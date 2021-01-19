module.exports = {
  name: 'yleinen',
  description: 'replies with a random variation of `yleinen`',
  aliases: false,
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 5,
  execute(message, args) {
    const yleinens = ['yleinen', 'YLEINEN', 'y l e i n e n', '*yleinen*', '**yleinen**', '***yleinen***', '_ylienen_', '~~yleinen~~', '`yleinen`'];
    const random = Math.floor(Math.random() * yleinens.length);
    message.channel.send(yleinens[random]);
  },
};