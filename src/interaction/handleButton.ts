import { ButtonInteraction, CacheType, Client, Modal, TextBasedChannel, TextChannel, TextInputComponent, MessageActionRow } from "discord.js";
import { disableButtons } from "../utils/utils";
import { octokit } from "../index";
import prisma from "../prisma";
import shell from "shelljs";

export async function handleInteractionButton(client: Client, interaction: ButtonInteraction<CacheType>) {
	if (interaction.customId.startsWith("ignore")) {
		await disableButtons(interaction.channel as TextBasedChannel, interaction.message.id);
		return interaction.reply({
			content: "Okey will not publish this!",
		});
	} else if (interaction.customId.startsWith("ghCreate")) {
		const [_action, channelId, threadId] = interaction.customId.split("|");
		const channel = (await client.channels.fetch(channelId)) as TextChannel;
		const thread = await channel.threads.fetch(threadId);

		const modal = new Modal().setCustomId("reasonModal").setTitle("Reason");
		const reasonInput = new TextInputComponent().setCustomId("body").setLabel(`Body of the issue`).setStyle("PARAGRAPH");

		// @ts-ignore
		const row = new MessageActionRow().addComponents([reasonInput]);
		// @ts-ignore
		modal.addComponents(row);

		await interaction.showModal(modal);
		const modalResponse = await interaction.awaitModalSubmit({ filter: (i: any) => i.customId === "reasonModal" && i.user.id === interaction.user.id, time: 15_000 });

		const body = modalResponse.fields.getTextInputValue("body");

		const issue = await octokit.rest.issues.create({
			owner: process.env.GITHUB_OWNER || "",
			repo: process.env.GITHUB_REPO || "",
			title: thread?.name || "Undefined name",
			body,
		});

		await prisma.issues.create({
			data: {
				id: issue.data.number.toString(),
				threadId: threadId,
			},
		});

		await disableButtons(interaction.channel as TextBasedChannel, interaction.message.id);

		const message = await interaction.channel?.send({
			content: `**Published the issue**\n${issue.data.html_url}`,
		});

		await message?.pin();

		await modalResponse.reply({
			content: "Sucessfully created a ticket",
			ephemeral: true,
		});

		return;
	} else if (interaction.customId.startsWith("deploy")) {
		await interaction.deferReply();

		shell.cd("~/bulbbot");

		const cmds: string[] = ["git pull", "rm -rf build", "rm -rf node_modules", "yarn install", "tsc", "pm2 restart bulbbot"];
		for (let cmd of cmds) {
			shell.exec(cmd);
		}

		await interaction.followUp({
			content: `Deployed \`${interaction.customId.split("|")[1]}\` successfully!`,
		});
		await disableButtons(interaction.channel as TextBasedChannel, interaction.message.id);
	}
}
