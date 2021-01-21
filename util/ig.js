const axios = require('axios');

const headers = {
  'authority': 'www.instagram.com',
  'cache-control': 'max-age=0',
  'dnt': '1',
  'upgrade-insecure-requests': '1',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'sec-fetch-site': 'none',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-user': '?1',
  'sec-fetch-dest': 'document',
  'accept-language': 'en-US,en;q=0.9',
};

const json = '/?__a=1';

function getImage(message, link) {
  axios({
    url: link,
    headers: headers,
    referrerPolicy: 'strict-origin-when-cross-origin',
  }).then((response) => {
    const data = response.data;
    const imgs = data.graphql.shortcode_media.display_resources;
    const img = imgs[imgs.length - 1].src;
    // return img;
    return message.channel.send(img);
  });
}

function embedIG(message) {
  const link = message.content.trim().split(/ +/)[0];
  if (link.slice(0, 25) !== 'https://www.instagram.com') {
    // check if is an actual Instagram link
    throw new Error(link + 'is not an Instagram link');
  }
  if (link.slice(25, 28) === '/p/') {
    // check if it is a post
    const apilink = link.slice(0, 39) + json;
    getImage(message, apilink);
    // getImage(apilink).then((img) => { return message.channel.send(img); });
    // const img = getImage(apilink);
    // return message.channel.send(img);
  }
}

module.exports = {
  embedIG,
};