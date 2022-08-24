import { MessageReaction, PartialMessageReaction } from "discord.js";

export async function handleTodoReaction(reaction: MessageReaction | PartialMessageReaction) {
	const newEmoji = reaction.emoji.id === "1012062246731518043" ? " <:greenTick:1012062248061108376>" : "<:redTick:1012062246731518043>";

	await reaction.users.fetch();
	if (!reaction.users.cache.find((user) => !user.bot)) return;

	await reaction.message.reactions.removeAll();
	await reaction.message.react(newEmoji);
}
