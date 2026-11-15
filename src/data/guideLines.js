/**
 * Child-friendly guide narration lines (Ages 8-14)
 * Spoken by EVA-01 (Orbital Watcher companion) when visiting each celestial destination.
 * Exactly 2 clear, inspiring sentences per destination for students and kids.
 */

export const guideLines = {
  'apollo-15-lrv': {
    title: 'The Moon · Hadley Rille',
    destination: 'The Moon',
    sentences: [
      'This is the Moon’s Hadley Rille, an airless, cratered world where towering mountains shadow ancient lava valleys.',
      'Our electric Moon buggy carried Apollo astronauts over 17 miles to collect ancient rocks, and it still rests quietly in the lunar dust today!'
    ],
    text: 'This is the Moon’s Hadley Rille, an airless, cratered world where towering mountains shadow ancient lava valleys. Our electric Moon buggy carried Apollo astronauts over 17 miles to collect ancient rocks, and it still rests quietly in the lunar dust today!'
  },

  'opportunity-rover': {
    title: 'Mars · Meridiani Planum',
    destination: 'Mars',
    sentences: [
      'This is Meridiani Planum on Mars, a freezing desert world swept by giant dust storms beneath salmon-colored skies.',
      'Our brave Opportunity rover explored across craters for nearly 15 years, uncovering strong evidence of ancient liquid water on the Red Planet!'
    ],
    text: 'This is Meridiani Planum on Mars, a freezing desert world swept by giant dust storms beneath salmon-colored skies. Our brave Opportunity rover explored across craters for nearly 15 years, uncovering strong evidence of ancient liquid water on the Red Planet!'
  },

  'voyager-1': {
    title: 'Interstellar Space · The Frontier',
    destination: 'Interstellar Space',
    sentences: [
      'This is the pitch-black ocean of interstellar space, far beyond all the planets and the warm solar wind of our Sun.',
      'The Voyager 1 probe launched in 1977 and is still flying outward toward the stars, carrying Earth’s Golden Record over 25.9 billion kilometers (~173 AU) from home!'
    ],
    text: 'This is the pitch-black ocean of interstellar space, far beyond all the planets and the warm solar wind of our Sun. The Voyager 1 probe launched in 1977 and is still flying outward toward the stars, carrying Earth’s Golden Record over 25.9 billion kilometers (~173 AU) from home!'
  },

  'home': {
    title: 'Mission Control · Deep Space Archives',
    destination: 'Mission Control',
    sentences: [
      'Welcome to mission control, space explorer! Here we remember the brave robotic explorers left across our solar system.',
      'Choose a world above or below to journey across the cosmos and uncover the secrets these machines left behind.'
    ],
    text: 'Welcome to mission control, space explorer! Here we remember the brave robotic explorers left across our solar system. Choose a world above or below to journey across the cosmos and uncover the secrets these machines left behind.'
  }
};

/**
 * Look up guide narrative for a given mission id or destination keyword.
 */
export function getGuideLine(id) {
  if (!id) return guideLines['home'];
  if (guideLines[id]) return guideLines[id];

  const lower = String(id).toLowerCase();
  if (lower.includes('moon') || lower.includes('apollo') || lower.includes('lrv')) {
    return guideLines['apollo-15-lrv'];
  }
  if (lower.includes('mars') || lower.includes('opportunity')) {
    return guideLines['opportunity-rover'];
  }
  if (lower.includes('voyager') || lower.includes('interstellar') || lower.includes('deep')) {
    return guideLines['voyager-1'];
  }
  return guideLines['home'];
}
