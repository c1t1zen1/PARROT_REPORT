import requests
from bs4 import BeautifulSoup
import json
from urllib.parse import urljoin, urlparse

# Dictionary to store word frequencies and most recent URLs
word_data = {}

# Set to store visited folder names
visited_folders = set()

# List of common stop words to ignore
common_words = [
    '/',
    'a', 'a:', 'about', 'above', 'after', 'again', 'against', 'ain', 'all', 'am', 'an', 'and', 'any', 'are', 'aren', "aren't", 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
    'can', 'couldn', "couldn't",
    'd', 'did', 'didn', "didn't", 'do', 'does', 'doesn', "doesn't", 'doing', 'don', "don't", 'down', 'during',
    'each',
    'fark', 'few', 'for', 'from', 'further',
    'had', 'hadn', "hadn't", 'hard', 'has', 'hasn', "hasn't", 'have', 'haven', "haven't", 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
    'i', 'if', 'in', 'into', 'is', 'isn', "isn't", 'it', "it's", 'its', 'itself',
    'just',
    'll',
    'm', 'ma', 'me', 'mightn', "mightn't", 'more', 'most', 'mustn', "mustn't", 'my', 'myself',
    'needn', "needn't", 'no', 'nor', 'not', 'now',
    'o', 'of', 'off', 'on', 'onion', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
    'q:',
    're',
    's', 'same', 'shan', "shan't", 'she', "she's", 'shoppes', 'should', "should've", 'shouldn', "shouldn't", 'so', 'some', 'such',
    't', 'than', 'that', "that'll", 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'times', 'to', 'too',
    'under', 'until', 'up',
    've', 'very',
    'was', 'wasn', "wasn't", 'we', 'were', 'weren', "weren't", 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'won', "won't", 'would', 'wouldn', "wouldn't",
    'y', 'you', "you'd", "you'll", "you're", "you've", 'your', 'yours', 'yourself', 'yourselves'
]

# List of URLs to ignore
ignore_urls = ['https://c1t1zen.com/PR/index.html', 'https://c1t1zen.com/PR/indexD.html', 'https://c1t1zen.com/PR/archiveD.html']

# Function to scrape a page
def scrape_page(url, depth=0):
    # Create an absolute URL
    absolute_url = urljoin('https://c1t1zen.com/PR/', url)
    
    # Check if the URL is in the ignore list
    if absolute_url in ignore_urls:
        return
    
    # Extract the last folder name from the URL
    last_folder = urlparse(absolute_url).path.strip('/').split('/')[-1]
    
    # Check if folder has already been visited
    if last_folder in visited_folders:
        return
    
    # Mark folder as visited
    visited_folders.add(last_folder)
    
    # Make a GET request to fetch the raw HTML content
    response = requests.get(absolute_url)
    
    # Specify the encoding to ensure proper text format
    response.encoding = 'utf-8'
    
    # Check for successful response
    if response.status_code != 200:
        return
    
    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Scrape headlines
    for headline in soup.find_all('a'):
        words = headline.text.split()
        for word in words:
            word = word.lower()
            
            # Ignore common words
            if word in common_words:
                continue
            
            # Initialize or update word data
            if word not in word_data:
                word_data[word] = {'count': 0, 'recentURL': ''}
                
            word_data[word]['count'] += 1
            
            # Update the most recent occurrence only if it's the first time
            if word_data[word]['count'] == 1:
                word_data[word]['recentURL'] = absolute_url
                
            # Print to console if word occurs more than 10 times
            if word_data[word]['count'] > 10:
                print(f"The word '{word}' has been found {word_data[word]['count']} times at {word_data[word]['recentURL']}.")
    
    # Scrape links if depth < 1
    if depth < 1:
        for link in soup.find_all('a'):
            scrape_page(link.get('href'), depth + 1)

# Start scraping from the archive page
scrape_page('archive.html')  # Note: Using a relative URL here

# Save word frequencies and most recent URLs as a JSON file
# Filter out words that occur more than 10 times
filtered_word_data = {k: v for k, v in word_data.items() if v['count'] > 10}

# Save the filtered data to a JSON file
with open('word_data.json', 'w', encoding='utf-8') as f:
    json.dump(filtered_word_data, f, ensure_ascii=False)
