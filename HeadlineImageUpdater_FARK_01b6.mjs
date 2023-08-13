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
        const headline = $('h2:contains("Fark")').next().find('li a').first().text().trim();
        if (headline) {
            return headline;
        } else {
            console.error("Failed to extract the Fark 1 headline using cheerio.");
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
        console.log("Fark 1 Headline:", sanitizedHeadline);
        const directory = path.join(sanitizedHeadline); // Create the directory path
        const imageFiles = await generateImageFiles(directory); // Pass directory to generateImageFiles
        const indexContent = fs.readFileSync('./index2.html', 'utf-8');
    	const imgTag = `<center><br><img class="generated-image" src="${imagePath}" alt="Generated Image" width="100%"></center>`;
    	const $ = cheerio.load(indexContent);
        const FarkHeadlineElement = $('h2:contains("Fark")').next().find('li a').first();
        FarkHeadlineElement.after(imgTag);
        fs.writeFileSync('./index2.html', $.html());
          console.log("Updated Fark 1 images:", directory);
        } catch (error) {
          console.error("Error generating images:", error);
          // Handle the error by generating a new image with Parrot Pete prompt
          setTimeout(async () => {
            try {
                const fallbackImageFiles = await generateImageFiles("Scared Parrot wearing a fedora and dressed like a reporter with a notepad in a dark alley");
                const fallbackImageData = fallbackImageFiles[0].data; // BASE64_IMAGE_DATA
                let indexContent = fs.readFileSync('./index2.html', 'utf-8');
                const $ = cheerio.load(indexContent);
                const FarkHeadlineElement = $('h2:contains("Fark")').next().find('li a').first();
                const imgTag = `<center><br><img src="data:image/jpeg;base64,${fallbackImageData}" alt="Fallback Image" width="98%"></center>`;
                FarkHeadlineElement.after(imgTag);
                fs.writeFileSync('./index2.html', $.html());
                console.log("Uhh No! banned words! Parrot Pete is on the case.");
            } catch (fallbackError) {
                console.error("Error generating fallback image:", fallbackError);
            }
        }, 5000); // Delay 5 seconds before fallback
		}
    } else {
        console.log("Failed to fetch the Fark 1 headline.");
    }
}

generateImagesFromHeadline();





