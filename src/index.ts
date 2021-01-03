import { Config } from './interfaces/Config';
import * as item from '../config.json';
import { Bot } from './client/Client';

new Bot().start(item as Config);
