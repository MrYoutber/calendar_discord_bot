const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  EmbedBuilder,
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
    },
    {
      name: "show-others",
      type: ApplicationCommandOptionType.Boolean,
      description: "Show your calendar to everyone or just to you.",
      required: false,
    },
  ],
  callback: async (client, interaction) => {
    if (interaction.options.getBoolean("show-others"))
      await interaction.deferReply({ ephemeral: false });
    else await interaction.deferReply({ ephemeral: true });

    const user = interaction.user;
    const guild = client.guilds.cache.get(
      interaction.options.getString("server")
    );

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
            priority,
          });
        }
      }
    }

    if (tasksArray.length === 0) {
      return interaction.editReply("You have no tasks in your calendar.");
    }

    console.log(tasksArray);

    let tasksArrayByDateAndPriority = [];
    for (const task of tasksArray) {
      let dateEntry = tasksArrayByDateAndPriority.find(
        (entry) => entry.date === task.date
      );

      if (dateEntry) {
        // If the date already exists, push the task to the tasks array
        dateEntry.tasks.push(task);
      } else {
        // If the date does not exist, create a new entry
        tasksArrayByDateAndPriority.push({
          date: task.date,
          tasks: [task],
        });
      }
    }

    // Sort tasks within each date entry by priority and time
    tasksArrayByDateAndPriority.forEach((dateEntry) => {
      dateEntry.tasks.sort((a, b) => {
        // Compare by priority
        if (a.priority < b.priority) return -1;
        if (a.priority > b.priority) return 1;
        // If priorities are equal, compare by time
        return a.time.localeCompare(b.time);
      });
    });

    // Building the reply string
    let replyString = "";
    for (const dateEntry of tasksArrayByDateAndPriority) {
      replyString += `## ${dateEntry.date}\n`;
      for (const taskEntry of dateEntry.tasks) {
        replyString += `**${taskEntry.taskName}** - ${taskEntry.time} - Priority: ${taskEntry.priority}\n`;
      }
    }

    let replyEmbed = new EmbedBuilder()
      .setTitle(`Your Calendar`)
      .setDescription(replyString)
      .setColor("Blue")
      .setTimestamp();

    let content = interaction.options.getBoolean("show-others")
      ? "Here is the calendar for <@" + user.id + ">:"
      : "Here is your calendar:";

    await interaction.editReply({
      content: content,
      embeds: [replyEmbed],
    });
  },
};
