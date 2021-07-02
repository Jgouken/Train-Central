const config = require('./config/config')
const {bot, Discord} = require('./config/config')

let regions = [
  "Work Region",
  "Fun Region",
  "Shop Region",
  "Airport",
  //"Thieves Cave"
]

let regionIDs = [
  "860179772202156053",
  "860179816207876136",
  "860179694837170197",
  "860180163576070184",
  // "860179834704232458"
]

var currentRegion = regions[0]

bot.on('ready', async () => {
  console.log(`\n\n${config.name.toLocaleUpperCase()} IS ONLINE!\n\n`);

  async function getNextRegion(my) {
    for (let i = 0; i < regions.length; i++) {
      if (my.roles.cache.get(regions[i])) {
        if (i >= regions.length) return regions[0]
        else return regions[(i + 1)]
      } else if (i >= regions.length) return regions[0]
    }
  }
  
  async function getNextRole(afterRegion) {
    for (let i = 0; i < regions.length; i++) {
      if (regions[i] === afterRegion) return regionIDs[i]
      else if (i >= regions.length) return regionsIDs[0]
    }
  }

  const guild = bot.guilds.cache.get('851966158651392040')
  const train = bot.channels.cache.get("860023491729817620")
  const my = guild.members.cache.get("860171173518245928")

  setTimeout(async () => {
    let beforeRegion = currentRegion
    let afterRegion = await getNextRegion(my)
    let role = await getNextRole(afterRegion)
    console.log(afterRegion)

    // Move the train
    if (my.roles.cache.get(role => role.name === beforeRegion)) my.roles.remove((my.roles.cache.find(role => role.name === beforeRegion)).id).catch(() => {return})

    my.roles.add(role)
    currentRegion = afterRegion
    train.send(`I'm now at the ${currentRegion}!`)
  }, 10 * 1000) // 120 seconds
})

bot.login(config.TOKEN)