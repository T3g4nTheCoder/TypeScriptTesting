import { Collection, MessageEmbed } from 'discord.js';
import { Command, RunFunction } from '../../interfaces/Command';

export const name: string = 'help';
export const aliases: String[] = ['commands', 'command', 'how', 'test'];
export const category: string = 'info';
export const run: RunFunction = async (client, message, args) => {
	const embed: MessageEmbed = new MessageEmbed()
		.setDescription(`${client.cmdAmount} Commands | ${client.user.tag}`)
		.setColor('RANDOM');

	if (!args.length) {
		/* No Command Query */

		const cats: Collection<String, String> = client.categorys;
		cats.map(async (category: String) => {
			if (!category) return;

			const length: number = client.commands.filter(
				(command) => command.category == category
			).size;
			embed.addField(
				`${
					category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
				} [${length}]`,
				`\`${client.commands
					.filter((command: Command) => command.category === category)
					.array()
					.map((command: Command) => {
						return command.name;
					})
					.join(', ')}\``
			);
		});
		message.channel.send(embed);
	} else {
		/* Command Query */
	}
};
