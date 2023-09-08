import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';

// Append the datestamp to the HTML content
const indexContent = fs.readFileSync('./indexD.html', 'utf-8');
const currentDate = new Date();
const datestamp = currentDate.toLocaleString();

const $ = cheerio.load(indexContent);

// Append the datestamp to the body, which will place it just before the closing </body> tag
$('body').append(`\n<p style="text-align: center;">PARROT REPORT: ${datestamp} UTC</p><p style="text-align: center;"><a href="https://c1t1zen.com/PR/archiveD.html" style="text-decoration: none; color: inherit;">Explore The Archives</a></p><br>`);



fs.writeFileSync('./indexD.html', $.html());
