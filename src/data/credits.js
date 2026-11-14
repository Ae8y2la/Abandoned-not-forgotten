/**
 * THE UNFINISHED MISSION — Authentic NASA Imagery Credits & Provenance
 * All assets downloaded directly from images.nasa.gov archives.
 * Zero third-party, stock, or AI-generated visual media.
 */

export const imageCredits = [
  {
    key: "apollo15_rover_irwin",
    title: "Astronaut James Irwin with Lunar Roving Vehicle at Hadley-Apennine",
    nasaId: "as15-88-11866",
    mission: "Apollo 15",
    type: "photograph",
    sourceUrl: "https://images.nasa.gov/details-as15-88-11866",
    creditLine: "NASA / Apollo 15 Crew (Dave Scott & Jim Irwin)",
    usageNote: "Public Domain (NASA Lunar Surface Photography, 1 August 1971).",
    heroFile: "/assets/nasa/apollo15_rover_irwin_1920.webp",
    smallFile: "/assets/nasa/apollo15_rover_irwin_800.webp",
    altText: "Astronaut James Irwin salutes beside the U.S. flag and Lunar Roving Vehicle on the lunar surface, with Mons Hadley towering in the background."
  },
  {
    key: "apollo15_rover_work",
    title: "Astronaut Working at the Lunar Roving Vehicle during Apollo 15 EVA",
    nasaId: "as15-86-11603",
    mission: "Apollo 15",
    type: "photograph",
    sourceUrl: "https://images.nasa.gov/details-as15-86-11603",
    creditLine: "NASA / Apollo 15 Crew",
    usageNote: "Public Domain (NASA Lunar Surface Photography, 31 July 1971).",
    heroFile: "/assets/nasa/apollo15_rover_work_1920.webp",
    smallFile: "/assets/nasa/apollo15_rover_work_800.webp",
    altText: "Astronaut James Irwin works at the rear of the Lunar Roving Vehicle, showing the wire-mesh resilient tires and communications antenna."
  },
  {
    key: "opportunity_self_portrait",
    title: "Self-Portrait by Opportunity Mars Rover on Endeavour Crater Rim",
    nasaId: "PIA18079",
    mission: "Opportunity (MER-B)",
    type: "photograph",
    sourceUrl: "https://images.nasa.gov/details-PIA18079",
    creditLine: "NASA / JPL-Caltech / Cornell Univ. / Arizona State Univ.",
    usageNote: "Public Domain (NASA/JPL Mars Exploration Rover Pancam mosaic, March 2014).",
    heroFile: "/assets/nasa/opportunity_self_portrait_1920.webp",
    smallFile: "/assets/nasa/opportunity_self_portrait_800.webp",
    altText: "Self-portrait mosaic of the Opportunity Mars exploration rover showing its solar panels and camera mast on the rim of Endeavour Crater."
  },
  {
    key: "opportunity_blueberries",
    title: "Hematite Spherules ('Blueberries') in Martian Soil",
    nasaId: "PIA05273",
    mission: "Opportunity (MER-B)",
    type: "photograph",
    sourceUrl: "https://images.nasa.gov/details-PIA05273",
    creditLine: "NASA / JPL-Caltech / USGS",
    usageNote: "Public Domain (NASA/JPL Microscopic Imager frame at Eagle Crater, March 2004).",
    heroFile: "/assets/nasa/opportunity_blueberries_1920.webp",
    smallFile: "/assets/nasa/opportunity_blueberries_800.webp",
    altText: "Microscopic Imager close-up of spherical hematite concretions ('blueberries') formed in ancient water on the floor of Eagle Crater."
  },
  {
    key: "opportunity_perseverance_valley",
    title: "Opportunity's Tracks in Perseverance Valley",
    nasaId: "PIA23246",
    mission: "Opportunity (MER-B)",
    type: "photograph",
    sourceUrl: "https://images.nasa.gov/details-PIA23246",
    creditLine: "NASA / JPL-Caltech",
    usageNote: "Public Domain (NASA/JPL Navcam mosaic, 2018).",
    heroFile: "/assets/nasa/opportunity_perseverance_valley_1920.webp",
    smallFile: "/assets/nasa/opportunity_perseverance_valley_800.webp",
    altText: "Navcam mosaic showing the dual tracks left by Opportunity's six aluminum wheels entering Perseverance Valley."
  },
  {
    key: "voyager1_spacecraft",
    title: "Voyager 1 Entering Interstellar Space (Artist Concept)",
    nasaId: "PIA17049",
    mission: "Voyager 1",
    type: "illustration",
    sourceUrl: "https://images.nasa.gov/details-PIA17049",
    creditLine: "NASA / JPL-Caltech",
    usageNote: "Public Domain NASA Illustration (Spacecraft rendering outside the heliosphere).",
    heroFile: "/assets/nasa/voyager1_spacecraft_1920.webp",
    smallFile: "/assets/nasa/voyager1_spacecraft_800.webp",
    altText: "Artist concept illustration of NASA's Voyager 1 spacecraft with its 3.7-meter high-gain antenna, traversing the boundary of interstellar space."
  }
];

export const nasaDisclaimer = "Independent educational project created for the NASA Space Apps Challenge; NASA names and imagery are used for educational purposes with attribution; this does not imply NASA endorsement.";

// Helper to get image record by key
export const getImageCredit = (key) => imageCredits.find((c) => c.key === key);
