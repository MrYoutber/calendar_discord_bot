const { devs, testServer } = require("../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );

    if (!commandObject) return;

    if (commandObject.devOnly && !devs.includes(interaction.member.id)) {
      return interaction.reply({
        content: "Only developers are allowed to run this command.",
        ephemeral: true,
      });
    }

    if (commandObject.testOnly && interaction.guild.id !== testServer) {
      return interaction.reply({
        content: "This command cannot be run here.",
        ephemeral: true,
      });
    }

    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          return interaction.reply({
            content: "Not enough permissions.",
            ephemeral: true,
          });
        }
      }
    }

    if (commandObject.botPermissions?.length) {
      const bot = interaction.guild.members.me;

      for (const permission of commandObject.botPermissions) {
        if (!bot.permissions.has(permission)) {
          return interaction.reply({
            content: "I don’t have enough permissions.",
            ephemeral: true,
          });
        }
      }
    }

    await commandObject.callback(client, interaction);
  } catch (error) {
    console.error(`There was an error running this command: ${error}`);
  }
};
