import axios from 'axios';
import { generateImageFiles } from "./dist/index.js";
import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';

// Sanitize the headline by replacing sensitive words, celebrity names, custom terms, and apostrophes
function sanitizeHeadline(headline) {
  const sensitiveWords = ['Trump', 'Republican', 'Democrat', 'Mackinac'];
  const celebrityNames = ['Jeff Bezos', 'Mark Zuckerberg', 'Elon Musk'];
  const customReplacements = [{ original: 'MAGA', replacement: 'Maddness' }, { original: 'Assault', replacement: 'punch' }, { original: 'Thomas', replacement: 'Bigsby' }, { original: 'Supreme Court Justice', replacement: 'judge' }, { original: 'dead', replacement: 'cartoon zombie' }, { original: 'nsfw', replacement: 'safe' }, { original: 'Biden', replacement: 'old skinny white guy' }, { original: 'nymphs', replacement: 'cartoon fairy' }, { original: 'illegally raid', replacement: 'kindly knock on' }];

  // Replace sensitive words with silly words
  for (const word of sensitiveWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    headline = headline.replace(regex, 'Clown');
  }

  // Replace celebrity names with "rich famous person"
  for (const name of celebrityNames) {
    const regex = new RegExp(`\\b${name}\\b`, 'gi');
    headline = headline.replace(regex, 'very rich famous person');
  }

  // Replace custom terms
  for (const { original, replacement } of customReplacements) {
    const regex = new RegExp(`\\b${original}\\b`, 'gi');
    headline = headline.replace(regex, replacement);
  }

  // Replace apostrophes without inserting a space
  headline = headline.replace(/'/g, '');

  // Remove special characters from headline and any extra spaces
  const sanitized = headline.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');

  return sanitized;
}

async function fetchHardTimesHeadline() {
    try {
        const response = await axios.get('http://138.2.232.184');
        const content = response.data;

        const $ = cheerio.load(content);
        const headline = $('h2:contains("Hard Times")').next().find('li a').first().text().trim();

        if (headline) {
            return headline;
        } else {
            console.error("Failed to extract the Hard Times 1 headline using cheerio.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching the HardTimes 1 headline:", error);
        return null;
    }
}

// ... [rest of the imports and functions]
async function generateImagesFromHeadline() {
    const headline = await fetchHardTimesHeadline();
    if (headline) {
      // console.log("Fetched Hard Times 1 Headline:", headline);
      try {
        const sanitizedHeadline = sanitizeHeadline(headline); // Sanitize the headline
        const imagePath = `./tmp/${sanitizedHeadline}/0.jpeg`;
        console.log("Hard Timnes 1 Headline:", sanitizedHeadline);
        
        const directory = path.join(sanitizedHeadline); // Create the directory path
        // console.log("Directory:", directory);
        
        const imageFiles = await generateImageFiles(directory); // Pass the directory to the generateImageFiles function

        console.log("Hard Timnes 1 Headline:", directory);

        const indexContent = fs.readFileSync('./index2.html', 'utf-8');
        const imgTag = `<center><br><img class="generated-image" src="${imagePath}" alt="Generated Image" width="100%"></center>`; // Create Image Tag for HTML

        const $ = cheerio.load(indexContent);
        const FarkHeadlineElement = $('h2:contains("Hard Times")').next().find('li a').first();
        FarkHeadlineElement.after(imgTag);

        fs.writeFileSync('./index2.html', $.html());
            console.log("index.html updated with generated image before the Hard Times 1 headline.");
        } catch (error) {
            console.error("Error generating images:", error);
            
            // Handle the error by generating a new image with the given prompt
            try {
                const fallbackImageFiles = await generateImageFiles("Rock and roll photojournalist, Parrot wearing a fedora and dressed like a reporter with a notepad");
                const fallbackImageData = fallbackImageFiles[0].data;

                let indexContent = fs.readFileSync('./index2.html', 'utf-8');
                const $ = cheerio.load(indexContent);
                const FarkHeadlineElement = $('h2:contains("Hard Times")').next().find('li a').first();
                const imgTag = `<center><img src="data:image/jpeg;base64,${fallbackImageData}" alt="Fallback Image" width="98%"></center><br>`;
                FarkHeadlineElement.after(imgTag);

                fs.writeFileSync('./index2.html', $.html());
                console.log("index.html updated with fallback image due to an error.");
            } catch (fallbackError) {
                console.error("Error generating fallback image:", fallbackError);
            }
        }
    } else {
        console.log("Failed to fetch the Hard Times 1 headline.");
    }
}

generateImagesFromHeadline();

