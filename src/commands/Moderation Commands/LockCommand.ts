export const name: string = 'lock';
export const aliases: String[] = ['lockchat', 'lockchannel', 'stopchat'];
export const category: string = 'moderation';

import { Role, RoleManager, TextChannel } from 'discord.js';
import { RunFunction } from '../../interfaces/Command';

export const run: RunFunction = async (client, message, args) => {
	/*
    
    TODO:
    
    1. Create a role that has no permissions to the channel
    and assign it to everyone. Don't take the role away when unlocked.
    This role will be the role to lock for all of the future locked channels.

    */

	const roleName = 'Locked Channels [Guildster]';

	const msg = await message.channel.send(
		client.embed({ description: 'Locking channel...', color: 'RED' }, message)
	);
	async function getRole(): Promise<Role> {
		let whatToReturn: Role | false;
		const guildRoles: RoleManager = message.guild.roles;
		const fetchRole: Role | undefined = guildRoles.cache.find(
			(role) => role.name == roleName
		);
		if (!fetchRole) {
			if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
				// If I don't have permssion to create roles.
				msg.edit(
					client.embed(
						{
							description:
								'I do not have enough permissions to create a role to lock the channel with. I require permission: Manage Roles',
						},
						message
					)
				);
				return;
			} else {
				// If I have permission and there is no role.
				const createdRole = await guildRoles.create({
					data: {
						name: roleName,
						permissions: [],
					},
				});
				whatToReturn = createdRole;
			}
		} else {
			whatToReturn = fetchRole;
		}
		return whatToReturn;
	}
	const role = await getRole();

	if (!role) return;

	message.guild.members.cache.forEach((member) => {
		member.roles.add(role).catch((err: Error) => {
			err; // This makes sure that it's not logged to the console, if someone has a higher role than me.
		});
	});

	const { channel } = message;

	(channel as TextChannel).updateOverwrite(role.id, {
		SEND_MESSAGES: false,
		ATTACH_FILES: false,
		SEND_TTS_MESSAGES: false,
	});

	msg.edit(
		client.embed(
			{
				description:
					'**THIS CHANNEL HAS BEEN LOCKED BY ' +
					message.author.tag +
					'. PLEASE WAIT UNTIL THEY UNLOCK IT.**',
			},
			message
		)
	);
};
