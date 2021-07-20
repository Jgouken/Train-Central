const config = require('./config/config')
const {bot, Discord, warningTime} = require('./config/config')
const riders = new Set();
const mysql = require('mysql');
const util = require('util');
let con = mysql.createConnection({
    host: 'panel.bitsec.dev',
    user: 'u318_3GXpXODhvF',
    password: 'g9t3NvB.6o4wOk7Lx!u8HhCp',
    database: 's318_TCPhone'
});

con.connect();
var dbName = 'users'
const query = util.promisify(con.query).bind(con);

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
  if (config.stop == true) return console.log(`\n\n${config.name.toLocaleUpperCase()} IS ONLINE, BUT IS STOPPED!\n\n`);
  console.log(`\n\n${config.name.toLocaleUpperCase()} IS ONLINE!\n\n`);
  const guild = bot.guilds.cache.get("851966158651392040")
  const train = bot.channels.cache.get("860608724019314768")
  const member = guild.members.cache.get("860171173518245928")
  for (let i = -1; i < regions.length; i++) member.roles.remove(regionIDs[i]).catch(() => {return})

  setInterval (async function () {
      var date = new Date();
      member.roles.remove(regionIDs[currentRegion])
      currentRegion += 1
      if (!regions[currentRegion]) currentRegion = 0
      member.roles.add(regionIDs[currentRegion])
      train.overwritePermissions([
        {
          id: guild.id,
          deny: ['VIEW_CHANNEL']
        },
        {
          id: regionIDs[currentRegion],
          allow: ['VIEW_CHANNEL'],
        },
      ]);

      riders.forEach(user => {
        let member = guild.members.cache.get(user)
        for (let i = -1; i < regionIDs.length; i++) member.roles.remove(regionIDs[i]).catch(() => {return})
        member.roles.add(regionIDs[currentRegion])
      })

      await query(`UPDATE train SET regionid = '${regionIDs[currentRegion]}' WHERE id = 'train'`)
      await query(`UPDATE train SET region = '${regions[currentRegion]}' WHERE id = 'train'`)
      await query(`UPDATE train SET nextregion = '${regions[currentRegion + 1] || regions[0]}' WHERE id = 'train'`)

      riders.clear()
      train.send(`React to enter the train to go to **${regions[currentRegion + 1] || regions[0]}**.`)
      train.send({
        embed: {
          title: regions[currentRegion],
          description: `The TC-Train has arrived at the ${regions[currentRegion]}. Next stop: **${regions[currentRegion + 1] || regions[0]}**.\nReact to enter the train.`,
          timestamp: new Date(date.getTime() + 2 * 60000),
          footer: {
            text: `Leaving:`
          }
        }
      })
      .then((m) => {
        m.react('🚂')
        const filter = (user) => {
          return !user.bot
        };
        
        const collector = m.createReactionCollector(filter, { time: (config.waitTime - 2) * 1000 });
        
        collector.on('collect', (reaction, user) => {
          con.query(`SELECT balance FROM ${dbName} WHERE id = '${user.id}'`, async function (err, result, fields) {
            Object.keys(result).forEach(async function(key) {
                var bal = JSON.parse(JSON.stringify(result[key])).balance
                if (Number(bal) < 10) {
                  user.send('HALT! You do not have sufficient funds to board this train! You require $10!').catch(() => {return})
                  reaction.users.remove(user.id)
                }
              });
          })
          riders.add(user.id)
        });

        collector.on('end', async () => {
          train.bulkDelete(2)
        })
    })
  }, (config.waitTime) * 1000);
})

bot.login(config.TOKEN)