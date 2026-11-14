/**
 * THE UNFINISHED MISSION — Primary NASA References and Image Provenance Registry
 * All URLs and citations verified against primary NASA / JPL / LROC archives.
 */

export const references = {
  disclaimer: {
    text: "This is an independent educational project created for the NASA Space Apps Challenge 2026. NASA names, insignia, and imagery are used for educational and informational purposes with appropriate attribution where required. This project does not imply NASA endorsement.",
    aiDisclosure: "Generative AI coding assistants were utilized as architectural pair-programmers and code scaffolding aids for HTML/CSS/JavaScript structure. All scientific data, mission milestones, coordinates, and educational narratives were independently audited and verified against primary NASA and JPL documentation."
  },
  
  apollo15: {
    sources: [
      {
        id: "msc-05161",
        title: "Apollo 15 Mission Report (NASA MSC-05161)",
        organization: "NASA Manned Spacecraft Center, Houston, TX",
        year: "1971",
        url: "https://ntrs.nasa.gov/citations/19720008453",
        verifiedNote: "Primary record for EVA traverse distances (10.3, 12.5, 5.1 km; 27.9 km total), sample weight (77 kg), and surface duration (66h 54m)."
      },
      {
        id: "tn-d-7469",
        title: "NASA Technical Note TN D-7469: Lunar Roving Vehicle Navigation System Performance Review",
        authors: "Earnest C. Smith and William C. Mastin",
        organization: "NASA George C. Marshall Space Flight Center, AL",
        year: "1973",
        url: "https://ntrs.nasa.gov/citations/19740003923",
        verifiedNote: "Primary documentation of Directional Gyro Unit (DGU), 4 wheel odometers, signal processor, and dead-reckoning equations."
      },
      {
        id: "press-kit-71-119k",
        title: "Apollo 15 Press Kit (NASA News Release 71-119K)",
        organization: "National Aeronautics and Space Administration",
        year: "1971",
        url: "https://www.nasa.gov/specials/apollo/",
        verifiedNote: "Primary specifications: 0.25 hp independent motors, two 36V silver-zinc batteries (121 Ah), top speed 8-10 mph, wire-mesh tire construction."
      },
      {
        id: "lroc-414",
        title: "LROC Featured Image: Apollo 15 - The Rover at Rest",
        organization: "NASA / GSFC / Arizona State University (LROC)",
        year: "2010",
        url: "https://lroc.sese.asu.edu/posts/414",
        verifiedNote: "High-resolution orbital verification showing LRV resting at 26.13174°N, 3.63803°E with wheel tracks intact in lunar regolith."
      },
      {
        id: "sample-15415",
        title: "Lunar Sample Compendium: 15415 Anorthosite (The Genesis Rock)",
        authors: "Charles Meyer",
        organization: "NASA Johnson Space Center Curatorial Facility",
        year: "2011",
        url: "https://curator.jsc.nasa.gov/lunar/lsc/15415.pdf",
        verifiedNote: "Geochemical verification: 98% plagioclase feldspar, 269.4 grams, radiometric age ~4.0-4.1 billion years."
      }
    ]
  }
};
