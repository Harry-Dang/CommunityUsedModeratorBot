module.exports = {
  name: 'ping',
  description: 'replies with `pong!` to test if bot is responding',
  aliases: false,
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 5,
  execute(message, args) {
    message.reply('pong!');
  },
};