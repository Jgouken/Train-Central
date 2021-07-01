const Discord = require('discord.js');
const bot = new Discord.Client();

module.exports = {
    Discord: Discord, 
    bot: bot,
    
    name: 'Train',
    TOKEN: process.env.TOKEN,
    prefix: `tc!`,
}