import { Client } from "discord.js";
import { config } from "dotenv";
import { Octokit } from "octokit";
import { handleGuildMemberAdd } from "./events/handleGuildMemberAdd";
import { handleTodoMessage } from "./events/handleMessageCreate";
import { handleTodoReaction } from "./events/handleReactionAdd";
import { handleThreadCreate } from "./events/handleThreadCreate";
import { handleInteractionButton } from "./interaction/handleButton";
import { handleInteractionSelect } from "./interaction/handleSelect";
import { syncUsers } from "./utils/database";

config({
	path: `${__dirname}/../.env`,
});

export const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const client = new Client({
	intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"],
	partials: ["REACTION", "MESSAGE"],
	allowedMentions: {
		parse: [],
		repliedUser: false,
		roles: [],
		users: [],
	},
});

client.once("ready", async () => {
	console.log(`[CLIENT] ${client.user?.tag} is online`);
	client.user?.setActivity({
		name: "over Bulbbot",
		type: "WATCHING",
	});

	await syncUsers(client);
});

client.on("threadCreate", async (thread) => {
	if (thread.parentId !== process.env.TODOLIST_CHANNEL_ID) return;
	await handleThreadCreate(thread);
});

client.on("guildMemberAdd", async (member) => {
	if (member.guild.id !== process.env.MAIN_GUILD) return;
	await handleGuildMemberAdd(client, member);
});

client.on("interaction", async (interaction) => {
	if (interaction.isButton()) await handleInteractionButton(client, interaction);
	else if (interaction.isSelectMenu()) await handleInteractionSelect(client, interaction);
});

client.on("messageCreate", async (message) => {
	if (message.channelId !== process.env.TODOLIST_CHANNEL_ID) return;
	await handleTodoMessage(message);
});

client.on("messageReactionAdd", async (reaction) => {
	if (reaction.message.channelId !== process.env.TODOLIST_CHANNEL_ID) return;
	await handleTodoReaction(reaction);
});

client.login(process.env.DISCORD_TOKEN);
