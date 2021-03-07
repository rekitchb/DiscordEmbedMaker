import Prompt from 'prompt'
import { Client, MessageEmbed, TextChannel } from 'discord.js'
import { readdirSync } from 'fs'
import 'dotenv/config'

const client = new Client()
let configData: any = {}

client.on('ready', async () => {
  console.log(`Connected as ${client.user?.tag}!${client.user?.bot ? ' (Bot)' : ' (User)'}`)

  const server = await client.guilds.fetch(configData.serverID)
  const channel = await client.channels.fetch(configData.channelID) as TextChannel
  if (!server || !channel) {
    console.log('Invalid server or channel. Exiting app now.')
    process.exit(1)
  }
  console.log(`\nServer target: ${server.name} [${server.id}]\nChannel target: #${channel.name} [${channel.id}]\n`)

  console.log(`Trying to send ${configData.message.length} messages...`)
  let count = 1
  for (const data of configData.message) {
    try {
      const embed = new MessageEmbed(data)
      await channel.send(embed)
    } catch (err) {
      throw new Error(err.message)
    } finally {
      console.log(`Send ${count} message, done!`)
      count++
    }
  }

  console.log('\nAll done! Exiting app now.')
  process.exit(0)
})

Prompt.start()

const data = readdirSync('./Template').filter(v => v !== '_schema.json')
console.log(`Please choose template that you want to use:`)
data.forEach((v, i) => {
  console.log(`${i + 1}. ${v}`)
})

Prompt.get(['choosen'], async (err, result) => {
  if (err) return
  if (result.choosen > data.length || result.choosen < 0) {
    console.log('Data invalid. Exiting app now.')
    process.exit(1)
  }

  const selected = data[parseInt(result.choosen.toString()) - 1]
  configData = (await import(`./Template/${selected}`)).default
  console.log(`\nImporting ${selected}...`)

  console.log("Connecting to Discord...")
  client.login(process.env.TOKEN)
})

