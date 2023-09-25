import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';

// Append the datestamp to the HTML content
const indexContent = fs.readFileSync('./index.html', 'utf-8');
const currentDate = new Date();
const datestamp = currentDate.toLocaleString();
const $ = cheerio.load(indexContent);

// Create a container div that spans the width of the page
const containerDiv = `
<div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <p style="text-align: center;">PARROT REPORT: ${datestamp} UTC</p>
    <p style="text-align: center;"><a href="https://c1t1zen.com/PR/archive.html" style="text-decoration: none; color: inherit;">Explore The Archives</a></p>
</div>
<br>
`;

// Append the container div to the body, which will place it just before the closing </body> tag
$('body').append(containerDiv);
fs.writeFileSync('./index.html', $.html());
