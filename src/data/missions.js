/**
 * THE UNFINISHED MISSION — Mission Dossier Registry
 * Strictly verified data separating content from components.
 */

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
    surfaceDuration: "66 hours, 54 minutes",
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
      statusStatement: "The Apollo 15 LRV remains where Dave Scott parked it on 2 August 1971: exactly 550 meters east of the Lunar Module descent stage at 26.13174°N, 3.63803°E. Its color TV camera recorded the historic liftoff of Falcon, and in 2010, NASA's Lunar Reconnaissance Orbiter photographed the rover and its dual wheel tracks still clearly etched into the vacuum of Hadley.",
      verifiedCoordinates: "26.13174° N, 3.63803° E (Elevation -1,928 m)",
      lrocReference: "NASA / GSFC / Arizona State University LROC NAC Frame M175252641L",
      primarySourceCount: 5
    }
  }
];

// Helper to find mission by ID
export const getMissionById = (id) => missions.find((m) => m.id === id);
