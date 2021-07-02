const Discord = require('discord.js');
const bot = new Discord.Client({ ws: { intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_PRESENCES', 'GUILD_MEMBERS'] }});

module.exports = {
    Discord: Discord, 
    bot: bot,
    
    name: 'Train',
    TOKEN: process.env.TOKEN,
    prefix: `tc!`,
}