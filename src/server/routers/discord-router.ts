import { clerkProcedure, j, publicProcedure } from "@/server/jstack";
import {
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPIGuildChannelsResult,
  RESTGetAPIGuildResult,
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

    const guilds = (await response.json()) as RESTGetAPICurrentUserGuildsResult;

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
      method: "GET",
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

        return baseUrl + permissionsAndScopes;
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
        guildId: null,
        message: "No connected discord accounts for the user",
      });

    if (!tokens[0] || !tokens[0].token)
      return c.json({
        channels: null,
        guildId: null,
        message: "No access token for the user",
      });

    const accessToken = tokens[0].token;

    const response = await fetch("https://discord.com/api/v10/oauth2/@me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok)
      return c.json({
        channels: null,
        guildId: null,
        message: response.statusText,
      });

    const data =
      (await response.json()) as RESTGetAPIOAuth2CurrentAuthorizationResult;

    if (!data)
      return c.json({
        channels: null,
        guildId: null,
        message: "No current Oauth2 data recieved",
      });

    const discordId = data.user?.id;

    if (!discordId)
      return c.json({
        channels: null,
        guildId: null,
        message: "No discord user id found",
      });

    const onboardingGuild = await kv.get(`onboarding-guild-${discordId}`);

    if (!onboardingGuild)
      return c.json({
        channels: null,
        guildId: null,
        message: "No guild is being onboarded by the user",
      });

    const res = await fetch(
      `https://discord.com/api/v10/guilds/${onboardingGuild}/channels`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        },
      }
    );

    if (!res.ok)
      return c.json({
        channels: null,
        guildId: onboardingGuild,
        message: "Bot not in the selected guild. Retrying in 10 seconds.",
      });

    const channels = (await res.json()) as RESTGetAPIGuildChannelsResult;

    if (!channels)
      return c.json({
        channels: null,
        guildId: onboardingGuild,
        message: "Unable to fetch channels for the onboarded guild",
      });

    return c.superjson({
      channels: channels.filter(
        (channel) => channel.type === 0 || channel.type === 5
      ),
      guildId: onboardingGuild,
      message: "Fetched all channels for the onboarded guild",
    });
  }),

  configureGuild: clerkProcedure
    .input(
      z.object({
        guildId: z.string(),
        channelId: z.string(),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { db, client, token } = ctx;
      const { guildId, channelId } = input;
      const { DISCORD_BOT_TOKEN } = env(c);

      const auth = await client.sessions.getSession(token.sid);
      const userId = auth.userId;

      const tokens = (
        await client.users.getUserOauthAccessToken(userId, "discord")
      ).data;

      if (!tokens)
        return c.json({
          configured: false,
          message: "No connected discord accounts for the user",
        });

      if (!tokens[0] || !tokens[0].token)
        return c.json({
          configured: false,
          message: "No access token for the user",
        });

      const accessToken = tokens[0].token;

      const response = await fetch("https://discord.com/api/v10/oauth2/@me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok)
        return c.json({
          configured: false,
          message: response.statusText,
        });

      const data =
        (await response.json()) as RESTGetAPIOAuth2CurrentAuthorizationResult;

      if (!data)
        return c.json({
          configured: false,
          message: "No current Oauth2 data recieved",
        });

      const discordId = data.user?.id;

      if (!discordId)
        return c.json({
          configured: false,
          message: "No discord user id found",
        });

      const guild = (await (
        await fetch(`https://discord.com/api/v10/guilds/${guildId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          },
        })
      ).json()) as RESTGetAPIGuildResult;

      if (!guild)
        return c.json({
          configured: false,
          message: "No guild with that id found",
        });

      const user = await db.users.findUnique({ where: { discordId } });

      if (!user)
        return c.json({
          configured: false,
          message: "User does not exist in db",
        });

      const configuredGuild = await db.servers.create({
        data: {
          id: guild.id,
          name: guild.name,
          ownerId: guild.owner_id,
          updatesChannel: channelId,
        },
      });

      if (!configuredGuild)
        return c.json({
          configured: false,
          message: "Error creating and configuring the guild",
        });

      return c.json({ configured: true, message: "Guild configured" });
    }),
});
