import { dashProcedure, j } from "@/server/jstack";
import {
	RESTGetAPICurrentUserGuildsResult,
	RESTGetAPIGuildMemberResult,
	RESTGetAPIGuildResult,
	RESTGetAPIGuildChannelsResult,
} from "discord-api-types/v10";
import { env } from "hono/adapter";
import { z } from "zod";

const DISCORD_INVITE_REGEX =
	/^https:\/\/(?:discord\.gg\/|discord\.com\/invite\/)([A-Za-z0-9_-]{2,32})\/?$/i;

/**
 * Router for dashboard procedures related to Discord guild management.
 */
export const dashRouter = j.router({
	/**
	 * Retrieves the list of Discord guilds shared between the user and the bot
	 * where the user has ADMINISTRATOR or MANAGE_GUILD permissions.
	 * Upserts guild info in the database and returns sorted guild entries.
	 * @returns JSON response with `guilds` array or null and a message.
	 */
	getGuildList: dashProcedure.query(
		async ({ c, ctx: { db, accessToken } }) => {
			try {
				const botToken = env(c).DISCORD_BOT_TOKEN;

				const [userRes, botRes] = await Promise.all([
					fetch("https://discord.com/api/v10/users/@me/guilds", {
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}),
					fetch("https://discord.com/api/v10/users/@me/guilds", {
						headers: {
							Authorization: `Bot ${botToken}`,
						},
					}),
				]);

				const [userGuilds, botGuilds] = await Promise.all([
					userRes.json() as Promise<RESTGetAPICurrentUserGuildsResult>,
					botRes.json() as Promise<RESTGetAPICurrentUserGuildsResult>,
				]);

				const MASK = BigInt(8) | BigInt(32); // ADMINISTRATOR | MANAGE_GUILD
				const shared = userGuilds.filter(
					(g) =>
						(BigInt(g.permissions) & MASK) !== BigInt(0) &&
						botGuilds.some((b) => b.id === g.id)
				);
				const sharedIds = shared.map((g) => g.id);
				if (shared.length === 0) {
					return c.json({
						guilds: null,
						message: "No shared guilds found",
					});
				}

				// upsert each shared guild, fetching full guild info to retrieve ownerId
				await Promise.all(
					shared.map(async (g) => {
						const guildRes = await fetch(
							`https://discord.com/api/v10/guilds/${g.id}`,
							{ headers: { Authorization: `Bot ${botToken}` } }
						);
						const guildData =
							(await guildRes.json()) as RESTGetAPIGuildResult;
						return db.servers.upsert({
							where: { id: guildData.id },
							create: {
								id: guildData.id,
								name: guildData.name,
								ownerId: guildData.owner_id,
								icon: guildData.icon,
							},
							update: {
								name: guildData.name,
								ownerId: guildData.owner_id,
								icon: guildData.icon,
							},
						});
					})
				);

				const servers = await db.servers.findMany({
					where: {
						id: { in: sharedIds },
					},
					orderBy: [
						{ lastOpened: { sort: "desc", nulls: "last" } },
						{ name: "asc" },
					],
				});

				return c.json({
					guilds: servers,
					message: "Retrieved sorted guilds list",
				});
			} catch (err: any) {
				console.error("getGuildList error:", err);
				return c.json({
					guilds: null,
					message: err.message || "Internal error",
				});
			}
		}
	),

	/**
	 * Fetches basic information (name, description, icon) for a specified guild.
	 * First verifies the user has MANAGE_GUILD or ADMINISTRATOR permissions.
	 * @param input.guildId - The ID of the guild to fetch header info for.
	 * @returns JSON response with `success`, `data` (name, description, icon), or `noPerm`/`error`.
	 */
	getHeaderInfo: dashProcedure
		.input(z.object({ guildId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const botToken = env(c).DISCORD_BOT_TOKEN;
			try {
				// Fetch user guilds to check permissions
				const userGuildsRes = await fetch(
					"https://discord.com/api/v10/users/@me/guilds",
					{
						headers: {
							Authorization: `Bearer ${ctx.accessToken}`,
						},
					}
				);

				if (!userGuildsRes.ok) {
					throw new Error(
						`Failed to fetch user guilds [${userGuildsRes.status}]`
					);
				}

				const userGuilds: RESTGetAPICurrentUserGuildsResult =
					await userGuildsRes.json();

				// Check if user has MANAGE_GUILD or ADMINISTRATOR permissions
				const hasPerm = userGuilds.some(
					(g) =>
						g.id === input.guildId &&
						(BigInt(g.permissions) & (BigInt(8) | BigInt(32))) !==
							BigInt(0)
				);

				if (!hasPerm) {
					return c.json({
						noPerm: true,
						error: "Forbidden - missing required server permissions",
					});
				}

				// Fetch guild info using bot token
				const guildRes = await fetch(
					`https://discord.com/api/v10/guilds/${input.guildId}`,
					{
						headers: {
							Authorization: `Bot ${botToken}`,
						},
					}
				);

				if (!guildRes.ok) {
					return c.json({
						success: false,
						error: `Failed to fetch guild info`,
					});
				}

				const guild: RESTGetAPIGuildResult = await guildRes.json();

				return c.json({
					success: true,
					data: {
						name: guild.name,
						description: guild.description,
						icon: guild.icon
							? `https://cdn.discordapp.com/icons/${guild.id}/${
									guild.icon
							  }.${guild.icon.startsWith("a_") ? "gif" : "png"}`
							: "https://archive.org/download/discordprofilepictures/discordblue.png",
					},
				});
			} catch (err: any) {
				console.error("getHeaderInfo error:", err);
				return c.json({
					success: false,
					error: err.message || "Internal error",
				});
			}
		}),

	/**
	 * Retrieves full guild details and synchronizes last opened time in the database.
	 * Fetches guild info via bot token with `with_counts` and upserts/updates DB.
	 * @param input.guildId - The ID of the guild to fetch.
	 * @returns JSON response with `success`, `data` containing `guild` and `dbGuild`, or `error`.
	 */
	getGuildInfo: dashProcedure
		.input(z.object({ guildId: z.string() }))
		.query(async ({ c, ctx: { db }, input: { guildId } }) => {
			const botToken = env(c).DISCORD_BOT_TOKEN;

			try {
				const guildRes = await fetch(
					`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`,
					{ headers: { Authorization: `Bot ${botToken}` } }
				);

				if (!guildRes.ok) {
					return c.json({
						success: false,
						error: `Guild fetch failed [${guildRes.status}]`,
					});
				}

				const guildData =
					(await guildRes.json()) as RESTGetAPIGuildResult;

				const dbGuildData = await db.servers.findUnique({
					where: { id: guildId },
					cacheStrategy: {
						ttl: 30,
						swr: 60,
					},
				});

				let dbGuild;
				if (!dbGuildData) {
					dbGuild = await db.servers.create({
						data: {
							id: guildData.id,
							name: guildData.name,
							ownerId: guildData.owner_id,
							lastOpened: new Date(),
						},
					});
				} else {
					await db.servers.update({
						where: {
							id: guildData.id,
						},
						data: {
							lastOpened: new Date(),
						},
					});
					dbGuild = dbGuildData;
				}

				return c.json({
					success: true,
					data: {
						guild: guildData,
						dbGuild: dbGuild,
					},
				});
			} catch (err: any) {
				console.error("getGuild error:", err);
				return c.json({
					success: false,
					error: err.message || "Internal error",
				});
			}
		}),

	/**
	 * Updates guild settings (name, description) on Discord if they differ from initial values.
	 * Sends a PATCH request with changed fields and logs an audit reason.
	 * @param input.guildId - The ID of the guild to update.
	 * @param input.name - New guild name.
	 * @param input.description - New guild description.
	 * @param input.initialName - Original guild name for change detection.
	 * @param input.initialDescription - Original guild description for change detection.
	 * @returns JSON response with `success` or `error`.
	 */
	setGuildInfo: dashProcedure
		.input(
			z.object({
				guildId: z.string(),
				name: z.string(),
				description: z.string(),
				initialName: z.string(),
				initialDescription: z.string(),
			})
		)
		.mutation(
			async ({
				c,
				input: {
					guildId,
					name,
					description,
					initialName,
					initialDescription,
				},
			}) => {
				const botToken = env(c).DISCORD_BOT_TOKEN;

				const updates: Record<string, string> = {};
				if (name !== initialName) updates.name = name;
				if (description !== initialDescription)
					updates.description = description;

				if (Object.keys(updates).length === 0) {
					return c.json({
						success: false,
						error: "No changes detected",
					});
				}

				const updateRes = await fetch(
					`https://discord.com/api/v10/guilds/${guildId}`,
					{
						method: "PATCH",
						headers: {
							"X-Audit-Log-Reason":
								"Changed by server manager on Cleo dashboard.",
							"Content-Type": "application/json",
							Authorization: `Bot ${botToken}`,
						},
						body: JSON.stringify(updates),
					}
				);

				if (!updateRes.ok) {
					console.error(updateRes.body);
					console.error(await updateRes.json());
					return c.json({
						success: false,
						error: `Error updating guild info [${updateRes.status}]`,
					});
				}

				return c.json({
					success: true,
				});
			}
		),

	/**
	 * Validates and sets a new invite link for a guild in the database.
	 * Parses invite code from URL, normalizes the invite link, and updates the DB record.
	 * @param input.guildId - The ID of the guild to update.
	 * @param input.inviteLink - Discord invite URL to set.
	 * @returns JSON response with `success`, updated `data.guild`, or `error`.
	 */
	setGuildInvite: dashProcedure
		.input(
			z.object({
				guildId: z.string(),
				inviteLink: z
					.string()
					.url({ message: "Please only provide a valid url." })
					.regex(DISCORD_INVITE_REGEX, {
						message:
							"Please only provide a valid discord invite link.",
					}),
			})
		)
		.mutation(
			async ({ c, ctx: { db }, input: { guildId, inviteLink } }) => {
				const [fullUrl, code] = DISCORD_INVITE_REGEX.exec(inviteLink)!;
				const isDotCom = fullUrl.includes("discord.com/invite");
				const url = isDotCom
					? fullUrl
					: `https://discord.com/invite/${code}`;

				try {
					const guild = await db.servers.update({
						data: { inviteLink: url, inviteCode: code },
						where: { id: guildId },
					});
					return c.json({
						success: true,
						data: { guild },
						message: "Set the invite link",
					});
				} catch (err: any) {
					console.error("Updating db error:", err);
					return c.json({
						success: false,
						error: err.message || "Internal server error",
					});
				}
			}
		),

	/**
	 * Retrieves channel settings for a guild, verifying user permissions and fetching
	 * channel list via bot token. Maps configured channels (welcome, announcement,
	 * updates, logs) from DB to channel id/name or null if missing.
	 * @param input.guildId - The ID of the guild to fetch channels for.
	 * @returns JSON response with `success` and `data.channels` or `error`/`noPerm`.
	 */
	getGuildChannels: dashProcedure
		.input(z.object({ guildId: z.string() }))
		.query(async ({ c, ctx: { db, accessToken }, input: { guildId } }) => {
			const botToken = env(c).DISCORD_BOT_TOKEN;
			try {
				// Fetch user guilds to check permissions
				const userGuildsRes = await fetch(
					"https://discord.com/api/v10/users/@me/guilds",
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);
				if (!userGuildsRes.ok) {
					return c.json({
						success: false,
						error: `Failed to fetch user guilds [${userGuildsRes.status}]`,
					});
				}
				const userGuilds =
					(await userGuildsRes.json()) as RESTGetAPICurrentUserGuildsResult;
				const hasPerm = userGuilds.some(
					(g) =>
						g.id === guildId &&
						(BigInt(g.permissions) & (BigInt(8) | BigInt(32))) !==
							BigInt(0)
				);
				if (!hasPerm) {
					return c.json({
						success: false,
						noPerm: true,
						error: "Forbidden - missing required server permissions",
					});
				}

				// Fetch channels using bot token
				const channelsRes = await fetch(
					`https://discord.com/api/v10/guilds/${guildId}/channels`,
					{
						headers: {
							Authorization: `Bot ${botToken}`,
						},
					}
				);
				if (!channelsRes.ok) {
					return c.json({
						success: false,
						error: `Failed to fetch channels [${channelsRes.status}]`,
					});
				}
				const allChannels =
					(await channelsRes.json()) as RESTGetAPIGuildChannelsResult;

				// Load server settings from DB
				const server = await db.servers.findUnique({
					where: { id: guildId },
				});
				if (!server) {
					return c.json({
						success: false,
						error: "Server not found",
					});
				}

				// Build channels result for each setting, defaulting to null
				const result: Record<
					string,
					{ id: string; name: string } | null
				> = {};
				const settings = [
					["welcomeChannel", server.welcomeChannel],
					["announcementChannel", server.announcementChannel],
					["updatesChannel", server.updatesChannel],
					["logsChannel", server.logsChannel],
				] as const;
				for (const [key, chId] of settings) {
					if (!chId) {
						result[key] = null;
					} else {
						const ch = allChannels.find((c) => c.id === chId);
						result[key] =
							ch && ch.name ? { id: ch.id, name: ch.name } : null;
					}
				}

				return c.json({
					success: true,
					data: { channels: result, allChannels },
				});
			} catch (err: any) {
				console.error("getGuildChannels error:", err);
				return c.json({
					success: false,
					error: err.message || "Internal error",
				});
			}
		}),
});
