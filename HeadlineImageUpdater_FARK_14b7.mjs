import { sanitizeHeadline } from './sanitize.js';
import { generateImageFiles } from "./dist/index.js";
import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
// Read the Headline from index2.html to create Bing prompt 
async function fetchFarkHeadline() {
    try {
        const content = fs.readFileSync('./index2.html', 'utf-8');
        const $ = cheerio.load(content);
        const headline = $('h2:contains("Fark")').next().find('li a').eq(13).text().trim();
        if (headline) {
            return headline;
        } else {
            console.error("Failed to extract the Fark 14 headline using cheerio.");
            return null;
        }
    } catch (error) {
        console.error("Error reading the content from index2.html:", error);
        return null;
    }
}
// Use the sanitized Headline to create folder and prompt
async function generateImagesFromHeadline() {
    const headline = await fetchFarkHeadline();
    if (headline) {
      try {
        const sanitizedHeadline = sanitizeHeadline(headline); // Sanitize headline
        const imagePath = `./tmp/${sanitizedHeadline}/0.jpeg`; // Use path for images
        console.log(`Fark 14 Headline: ${sanitizedHeadline}\n`);
        const directory = path.join(sanitizedHeadline); // Create the directory path
        const imageFiles = await generateImageFiles(directory); // Pass directory to generateImageFiles
        const indexContent = fs.readFileSync('./index2.html', 'utf-8');
        const imgTag = `<center><img class="generated-image" src="${imagePath}" onerror="this.src='PARROT_UFO.jpg';" alt="Generated Image" width="100%"></center>`; // Added <br> here
        const $ = cheerio.load(indexContent);
        const FarkHeadlineElement = $('h2:contains("Fark")').next().find('li a').eq(13);
        FarkHeadlineElement.before(imgTag);
        fs.writeFileSync('./index2.html', $.html());
            console.log(`Updated Fark 14 images: ${directory}\n`);
        } catch (error) {
          console.error(`Error generating images: ${error}\n`);         
          // Handle the error by generating a new image with the given prompt after 5 seconds 
          setTimeout(async () => {
            try {
                const fallbackImageFiles = await generateImageFiles("Dirty Parrot wearing a fedora and dressed like a reporter with a notepad in mudrun");
                const fallbackImageData = fallbackImageFiles[0].data;
                let indexContent = fs.readFileSync('./index2.html', 'utf-8');
                const $ = cheerio.load(indexContent);
                const FarkHeadlineElement = $('h2:contains("Fark")').next().find('li a').eq(13);
                const imgTag = `<center><img src="data:image/jpeg;base64,${fallbackImageData}" onerror="this.src='PARROT_UFO.jpg';" alt="Fallback Image" width="98%"></center>`;
                FarkHeadlineElement.before(imgTag);
                fs.writeFileSync('./index2.html', $.html());
                console.log(`Uhh No! Banned words! Parrot Pete is on the Beat.\n`);
            } catch (fallbackError) {
                console.error(`Error generating fallback image: ${fallbackError}\n`);
            }
        }, 5000); // Delay 5 seconds before fallback
		}
    } else {
        console.log(`Failed to fetch the Fark 14 headline.\n`);
    }
}
generateImagesFromHeadline();





