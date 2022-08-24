import { Message } from "discord.js";

export async function handleTodoMessage(message: Message<boolean>) {
	await message.react("<:redTick:1012062246731518043>");
}
