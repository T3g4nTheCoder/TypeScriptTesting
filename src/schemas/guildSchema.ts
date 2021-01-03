import mongoose from 'mongoose';

const guildSchema = new mongoose.Schema({
  _id: String,
  Logs: String,
  Prefix: String,
});

export default mongoose.model("guilds", guildSchema);
