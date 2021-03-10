import consola, { Consola } from 'consola';
import {
	Client,
	MessageEmbedOptions,
	Message,
	Intents,
	Collection,
	MessageEmbed,
} from 'discord.js';
import mongoose from 'mongoose';
import glob from 'glob';
import { Command } from '../interfaces/Command';
import { Event } from '../interfaces/Event';
import { Config } from '../interfaces/Config';
import { promisify } from 'util';

const globPromise = promisify(glob);

class Bot extends Client {
	public logger: Consola = consola;
	public events: Collection<String, Event> = new Collection();
	public commands: Collection<String, Command> = new Collection();
	public config: Config;
	public cmdAmount: number = 0;
	public categorys: Collection<String, String> = new Collection();
	public constructor() {
		super({
			ws: { intents: Intents.ALL },
			messageCacheLifetime: 180,
			messageCacheMaxSize: 200,
			messageEditHistoryMaxSize: 200,
			messageSweepInterval: 180,
		});
	}
	public async start(config: Config): Promise<void> {
		this.config = config;
		const { token, mongopath } = config;
		this.login(token);
		const commandFiles: string[] = await globPromise(
			`${__dirname}/../commands/**/*{.ts,.js}`
		);
		commandFiles.map(async (value: string) => {
			const command: Command = await import(value);
			this.commands.set(command.name, command);
			this.cmdAmount++;
			if (!this.categorys) {
				this.categorys.set(command.category, command.category);
			} else if (!this.categorys.has(command.category)) {
				this.categorys.set(command.category, command.category);
			}
		});
		const eventFiles: string[] = await globPromise(
			`${__dirname}/../events/**/*{.ts,.js}`
		);
		eventFiles.map(async (value: string) => {
			const event: Event = await import(value);
			this.events.set(event.name, event);
			this.on(event.name, event.run.bind(null, this));
		});
		// mongoose.connect(mongopath, {
		// 	useUnifiedTopology: true,
		// 	useNewUrlParser: true,
		// 	useFindAndModify: false,
		// 	keepAlive: true,
		// });
	}
	public getCommand(value: string): Command | null {
		return this.commands.get(value) ||
			this.commands.find(
				(command) => command.aliases && command.aliases.includes(value)
			)
			? this.commands.get(value) ||
					this.commands.find(
						(command) => command.aliases && command.aliases.includes(value)
					)
			: null;
	}
	public error(description: string): MessageEmbed {
		return new MessageEmbed()
			.setDescription(description)
			.setColor('RED')
			.setFooter('ERROR')
			.setTimestamp(Date.now());
	}
	public embed(options: MessageEmbedOptions, message: Message): MessageEmbed {
		return new MessageEmbed({ ...options, color: 'RANDOM' })
			.setFooter(
				`|   ${message.author.tag}`,
				message.author.displayAvatarURL({ dynamic: true, format: 'png' })
			)
			.setTimestamp(Date.now());
	}
}

export { Bot };
