module.exports = {
    name: "taskExpires",
    once: false,
    async execute(client) {
        const Task = require("../../models/Task");
        const { MessageEmbed } = require("discord.js");

        const tasks = await Task.find({});

        const now = new Date();

        for (const task of tasks) {
            if (task.date_time <= now) {
                const user = await client.users.fetch(task.userId);
                const guild = await client.guilds.fetch(task.guildId);

                const embed = new MessageEmbed()
                    .setTitle("Task Reminder")
                    .setDescription(`You have a task that has expired in **${guild.name}**.`)
                    .addField("Task", task.task)
                    .setColor("RED")
                    .setTimestamp();

                user.send({ embeds: [embed] });

                await Task.findByIdAndDelete(task._id);
            }
        }
    }
}