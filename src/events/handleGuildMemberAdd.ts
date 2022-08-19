import { Client, GuildMember } from "discord.js";
import { bitfieldToFlags } from "../utils/bitfield";
import prisma from "../prisma";

export async function handleGuildMemberAdd(_client: Client, member: GuildMember) {
	const dbUser = await prisma.user.findFirst({
		where: {
			id: member.user.id,
		},
	});

	if (!dbUser || dbUser.flags === 0n) return;

	const flags = bitfieldToFlags(parseInt(dbUser.flags.toString()));
	const roles: string[] = [];
	for (let flag of flags) {
		switch (flag) {
			case "BUGHUNTER":
				roles.push("774775038436048906");
				break;

			case "CONTRIUBTOR":
				roles.push("759078667107958804");
				break;

			case "TRANSLATOR":
				roles.push("820292108367560746");
				break;

			case "CORE":
				break;

			default:
				break;
		}
	}

	await member.roles.add(roles, "Restored contribution roles");
}
