import { Flags } from "./types";

export let FLAGS = {
	CORE: 1 << 0,
	CONTRIUBTOR: 1 << 1,
	BUGHUNTER: 1 << 2,
	TRANSLATOR: 1 << 3,
};

export const users: {
	id: string;
	github?: string;
	flags: Flags[];
}[] = [
	{
		id: "190160914765316096",
		github: "y3ll0wlife",
		flags: ["CORE"],
	},
	{
		id: "439396770695479297",
		github: "KlukCZ",
		flags: ["CORE", "CONTRIUBTOR", "BUGHUNTER", "TRANSLATOR"],
	},
	{
		id: "193160566334947340",
		github: "wakfi",
		flags: ["CORE", "CONTRIUBTOR", "BUGHUNTER"],
	},
	{
		id: "360809274894712833",
		flags: ["CONTRIUBTOR"],
	},
	{
		id: "311929179186790400",
		flags: ["CONTRIUBTOR", "TRANSLATOR"],
	},
	{
		id: "559071881932570644",
		flags: ["BUGHUNTER"],
	},
	{
		id: "231714802261557249",
		flags: ["BUGHUNTER", "TRANSLATOR", "CONTRIUBTOR"],
	},
	{
		id: "565143645167288340",
		flags: ["TRANSLATOR"],
	},
	{
		id: "850003505778393128",
		flags: ["TRANSLATOR"],
	},
	{
		id: "256422547556401152",
		flags: ["TRANSLATOR"],
	},
	{
		id: "425339165278863380",
		flags: ["TRANSLATOR"],
	},
	{
		id: "511158329477693449",
		flags: ["TRANSLATOR"],
	},
	{
		id: "742369927985365042",
		flags: ["TRANSLATOR"],
	},
	{
		id: "562281047811817493",
		flags: ["CONTRIUBTOR", "BUGHUNTER", "TRANSLATOR"],
	},
];
