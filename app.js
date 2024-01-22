const fs = require('fs');
const dns = require('dns');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const targetFilePath = process.argv[2];

if (!targetFilePath) {
  const path = __filename.split('\\');
  console.log(`\n  [!] Usage: node ${path[path.length - 1]} <sites.txt>\n`);
  process.exit(1);
}

(async () => {
  console.log(`
                                Join Us: https://t.me/Securi3yTalent
                                       Author: @Securi3yTalent
`);

  try {
    const target = (await readFileAsync(targetFilePath, 'utf-8')).split('\n').map((line) => line.trim()).filter(Boolean);

    const domain = (site) => site.replace(/^https?:\/\/|www\.|\/.*$/g, '');

    const getIP = async (url) => {
      try {
        const dom = domain(url);
        try {
          const ip = await promisify(dns.resolve)(dom);
          console.log(` -| ${url} --> \x1b[32m[${ip.join(', ')}]\x1b[0m`);
          await writeFileAsync('ip.txt', ip.join('\n') + '\n', { flag: 'a' });
        } catch (error) {
          console.log(` -| ${url} --> \x1b[31m[DomainNotWork]\x1b[0m`);
        }
      } catch (error) {
        console.log(` -| ${url} --> \x1b[31m[DomainNotWork]\x1b[0m - ${error.message}`);
      }
    };

    const promises = target.map((url) => getIP(url));
    await Promise.all(promises);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
})();
