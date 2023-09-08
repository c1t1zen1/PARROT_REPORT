// sanitize keywords - masterlist
// V0.2.6 - August 28 2023
// Sanitize the headline by replacing sensitive words, celebrity names, custom terms, and apostrophes

export function sanitizeHeadline(headline) {
  const sensitiveWords = ['Trump', 'Republican', 'Democrat', 'Authorit', 'Conservative', 'Liberal', 'Rudy Giuliani', 'Bill Clinton', 'Epstein', 'Valdimir', 'Zelensky', 'Clinton', 'Roger Stone'];
  const celebrityMaleNames = ['Jeff Bezos', 'Mark Zuckerberg', 'Elon Musk', 'DeSantis', 'Jimmy Carter', 'Putin', 'Elon', 'Musk'];
  const celebrityFemaleNames = ['Oprah', 'Jennifer Lopez', 'Paltrow', 'Hilary', 'Hillary'];
  const customReplacements = [{ original: 'MAGA', replacement: 'Maddness' }, { original: 'Assault', replacement: 'punch' }, { original: 'Thomas', replacement: 'Bigsby' }, { original: 'Supreme Court Justice', replacement: 'judge' }, { original: 'dead', replacement: 'skeleton' }, { original: 'nsfw', replacement: 'safe' }, { original: 'Hunter Biden', replacement: 'middle aged scruffy skinny white guy' }, { original: 'Biden', replacement: 'really old tired skinny white guy' }, { original: 'nymphs', replacement: 'cartoon fairy' }, { original: 'illegally raid', replacement: 'kindly knock on' }, { original: 'repressive', replacement: 'overly friendly' }, { original: 'Barack Obama', replacement: 'tall skinny older black man' }, { original: 'Obama', replacement: 'old skinny graying hair black man in suit' }, { original: 'lazy', replacement: 'tired' }, { original: 'shrewd', replacement: 'patient' }, { original: 'brat', replacement: 'rich kid' }, { original: 'Epstein', replacement: 'tall skinny older man' }, { original: 'Holocaust', replacement: 'old timey war' }, { original: 'libel', replacement: 'words' }, { original: 'fake ID', replacement: 'bad card' }, { original: 'banned', replacement: 'kicked out' }, { original: 'Senator Feinstein', replacement: 'old italian lady' }, { original: 'Elvis Presley', replacement: 'Early Rock n Roll start' }, { original: 'Rebelling', replacement: 'acting out' }, { original: 'shoots', replacement: 'shouts' }, { original: 'sued', replacement: 'given papers' }, { original: 'EVERYBODY PANIC', replacement: 'keep calm' }, { original: 'deadly', replacement: 'big' }, { original: 'problem', replacement: 'issue' }, { original: 'mouth off', replacement: 'loud' }, { original: 'sucking', replacement: 'being boring' }, { original: 'steals', replacement: 'borrows' }, { original: 'breaks', replacement: 'opens' }, { original: 'sets fire', replacement: 'blowtorch' }, { original: 'Holiday Inn Express', replacement: 'cheap motel' }, { original: 'Shooting', replacement: 'responsible cat owner' }, { original: 'Abuse', replacement: 'care' }, { original: 'Homelessness', replacement: 'living in tents' }, { original: 'Criminalized', replacement: 'looked at by police' }, { original: 'guilty', replacement: 'looking odd' }, { original: 'stupid', replacement: 'silly' }, { original: 'bomb', replacement: 'Acme TNT' }, { original: 'bestiality', replacement: 'animals playing' }];
  const customReplacements2 = [{ original: 'Cock', replacement: 'Rooster' }, { original: 'boobies', replacement: 'melons' }, { original: 'poisoning', replacement: 'magic potion' }, { original: 'Plagiarism', replacement: 'Copying' }, { original: 'Hardcore', replacement: 'muscles' }, { original: 'Pubic', replacement: 'underwear' }, { original: 'revenge-porn', replacement: 'home video' }, { original: 'penis', replacement: 'foot' }, { original: 'rogue', replacement: 'on its own' }, { original: 'love life', replacement: 'dating scene' }, { original: 'Slave', replacement: 'human' }, { original: 'Hot Cousin', replacement: 'Blonde' }, { original: 'Hooligans', replacement: 'rough human' }, { original: 'Narcissist', replacement: 'Big Ego' }, { original: 'Crappy', replacement: 'not great' }, { original: 'Fuck', replacement: 'Hella' }, { original: 'Pope Francis', replacement: 'octagenarian with tall white religious hat' }, { original: 'Masturbating', replacement: 'hands together' }, { original: 'Orgy', replacement: 'humans wrestling' }, { original: 'wreck', replacement: 'distorted' }, { original: 'genocide', replacement: 'battle' }];

  // Replace political sensitive words with clown
  for (const word of sensitiveWords) {
    const regex = new RegExp(`\\b${word}\\w*\\b`, 'gi');
    headline = headline.replace(regex, 'Old white person');
  }

  // Replace celebrity male names with "very rich white man"
  for (const name of celebrityMaleNames) {
    const regex = new RegExp(`\\b${name}\\b`, 'gi');
    headline = headline.replace(regex, 'very rich white man');
  }
  
  // Replace celebrity women names with "very rich woman"
  for (const name of celebrityFemaleNames) {
    const regex = new RegExp(`\\b${name}\\b`, 'gi');
    headline = headline.replace(regex, 'very rich woman');
  }
  
  // Replace custom terms
  for (const { original, replacement } of customReplacements) {
    const regex = new RegExp(`\\b${original}\\b`, 'gi');
    headline = headline.replace(regex, replacement);
  }

  // Replace custom terms 2
   for (const { original, replacement } of customReplacements2) {
    const regex = new RegExp(`\\b${original}\\b`, 'gi');
    headline = headline.replace(regex, replacement);
  }

  // Replace apostrophes without inserting a space
  headline = headline.replace(/'/g, '');

  // Remove special characters from headline and any extra spaces
  const sanitized = headline.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');

  // Limit the sanitized headline to a specific length
  const maxLength = 255; // Max 255 characters
  let truncated = sanitized.slice(0, maxLength);

  // Trim any trailing spaces
  truncated = truncated.trim();

  return truncated;
}

