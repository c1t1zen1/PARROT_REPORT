let words = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  loadJSON('word_data.json', (data) => {
    createWordObjects(data);
  });
}

function createWordObjects(data) {
  for (let word in data) {
    let count = data[word].count;
    let url = data[word].recentURL;
    let fontSize = map(count, 10, 100, 32, 220);
    let x = random(width);
    let y = random(height);
    let vx = random(-1, 1);
    let vy = random(-1, 1);
    words.push({ word, count, url, fontSize, x, y, vx, vy });
  }
}

function draw() {
  background(0, 0, 128, 255); // Dark purple background

  for (let i = 0; i < words.length; i++) {
    let wordA = words[i];
    textSize(wordA.fontSize);
    fill(random(253, 255), random(253, 255), random(253, 255));
    text(wordA.word, wordA.x, wordA.y);

    // Bounce off edges
    if (wordA.x <= 0 || wordA.x >= width) {
      wordA.vx = -wordA.vx;
    }
    if (wordA.y <= 0 || wordA.y >= height) {
      wordA.vy = -wordA.vy;
    }

    // Repulsion force
    for (let j = i + 1; j < words.length; j++) {
      let wordB = words[j];
      let dx = wordA.x - wordB.x;
      let dy = wordA.y - wordB.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = (wordA.fontSize + wordB.fontSize) / 2;

      if (distance < minDist) {
        let angle = atan2(dy, dx);
        let force = 0.01;
        let fx = force * cos(angle);
        let fy = force * sin(angle);

        wordA.vx += fx;
        wordA.vy += fy;
        wordB.vx -= fx;
        wordB.vy -= fy;
      }
    }

    // Update position
    wordA.x += wordA.vx;
    wordA.y += wordA.vy;
  }
}

function mousePressed() {
  for (let wordObj of words) {
    let wordWidth = textWidth(wordObj.word);
    let wordHeight = wordObj.fontSize;
    if (mouseX > wordObj.x && mouseX < wordObj.x + wordWidth &&
        mouseY > wordObj.y - wordHeight && mouseY < wordObj.y) {
      window.location.href = wordObj.url;
    }
  }
}
