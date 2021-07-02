const config = require('./config/config')
const {bot, Discord} = require('./config/config')
const guild = bot.guilds.cache.get('851966158651392040')
const train = bot.channels.cache.get('860023491729817620')
const my = bot.members.cache.get('860171173518245928')

let regions = [
  "Work Region",
  "Fun Region",
  "Shop Region",
  "Airport",
  //"Thieves Cave"
]
var currentRegion = regions[0]

async function getNextRegion() {
  for (let i = -1; i < regions.length; i++) {
    if (my.roles.find(regions[i])) {
      if (i >= regions.length) return regions[0]
      else return regions[(i + 1)]
    } else if (i >= regions.length) return regions[0]
  }
}

bot.on('ready', async () => {
  console.log(`\n\n${config.name.toLocaleUpperCase()} IS ONLINE!\n\n`);
  setTimeout(async () => {
    let beforeRegion = currentRegion
    let afterRegion = await getNextRegion()
    const role = guild.roles.cache.find(role => role.name === afterRegion)

    // Move the train
    if (my.roles.cache.get(role => role.name === beforeRegion)) my.roles.remove((my.roles.cache.get(role => role.name === beforeRegion)).id).catch(() => {return})

    my.roles.add(role)
    
    currentRegion = afterRegion
    train.send(`I'm now at the ${currentRegion}!`)
  }, 20 * 1000) // 120 seconds
})

bot.login(config.TOKEN)