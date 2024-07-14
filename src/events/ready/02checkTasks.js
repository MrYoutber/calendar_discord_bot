const { Client } = require('discord.js');
let handleTaskExpiration = require('../../handlers/tasks/handleTaskExpiration.js');
let handleTaskReminders = require('../../handlers/tasks/handleTaskReminders.js');

/**
 * @param {Client} client
 */
module.exports = (client) => {
    const checkInterval = 1000; // 1 second

    // learned that setInterval is asynchronous, so it is better to use instead of while (true) loop, cause that would block other operations
    setInterval(() => {
        let now = new Date();
        if (now.getSeconds() !== 0) return;

        console.log('Checking for expired tasks...');
        handleTaskExpiration.execute(client);
        console.log('Checking for task reminders...');
        handleTaskReminders.execute(client);
    }, checkInterval);
}