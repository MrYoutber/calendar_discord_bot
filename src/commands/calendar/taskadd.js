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
  name: "taskadd",
  description: "Add a task to the calendar",
  options: [
    {
      name: "task",
      type: ApplicationCommandOptionType.String,
      description: "The task to add. e.g. 'Do homework'",
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
    {
      name: "priority",
      type: ApplicationCommandOptionType.Integer,
      description: "The priority of the task. 1-4 where 1 is highest priority.",
      required: true,
    }
  ],
  callback: async (client, interaction) => {
    await interaction.deferReply();

    const task = interaction.options.getString("task");
    const dateString = interaction.options.getString("date");
    let timeString = interaction.options.getString("time");
    const priority = interaction.options.getInteger("priority");

    const userId = interaction.user.id;
    const guildId = interaction.guild.id;

    // Check if the date is valid in the MM-DD-YYYY format
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return interaction.editReply(
        "Invalid date format. Please use the format `MM-DD-YYYY` or `MM/DD/YYYY`."
      );
    }

    // Check if the time is valid in the HH:MM format
    let time = timeString.split(":");
    if (time.length === 1) {
      timeString += ":00";
      time = timeString.split(":");
    }
    if (time.length !== 2 || isNaN(time[0]) || isNaN(time[1])) {
      return interaction.editReply(
        "Invalid time format. Please use the format `HH:MM`."
      );
    }

    const dateAndTimeString = `${dateString} ${timeString}`;

    // Check if the date and time is valid
    const dateAndTime = new Date(dateAndTimeString);
    if (isNaN(dateAndTime.getTime())) {
      return interaction.editReply(
        "An error occured. If you're the server owner, please check the console for more information."
      );
    }

    // Check if the priority is valid
    if (priority < 1 || priority > 4) {
      return interaction.editReply(
        "Invalid priority. Please use a number between 1 and 4."
      );
    }

    const newTask = new Task({
      userId: userId,
      guildId: guildId,
      task: task,
      date_time: dateAndTime,
      user_date_time: dateAndTimeString,
      priority: priority,
    });

    // Save the task to the database
    newTask
      .save()
      .then(() => {
        interaction.editReply("Task added to the calendar! Make sure to have DMs enabled to receive reminders.");
        console.log(
          `Task added to the calendar: ${task} on ${dateAndTimeString} from user ${userId} in guild ${guildId}, local user time: ${timeString}`
        );
      })
      .catch((err) => {
        console.error(err);
        interaction.editReply(
          "An error occurred while adding the task to the calendar."
        );
      });
  },
};
