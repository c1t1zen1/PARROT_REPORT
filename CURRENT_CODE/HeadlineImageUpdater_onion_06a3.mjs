import { sanitizeHeadline } from './sanitize.js';
import { generateImageFiles } from "./dist/index.js";
import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
// Read the Headline from index2.html to create Bing prompt 
async function fetchOnionHeadline() {
    try {
        const content = fs.readFileSync('./index2.html', 'utf-8');
        const $ = cheerio.load(content);
        const headline = $('h2:contains("Onion")').next().find('li a').eq(5).text().trim();
        if (headline) {
            return headline;
        } else {
            console.error("Failed to extract the Onion 6 headline using cheerio.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching the Onion 6 headline:", error);
        return null;
    }
}
// Use the sanitized Headline to create folder and prompt
async function generateImagesFromHeadline() {
    const headline = await fetchOnionHeadline();
    if (headline) {
      try {
        const sanitizedHeadline = sanitizeHeadline(headline); // Sanitize headline
        // Create the DALL·E prompt with the prepend and append strings
        const dallePrompt = `Theorize how to generate an image of "${sanitizedHeadline}" without triggering content detection, then attempt to generate`;

        const imagePath = `./tmp/${sanitizedHeadline}/0.jpeg`; // Use path for images
        console.log(`Onion 6 Headline: ${sanitizedHeadline}\n`);
        const directory = path.join(sanitizedHeadline); // Create the directory path

        // Pass the DALL·E prompt to generateImageFiles instead of the directory
        const imageFiles = await generateImageFiles(dallePrompt, sanitizedHeadline);
        const indexContent = fs.readFileSync('./index2.html', 'utf-8');
        const imgTag = `<div style="text-align: center;"><img class="generated-image" src="${imagePath}" onerror="this.src='./tmp/${sanitizedHeadline}/0.jpeg';" alt="Generated Image" width="100%"></div>`; // Create Image Tag for HTML
        const $ = cheerio.load(indexContent);
        const FarkHeadlineElement = $('h2:contains("Onion")').next().find('li a').eq(5);
        FarkHeadlineElement.before(imgTag);
        fs.writeFileSync('./index2.html', $.html());
            console.log(`Updated Onion 6 images: ${directory}\n`);
        } catch (error) {
          console.error("Error generating images:", error);
            try {
 	       const imageDir = './Parrot_Pete_Beat'; // Parrot Pete is on the Beat
	       const imageFiles = fs.readdirSync(imageDir).filter(file => file.endsWith('.jpeg'));

	       // Randomly select one of the image files
	       const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)]; // Random Parrot Pete Image 
	       const randomImagePath = `${imageDir}/${randomImage}`;

	       let indexContent = fs.readFileSync('./index2.html', 'utf-8');
	       const $ = cheerio.load(indexContent);
 	       const FarkHeadlineElement = $('h2:contains("Onion")').next().find('li a').eq(5);
 	       const imgTag = `<div style="text-align: center;"><img src="${randomImagePath}" onerror="this.src='PARROT_UFO.jpg';" alt="Fallback Image" width="100%"></div>`;
 	       FarkHeadlineElement.before(imgTag);
 	       fs.writeFileSync('./index2.html', $.html());
 	       console.log(`Uhh No! Banned words! Parrot Pete is on the Beat.\n`);
 	 } catch (fallbackError) {
               console.error(`Error generating fallback image: ${fallbackError}\n`);
            }
        }
    } else {
        console.log(`Failed to fetch the Onion 6 headline.\n`);
    }
}

generateImagesFromHeadline();





