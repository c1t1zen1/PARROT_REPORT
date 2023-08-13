
import { generateImageFiles } from "./dist/index.js";
import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';

function sanitizeHeadline(headline) {
    // Replace special characters with underscores
    const sanitized = headline.replace(/[^A-Za-z0-9_\-]/g, ' ').replace(/:/g, '');
    return sanitized;
}

// Read the Headline from index2.html to create Bing prompt 
async function fetchFarkHeadline() {
    try {
        const content = fs.readFileSync('./index2.html', 'utf-8');
        const $ = cheerio.load(content);
        const headline = $('h2:contains("Fark")').next().find('li a').eq(1).text().trim();

        if (headline) {
            return headline;
        } else {
            console.error("Failed to extract the Fark 2 headline using cheerio.");
            return null;
        }
    } catch (error) {
        console.error("Error reading the content from index2.html:", error);
        return null;
    }
}

// ... [rest of the imports and functions]
async function generateImagesFromHeadline() {
    const headline = await fetchFarkHeadline();
    if (headline) {
      // console.log("Fetched Fark 2 Headline:", headline);
      try {
        const sanitizedHeadline = sanitizeHeadline(headline); // Sanitize the headline
        const imagePath = `./tmp/${sanitizedHeadline}/0.jpeg`;
        console.log("Fark 2 Headline:", sanitizedHeadline);
        
        const directory = path.join(sanitizedHeadline); // Create the directory path
        // console.log("Directory:", directory);

        const imageFiles = await generateImageFiles(directory); // Pass the directory to the generateImageFiles function

        console.log("Fark 2 Headline:", directory);

        const indexContent = fs.readFileSync('./index2.html', 'utf-8');
        const imgTag = `<center><br><img class="generated-image" src="${imagePath}" alt="Generated Image" width="100%"></center>`; // Added <br> here

        const $ = cheerio.load(indexContent);
        const FarkHeadlineElement = $('h2:contains("Fark")').next().find('li a').eq(1);
        FarkHeadlineElement.after(imgTag);

        fs.writeFileSync('./index2.html', $.html());
            console.log("index.html updated with generated image after the Fark 2 headline.");
        } catch (error) {
          console.error("Error generating images:", error);
            
          // Handle the error by generating a new image with the given prompt after 5 seconds 
          setTimeout(async () => {
            try {
                const fallbackImageFiles = await generateImageFiles("Amazed Parrot wearing a fedora and dressed like a reporter with a notepad in the big city");
                const fallbackImageData = fallbackImageFiles[0].data;

                let indexContent = fs.readFileSync('./index2.html', 'utf-8');
                const $ = cheerio.load(indexContent);
                const FarkHeadlineElement = $('h2:contains("Fark")').next().find('li a').eq(1);
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
        console.log("Failed to fetch the Fark 2 headline.");
    }
}

generateImagesFromHeadline();





