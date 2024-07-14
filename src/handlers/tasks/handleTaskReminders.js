module.exports = {
  name: "taskReminder",
  once: false,
  async execute(client) {
    const Task = require("../../models/Task");
    const { EmbedBuilder } = require("discord.js");

    const tasks = await Task.find({});

    const now = new Date();

    for (const task of tasks) {
      for (const reminder of task.reminders) {
        const reminderTime = new Date(task.date_time);
        const { numString, letterString } =
          separateNumbersFromLetters(reminder);
        switch (letterString) {
          case "d":
            reminderTime.setDate(reminderTime.getDate() - numString);
            break;
          case "h":
            reminderTime.setHours(reminderTime.getHours() - numString);
            break;
          case "m":
            reminderTime.setMinutes(reminderTime.getMinutes() - numString);
            break;
          default:
            break;
        }

        if (now >= reminderTime) {
          const user = await client.users.fetch(task.userId);
          const guild = await client.guilds.fetch(task.guildId);

          const embed = new EmbedBuilder()
            .setTitle("Task Reminder")
            .setDescription(
              `You have a task that expires in ${numString}${letterString} in **${guild.name}**.`
            )
            .addFields(
              { name: "Task", value: task.task },
              { name: "Expires in", value: numString + letterString }
            )
            .setColor("Yellow")
            .setTimestamp();

          user.send({ embeds: [embed] });

          task.reminders = task.reminders.filter((r) => r !== reminder);
          task.save();
        }
      }
    }
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
