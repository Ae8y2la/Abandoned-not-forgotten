/**
 * THE UNFINISHED MISSION — Primary NASA References and Image Provenance Registry
 * All URLs and citations verified against primary NASA / JPL / LROC archives.
 */

export const references = {
  disclaimer: {
    text: "This is an independent educational project created for the NASA Space Apps Challenge 2026. NASA names, insignia, and imagery are used for educational and informational purposes with appropriate attribution where required. This project does not imply NASA endorsement.",
    aiDisclosure: "Parts of this project were built with AI assistance (Claude, Antigravity). All images are NASA imagery with credits. All factual content was checked against NASA sources by the team."
  },
  
  apollo15: {
    sources: [
      {
        id: "nssdc-1971-063c",
        title: "Apollo 15 Lunar Module /ALSEP (Master Catalog: 1971-063C)",
        organization: "NASA National Space Science Data Center (NSSDCA)",
        year: "1971",
        url: "https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C",
        verifiedNote: "Primary record for Mare Imbrium landing, 3 EVAs (18h 35m total), 27.9 km covered, 77.31 kg sample mass, 66h 55m surface stay, and ALSEP shutdown on 30 Sept 1977."
      },
      {
        id: "nssdc-lrv",
        title: "The Apollo Lunar Roving Vehicle",
        organization: "NASA Goddard Space Flight Center / NSSDCA",
        year: "1971",
        url: "https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html",
        verifiedNote: "Primary documentation for LRV 210 kg dry mass, four 0.25 hp series-wound DC hub motors, two 36V silver-zinc batteries (121 Ah each), 81.8 cm wire-mesh tires, and folded stowage."
      },
      {
        id: "msc-05161",
        title: "Apollo 15 Mission Report (NASA MSC-05161)",
        organization: "NASA Manned Spacecraft Center, Houston, TX",
        year: "1971",
        url: "https://ntrs.nasa.gov/citations/19720008453",
        verifiedNote: "Records official surface stay duration of 66 hours 54 minutes 53.9 seconds, EVA 1 (10.3 km), EVA 2 (12.5 km), and EVA 3 (5.1 km) traverses."
      },
      {
        id: "lroc-featured-site-4",
        title: "LROC Featured Site: Apollo 15 Landing Site (Station 9A)",
        organization: "NASA / GSFC / Arizona State University (LROC)",
        year: "2010",
        url: "https://www.lroc.asu.edu/featured_sites/view_site/4",
        verifiedNote: "Orbital verification showing LRV parked at 26.13174°N, 3.63803°E with tracks intact."
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
  },

  opportunity: {
    sources: [
      {
        id: "nasa-science-mer",
        title: "Mars Exploration Rovers: Spirit and Opportunity",
        organization: "NASA Science Mission Directorate",
        year: "2024",
        url: "https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/",
        verifiedNote: "Official mission overview: landed 24 Jan 2004 PST, operated for more than 14 years, drove 28.06 miles (45.16 km), end date 13 Feb 2019."
      },
      {
        id: "jpl-release-2019-008",
        title: "NASA's Record-Setting Opportunity Rover Mission on Mars Comes to End",
        organization: "NASA / Jet Propulsion Laboratory (News Release 2019-008)",
        year: "2019",
        url: "https://www.jpl.nasa.gov/news/nasas-record-setting-opportunity-rover-mission-on-mars-comes-to-end",
        verifiedNote: "Confirms over 835 recovery commands sent in active recovery window (>1,000 commands total), final sol 5111, last contact 10 June 2018 in Perseverance Valley."
      },
      {
        id: "mer-science-results",
        title: "Science Results: Evidence of Past Water on Mars",
        organization: "NASA Science / Mars Exploration",
        year: "2023",
        url: "https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/science/",
        verifiedNote: "Confirms hematite blueberries, jarosite acidic epoch, Homestake calcium sulfate vein, and smectite clay minerals as evidence of neutral water."
      }
    ]
  },

  voyager1: {
    sources: [
      {
        id: "nasa-jpl-voyager",
        title: "Voyager Mission Overview & Interstellar Extended Mission",
        organization: "NASA / Jet Propulsion Laboratory",
        year: "2024",
        url: "https://science.nasa.gov/mission/voyager/",
        verifiedNote: "Launch 5 Sept 1977, Jupiter 1979, Saturn 1980, interstellar boundary crossing 25 August 2012, 1-light-day milestone on 18 Nov 2026."
      },
      {
        id: "voyager-status",
        title: "Voyager Mission Status & Telecommunications",
        organization: "NASA Jet Propulsion Laboratory / Deep Space Network",
        year: "2026",
        url: "https://voyager.jpl.nasa.gov/mission/status/",
        verifiedNote: "Real-time distance (~173 AU / 25.9B km), 3.7 m high-gain dish, 2 active science instruments (MAG, PWS), 8 powered down."
      }
    ]
  }
};
