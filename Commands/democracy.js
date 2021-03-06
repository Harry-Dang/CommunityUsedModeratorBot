const msPerMin = 60000;

module.exports = {
  name: 'democracy',
  description: 'flips a coin, if heads: mutes the specified member for one minute or `time_length` minutes (max is 10 min). By default, the coin is fair, but can be changed using `coin_probability`. `coin_probability` must be between 0 and 1',
  aliases: ['mute'],
  args: true,
  usage: 'user [time_length] [coin_probability]',
  guildOnly: true,
  cooldown: 5,
  execute(message, args) {
    message.guild.members.fetch(message.author).then(author => {
      if (!(author.roles.cache.some(role => role.name === 'The Tim Beal Council' || role.name === 'Kamala Harris'))) {
        return message.reply('you don\'t have sufficient privileges for this command');
      }
      const member = message.mentions.members.first();
      if (member.id === '800901935153807380') {
        return message.reply('please don\'t mute me :pleading_face:');
      }
      let muteTime = 1;
      let probability = 0.5;
      if (args[1] >= 0 && args[1] <= 10) {
        muteTime = args[1];
      }
      else if (args[1] < 0 || args[1] > 10) {
        return message.reply('invalid mute time, must be between 0 and 10 minutes');
      }
      if (args[2] >= 0 && args[2] <= 1) {
        probability = args[2];
      }
      if (member.roles.cache.some(role => role.name === 'Muted') || message.client.muted.has(member)) {
        return message.reply(`${member} is already muted`);
      }
      if (Math.random() < probability) {
        const roles = member.roles.cache;
        message.client.muted.set(member, roles);
        const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
        member.roles.add(muteRole);
        member.roles.remove(roles);
        message.reply(`i flipped a coin and got **heads**\n${member} has been muted for ` + muteTime + ' minute(s)');
        setTimeout(() => {
          member.roles.remove(muteRole);
          member.roles.add(roles);
          message.client.muted.delete(member);
          message.channel.send('it has been ' + muteTime + ` minute(s) so ${member} has been unmuted`);
        }, muteTime * msPerMin);
      }
      else {
        return message.reply('i flipped a coin and got **tails**');
      }
    });
  },
};