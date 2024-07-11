const { Client, IntentsBitField } = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const mongoose = require("mongoose");
require("dotenv").config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to db.");

    eventHandler(client);

    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(`There was an error connecting to the db: ${error}`);
  }
})();