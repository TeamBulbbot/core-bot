import { ButtonInteraction, CacheType, Client, Modal, TextBasedChannel, TextChannel, TextInputComponent, MessageActionRow } from "discord.js";
import { disableButtons } from "../utils/utils";
import { octokit } from "../index";
import prisma from "../prisma";
import { spawn } from "child_process";

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
		const terminal = spawn("bash");

		terminal.stdin.write("cd ~/bulbbot");
		terminal.stdin.write("git pull");
		terminal.stdin.write("rm -rf build");
		terminal.stdin.write("rm -rf node_modules");
		terminal.stdin.write("yarn install");
		terminal.stdin.write("npx tsc");
		terminal.stdin.write("yarn db:migrate");
		terminal.stdin.write("pm2 restart bulbbot");

		terminal.stdin.end();

		terminal.stdout.on("data", (data) => {
			console.log("stdout: " + data);
		});

		terminal.stderr.on("data", (data) => {
			console.log("stderr: " + data);
		});

		terminal.on("exit", async (code) => {
			console.log("child process exited with code " + code);

			await interaction.followUp({
				content: `Deployed \`${interaction.customId.split("|")[1]}\` successfully!`,
			});
			await disableButtons(interaction.channel as TextBasedChannel, interaction.message.id);
		});
	}
}
