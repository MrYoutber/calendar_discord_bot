const { Client, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "clear",
    description: "Clear messages in a channel",
    options: [
        {
            name: "amount",
            type: ApplicationCommandOptionType.Integer,
            description: "The amount of messages to clear",
            required: true,
        },
    ],
    callback: async (client, interaction) => {
        await interaction.deferReply();

        const amount = interaction.options.getInteger("amount");

        if (amount < 1 || amount > 100) {
            return await interaction.editReply("You can only clear 1 to 100 messages at a time.");
        }

        await interaction.channel.bulkDelete(amount, true).catch((err) => {
            console.error(err);
            interaction.editReply("There was an error trying to clear messages in this channel!");
        });

        await interaction.editReply(`Successfully cleared ${amount} messages.`);
        
        setTimeout(async () => {
            await interaction.deleteReply();
        }, 1000);
    },
};