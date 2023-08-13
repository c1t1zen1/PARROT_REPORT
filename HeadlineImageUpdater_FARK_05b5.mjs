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
    headline = headline.replace(regex, 'silly word');
  }

  // Replace celebrity names with "rich famous person"
  for (const name of celebrityNames) {
    const regex = new RegExp(`\\b${name}\\b`, 'gi');
    headline = headline.replace(regex, 'rich famous person');
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

// Read the Headline from index2.html to create Bing prompt 
async function fetchFarkHeadline() {
    try {
        const content = fs.readFileSync('./index2.html', 'utf-8');
        const $ = cheerio.load(content);
        const headline = $('h2:contains("Fark")').next().find('li a').eq(4).text().trim();

        if (headline) {
            return headline;
        } else {
            console.error("Failed to extract the Fark 5 headline using cheerio.");
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
      // console.log("Fetched Fark 5 Headline:", headline);
      try {
        const sanitizedHeadline = sanitizeHeadline(headline); // Sanitize the headline
        const imagePath = `./tmp/${sanitizedHeadline}/0.jpeg`;
        console.log("Fark 5 Headline:", sanitizedHeadline);
        
        const directory = path.join(sanitizedHeadline); // Create the directory path
        // console.log("Directory:", directory);

        const imageFiles = await generateImageFiles(directory); // Pass the directory to the generateImageFiles function

        console.log("Fark 5 Headline:", directory);

        const indexContent = fs.readFileSync('./index2.html', 'utf-8');
        const imgTag = `<center><br><img class="generated-image" src="${imagePath}" alt="Generated Image" width="100%"></center>`; // Added <br> here

        const $ = cheerio.load(indexContent);
        const FarkHeadlineElement = $('h2:contains("Fark")').next().find('li a').eq(4);
        FarkHeadlineElement.after(imgTag);

        fs.writeFileSync('./index2.html', $.html());
            console.log("index.html updated with generated image after the Fark 2 headline.");
        } catch (error) {
          console.error("Error generating images:", error);
            
          // Handle the error by generating a new image with the given prompt after 5 seconds 
          setTimeout(async () => {
            try {
                const fallbackImageFiles = await generateImageFiles("Investigative Parrot wearing a fedora and dressed like a reporter with a notepad in a small city");
                const fallbackImageData = fallbackImageFiles[0].data;

                let indexContent = fs.readFileSync('./index2.html', 'utf-8');
                const $ = cheerio.load(indexContent);
                const FarkHeadlineElement = $('h2:contains("Fark")').next().find('li a').eq(4);
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
        console.log("Failed to fetch the Fark 5 headline.");
    }
}

generateImagesFromHeadline();





