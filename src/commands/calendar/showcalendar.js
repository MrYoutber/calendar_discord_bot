const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
} = require("discord.js");
const Task = require("../../models/Task");

/**
 * 
 * @param {Client} client
 * @param {Interaction} interaction
 */
module.exports = {
    name: "showcalendar",
    description: "Show your calendar.",
    options: [
        {
            name: "server",
            type: ApplicationCommandOptionType.String,
            description: "The ID of the server you want to show the calendar for.",
            required: false,
        }
    ],
    callback: async (client, interaction) => {
        await interaction.deferReply();

        const user = interaction.user;
        const guild = client.guilds.cache.get(interaction.options.getString("server"));

        const tasks = await Task.find({});

        const tasksArray = [];

        for (const task of tasks) {
            if (!guild) {
                if (task.userId === user.id) {
                    const date_time_string = task.user_date_time;
                    const date = date_time_string.split(" ")[0];
                    const time = date_time_string.split(" ")[1];
                    const priority = task.priority;
                    const taskName = task.task;

                    tasksArray.push({
                        date,
                        time,
                        taskName,
                        priority
                    });
                }
            }
        }

        if (tasksArray.length === 0) {
            return interaction.editReply("You have no tasks in your calendar.");
        }

        console.log(tasksArray);

        let replyString = "";
        let datesArray = "";
        // To implement the sorting of tasks and making the replyString

        await interaction.editReply(tasksArray.map(task => { return `**${task.taskName}** - ${task.date} ${task.time} - Priority: ${task.priority}` }).join("\n"));
    }
}