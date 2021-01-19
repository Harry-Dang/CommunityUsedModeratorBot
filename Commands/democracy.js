const msPerMin = 60000;

module.exports = {
  name: 'democracy',
  description: 'flips a coin, if heads: mutes the specified member for a minute or `time_length` minutes',
  aliases: ['mute'],
  args: true,
  usage: 'user [time_length]',
  guildOnly: true,
  cooldown: 5,
  execute(message, args) {
    const member = message.mentions.members.first();
    let muteTime = 1;
    if (args.length >= 1) {
      muteTime = args[1];
    }
    if (member.roles.cache.some(role => role.name === 'Muted') || message.client.muted.has(member)) {
      return message.reply('<@member id> is already muted');
    }
    if (Math.random() >= 0.5) {
      const roles = [member.roles.cache.values()];
      message.client.muted.set(member, roles);
      const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
      member.roles.add(muteRole);
      roles.forEach(function (role) {
        member.roles.remove(role);
      });
      message.reply('i flipped a coin and got **heads**\n<@member id> has been muted for ' + muteTime + ' minute(s)');
      setTimeout(() => {
        member.roles.remove(muteRole);
        roles.forEach(function (role) {
          member.roles.add(role);
        });
        message.client.muted.delete(member);
      }, muteTime * msPerMin);
      message.channel.send('it has been ' + muteTime + 'minute(s) so <@member id> has been unmuted');
    }
    else {
      return message.reply('i flipped a coin and got **tails**');
    }
  },
};