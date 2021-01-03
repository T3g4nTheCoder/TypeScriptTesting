import { Message } from 'discord.js';
import { RunFunction } from '../../interfaces/Command';

function format(seconds: number) {
	function pad(s: number) {
		return (s < 10 ? '0' : '') + s;
	}
	var hours = Math.floor(seconds / (60 * 60));
	var minutes = Math.floor((seconds % (60 * 60)) / 60);
	var secs = Math.floor(seconds % 60);

	return pad(hours) + ':' + pad(minutes) + ':' + pad(secs);
}

export const name: string = 'ping';
export const category: string = 'info';
export const aliases: String[] = ['ms', 'time'];
export const run: RunFunction = async (client, message, args) => {
	const msg: Message = await message.channel.send(
		client.embed({ description: 'Pinging...' }, message)
	);
	msg.edit(
		client.embed(
			{
				title: 'Pong!',
				fields: [
					{
						name: 'API',
						value: `${client.ws.ping} MS!`,
						inline: true,
					},
					{
						name: 'Server',
						value: `Server: ${
							msg.createdTimestamp - message.createdTimestamp
						} MS`,
						inline: true,
					},
					{
						name: 'Uptime',
						value: `${format(process.uptime())}`,
						inline: true,
					},
				],
				thumbnail: {
					url:
						'https://cdn.discordapp.com/attachments/730447146079223819/792754917437210624/ndozdv59jsx21.png',
				},
			},
			message
		)
	);
};
