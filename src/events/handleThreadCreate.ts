import { MessageActionRow, MessageButton, MessageSelectMenu, ThreadChannel } from "discord.js";

export async function handleThreadCreate(thread: ThreadChannel) {
	const buttons = new MessageActionRow().addComponents([
		new MessageButton().setLabel("Yes").setStyle("SUCCESS").setCustomId(`ghCreate|${thread.parentId}|${thread.id}`),
		new MessageButton().setLabel("No").setStyle("DANGER").setCustomId("ignore"),
	]);

	const selects1 = new MessageActionRow().addComponents([
		new MessageSelectMenu()
			.setCustomId(`assignLabels|${thread.id}`)
			.setPlaceholder("Assign labels to the issue")
			.addOptions([
				{
					label: "Bug",
					value: "bug",
					emoji: "🐛",
					description: "Something isn't working ",
				},
				{
					label: "Documentation",
					value: "documentation",
					emoji: "📚",
					description: "Improvements or additions to documentation",
				},
				{
					label: "Enhancement",
					value: "enhancement",
					emoji: "⭐",
					description: "New feature or request",
				},
				{
					label: "Help Wanted",
					value: "help wanted",
					emoji: "🙋",
					description: "Extra attention is needed",
				},
			])
			.setMinValues(1)
			.setMaxValues(1),
	]);
	const selects2 = new MessageActionRow().addComponents([
		new MessageSelectMenu()
			.setCustomId(`assignDeveloper|${thread.id}`)
			.setPlaceholder("Assign developer to the issue")
			.addOptions([
				{
					label: "mrphilip",
					value: "190160914765316096",
					emoji: "<:mrphilip:1009545567245967410>",
				},
				{
					label: "KlukCZ",
					value: "439396770695479297",
					emoji: "<:KlukCZ:1009545570572058644>",
				},
				{
					label: "wakfi",
					value: "193160566334947340",
					emoji: "<:wakfi:1009545569053720737>",
				},
			])
			.setMinValues(1)
			.setMaxValues(1),
	]);

	await thread.send({
		content: `Want me to create an issue on GitHub about this?`,
		components: [buttons, selects1, selects2],
	});
}
