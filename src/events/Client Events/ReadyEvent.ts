import { RunFunction } from '../../interfaces/Command';

export const name: string = 'ready';

export const run: RunFunction = async (client) => {
	client.logger.success(`${client.user.tag} is online!`);
};
