export const name: string = 'unlock';
export const aliases: String[] = ['unlockchat', 'unlockchannel', 'startchat'];
export const category: string = 'moderation';

import { Message, TextChannel } from 'discord.js';
import { RunFunction } from '../../interfaces/Command';

export const run: RunFunction = async (client, message, args) => {
	const roleName = 'Locked Channels [Guildster]';

	if (message.deletable) {
		message.delete();
	}

	if (!message.member.hasPermission('MANAGE_CHANNELS')) {
		message.channel.send(
			client.error('You do not have enough permissions to run this command.')
		);
		return;
	}

	const { channel } = message;

	const msg: Message = await message.channel.send(
		client.embed(
			{ description: 'Unlocking channel...', color: 'GREEN' },
			message
		)
	);

	async function removeRolePerms() {
		// Takes away the permsissions that make them not able to send messages.
		(channel as TextChannel).updateOverwrite(
			message.guild.roles.cache.find((r) => r.name == roleName).id,
			{
				SEND_MESSAGES: true,
			}
		);
	}

	if (
		!message.guild.me.hasPermission('MANAGE_ROLES') ||
		!message.guild.me.hasPermission('MANAGE_CHANNELS')
	) {
		// If I don't have permssion to create roles.
		msg.edit(
			client.embed(
				{
					description:
						'I do not have enough permissions to edit the permissions of this channel! Manage Roles, Manage Channels or Admin',
				},
				message
			)
		);
		return;
	} else {
		// If I have permission.
		let role = message.guild.roles.cache.find((r) => r.name == roleName);

		if (!role) {
			role = await message.guild.roles.create({
				data: {
					name: roleName,
					permissions: [],
				},
			});

			message.guild.members.cache.forEach((member) => {
				member.roles.add(role).catch((err: Error) => {
					err; // This makes sure that it's not logged to the console, if someone has a higher role than me.
				});
			});
		}

		removeRolePerms();
		msg.edit(
			client.embed(
				{
					description: `I have unlocked this channel!`,
				},
				message
			)
		);
	}
};
