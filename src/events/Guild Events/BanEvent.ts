import {
	Guild,
	GuildAuditLogs,
	GuildMember,
	MessageEmbed,
	TextChannel,
} from 'discord.js';
import { RunFunction } from '../../interfaces/Event';
import guildSchema from '../../schemas/guildSchema';

export const name: string = 'guildBanAdd';
export const run: RunFunction = async (
	client,
	guild: Guild,
	member: GuildMember
) => {
	const logChannel = await guildSchema.findById(guild.id).Logs;
	if (!logChannel) return;
	let log: GuildAuditLogs | any;
	if (guild.me.hasPermission('VIEW_AUDIT_LOG')) {
		log = await guild.fetchAuditLogs({
			type: 'MEMBER_BAN_ADD',
			limit: 1,
		});
	}
	const fetchedChannel = guild.channels.cache.get(logChannel);
	if (!fetchedChannel) {
		guildSchema.findOneAndDelete({
			Logs: logChannel,
		});
		return;
	}
	if (
		!fetchedChannel.permissionsFor(guild.me).has('VIEW_CHANNEL') &&
		!fetchedChannel.permissionsFor(guild.me).has('SEND_MESSAGES')
	)
		return;

	if (!log) {
		(fetchedChannel as TextChannel).send(
			new MessageEmbed({
				color: 'RED',
				title: `Banned User | ${member.user.tag}`,
				fields: [
					{
						name: `Reason`,
						value: `No Reason Found`,
					},
					{
						name: `Banned User`,
						value: `<@${member.user.id}>`,
					},
				],
				footer: {
					text: `Moderator ID: unknown`,
				},
			})
		);
	} else {
		(fetchedChannel as TextChannel).send(
			new MessageEmbed({
				color: 'RED',
				title: `Banned User | ${member.user.tag}`,
				fields: [
					{
						name: `Reason`,
						value: `${log.entries.first().reason}`,
					},
					{
						name: `Banned User`,
						value: `<@${member.user.id}>`,
					},
				],
				footer: {
					text: `Moderator ID: ${log.entries.first().executor}`,
				},
			})
		);
	}
};
