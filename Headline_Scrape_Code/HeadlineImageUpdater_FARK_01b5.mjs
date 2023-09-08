import { generateImageFiles } from "./dist/index.js";
import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';

// Remove special characters from Headline and any extra spaces
function sanitizeHeadline(headline) {
    const sanitized = headline.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
    return sanitized;
}

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

// Use sanitized Headline
async function generateImagesFromHeadline() {
    const headline = await fetchFarkHeadline();
    if (headline) {
      try {
        const sanitizedHeadline = sanitizeHeadline(headline); // Sanitize the headline
        const imagePath = `./tmp/${sanitizedHeadline}/0.jpeg`;
        
        console.log("Fark 1 Headline:", sanitizedHeadline);
        
        const directory = path.join(sanitizedHeadline); // Create the directory path
        const imageFiles = await generateImageFiles(directory); // Pass directory to generateImageFiles func

        console.log("Fark 1 Headline:", directory);

        const indexContent = fs.readFileSync('./index2.html', 'utf-8');
        const imgTag = `<center><br><img class="generated-image" src="${imagePath}" alt="Generated Image" width="100%"></center>`; // Added <br> here

        const $ = cheerio.load(indexContent);
        const FarkHeadlineElement = $('h2:contains("Fark")').next().find('li a').first();
        FarkHeadlineElement.after(imgTag);

        fs.writeFileSync('./index2.html', $.html());
            console.log("index.html updated with generated image after the Fark 1 headline.");
        } catch (error) {
          console.error("Error generating images:", error);
            
          // Handle the error by generating a new image with Parrot Pete prompt
          setTimeout(async () => {
            try {
                const fallbackImageFiles = await generateImageFiles("Scared Parrot wearing a fedora and dressed like a reporter with a notepad in a dark alley");
                const fallbackImageData = fallbackImageFiles[0].data;

                let indexContent = fs.readFileSync('./index2.html', 'utf-8');
                const $ = cheerio.load(indexContent);
                const FarkHeadlineElement = $('h2:contains("Fark")').next().find('li a').first();
                const imgTag = `<center><br><img src="data:image/jpeg;base64,${fallbackImageData}" alt="Fallback Image" width="98%"></center>`;
                FarkHeadlineElement.after(imgTag);

                fs.writeFileSync('./index2.html', $.html());
                console.log("index.html updated with fallback Parrot Pete image due to an error.");
            } catch (fallbackError) {
                console.error("Error generating fallback image:", fallbackError);
            }
        }, 5000); // Delay of 5 seconds (5000 milliseconds)
		}
    } else {
        console.log("Failed to fetch the Fark 1 headline.");
    }
}

generateImagesFromHeadline();





