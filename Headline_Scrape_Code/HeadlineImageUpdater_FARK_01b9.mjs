import { generateImageFiles } from "./dist/index.js";
import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import { sanitizeHeadline } from "./sanitize.mjs";

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
        console.log(`Fark 1 Headline: ${sanitizedHeadline}\n`);
        const directory = path.join(sanitizedHeadline); // Create the directory path
        const imageFiles = await generateImageFiles(directory); // Pass directory to generateImageFiles
        const indexContent = fs.readFileSync('./index2.html', 'utf-8');
    	const imgTag = `<div style="text-align: center;"><img class="generated-image" src="${imagePath}" onerror="this.src='./tmp/${sanitizedHeadline}/0.jpeg';" alt="Generated Image" width="100%"></div>`; // Create Image Tag for HTML
    	const $ = cheerio.load(indexContent);
        const FarkHeadlineElement = $('h2:contains("Fark")').next().find('li a').first();
        FarkHeadlineElement.before(imgTag);
        fs.writeFileSync('./index2.html', $.html());
          console.log(`Updated Fark 1 images: ${directory}\n`);
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
 	       const FarkHeadlineElement = $('h2:contains("Fark")').next().find('li a').first();
 	       const imgTag = `<div style="text-align: center;"><img src="${randomImagePath}" onerror="this.src='PARROT_UFO.jpg';" alt="Fallback Image" width="100%"></div>`;
 	       FarkHeadlineElement.before(imgTag);
 	       fs.writeFileSync('./index2.html', $.html());
 	       console.log(`Uhh No! Banned words! Parrot Pete is on the Beat.\n`);
 	 } catch (fallbackError) {
               console.error(`Error generating fallback image: ${fallbackError}\n`);
            }
        }
    } else {
        console.log(`Failed to fetch the Fark 1 headline.\n`);
    }
}

generateImagesFromHeadline();

