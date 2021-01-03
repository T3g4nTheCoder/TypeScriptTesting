import { RunFunction } from '../../interfaces/Event';

export const name: string = 'unhandledPromiseRejection';
export const run: RunFunction = async (client, error) => {
	client.logger.error(
		`Unhandled Promise Rejection.`,
		error,
		'You probably want to fix this.'
	);
};
