import { Bot } from '../client/Client';
import { Message } from 'discord.js';

export interface RunFunction {
	(client: Bot, message: Message, args: String[]): Promise<unknown>;
}

export interface Command {
	name: String;
	category: String;
	aliases: String[];
	run: RunFunction;
}
