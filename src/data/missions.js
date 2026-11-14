/**
 * THE UNFINISHED MISSION — Mission Dossier Registry
 * Strictly verified data separating content from components.
 * Voyager 1 is an active interstellar explorer and must NEVER be called abandoned or dead.
 */

// Helper to determine if date is on or after 18 Nov 2026 light-day milestone
export const isPostLightDay = () => new Date() >= new Date('2026-11-18T10:16:07Z');

export const missions = [
  {
    id: "apollo-15-lrv",
    destination: "THE MOON",
    destinationSector: "Sector 01 · 384,400 KM",
    machineName: "Apollo 15 Lunar Roving Vehicle",
    designation: "LRV-001 / Boeing & Delco Electronics",
    lightTime: "1.3 light-seconds",
    landingDate: "30 July 1971",
    departureDate: "2 August 1971",
    surfaceDuration: "Nearly 67 hours (66h 54m 54s MSC-05161 / 66h 55m NSSDCA)",
    sampleMass: "77.31 kg of lunar samples returned",
    statusBadge: "Parked on Lunar Surface",
    statusType: "PARKED",
    coordinates: "26.13174°N, 3.63803°E",
    locationName: "Station 9A · Hadley Rille, Mare Imbrium",
    thematicSnippet: "The First Wheels on Another World",
    accentColor: "var(--color-lunar-amber)",

    // Beat 1: Mystery (40-70 words)
    mystery: {
      headline: "The Horizon Constraint",
      narrative: "On Apollo 11, 12, and 14, astronauts were restricted to how far they could safely walk on foot. Towering lunar peaks and deep volcanic canyons remained frustratingly out of reach on the horizon. To uncover the Moon's primordial history, NASA had to invent a machine that could carry humans across an airless, cratered wilderness without getting lost or breaking down."
    },

    // Beat 2: Machine (Engineering Breakdown - Explain HOW it worked)
    machine: {
      headline: "How It Worked: Engineering for a Lunar Vacuum",
      subheadline: "Every automotive convention had to be reinvented for the Moon's extreme temperature swings (-150°C to +120°C) and total vacuum.",
      specs: [
        {
          label: "Wire-Mesh Resilient Wheels",
          detail: "Rubber tires would rupture in a vacuum. Instead, General Motors wove 800 strands of zinc-coated steel piano wire with riveted titanium chevrons covering 50% of the surface for traction in powder.",
          metric: "81 cm diameter"
        },
        {
          label: "Independent Hub Motors",
          detail: "Four 1/4-horsepower DC series-wound electric motors were mounted directly inside each wheel hub with 80:1 harmonic drive reduction—eliminating heavy transmissions and drive shafts.",
          metric: "4 × 0.25 hp (190 W)"
        },
        {
          label: "Silver-Zinc Power Storage",
          detail: "Two non-rechargeable 36-volt silver-zinc batteries encased in magnesium cases with potassium hydroxide electrolyte, wired so either battery could carry the full load alone.",
          metric: "2 × 121 Ampere-hours"
        },
        {
          label: "Gyroscopic Dead-Reckoning Nav",
          detail: "Without GPS or a magnetic field, a Directional Gyro Unit tracked heading, while magnetic odometers on all 4 wheels counted pulses. A hybrid processor computed bearing and range to Falcon.",
          metric: "±100 m accuracy"
        },
        {
          label: "Folded Stowage System",
          detail: "The 3.1-meter-long chassis folded into a 1.5-meter triangle to fit inside the Lunar Module's quadrant 1 bay, deploying via astronauts pulling lanyards and reel cables.",
          metric: "210 kg dry mass"
        }
      ]
    },

    // Beat 3: Mission (The Traverse - 100-150 words)
    missionStory: {
      headline: "Traversing Hadley Delta and the Great Rille",
      narrative: "On 31 July 1971, Commander Dave Scott and James Irwin unfolded the rover on the plain of Hadley. Over three lunar surface excursions totaling 27.9 kilometers, they drove up the 18-degree slopes of Mons Hadley Delta and peered into the 300-meter abyss of Hadley Rille. At Spur Crater, Scott spotted a gleaming white specimen: the 'Genesis Rock,' a 4-billion-year-old fragment of primordial lunar crust. When their front steering temporarily malfunctioned, the rover's independent rear steering kept them on course. Navigating solely by gyroscopic dead-reckoning, they always preserved enough life-support margins to walk back if the vehicle stalled. Before launching home, they parked the rover 550 meters east so its color camera could broadcast their liftoff to millions on Earth."
    },

    // Beat 4: Interactive Teaching Model Meta
    interaction: {
      type: "LUNAR_ROVER_SIM",
      title: "Explore the Lunar Terrain",
      conceptTaught: "Dead-Reckoning Navigation & The Walk-Back Safety Margin",
      modelLabel: "SIMPLIFIED TEACHING MODEL: DEAD-RECKONING & TRAVERSE CONSTRAINT",
      benchmarks: [
        { name: "EVA 1 Traverse", distanceKm: 10.3, duration: "6 h 33 min", target: "Stannum & Elbow Crater" },
        { name: "EVA 2 Traverse", distanceKm: 12.5, duration: "7 h 12 min", target: "Mons Hadley Delta & Spur Crater" },
        { name: "EVA 3 Traverse", distanceKm: 5.1, duration: "4 h 50 min", target: "Hadley Rille Scarp" },
        { name: "Total Rover Distance", distanceKm: 27.9, duration: "3 EVAs", target: "Apollo 15 Record" }
      ]
    },

    // Beat 5: Discover the Science
    science: {
      headline: "What the Machine Revealed",
      takeaway: "Engineering changes what scientists can explore.",
      discoveries: [
        {
          title: "The Genesis Rock (Sample 15415)",
          description: "Anorthosite mineral formed ~4.0 to 4.1 billion years ago, proving the early Moon was enveloped by a global magma ocean where lighter feldspar floated upward to form the primordial crust.",
          significance: "Confirmed the Lunar Magma Ocean Hypothesis."
        },
        {
          title: "Hadley Rille Volcanic Architecture",
          description: "Observations along the rille's 300-meter chasm revealed distinct layered basalt rock outcroppings, demonstrating that lunar mare basins were filled by successive waves of low-viscosity lava.",
          significance: "Established ancient episodic lunar volcanism."
        },
        {
          title: "Subsurface Regolith Heat Flow",
          description: "Thermal drill probes driven into the regolith proved that lunar dust is an extraordinary thermal insulator, protecting the Moon's interior from the vacuum of space.",
          significance: "First in-situ measurement of lunar thermal conductivity."
        }
      ]
    },

    // Beat 6: The Legacy & Verified Provenance
    legacy: {
      headline: "Still on the Moon: Station 9A",
      statusStatement: "The Apollo 15 LRV remains where Dave Scott parked it on 2 August 1971: 165 meters east of the Lunar Module descent stage at 26.13174°N, 3.63803°E. Its color TV camera recorded the historic liftoff of Falcon, and in 2010, NASA's Lunar Reconnaissance Orbiter photographed the rover and its dual wheel tracks still clearly etched into the vacuum of Hadley.",
      alsoLeftBehind: "Falcon Lunar Module descent stage and the Apollo Lunar Surface Experiments Package (ALSEP) station, which operated until NASA commanded shutdown on 30 September 1977.",
      sampleYield: "77.31 kg (170.4 lb) of verified lunar specimens returned to Earth (NSSDCA 1971-063C).",
      verifiedCoordinates: "26.13174° N, 3.63803° E (Elevation -1,928 m)",
      lrocReference: "NASA / GSFC / Arizona State University LROC NAC Frame M175252641L",
      primarySourceCount: 5
    }
  },

  {
    id: "opportunity-mer",
    destination: "MARS",
    destinationSector: "Sector 02 · ~225,000,000 KM",
    machineName: "Opportunity Mars Exploration Rover",
    designation: "MER-B / NASA Jet Propulsion Laboratory",
    lightTime: "~12.5 light-minutes",
    landingDate: "24 January 2004 PST (25 Jan UTC)",
    departureDate: "10 June 2018 (Final transmission)",
    surfaceDuration: "More than 14 years (5,111 Sols)",
    statusBadge: "Resting in Perseverance Valley",
    statusType: "RESTING",
    coordinates: "1.9483°S, 354.4742°E",
    locationName: "Perseverance Valley · Endeavour Crater Rim",
    thematicSnippet: "14+ Years of Following the Water",
    accentColor: "var(--color-mars-rust)",

    // Beat 1: Mystery (40-70 words)
    mystery: {
      headline: "The Water Riddle of the Red Planet",
      narrative: "Telescopes and orbiters had photographed vast, dried canyons and hematite minerals across Mars, but whether liquid water had ever pooled on its surface remained deeply debated. To prove whether Mars was once hospitable, NASA needed a robotic geologist that could travel across Martian plains and read the chemical fingerprint of ancient rocks."
    },

    // Beat 2: Machine (Engineering Breakdown)
    machine: {
      headline: "How It Worked: A Mobile Field Geologist",
      subheadline: "Built with solar panels and a robotic instrument deployment arm to examine Martian mineralogy down to the sub-millimeter scale.",
      specs: [
        {
          label: "Pancam & Mini-TES Remote Sensing",
          detail: "Mounted atop a 1.5-meter mast, the stereo Panoramic Camera and Miniature Thermal Emission Spectrometer identified promising mineral outcroppings from dozens of meters away.",
          metric: "High-resolution 3D multispectral"
        },
        {
          label: "Rock Abrasion Tool (RAT)",
          detail: "A diamond-tipped cutting head spun at 3,000 RPM to grind away dusty exterior weathering, exposing fresh, uncorrupted rock matrix for direct geochemical interrogation.",
          metric: "Grinds 5 cm diameter × 5 mm depth"
        },
        {
          label: "Alpha Particle X-Ray & Mössbauer",
          detail: "The APXS bombarded rock targets with curium-244 to measure elemental composition, while the Mössbauer spectrometer measured iron-bearing minerals and oxidation states.",
          metric: "Definitive iron mineral identification"
        },
        {
          label: "Microscopic Imager (MI)",
          detail: "A high-magnification camera mounted on the robotic arm that resolved microscopic grain shapes, sedimentary layering, and crystalline mineral structures.",
          metric: "30 microns per pixel"
        },
        {
          label: "Rocker-Bogie Mobility System",
          detail: "Six independently driven aluminum wheels connected by a differential rocker-bogie suspension allowed Opportunity to climb over obstacles larger than its 26-cm wheels without tipping.",
          metric: "45.16 km total odometer"
        }
      ]
    },

    // Beat 3: Mission (Traverse Story - 100-150 words)
    missionStory: {
      headline: "From Eagle Crater to Perseverance Valley",
      narrative: "Targeted to survive just 90 Martian sols and travel 1,000 meters, Opportunity touched down inside Eagle Crater in January 2004. It immediately hit the geological jackpot: bedrock filled with millimeter-sized hematite 'blueberries' and jarosite formed in ancient acidic water. Over the next decade and a half, the rover journeyed across 28.06 miles (45.16 kilometers)—surpassing the off-world driving record—climbing into Victoria Crater and reaching the ancient 22-kilometer rim of Endeavour Crater. There it discovered gypsum veins and smectite clay minerals formed in neutral-pH, fresh water. In June 2018, a catastrophic planet-encircling dust storm blotted out the Sun, starving the rover's solar arrays. After more than 1,000 recovery commands radiated by engineers, NASA declared its mission complete on 13 February 2019."
    },

    // Beat 4: Interactive Teaching Model Meta
    interaction: {
      type: "MARS_EVIDENCE_LAB",
      title: "Investigate the Martian Evidence",
      conceptTaught: "Paleo-Hydrological Mineral Fingerprinting",
      modelLabel: "SIMPLIFIED TEACHING MODEL: PALEO-HYDROLOGICAL MINERAL ANALYSIS",
      clues: [
        { id: "blueberries", mineral: "Hematite Spherules ('Blueberries')", condition: "Standing liquid water / wet sediment", verdict: "Proof of long-standing liquid groundwater in Meridiani." },
        { id: "jarosite", mineral: "Jarosite (Hydrated Iron Sulfate)", condition: "Highly acidic water environment", verdict: "Indicates harsh, highly acidic water during the Martian past." },
        { id: "gypsum", mineral: "Homestake Gypsum Vein", condition: "Neutral water flowing in bedrock fractures", verdict: "Pure calcium sulfate precipitated from circulating warm fractures." },
        { id: "clay", mineral: "Smectite Clay Minerals (Phyllosilicates)", condition: "Neutral-pH, benign water chemistry", verdict: "CRITICAL: Proves neutral water conditions, NOT proof of life!" }
      ]
    },

    // Beat 5: Discover the Science
    science: {
      headline: "What the Machine Revealed",
      takeaway: "A robotic explorer can help scientists reconstruct the history of another world.",
      discoveries: [
        {
          title: "Groundwater Sediments & 'Blueberries'",
          description: "Gray hematite spherules formed inside wet sedimentary rock, proving that liquid water was once persistent and active across Meridiani Planum.",
          significance: "First definitive ground confirmation of Martian liquid water."
        },
        {
          title: "Acidic vs. Neutral Hydrological Epochs",
          description: "Jarosite found at Eagle Crater proved an acidic ancient era, while gypsum and clays at Endeavour Crater proved a much earlier epoch of neutral-pH water.",
          significance: "Demonstrated Mars underwent dramatic global climate evolution."
        },
        {
          title: "Ancient Neutral Smectite Clays",
          description: "Iron/magnesium clays formed under mild, non-acidic conditions favorable for organic chemistry. (NOTE: Proves water environment, not biological life).",
          significance: "Identified Mars' most habitable ancient environment."
        }
      ]
    },

    // Beat 6: The Legacy & Verified Provenance
    legacy: {
      headline: "Resting in Perseverance Valley",
      statusStatement: "Opportunity rests quietly in Perseverance Valley on the western rim of Endeavour Crater at 1.9483°S, 354.4742°E. Operating for more than 14 years—over 55 times its planned 90-sol design lifespan—it drove 28.06 miles (45.16 km), completing the first off-world marathon. (NASA's Perseverance rover surpassed this driving record on 11 October 2026 at 28.10 miles / 45.22 km). Over 835 recovery commands were radiated during the active listening window before final decommissioning on 13 February 2019.",
      verifiedCoordinates: "1.9483° S, 354.4742° E (Endeavour Rim)",
      lrocReference: "Photographed from Mars orbit by NASA Mars Reconnaissance Orbiter (HiRISE ESP_056955_1775).",
      primarySourceCount: 6
    }
  },

  {
    id: "voyager-1",
    destination: "DEEP SPACE",
    destinationSector: "Sector 03 · 25.9 BILLION KM (1 LIGHT-DAY)",
    machineName: "Voyager 1 Interstellar Spacecraft",
    designation: "Voyager 1 / NASA Jet Propulsion Laboratory",
    lightTime: "24.0 light-hours (one-way)",
    landingDate: "5 September 1977 (Launch)",
    departureDate: "Active Interstellar Extended Mission (VIM)",
    surfaceDuration: "49+ Years in Deep Space Flight",
    statusBadge: "Active Interstellar Explorer (2 Instruments Online)",
    statusType: "ACTIVE",
    coordinates: "~173.1 AU / RA 17h 15m, Dec +12° 02'",
    locationName: "Interstellar Space · Beyond the Heliopause",
    thematicSnippet: "The First Messenger to the Stars",
    accentColor: "var(--color-deep-gold)",

    // Beat 1: Mystery (40-70 words)
    mystery: {
      headline: "The Edge of the Sun's Realm",
      narrative: "For human history, astronomers wondered where our solar system truly ends and the vast interstellar ocean begins. What lies beyond the shield of the solar wind? Launched in 1977 to explore Jupiter and Saturn, Voyager 1 was tasked with flying farther than any human creation—carrying our voice past the edge of the Sun's realm."
    },

    // Beat 2: Machine (Engineering Breakdown)
    machine: {
      headline: "How It Works: Surviving the Interstellar Void",
      subheadline: "Operating on the radioactive decay of plutonium-238, communicating across 25.9 billion kilometers with just two remaining active science instruments.",
      specs: [
        {
          label: "3.7-Meter High-Gain Dish Antenna",
          detail: "A parabolic reflector dish focuses its 20-watt radio beam precisely back toward Earth, communicating via S-band uplink and X-band downlink with the Deep Space Network.",
          metric: "3.7 m (12 ft) diameter"
        },
        {
          label: "Radioisotope Thermoelectric Generators (RTGs)",
          detail: "Three RTGs convert heat from the radioactive decay of plutonium-238 into electricity. Power decreases by ~4 watts annually, prompting engineers to shut off non-essential systems.",
          metric: "Decays ~4 W / year"
        },
        {
          label: "Active Science: Magnetometer (MAG)",
          detail: "Mounted on a 13-meter boom to isolate it from spacecraft currents, MAG directly measures the interstellar magnetic field shaped by surrounding stars.",
          metric: "One of 2 active instruments"
        },
        {
          label: "Active Science: Plasma Wave Subsystem (PWS)",
          detail: "Measures electron density oscillations in interstellar ionized gas. Revealed a 40x density jump when Voyager crossed into pristine interstellar space.",
          metric: "One of 2 active instruments"
        },
        {
          label: "Power Management & Safe State",
          detail: "Eight instruments (including cameras, IR/UV spectrometers, and cosmic ray sensors) have been powered down to preserve power for telemetry and attitude thrusters.",
          metric: "8 of 10 instruments powered down"
        }
      ]
    },

    // Beat 3: Mission (Traverse Story - 100-150 words)
    missionStory: {
      headline: "Into the Interstellar Medium",
      narrative: "Launched from Cape Canaveral on 5 September 1977, Voyager 1 flew past Jupiter in March 1979 and Saturn in November 1980. Propelled upward by Saturn's gravity assist, it climbed above the plane of the planets at 38,000 miles per hour (17 km/s). On 25 August 2012, Voyager 1 officially crossed the heliopause—the magnetic boundary where the solar wind gives way to the interstellar wind—becoming the first human-made object to enter interstellar space. Today it continues its journey under the Voyager Interstellar Mission. On 18 November 2026, it is due to reach a distance of one light-day (25.902 billion kilometers / 16.094 billion miles) from Earth, where a radio command takes a full 24 hours to arrive and 48 hours for a reply."
    },

    // Beat 4: Interactive Teaching Model Meta
    interaction: {
      type: "INTERSTELLAR_PING",
      title: "Follow the Signal",
      conceptTaught: "Speed-of-Light Telemetry Latency & Inverse-Square Signal Falloff",
      modelLabel: "SIMPLIFIED TEACHING MODEL: SPEED-OF-LIGHT TELEMETRY LATENCY",
      oneWayDelayHours: 24.0,
      roundTripHours: 48.0,
      distanceKm: "25.902 Billion km (1 Light-Day)"
    },

    // Beat 5: Discover the Science
    science: {
      headline: "What the Machine Revealed",
      takeaway: "A spacecraft can continue its scientific journey far beyond its original planetary mission.",
      discoveries: [
        {
          title: "The Heliopause Boundary",
          description: "Crossed on 25 August 2012, marked by a 40-fold surge in electron plasma density from 0.002 to 0.08 per cubic centimeter.",
          significance: "First in-situ measurement of pristine interstellar matter."
        },
        {
          title: "Interstellar Magnetic Alignment",
          description: "Discovered that the interstellar magnetic field aligns unexpectedly with the Sun's heliospheric field rather than being wildly turbulent.",
          significance: "Reshaped astrophysics models of galactic magnetic interaction."
        },
        {
          title: "Active Cosmic Radiation Shield",
          description: "Proved that the Sun's heliosphere deflects more than 75% of galactic cosmic rays from penetrating our inner solar system.",
          significance: "Revealed how our Sun protects life on Earth."
        }
      ]
    },

    // Beat 6: The Legacy & Verified Provenance
    legacy: {
      headline: "Active Interstellar Explorer: Never Abandoned",
      statusStatement: "Voyager 1 is not dead and has never been abandoned. It remains an active interplanetary spacecraft communicating daily with NASA's Deep Space Network stations in Madrid, Goldstone, and Canberra. Operating in interstellar space over 25.9 billion kilometers away, it carries the Golden Record—a message from humanity to any civilization that might one day discover it.",
      verifiedCoordinates: "173.1 AU / RA 17h 15m, Dec +12° 02' (Ophiuchus)",
      lrocReference: "Tracked live via NASA Deep Space Network Telecommunications and NASA Eyes on the Solar System.",
      primarySourceCount: 6
    }
  }
];

export const getMissionById = (id) => missions.find((m) => m.id === id);
