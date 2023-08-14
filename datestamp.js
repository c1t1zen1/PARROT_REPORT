import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';

// Append the datestamp to the HTML content
const indexContent = fs.readFileSync('./index2.html', 'utf-8');
const currentDate = new Date();
const datestamp = currentDate.toLocaleString();

const $ = cheerio.load(indexContent);
const lastDiv = $('div').last();
lastDiv.after(`\n<p style="text-align: center;">Parrot Pete reporting in at: ${datestamp} GMT</p>`);

fs.writeFileSync('./index2.html', $.html());
