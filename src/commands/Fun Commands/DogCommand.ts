import { RunFunction } from '../../interfaces/Command';
import { Search } from '../../interfaces/Search';
import { Message } from 'discord.js';
import rp from 'g-i-s';
export const name: string = 'dog';
export const category: string = 'fun';
export const aliases: String[] = ['doggo', 'dogs', 'pup', 'puppy', 'doggy'];
export const run: RunFunction = async (client, message, args) => {
	const msg: Message = await message.channel.send(
		client.embed({ description: 'Finding a cute doggo...' }, message)
	);
	const searches = [
		'golden retriever',
		'dog',
		'baby dog',
		'cute dog',
		'racing dog',
	];
	const search = searches[Math.floor(Math.random() * searches.length)];
	rp(search, (err: Error, data: Search) => {
		if (err) {
			client.logger.error(err);
		}
		const discordData = data[Math.floor(Math.random() * data.length)]; // The object that data (the variable) will return
		msg.edit(
			client.embed(
				{
					title: 'Found One!',
					url: discordData.url.split('?')[0],
					image: {
						url: discordData.url.split('?')[0],
					},
				},
				message
			)
		);
	});
};
