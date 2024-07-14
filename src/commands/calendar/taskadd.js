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
    },
    {
      name: "reminders",
      type: ApplicationCommandOptionType.String,
      description:
        "Add reminders for the task. You can set as many as you want, separated by commas. e.g. '1d, 1h, 30m'",
      required: false,
    },
  ],
  callback: async (client, interaction) => {
    await interaction.deferReply();

    const task = interaction.options.getString("task");
    const dateString = interaction.options.getString("date");
    let timeString = interaction.options.getString("time");
    const priority = interaction.options.getInteger("priority");
    const remindersString = interaction.options.getString("reminders");
    const reminders = remindersString ? remindersString.split(",") : [];

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

    // Check if the reminders are valid
    for (const reminder of reminders) {
      const { numString, letterString } = separateNumbersFromLetters(reminder);
      const num = parseInt(numString);
      if (isNaN(num)) {
        return interaction.editReply(
          "Invalid reminder format. Please use the format `1d`, `1h`, `30m`, etc."
        );
      }

      if (
        letterString !== "d" &&
        letterString !== "h" &&
        letterString !== "m"
      ) {
        return interaction.editReply(
          "Invalid reminder format. Please use the format `1d`, `1h`, `30m`, etc."
        );
      }

      if (num < 1) {
        return interaction.editReply(
          "Invalid reminder format. Please use a number greater than 0."
        );
      }

      if (num > 30 && letterString === "d") {
        return interaction.editReply(
          "Invalid reminder format. You can only set a maximum of 30 days."
        );
      }

      if (num > 24 && letterString === "h") {
        return interaction.editReply(
          "Invalid reminder format. You can only set a maximum of 24 hours."
        );
      }

      if (num > 60 && letterString === "m") {
        return interaction.editReply(
          "Invalid reminder format. You can only set a maximum of 60 minutes."
        );
      }

      // Calculate the reminder time
      let reminderTime = new Date(dateAndTime);
      if (letterString === "d") {
        reminderTime.setDate(reminderTime.getDate() - num);
      } else if (letterString === "h") {
        reminderTime.setHours(reminderTime.getHours() - num);
      } else if (letterString === "m") {
        reminderTime.setMinutes(reminderTime.getMinutes() - num);
      }

      // Check if the reminder time is in the past
      if (reminderTime < new Date()) {
        return interaction.editReply(
          "Invalid reminder time. The reminder time cannot be in the past."
        );
      }
    }

    const newTask = new Task({
      userId: userId,
      guildId: guildId,
      task: task,
      date_time: dateAndTime,
      user_date_time: dateAndTimeString,
      priority: priority,
      reminders: reminders,
    });

    // Save the task to the database
    newTask
      .save()
      .then(() => {
        interaction.editReply(
          "Task added to the calendar! Make sure to have DMs enabled to receive reminders."
        );
        console.log(
          `Task added to the calendar: ${task} on ${dateAndTimeString} from user ${userId} in guild ${guildId}, local user time: ${timeString}. Reminders: ${reminders}`
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

function separateNumbersFromLetters(inputString) {
  let numString = "";
  let letterString = "";

  for (const char of inputString) {
    if (!isNaN(char) && char !== " ") {
      // Check if char is a number
      numString += char;
    } else if (isNaN(char)) {
      // Check if char is a letter
      letterString += char;
    }
  }

  return { numString, letterString };
}
