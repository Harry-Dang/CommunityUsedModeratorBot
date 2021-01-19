module.exports = {
  name: 'reload',
  description: 'Reloads a command, for internal use only',
  args: true,
  usage: 'command_name',
  guildOnly: false,
  cooldown: 5,
  execute(message, args) {
    // check if command exists
    const commandName = args[0].toLowerCase();
    const command = message.client.commands.get(commandName)
      || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    // return if doesn't exist
    if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);

    // deletes cache of command
    delete require.cache[require.resolve(`./${command.name}.js`)];

    // acquire command again
    try {
      const newCommand = require(`./${command.name}.js`);
      message.client.commands.set(newCommand.name, newCommand);
    }
    catch (error) {
      console.error(error);
      message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
    }
  },
};