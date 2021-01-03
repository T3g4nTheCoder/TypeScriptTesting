import { Message } from 'discord.js';
import { Command } from '../../interfaces/Command';
import { RunFunction } from '../../interfaces/Event';

const prefix: string = '!';

export const name: string = 'message';
export const run: RunFunction = async (client, message: Message) => {
	if (
		!message.guild ||
		!message.content.startsWith(prefix.toLowerCase()) ||
		message.author.bot
	)
		return;

	const args: String[] = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const commandREQ: string = args.shift().toLowerCase();

	const commandRES: Command | null = client.getCommand(commandREQ);
	if (!commandRES) return;
	commandRES.run(client, message, args).catch((e: Error) => {
		client.logger.error(e);
		message.channel.send(
			client.error(
				`An error occurred when running the ${commandRES.name} command.\n${e.message}`
			)
		);
	});
};
