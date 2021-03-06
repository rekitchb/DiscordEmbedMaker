import { Client } from 'discord.js'

const client = new Client()

client.on('ready', async () => {
  console.log('We\'re ready!')
})

client.login(process.env.TOKEN)

