import { sanitizeHeadline } from './sanitize.js';
import { generateImageFiles } from "./dist/index.js";
import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
// Read the Headline from index2.html to create Bing prompt 
async function fetchHardTimesHeadline() {
    try {
        const content = fs.readFileSync('./index2.html', 'utf-8');
        const $ = cheerio.load(content);
        const headline = $('h2:contains("Hard Times")').next().find('li a').eq(4).text().trim();
        if (headline) {
            return headline;
        } else {
            console.error("Failed to extract the Hard Times 5 headline using cheerio.");
            return null;
        }
    } catch (error) {
        console.error("Error reading the content from index2.html:", error);
        return null;
    }
}
// Use the sanitized Headline to create folder and prompt
async function generateImagesFromHeadline() {
    const headline = await fetchHardTimesHeadline();
    if (headline) {
      try {
        const sanitizedHeadline = sanitizeHeadline(headline); // Sanitize headline
        const imagePath = `./tmp/${sanitizedHeadline}/0.jpeg`; // Use path for images
        console.log(`Hard Times 5 Headline: ${sanitizedHeadline}\n`);
        const directory = path.join(sanitizedHeadline); // Create the directory path
        const imageFiles = await generateImageFiles(directory); // Pass directory to generateImageFiles
        const indexContent = fs.readFileSync('./index2.html', 'utf-8');
        const imgTag = `<center><img class="generated-image" src="${imagePath}" onerror="this.src='PARROT_UFO.jpg';" alt="Generated Image" width="100%"></center>`; // Create Image Tag for HTML
        const $ = cheerio.load(indexContent);
        const FarkHeadlineElement = $('h2:contains("Hard Times")').next().find('li a').eq(4);
        FarkHeadlineElement.before(imgTag);
        fs.writeFileSync('./index2.html', $.html());
            console.log(`Updated Hard Times 5 images: ${directory}\n`);
        } catch (error) {
          console.error(`Error generating images: ${error}\n`);
          // Handle the error by generating a new image with the given prompt
          setTimeout(async () => {
            try {
                const fallbackImageFiles = await generateImageFiles("Rock and roll photojournalist, Parrot wearing a fedora and dressed like a reporter with a notepad backstage at concert");
                const fallbackImageData = fallbackImageFiles[0].data;
                let indexContent = fs.readFileSync('./index2.html', 'utf-8');
                const $ = cheerio.load(indexContent);
                const FarkHeadlineElement = $('h2:contains("Hard Times")').next().find('li a').eq(4);
                const imgTag = `<center><img src="data:image/jpeg;base64,${fallbackImageData}" onerror="this.src='PARROT_UFO.jpg';" alt="Fallback Image" width="100%"></center><br>`;
                FarkHeadlineElement.before(imgTag);
                fs.writeFileSync('./index2.html', $.html());
                console.log(`Uhh No! Banned words! Parrot Pete is on the Beat.\n`);
            } catch (fallbackError) {
                console.error(`Error generating fallback image: ${fallbackError}\n`);
            }
        }, 5000); // Delay 5 seconds before fallback
		}
    } else {
        console.log(`Failed to fetch the Hard Times 5 headline.\n`);
    }
}
generateImagesFromHeadline();

