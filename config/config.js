const Discord = require('discord.js');
const bot = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_PRESENCES', 'GUILD_MEMBERS'] });

module.exports = {
    Discord: Discord, 
    bot: bot,
    
    name: 'Train',
    TOKEN: process.env.TOKEN,
    prefix: `tc!`,
    stop: false,
    waitTime: 120, // seconds
    timeFrame: this.waitTime, // Time maximum for users to enter the train.
    warningTime: 15, // how many seconds the train will warn the users before departing
}