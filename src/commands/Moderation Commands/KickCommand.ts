import { GuildMember } from 'discord.js';
import { RunFunction } from '../../interfaces/Command';

export const name: string = 'kick';
export const aliases: String[] = [];
export const category: string = 'moderation';
export const run: RunFunction = async (client, message, args) => {
	const { member, guild, mentions } = message;

	function error(item: string) {
		message.channel.send(client.error(item));
	}

	if (!member.hasPermission('KICK_MEMBERS'))
		return error('You do not have enough permissions to run this command!');
	const mention: GuildMember | null =
		guild.members.cache.get(args[0].toString()) || mentions.members.first();
	if (!mention) return error('You did not mention anybody!');

	const reason: string = args.slice(1)
		? args.slice(1).join(' ')
		: 'No Reason Specified';

	if (!mention.kickable)
		return error(
			'I cannot kick that person. Their role is probably higher than mine.'
		);

	mention.kick(reason);

	message.channel.send(
		client.embed(
			{
				description: `Success! I have successfully kicked ${mention.user.tag}`,
			},
			message
		)
	);
};
