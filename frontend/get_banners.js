const https = require('https');

https.get('https://www.mygov.in/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const regex = /src="(https:\/\/[^"]+\.(jpg|png|jpeg))"/gi;
    let match;
    const urls = new Set();
    while ((match = regex.exec(data)) !== null) {
      if (match[1].includes('banner') || match[1].includes('slider') || match[1].includes('campaign')) {
        urls.add(match[1]);
      }
    }
    console.log([...urls].slice(0, 5));
  });
}).on('error', (e) => {
  console.error(e);
});
