import fs from 'fs';
import cheerio from 'cheerio';

// Read the HTML content
const indexContent = fs.readFileSync('./index.html', 'utf-8');

const $ = cheerio.load(indexContent);

// Get the current date and format it
const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();

// Find the .nav-links div and append the formatted date
$('.nav-links').append(`	<span class="divider"><a href="https://c1t1zen.com/PR/about.html">ABOUT</a>|</span>
        <a href="https://c1t1zen.com/PR/archive.html">${formattedDate}</a><span class="divider">|</span>
        <a href="indexD.html">DARK MODE</a>
    </div>`);

// Write the modified HTML back to the file
fs.writeFileSync('./index.html', $.html());

