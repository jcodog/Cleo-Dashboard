import { clerkProcedure, j, publicProcedure } from "@/server/jstack";
import {
	RESTGetAPICurrentUserGuildsResult,
	RESTGetAPIGuildChannelsResult,
	RESTGetAPIOAuth2CurrentAuthorizationResult,
} from "discord-api-types/v10";
import { env } from "hono/adapter";
import { z } from "zod";

export const discordRouter = j.router({
	getUserGuilds: clerkProcedure.query(async ({ c, ctx }) => {
		const { client, token } = ctx;

		const auth = await client.sessions.getSession(token.sid);
		const userId = auth.userId;

		const tokens = (
			await client.users.getUserOauthAccessToken(userId, "discord")
		).data;

		if (!tokens)
			return c.json({
				guilds: null,
				message: "No connected discord accounts for the user",
			});

		if (!tokens[0] || !tokens[0].token)
			return c.json({
				guilds: null,
				message: "No access token for the user",
			});

		const accessToken = tokens[0].token;

		const response = await fetch(
			"https://discord.com/api/v10/users/@me/guilds",
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		if (!response.ok)
			return c.json({ guilds: null, message: response.statusText });

		const guilds =
			(await response.json()) as RESTGetAPICurrentUserGuildsResult;

		if (!guilds || guilds.length < 1)
			return c.json({
				guilds: null,
				message: "No guilds found for user",
			});

		return c.json({ guilds, message: "Retrieved guilds" });
	}),

	getBotGuilds: publicProcedure.query(async ({ c, input }) => {
		const { DISCORD_BOT_TOKEN } = env(c);
		const response = await fetch(
			"https://discord.com/api/v10/users/@me/guilds",
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
				},
			}
		);

		if (!response.ok)
			return c.json({ guilds: null, message: response.statusText });

		const botGuilds =
			(await response.json()) as RESTGetAPICurrentUserGuildsResult;

		if (!botGuilds || botGuilds.length < 1)
			return c.json({
				guilds: null,
				message: "No guilds found for the bot",
			});

		return c.json({
			guilds: botGuilds,
			message: "Retrieved shared guilds",
		});
	}),

	getOauth2Data: clerkProcedure.query(async ({ c, ctx }) => {
		const { client, token } = ctx;

		const auth = await client.sessions.getSession(token.sid);
		const userId = auth.userId;

		const tokens = (
			await client.users.getUserOauthAccessToken(userId, "discord")
		).data;

		if (!tokens)
			return c.json({
				currentOauth2Data: null,
				message: "No connected discord accounts for the user",
			});

		if (!tokens[0] || !tokens[0].token)
			return c.json({
				currentOauth2Data: null,
				message: "No access token for the user",
			});

		const accessToken = tokens[0].token;

		const response = await fetch("https://discord.com/api/v10/oauth2/@me", {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!response.ok)
			return c.json({
				currentOauth2Data: null,
				message: response.statusText,
			});

		const data =
			(await response.json()) as RESTGetAPIOAuth2CurrentAuthorizationResult;

		if (!data)
			return c.json({
				currentOauth2Data: null,
				message: "No current Oauth2 data recieved",
			});

		return c.json({
			currentOauth2Data: data,
			message: "Current Oauth2 data retrieved",
		});
	}),

	addCleo: clerkProcedure
		.input(
			z.object({
				mode: z.union([z.literal("user"), z.literal("server")]),
				guildId: z.string().optional(),
				discordId: z.string().optional(),
			})
		)
		.mutation(async ({ c, ctx, input }) => {
			const { mode, guildId, discordId } = input;
			const { client, token, kv } = ctx;

			const auth = await client.sessions.getSession(token.sid);
			const userId = auth.userId;

			if (!userId) {
				return c.json({
					success: false,
					message: "Unauthenticated user",
					url: null,
				});
			}

			if (mode === "server" && !guildId) {
				return c.json({
					success: false,
					message: "Missing the guildId needed to add to server",
					url: null,
				});
			}

			if (mode === "server" && guildId && discordId) {
				await kv.put(`onboarding-guild-${discordId}`, guildId);
			}

			const generateUrl = () => {
				const baseUrl =
					"https://discord.com/oauth2/authorize?client_id=1223326305169182740";
				const permissionsAndScopes =
					mode === "server"
						? `&permissions=593182191516919&integration_type=0&scope=bot&disable_guild_select=true&guild_id=${guildId}`
						: "&permissions=593182191516919&integration_type=1&scope=bot";
				const redirectUrl =
					"&redirect_url=https://cleoai.cloud/add/" +
					(mode === "user" ? "user" : "bot") +
					"/next";

				return baseUrl + permissionsAndScopes + redirectUrl;
			};

			return c.json({
				success: true,
				message: "Cleo invite url generate",
				url: generateUrl(),
			});
		}),

	getOnboardingGuildChannels: clerkProcedure.query(async ({ c, ctx }) => {
		const { client, token, kv } = ctx;
		const { DISCORD_BOT_TOKEN } = env(c);

		const auth = await client.sessions.getSession(token.sid);
		const userId = auth.userId;

		const tokens = (
			await client.users.getUserOauthAccessToken(userId, "discord")
		).data;

		if (!tokens)
			return c.json({
				channels: null,
				message: "No connected discord accounts for the user",
			});

		if (!tokens[0] || !tokens[0].token)
			return c.json({
				channels: null,
				message: "No access token for the user",
			});

		const accessToken = tokens[0].token;

		const response = await fetch("https://discord.com/api/v10/oauth2/@me", {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!response.ok)
			return c.json({
				channels: null,
				message: response.statusText,
			});

		const data =
			(await response.json()) as RESTGetAPIOAuth2CurrentAuthorizationResult;

		if (!data)
			return c.json({
				channels: null,
				message: "No current Oauth2 data recieved",
			});

		const discordId = data.user?.id;

		if (!discordId)
			return c.json({
				channels: null,
				message: "No discord user id found",
			});

		const onboardingGuild = await kv.get(`onboarding-guild-${discordId}`);

		if (!onboardingGuild)
			return c.json({
				channels: null,
				message: "No guild is being onboarded by the user",
			});

		const channels = (await (
			await fetch(
				`https://discord.com/api/v10/guilds/${onboardingGuild}/channels`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${DISCORD_BOT_TOKEN}`,
					},
				}
			)
		).json()) as RESTGetAPIGuildChannelsResult;

		if (!channels)
			return c.json({
				channels: null,
				message: "Unable to fetch channels for the onboarded guild",
			});

		return c.superjson({
			channels,
			message: "Fetched all channels for the onboarded guild",
		});
	}),
});
