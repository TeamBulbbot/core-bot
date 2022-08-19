import { FLAGS } from "../types/constants";
import { Flags } from "../types/types";

export function flagsTBitfield(flags: Flags[]) {
	let bitfield = 0;

	for (let flag of flags) {
		if (flag === "CORE") bitfield += FLAGS[flag];
		else if (flag === "BUGHUNTER") bitfield += FLAGS[flag];
		else if (flag === "CONTRIUBTOR") bitfield += FLAGS[flag];
		else if (flag === "TRANSLATOR") bitfield += FLAGS[flag];
	}

	return bitfield;
}

export function bitfieldToFlags(bitfield: number) {
	const flags: Flags[] = [];
	for (const [flag, value] of Object.entries(FLAGS)) {
		if ((bitfield & value) === value) flags.push(flag as Flags);
	}

	return flags;
}
