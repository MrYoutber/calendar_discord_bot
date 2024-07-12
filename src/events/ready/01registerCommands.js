const { Client } = require('discord.js');
const { clientId } = require('../../config.json');
require('dotenv').config();

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    registerCommands();
}

async function registerCommands() {
    const { REST, Routes } = require('discord.js');

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN); // Replace with your bot's token

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(clientId), // Replace with your bot's client ID
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}