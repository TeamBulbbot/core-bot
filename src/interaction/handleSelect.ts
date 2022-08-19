import { CacheType, Client, SelectMenuInteraction } from "discord.js";
import { octokit } from "../index";
import prisma from "../prisma";

export async function handleInteractionSelect(_client: Client, interaction: SelectMenuInteraction<CacheType>) {
	const [action, threadId] = interaction.customId.split("|");
	const values = interaction.values;

	const dbIssue = await prisma.issues.findFirst({
		where: {
			threadId,
		},
	});

	if (!dbIssue)
		return interaction.reply({
			content: "The issue has not yet been published to Github, upload before selecting",
			ephemeral: true,
		});

	if (action === "assingLabels") {
		await octokit.rest.issues.addLabels({
			issue_number: parseInt(dbIssue.id),
			owner: process.env.GITHUB_OWNER || "",
			repo: process.env.GITHUB_REPO || "",
			labels: values,
		});

		await interaction.reply({
			content: `Added label ${values.map((value) => `\`${value}\``).join(" ")} to the issue`,
		});
	} else if (action === "assignDeveloper") {
		const user = await prisma.user.findFirst({
			where: {
				id: values[0],
			},
		});

		if (!user || !user.githubId)
			return await interaction.reply({
				content: `Unable to find a user in the database or the user is missing the Github id`,
				ephemeral: true,
			});

		await octokit.rest.issues.addAssignees({
			issue_number: parseInt(dbIssue.id),
			owner: process.env.GITHUB_OWNER || "",
			repo: process.env.GITHUB_REPO || "",
			assignees: [user?.githubId],
		});

		await interaction.reply({
			content: `Assigneed ${values.map((value) => `<@${value}>`).join(" ")} to the issue`,
		});
	}
}
