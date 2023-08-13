import requests
from bs4 import BeautifulSoup
import subprocess
import time

def scrape_headlines(url, tag, class_name=None, is_onion=False):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find the headline tags. This depends on the structure of your webpage.
    headline_tags = soup.find_all(tag, class_=class_name)

    headlines = []
    for tag in headline_tags:
        if is_onion:
            # For The Onion, the 'a' tag is a parent of the 'h2' tag
            a_tag = tag.find_parent('a')
            if a_tag:
                # Extract the link from the 'a' tag
                link = a_tag.get('href')
                # Extract the text from the 'h2' tag
                text = tag.text
                headline = {'text': text, 'link': link}
                headlines.append(headline)
        else:
            a_tag = tag.find('a')  # Find the 'a' tag within the headline tag
            if a_tag and a_tag.text:  # Ensure the 'a' tag has text (i.e., it's a headline, not an ad or something else)
                # Extract the text and link from the 'a' tag
                headline = {'text': a_tag.text, 'link': a_tag.get('href')}
                headlines.append(headline)

    # Limit the number of headlines to 8
    return headlines[:8]

# Example usage:
fark_headlines = scrape_headlines('https://www.fark.com', 'span', 'headline')
onion_headlines = scrape_headlines('https://www.theonion.com', 'h4', 'sc-1qoge05-0', is_onion=True)
hardtimes_headlines = scrape_headlines('https://thehardtimes.net', 'h2', 'post-title')

# print('Fark Headlines:', fark_headlines)
# print('The Hard Times Headlines:', hardtimes_headlines)
# print('The Onion Headlines:', onion_headlines)
print('YOUR NEWS IS SERVED')

# Load the HTML template
with open('C:/Users/WindowsX/Documents/Code/Bimg/template.html', 'r') as f:
    html = f.read()
soup = BeautifulSoup(html, 'html.parser')

# Generate the list items for the Fark headlines
for headline in fark_headlines:
    li = soup.new_tag('li')
    a = soup.new_tag('a', href=headline['link'])
    a.string = headline['text']
    li.append(a)
    soup.find(id='fark-headlines').append(li)

# Generate the list items for The Onion headlines
for headline in onion_headlines:
    li = soup.new_tag('li')
    a = soup.new_tag('a', href=headline['link'])
    a.string = headline['text']
    li.append(a)
    soup.find(id='onion-headlines').append(li)

# Generate the list items for The Hard Times headlines
for headline in hardtimes_headlines:
    li = soup.new_tag('li')
    a = soup.new_tag('a', href=headline['link'])
    a.string = headline['text']
    li.append(a)
    soup.find(id='hardtimes-headlines').append(li)

# Save the modified HTML
with open('C:/Users/WindowsX/Documents/Code/Bimg/index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))

# Run the FARK Node.js script
subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_FARK_01b4.mjs"])
time.sleep(5)
subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_FARK_02b4.mjs"])
time.sleep(5)
subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_FARK_03b4.mjs"])
time.sleep(5)
subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_FARK_04b4.mjs"])
time.sleep(5)
subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_FARK_05b4.mjs"])
time.sleep(5)
subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_FARK_06b4.mjs"])
time.sleep(5)
subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_FARK_07b4.mjs"])
time.sleep(5)
subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_FARK_08b4.mjs"])
time.sleep(5)

# Run the Onion Node.js script
# subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_onion_01.mjs"])
# time.sleep(5)
# subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_onion_02b4.mjs"])
# time.sleep(5)
# subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_onion_03.mjs"])
# time.sleep(5)
# subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_onion_04.mjs"])
# time.sleep(5)
# subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_onion_05.mjs"])
# time.sleep(5)
# subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_onion_06.mjs"])
# time.sleep(5)
# subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_onion_07.mjs"])
# time.sleep(5)
# subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_onion_08.mjs"])
# time.sleep(5)

# Run the Hard Times Node.js script
# subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_HT_01b4.mjs"])
# time.sleep(5)
# subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_HT_02.mjs"])
# time.sleep(5)
# subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_HT_03.mjs"])
# time.sleep(5)
# subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_HT_04.mjs"])
# time.sleep(5)
# subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_HT_05.mjs"])
# time.sleep(5)
# subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_HT_06.mjs"])
# time.sleep(5)
# subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_HT_07.mjs"])
# time.sleep(5)
# subprocess.run(["node", "C:/Users/WindowsX/Documents/Code/Bimg/headlineImageUpdater_HT_08.mjs"])
# time.sleep(5)