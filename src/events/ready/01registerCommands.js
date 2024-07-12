const { Client, REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { devs, testServer, clientId } = require("../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");
require("dotenv").config();

/**
 * @param {Client} client
 */
module.exports = async (client) => {
  registerCommands();
};

async function registerCommands() {
  // Register commands globally
  const commands = [];
  const localCommands = getLocalCommands();

  localCommands.forEach((command) => {
    commands.push({
      name: command.name,
      description: command.description,
      options: command.options || [],
    });
    console.log(`Registering command: ${command.name}`);
  });

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(clientId), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}
