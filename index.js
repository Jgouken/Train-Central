const config = require('./config/config')
const {bot, Discord} = require('./config/config')
const disbut = require("discord-buttons");
const riders = new Set();

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
    train.send(`Train will depart in **15** seconds.`)
    .then((l) => {
      l.delete({timeout:0})
      setTimeout (async function () {
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
        let button = new MessageButton()
          .setStyle('green')
          .setLabel('Enter/Exit') 
          .setID('join');
        
        riders.clear()
        train.send({
          embed: {
            title: regions[currentRegion],
            description: `The TC-Train has arrived at the ${regions[currentRegion]}. Next stop: **${regions[currentRegion + 1] || regions[0]}**.\nReact to enter the train.`,
            timestamp: new Date(date.getTime() + 2 * 60000),
            footer: {
              text: `Leaving:`
            }
          }
        }, button)
        .then((m) => {
          bot.on('clickButton', async (button) => {
            await button.reply.defer()

            if (!riders.has(user.id)) {
              riders.add(user.id)
              await button.reply.send({
                embed: {
                  title: `Entered Train to: ${regions[currentRegion]}`,
                  description: `You have entered the train. Press the button again to exit.`,
                  timestamp: new Date(date.getTime() + 2 * 60000),
                  footer: {
                    text: `Leaving:`
                  }
                }
              }, true)
            } else {
              riders.delete(user.id)
              await button.reply.send({
                embed: {
                  title: `Exited Train`,
                  description: `You have exited the train. Press the button again to exit.`,
                }
              }, true)
            }
          });

          setTimeout(() => {
            button.setDisabled()
            m.delete({timeout: 0}).catch(() => {return})
            m.delete({timeout: 1000}).catch(() => {return})
            train.send('**LEAVING...**').then((lv) => {lv.delete({timeout: 5000})})
          }, (config.waitTime - 5) * 1000)

          /*
          m.react('🚂')
          const filter = (user) => {
            return !user.bot
          };
          
          const collector = m.createReactionCollector(filter, { time: (config.waitTime - 1) * 1000 });
          
          collector.on('collect', (reaction, user) => {
            
          });
  
          collector.on('end', () => {
            m.delete({timeout: 0}).catch(() => {return})
            m.delete({timeout: 1000}).catch(() => {return})
          })

          */
        })
      }, (config.warningTime * 1000));
    })
  }, ((config.waitTime - (config.warningTime - 1)) * 1000));
})

bot.login(config.TOKEN)