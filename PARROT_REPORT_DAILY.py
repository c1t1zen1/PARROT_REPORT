import requests
from bs4 import BeautifulSoup
import subprocess
import time
import os

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

    # Limit the number of headlines to 15
    return headlines[:15]

# Example usage:
fark_headlines = scrape_headlines('https://www.fark.com', 'span', 'headline')
onion_headlines = scrape_headlines('https://www.theonion.com', 'h4', 'sc-1qoge05-0', is_onion=True)
hardtimes_headlines = scrape_headlines('https://thehardtimes.net', 'h2', 'post-title')

# print('Fark Headlines:', fark_headlines)
# print('The Hard Times Headlines:', hardtimes_headlines)
# print('The Onion Headlines:', onion_headlines)
print('YOUR NEWS IS SERVED')

# Load the HTML template
with open('./template.html', 'r') as f:
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
with open('./index2.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))

# Run the FARK Headlines into Bing Image Creator
subprocess.run(["node", "./HeadlineImageUpdater_FARK_01a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_FARK_02a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_FARK_03a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_FARK_04a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_FARK_05a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_FARK_06a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_FARK_07a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_FARK_08a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_FARK_09a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_FARK_10a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_FARK_11a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_FARK_12a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_FARK_13a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_FARK_14a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_FARK_15a3.mjs"])
time.sleep(5)

# Run The Onion Headlines into Bing Image Creator
subprocess.run(["node", "./HeadlineImageUpdater_onion_01a3.mjs"])	
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_onion_02a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_onion_03a3.mjs"])	
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_onion_04a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_onion_05a3.mjs"])	
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_onion_06a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_onion_07a3.mjs"])	
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_onion_08a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_onion_09a3.mjs"])	
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_onion_10a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_onion_11a3.mjs"])	
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_onion_12a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_onion_13a3.mjs"])	
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_onion_14a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_onion_15a3.mjs"])	
time.sleep(5)

# Run The Hard Times into Bing Image Creator
subprocess.run(["node", "./HeadlineImageUpdater_HT_01a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_HT_02a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_HT_03a3.mjs"])	
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_HT_04a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_HT_05a3.mjs"])	
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_HT_06a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_HT_07a3.mjs"])	
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_HT_08a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_HT_09a3.mjs"])	
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_HT_10a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_HT_11a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_HT_12a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_HT_13a3.mjs"])	
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_HT_14a3.mjs"])
time.sleep(5)
subprocess.run(["node", "./HeadlineImageUpdater_HT_15a3.mjs"])	
time.sleep(5)

# make backup with current time 
now = int(time.time())
os.rename("./index.html", f"./index-{now}.html")

# Rename index2.html to index.html
os.rename("./index2.html", "./index.html")

