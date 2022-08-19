import { Client } from "discord.js";
import { users } from "../types/constants";
import prisma from "../prisma";
import { flagsTBitfield } from "./bitfield";

export async function syncUsers(_client: Client) {
	for (let user of users) {
		let dbUser = await prisma.user.findFirst({
			where: {
				id: user.id,
			},
		});

		if (!dbUser)
			dbUser = await prisma.user.create({
				data: {
					id: user.id,
					flags: flagsTBitfield(user.flags),
					githubId: user.github ? user.github : null,
				},
			});
	}
}
