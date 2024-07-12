module.exports = {
    name: "taskExpires",
    once: false,
    async execute(client) {
        const Task = require("../../models/Task");
        const { EmbedBuilder } = require("discord.js");

        const tasks = await Task.find({});

        const now = new Date();

        for (const task of tasks) {
            if (task.date_time <= now) {
                const user = await client.users.fetch(task.userId);
                const guild = await client.guilds.fetch(task.guildId);

                const user_date_time_string = task.user_date_time;
                const user_date_time = new Date(user_date_time_string).toString();

                const embed = new EmbedBuilder()
                    .setTitle("Task Reminder")
                    .setDescription(`You have a task that has expired in **${guild.name}**.`)
                    .addFields(
                        { name: "Task", value: task.task },
                        { name: "Expired At", value: user_date_time }
                    )
                    .setColor("Red")
                    .setTimestamp();

                user.send({ embeds: [embed] });

                await Task.findByIdAndDelete(task._id);
            }
        }
    }
}