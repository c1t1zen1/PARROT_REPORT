import axios from 'axios';
import { generateImageFiles } from "./dist/index.js";
import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';

function sanitizeHeadline(headline) {
    // Replace special characters with underscores
    const sanitized = headline.replace(/[^A-Za-z0-9_\-]/g, ' ').replace(/:/g, '');
    return sanitized;
}

async function fetchOnionHeadline() {
    try {
        const response = await axios.get('http://138.2.232.184');
        const content = response.data;

        const $ = cheerio.load(content);
        const headline = $('h2:contains("Onion")').next().find('li a').eq(6).text().trim();

        if (headline) {
            return headline;
        } else {
            console.error("Failed to extract the Onion 7 headline using cheerio.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching the Onion 7 headline:", error);
        return null;
    }
}

// ... [rest of the imports and functions]
async function generateImagesFromHeadline() {
    const headline = await fetchOnionHeadline();
    if (headline) {
      // console.log("Fetched Onion 7 Headline:", headline);
      try {
        const sanitizedHeadline = sanitizeHeadline(headline); // Sanitize the headline
        const imagePath = `./tmp/${sanitizedHeadline}/0.jpeg`;
        console.log("Onion 7 Headline:", sanitizedHeadline);
        
        const directory = path.join(sanitizedHeadline); // Create the directory path
        // console.log("Directory:", directory);
        
        const imageFiles = await generateImageFiles(directory); // Pass the directory to the generateImageFiles function

        console.log("Onion 7 Headline:", directory);

        const indexContent = fs.readFileSync('./index.html', 'utf-8');
        const imgTag = `<center><img src="${imagePath}" alt="Generated Image" width="98%"></center><br>`; // Added <br> here

        const $ = cheerio.load(indexContent);
        const FarkHeadlineElement = $('h2:contains("Onion")').next().find('li a').eq(6);
        FarkHeadlineElement.after(imgTag);

        fs.writeFileSync('./index.html', $.html());
            console.log("index.html updated with generated image before the Onion 6 headline.");
        } catch (error) {
            console.error("Error generating images:", error);
            
            // Handle the error by generating a new image with the given prompt
            try {
                const fallbackImageFiles = await generateImageFiles("Polaroid Style, Crime scene investigation Parrot wearing a fedora and dressed like a reporter with a notepad");
                const fallbackImageData = fallbackImageFiles[0].data;

                let indexContent = fs.readFileSync('./index.html', 'utf-8');
                const $ = cheerio.load(indexContent);
                const FarkHeadlineElement = $('h2:contains("Onion")').next().find('li a').eq(6);
                const imgTag = `<center><img src="data:image/jpeg;base64,${fallbackImageData}" alt="Fallback Image" width="98%"></center><br>`;
                FarkHeadlineElement.after(imgTag);

                fs.writeFileSync('./index.html', $.html());
                console.log("index.html updated with fallback image due to an error.");
            } catch (fallbackError) {
                console.error("Error generating fallback image:", fallbackError);
            }
        }
    } else {
        console.log("Failed to fetch the Onion 7 headline.");
    }
}

generateImagesFromHeadline();





