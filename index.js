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

var currentRegion = 0

bot.on('ready', async () => {
  console.log(`\n\n${config.name.toLocaleUpperCase()} IS ONLINE!\n\n`);
  const guild = bot.guilds.cache.get("851966158651392040")
  const train = bot.channels.cache.get("860023491729817620")
  const member = guild.members.cache.get("860171173518245928")

    var interval = setInterval (async function () {
      train.send('**15 SECONDS BEFORE THE TRAIN LEAVES.**')

      var interval2 = setInterval (async function () {
        member.roles.remove(regionIDs[currentRegion])
        currentRegion += 1
        if (!regions[currentRegion]) currentRegion = 0
        
        member.roles.add(regionIDs[currentRegion])
      }, 120 * 1000);

    }, 105 * 1000);

})

bot.login(config.TOKEN)