const { MessageEmbed } = require('discord.js');

const hourMS = 3600000;
const fiveMS = 300000;

module.exports = {
  name: 'qr',
  description: 'create a Quarantine Radio announcement that will ping everyone at the specified time',
  aliases: ['radio'],
  args: true,
  usage: 'qr number curated_by length YYYY-MM-DD HH:MM image',
  guildonly: true,
  cooldown: 5,
  execute(message, args) {
    const member = message.mentions.members.first().user;
    const now = Date.now();
    const start = parseDate(args[3], args[4]);

    const hrTimeOut = start.valueOf() - now.valueOf() - hourMS;
    const fiveTimeOut = start.valueOf() - now.valueOf() - fiveMS;
    const starting = start.valueOf() - now.valueOf();

    if (starting <= 0) {
      return message.reply('invalid start time');
    }

    // confirmation message
    message.channel.send(
      createQREmbed(args[0], member, args[2], start,
        message.attachments.first(), ''));
    // 1 hr warning
    if (hrTimeOut > 0) {
      setTimeout(() => {
        message.channel.send(
          createQREmbed(args[0], member, args[2], start,
            message.attachments.first(), 'starts in 1 hour'));
      }, start.valueOf() - now.valueOf() - hourMS);
    }
    // 5 min warning
    if (fiveTimeOut > 0) {
      setTimeout(() => {
        message.channel.send(
          createQREmbed(args[0], member, args[2], start,
            message.attachments.first(), 'starts in 5 min, pull up'));
      }, start.valueOf() - now.valueOf() - fiveMS);
    }
    // start warning
    setTimeout(() => {
      message.channel.send(
        createQREmbed(args[0], member, args[2], start,
          message.attachments.first(), 'starting now! pull tf up'));
    }, start.valueOf() - now.valueOf());
  },
};

function parseDate(date, time) {
  const dateSplit = date.split('-');
  const timeSplit = time.split(':');
  return new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2], timeSplit[0],
    timeSplit[1]);
}

function createQREmbed(number, author, length, date, image, description) {
  return new MessageEmbed()
    .setTitle('Quarantine Radio #' + number)
    .setDescription(description)
    .setThumbnail(author.displayAvatarURL())
    .setImage(image.proxyURL)
    .addFields({
      name: 'Curated by',
      value: `${author}`,
    })
    .addFields({
      name: 'Length',
      value: length + ' minutes',
    })
    .addFields({
      name: 'Date',
      value: date.toDateString(),
    })
    .addFields({
      name: 'Time',
      value:
        date.toLocaleTimeString('en-US', {
          timeZone: 'Europe/Paris',
          hour: '2-digit', minute: '2-digit',
          timeZoneName: 'short',
        }) + ' / ' +
        date.toLocaleTimeString('en-US', {
          timeZone: 'Europe/London',
          hour: '2-digit', minute: '2-digit',
          timeZoneName: 'short',
        }) + ' / ' +
        date.toLocaleTimeString('en-US', {
          timeZone: 'America/New_York',
          hour: '2-digit', minute: '2-digit',
          timeZoneName: 'short',
        }) + ' / ' +
        date.toLocaleTimeString('en-US', {
          timeZone: 'America/Chicago',
          hour: '2-digit', minute: '2-digit',
          timeZoneName: 'short',
        }) + ' / ' +
        date.toLocaleTimeString('en-US', {
          timeZone: 'America/Los_Angeles',
          hour: '2-digit', minute: '2-digit',
          timeZoneName: 'short',
        }),
    })
    .setTimestamp(new Date())
    .setFooter('Quarantine Radio Announcement');
}