const config = require('./config/config')
const {bot, Discord} = require('./config/config')

let regions = [
  "Work Region",
  "Fun Region",
  "Shop Region",
  "Airport",
  //"Thieves Cave"
]
var currentRegion = regions[0]

async function getNextRegion(my) {
  for (let i = -1; i < regions.length; i++) {
    if (my.roles.cache.get(regions[i])) {
      if (i >= regions.length) return regions[0]
      else return regions[(i + 1)]
    } else if (i >= regions.length) return regions[0]
  }
}

bot.on('ready', async () => {
  console.log(`\n\n${config.name.toLocaleUpperCase()} IS ONLINE!\n\n`);
  const guild = bot.guilds.cache.get('851966158651392040')
  const train = bot.channels.cache.get("860023491729817620");
  const my = guild.members.cache.get("860171173518245928")
  setTimeout(async () => {
    let beforeRegion = currentRegion
    let afterRegion = await getNextRegion(my)
    const role = guild.roles.cache.get(role => role.name === afterRegion)

    // Move the train
    if (my.roles.cache.get(role => role.name === beforeRegion)) my.roles.remove((my.roles.cache.get(role => role.name === beforeRegion)).id).catch(() => {return})

    my.roles.add(role)
    
    currentRegion = afterRegion
    train.send(`I'm now at the ${currentRegion}!`)
  }, 20 * 1000) // 120 seconds
})

bot.login(config.TOKEN)