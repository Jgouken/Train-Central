const config = require('./config/config')
const {bot, Discord} = require('./config/config')
var currentRegion = "Work Region"

let regions = [
  "Work Region",
  "Fun Region",
  "Shop Region",
  "Airport",
  //"Thieves Cave"
]

async function getNextRegion(guild) {
  var i = 0;
  regions.forEach(region => {
    if (guild.me.roles.cache.some(role => role.name === region)) {
      if (regions[i + 1]) {return regions[i + 1]} else return regions[0]
    } else {
      i++
    }
  });
}

bot.on('ready', async () => {
  console.log(`\n\n${config.name.toLocaleUpperCase()} IS ONLINE!\n\n`);
  setTimeout(async () => {
    const guild = bot.guilds.cache.get('851966158651392040')
    const train = bot.channels.cache.get('860023491729817620')
    let beforeRegion = currentRegion
    let afterRegion = await getNextRegion(guild)
    const role = (guild.roles.cache.find(role => role.name === afterRegion))

    // Move the trian
    if (guild.me.roles.cache.get(role => role.name === beforeRegion)) guild.me.roles.remove((guild.me.roles.cache.get(role => role.name === beforeRegion)).id).catch(() => {return})

    guild.me.roles.add(role)
    
    currentRegion = afterRegion
    train.send(`I'm now at the ${currentRegion}!`)
  }, 60 * 1000) // 120 seconds
})

bot.login(config.TOKEN)