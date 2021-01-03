import { RunFunction } from '../../interfaces/Command';

export const name: string = 'eval';
export const aliases: String[] = ['e'];
export const category: string = 'owner';
export const run: RunFunction = async (client, message, args) => {
	client.logger.info('works');

	(client.emit as any)('guildBanAdd', (message.guild, message.member));
};
