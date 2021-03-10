import { RunFunction } from '../../interfaces/Command';
import search from 'g-i-s';
import { Message } from 'discord.js';
import { Search } from '../../interfaces/Search';
export const name: string = 'milk';
export const category: string = 'fun';
export const aliases: String[] = ['sendmilk'];
export const run: RunFunction = async (client, message, args) => {
	const msg: Message = await message.channel.send(
		client.embed({ description: 'Finding you a picture of milk...' }, message)
	);
	search('milk', (err: Error, data: Search) => {
		const url = data[Math.floor(Math.random() * data.length)];
		msg.edit(
			client.embed(
				{
					title: 'Here is your picture of milk.',
					url: url.url.split('?')[0],
					image: {
						url: url.url.split('?')[0],
					},
				},
				message
			)
		);
	});
};
