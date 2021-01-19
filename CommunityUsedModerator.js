/*
CommunityUsedModerator Discord Bot
Harry Dang

Discord bot created for the private Discord server Anti GTP GTP Club for private use

TODO:
customize help menu
add democracy command
add quarantine radio schedule command
add response for invalid command

Made following Discord.js guide and An Idiot's Guide tutorial
*/

// require the Node's native file system module
const fs = require('fs');
// require the dotenv module
const dotenv = require('dotenv');
dotenv.config();
// require the discord.js module
const Discord = require('discord.js');
// requre the config file
// const { prefix } = require('./config.json');
const prefix = process.env.PREFIX;

// create a new Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();

// initializes array of js files for commands
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./Commands/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

// initializaes cooldown
const cooldowns = new Discord.Collection();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', (message) => {
  // exit if message doesn't contain prefix or is made by another bot
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // parses input message
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // exit if invalid command
  // TODO: add response
  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command) return;

  // arguments handling
  if (command.args && !args.length) {
    let response = 'no arguments were given';
    if (command.usage) {
      response += `\nExpected usage: \`${prefix}${command.name} ${command.usage}\``;
    }
    return message.reply(response);
  }

  // guild handling
  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply('this command must be used in a server, cannot be executed in DMs');
  }

  // cooldown handling
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // execute command
  try {
    command.execute(message, args);
  }
  catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
    message.channel.send(error.name + ': ' + error.message);
  }
});

// login to Discord with your app's token
client.login(process.env.TOKEN);