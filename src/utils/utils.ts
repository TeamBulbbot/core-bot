import { TextBasedChannel } from "discord.js";

export async function disableButtons(channel: TextBasedChannel, id: string) {
	const message = await channel?.messages.fetch(id);
	message?.edit({
		components: message.components?.map((c) => {
			return {
				type: c.type,
				components: c.components.map((c2: any) => {
					if (c2.type !== "BUTTON")
						return {
							...c2,
						};
					return {
						...c2,
						disabled: true,
					};
				}),
			};
		}),
	});
}
