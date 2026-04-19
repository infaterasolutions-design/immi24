// Shared live news events data
export const LIVE_EVENTS = [
  {
    id: "digital-nomad-visa",
    title: "Global Mobility Shift: European Union Proposes Streamlined Digital Nomad Visa Framework",
    date: "Updated October 24, 2023 — 14:20 GMT",
    authors: [
      { name: "Elis Gjevori", image: "/images/u1.jpg" },
      { name: "Lorraine Mallinder", image: "/images/u2.jpg" }
    ],
    heroImage: "/images/1.jpg",
    imageCaption: "Photo: Getty Images / European Press Agency",
    headerContext: "The European Commission is moving aggressively forward with a new proposal that could fundamentally alter the landscape for remote workers globally.\n\nHistorically, digital nomads navigating Europe have been forced to contend with a complex and often contradictory patchwork of individual national requirements. Some countries demand exorbitant proof of income, while others strictly prohibit any remote work whatsoever under standard tourist visas. The proposed unified framework aims to dismantle these barriers, offering a streamlined 'EU Nomad Pass' that would essentially act as a golden ticket for highly skilled professionals.",
    updates: [
      {
        id: "dnv-1",
        time: "13m ago (20:21 GMT)",
        title: "Member states react to tax reciprocity clause",
        content: "Spain and Italy have expressed concerns regarding the tax implications for remote workers staying longer than 180 days. Negotiations are currently focusing on a 'Dual Residence Recognition' model.\n\nSeveral finance ministers argued that the current framework would disproportionately benefit northern states while draining tax revenues from southern tourist hubs.",
        isFirst: true,
        images: ["/images/2.jpg"],
      },
      {
        id: "dnv-2",
        time: "2h ago (18:10 GMT)",
        title: "Tech Hubs in Berlin and Lisbon support the move",
        content: "Major European technology associations have released a joint statement welcoming the streamlined digital nomad visa, citing a projected 15% boost in local innovation ecosystems.\n\nThe statement, signed by over 40 tech industry leaders, argues that removing bureaucratic barriers to cross-border remote work will accelerate the development of pan-European startup ecosystems.",
        images: ["/images/3.jpg"],
      },
      {
        id: "dnv-3",
        time: "3h ago (17:30 GMT)",
        title: "Initial debate scheduled for European Parliament",
        content: "The European Parliament has confirmed that the first reading of the proposed digital nomad visa framework will take place during next week's plenary session in Strasbourg.\n\nParliamentary committees on Employment and Civil Liberties have both signaled their intent to propose amendments. Key areas of contention include the minimum income threshold for eligibility, which some MEPs argue is set too high and would exclude freelancers and early-career professionals.",
      }
    ]
  },
  {
    id: "scotus-public-charge",
    title: "Supreme Court to hear challenge on expanded public charge rule",
    date: "Updated October 25, 2023 — 09:15 GMT",
    author: {
      name: "Sarah Jenkins",
      role: "Legal Analyst",
      image: "/images/u2.jpg"
    },
    heroImage: "/images/supreme_court.png",
    imageCaption: "Photo: AP / US Supreme Court",
    headerContext: "The United States Supreme Court has agreed to hear oral arguments in a landmark case challenging the expanded public charge rule that took effect earlier this year. The ruling could have far-reaching implications for millions of immigrants currently in the US who rely on public benefits programs.",
    updates: [
      {
        id: "sc-1",
        time: "Just now",
        title: "Oral arguments scheduled for next month",
        content: "The court has set the date for oral arguments. Both sides are preparing their briefs for what is expected to be a heavily contested hearing.",
        isFirst: true,
      },
      {
        id: "sc-2",
        time: "2h ago",
        title: "Advocacy groups file amicus briefs",
        content: "Over 50 immigration advocacy organizations have filed amicus briefs urging the court to strike down the expanded rule, citing its disproportionate impact on low-income families.",
      }
    ]
  },
  {
    id: "h1b-renewal-expedited",
    title: "USCIS announces expedited processing for H-1B renewals",
    date: "Updated October 24, 2023 — 10:00 GMT",
    author: {
      name: "Michael Chen",
      role: "Immigration Policy Reporter",
      image: "/images/u1.jpg"
    },
    heroImage: "/images/uscis_tech.png",
    imageCaption: "Photo: Reuters",
    headerContext: "The United States Citizenship and Immigration Services has announced a new expedited processing pathway for H-1B visa renewals, reducing wait times from an average of 8 months to just 45 days. The new streamlined process applies to workers who have maintained continuous employment with their sponsoring employer.",
    updates: [
      {
        id: "h1b-1",
        time: "10m ago",
        title: "Tech industry welcomes the change",
        content: "Major tech companies have praised the new USCIS policy, stating it will significantly reduce uncertainty for their international workforce.",
        isFirst: true,
      }
    ]
  },
  {
    id: "canada-stem-pathway",
    title: "Canada introduces new permanent residency pathway for STEM graduates",
    date: "Updated October 24, 2023 — 14:20 GMT",
    author: {
      name: "Julian Thorne",
      role: "Chief Policy Correspondent",
      image: "/images/u1.jpg"
    },
    heroImage: "/images/canada_stem.png",
    imageCaption: "Photo: Getty Images",
    headerContext: "Immigration, Refugees and Citizenship Canada (IRCC) has launched a dedicated immigration stream targeting international STEM graduates from Canadian universities. The new pathway offers permanent residence within 6 months of graduation for students who complete a master's or doctoral degree in science, technology, engineering, or mathematics.",
    updates: [
      {
        id: "can-1",
        time: "1h ago",
        title: "Targeting 10,000 skilled immigrants annually",
        content: "This initiative is expected to attract an additional 10,000 skilled immigrants annually, directly competing with the US Optional Practical Training (OPT) program for international student talent. Canadian universities have already reported a 30% increase in STEM program applications since the announcement.",
        isFirst: true,
      }
    ]
  }
];

// Helper to find a single event by ID
export function getLiveEventById(id) {
  return LIVE_EVENTS.find((e) => e.id === id);
}

// Temporary export of LIVE_UPDATES mapping to the first event's updates, 
// just in case we need to slowly phase it out so other components don't immediately crash
export const LIVE_UPDATES = LIVE_EVENTS[0].updates;
