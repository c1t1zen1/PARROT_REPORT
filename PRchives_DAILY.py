import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import os

base_url = "https://c1t1zen.com/PRchives/"
data = []

def process_date(date):
    url = f"{base_url}{date.strftime('%d_%m_%Y')}"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Locate the <ul id='fark-headlines'> section
    fark_headlines_section = soup.find('ul', id='fark-headlines')
    
    # If the section is found, navigate to the next headline and image after this section
    if fark_headlines_section:
        headline_element = fark_headlines_section.find_next('a')
        image_element = fark_headlines_section.find_next('img')
    else:
        print(f"Failed to locate the 'fark-headlines' section in {url}")
        return

    # Extract headline and image link
    if headline_element:
        headline = headline_element.text
    else:
        print(f"Failed to extract headline from {url}")
        return

    if image_element:
        image_link = base_url + date.strftime('%d_%m_%Y') + '/' + image_element['src']
    else:
        print(f"Failed to extract image from {url}")
        return
    
    data.append({
        'date': date.strftime('%d_%m_%Y'),
        'headline': headline,
        'link': url,
        'image': image_link
    })

def format_date(date_str):
    date_obj = datetime.strptime(date_str, '%d_%m_%Y')
    return date_obj.strftime('%B %d %Y')

# Start 30 days ago
current_date = datetime.now() - timedelta(days=29)

# Loop for the past 30 days in descending order
for _ in range(30):
    process_date(current_date)
    current_date += timedelta(days=1)

# Reverse the data list for descending dates
data.reverse()

def generate_html(data):
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>PRchives</title>
    <style>
        body {
            	font-family: Helvetica;   
                text-decoration: none;
                text-align: center;
                color: black;
                background-color:  white; 
            } 

        h1 {
            margin-top: 1px;
        }

        /* Styles for larger screens */
        .column {
            width: 33%;
            float: left;
        }

        /* Styles for smaller screens */
        @media (max-width: 600px) {
            .column {
                width: 100%;
                float: none;
            }
        }

        ul {
            list-style-type: none;
            padding-left: 10px;
            padding-right: 10px;
            text-align: left;
        }

        ul li {
            padding: 10px;
            font-size: 1.4rem;
            background-color: #f1f1f1;
            margin-bottom: 10px;
        }

        ul li a {
            text-decoration: none;
            color: inherit;
        }
        .container {
            max-width: 512px;
            margin: 0 auto; /* center the container */
            text-align: center; /* align text to the left inside the container */
        }
    </style>
    </head>
    <body>
    <a href="https://c1t1zen.com/PR/index.html">
        <img src="PARROT_NEWS.jpg" alt="Parrot Pete on the Beat" width="200" height="200">
    </a>
    <h1>
        <a href="https://c1t1zen.com/PR/index.html">
            <picture>
                <source media="(min-width: 480px)" srcset="PARROT_REPORT.jpg">
                <source media="(min-width: 1px)" srcset="PR_LOGO.jpg">
                <img src="PR_LOGO.jpg" alt="PARROT REPORT">
            </picture>
        </a>
    </h1>
    <div class="container">	
    """

    for entry in data:
        date = format_date(entry['date'])
        headline = entry['headline']
        link = entry['link']
        image = entry['image']

        html_content += f"<h1><a href='{link}' style='color: black; text-decoration: none;'>{date}</a></h1>"
        html_content += f"<a href='{link}'><img class='generated-image' src='{image}' onerror=\"this.src='{image}';\" alt='{headline}' style='max-width:100%; height:auto;'></a><br><br><br>"
        # html_content += f"<div style='max-width:512px; margin: 0 auto;'><h2><a href='{link}' style='color: black; text-decoration: none;'>{headline}</a></h2></div><br><br>"


    html_content += """
    <h1>
        <a href="https://c1t1zen.com/PR/index.html">
            <picture>
                <source media="(min-width: 480px)" srcset="PARROT_REPORT.jpg">
                <source media="(min-width: 1px)" srcset="PR_LOGO.jpg">
                <img src="PR_LOGO.jpg" alt="PARROT REPORT">
            </picture>
        </a>
    </h1>	
    <script>
	// Get the image container element
	const imageContainers = document.querySelectorAll('.generated-image');

	let currentIndex = 0;
	const totalImages = 4; // Total number of images

	/// Function to update the image
	function updateImage() {
	    // Loop through each image container
            imageContainers.forEach((imageContainer) => {
                // Get the current image source
                let imagePath = imageContainer.src;

                // Replace the last digit with the current index
                imagePath = imagePath.replace(/\d(?=\.jpeg$)/, currentIndex);

                // Update the image source
                imageContainer.src = imagePath;
            });

            // Increment the index
            currentIndex = (currentIndex + 1) % totalImages;
        }

	// Initial image update
	updateImage();

	// Schedule image updates every 4 seconds
	setInterval(updateImage, 4000);

    </script>
    </div>
    </body>
    </html>
    """

    with open('archive.html', 'w') as file:
        file.write(html_content)

# Call the function after collecting all data
generate_html(data)

