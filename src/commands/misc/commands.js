const { Client, Interaction, EmbedBuilder } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */
module.exports = {
  name: "commands",
  description: "Show a list of commands",
  callback: async (client, interaction) => {
    await interaction.deferReply();
    const embed = new EmbedBuilder()
      .setTitle("Commands")
      .setDescription("Here is the list of commands:")
      .addFields(
        { name: "1. /commands", value: "Show a list of commands" },
        { name: "2. /clear", value: "Clear messages in a channel" },
        { name: "3. /ping", value: "Show the bot's ping" },
        { name: "4. /showcalendar", value: "Show your calendar" },
        { name: "5. /taskadd", value: "Add a task to the calendar" }
      )
      .setColor("Blue");
    await interaction.editReply({ embeds: [embed] });
  },
};
