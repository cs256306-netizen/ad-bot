require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('OK'));
app.listen(8080, () => console.log('Web ready'));

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

let isRunning = false;
let currentChannel = null;

function createMegaMessage() {
  const text = "반갑다 이기야 ";
  let message = "";
  while(message.length + text.length <= 2000) {
    message += text;
  }
  return message.trim();
}

async function megaSpam() {
  while(isRunning && currentChannel) {
    try {
      await currentChannel.send(createMegaMessage());
      await new Promise(r => setTimeout(r, 1000));
    } catch(e) {
      console.log('Waiting');
      await new Promise(r => setTimeout(r, 60000));
    }
  }
}

client.on('ready', () => console.log('Ad Bot Ready'));

client.on('messageCreate', async m => {
  if(m.author.bot) return;
  
  if(m.content === '$ad start'){
    if(isRunning) return;
    isRunning = true;
    currentChannel = m.channel;
    megaSpam();
    m.reply('Started');
  }
  
  if(m.content === '$ad stop'){
    isRunning = false;
    m.reply('Stopped');
  }
  
  if(m.content.startsWith('$ad add ')){
    m.reply('Added');
  }
});

client.login(process.env.DISCORD_TOKEN);
