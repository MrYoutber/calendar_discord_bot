const { Client, Interaction, ApplicationCommandOptionType } = require("discord.js");
const Task = require("../../models/Task");

module.exports = {
    name: "taskremove",
    description: "Remove a task from the calendar",
    options: [
        {
            name: "task",
            type: ApplicationCommandOptionType.String,
            description: "The task to remove. e.g. 'Do homework'",
            required: true,
        },
        {
            name: "date",
            type: ApplicationCommandOptionType.String,
            description: "The date of the task. Use MM-DD-YYYY or MM/DD/YYYY format.",
            required: true,
        },
        {
            name: "time",
            type: ApplicationCommandOptionType.String,
            description: "The time of the task. Use HH:MM format.",
            required: true,
        },
    ],
    callback: async (client, interaction) => {
        await interaction.deferReply();

        const task = interaction.options.getString("task");
        const dateString = interaction.options.getString("date");
        const timeString = interaction.options.getString("time");
        if (timeString.split(':').length !== 2) {
            return await interaction.editReply({
                content: "Invalid time format! Use HH:MM format.",
                ephemeral: true,
            });
        }
        const dateTimeString = `${dateString} ${timeString}`;

        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        const taskData = await Task.findOneAndDelete({
            task,
            user_date_time: dateTimeString,
            userId,
            guildId,
        });

        if (!taskData) {
            return await interaction.editReply({
                content: "Task not found!",
                ephemeral: true,
            });
        }

        await interaction.editReply({
            content: "Task removed successfully!",
            ephemeral: true,
        });
    },
}