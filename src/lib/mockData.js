import { CATEGORIES } from "./categoryConfig";

// Reliable, local image URLs
const IMAGES = {
  immigration1: "/images/1.jpg",
  immigration2: "/images/2.jpg",
  immigration3: "/images/3.jpg",
  immigration4: "/images/4.jpg",
  immigration5: "/images/5.jpg",
  immigration6: "/images/1.jpg", // Reusing 1 for variety
  avatar1: "/images/u1.jpg",
  avatar2: "/images/u2.jpg",
};

export const mockArticles = [
  {
    id: "1",
    categorySlug: "visa-news",
    subCategorySlug: "h1b-visa",
    categoryLabel: "H1B Visa",
    readTime: "8 min read",
    title: "New H-1B Selection Process: What Employers and Applicants Need to Know for 2024",
    authorName: "Marcus Vance",
    authorRole: "Senior Immigration Analyst",
    date: "Oct 24, 2024",
    authorImage: IMAGES.avatar1,
    mainImage: IMAGES.immigration1,
    imageCaption: "Photography by USCIS Editorial Team.",
    paragraphs: [
      "The Department of Homeland Security has finalized a significant overhaul of the H-1B registration process, implementing changes aimed at increasing fairness and preventing fraud. The new rules, released officially this week, mark one of the most substantial shifts in the specialty occupation visa program in recent years.",
      "For years, the system was plagued by multiple registrations for the same individual, which artificially inflated the number of applications and severely disadvantaged genuine applicants. Under the new beneficiary-centric lottery system, each unique individual will only be entered into the selection process once, regardless of how many employers submit registrations on their behalf.",
      "This shift is expected to dramatically alter the landscape for the upcoming quota season. Employers must be prepared for a more unpredictable selection rate. While the absolute number of registrations is expected to drop, the true demand for highly skilled foreign labor remains at an all-time high."
    ],
    quote: '"The goal is simple: to ensure that the lottery is fair and transparent for all participants, eliminating the loopholes that allowed for systemic abuse."',
    subTitle: "Core Changes to the Registration System",
    subParagraphs: [
      "Under the new rules, the registration fee has also seen a significant increase. It will jump from $10 to $215 per registration. This fee hike is designed to cover the administrative costs of the more robust vetting process and deter frivolous or highly speculative applications.",
      "Furthermore, the USCIS has introduced stricter guidelines regarding the bona fide nature of job offers. Employers must now provide more comprehensive documentation demonstrating a legitimate need for the specialized skills of the foreign worker, and that the position genuinely qualifies as a specialty occupation.",
      "Legal experts advise companies to conduct thorough internal audits of their H-1B practices and to start the preparation process earlier than ever. With the enhanced scrutiny, any discrepancies in the initial registration could lead to immediate denials or prolonged Requests for Evidence (RFEs) during the petition stage."
    ],
    tags: ["H1BVISA"]
  },
  {
    id: "2",
    categorySlug: "visa-news",
    subCategorySlug: "f1-opt",
    categoryLabel: "F1 & OPT/CPT",
    readTime: "5 min read",
    title: "USCIS Expands Premium Processing to Additional Categories",
    authorName: "Sarah Jenkins",
    authorRole: "Policy Correspondent",
    date: "Nov 02, 2024",
    authorImage: IMAGES.avatar2,
    mainImage: IMAGES.immigration2,
    imageCaption: "Expansion aims to reduce backlogs.",
    paragraphs: [
      "In a major move to mitigate historic administrative backlogs, USCIS has officially expanded premium processing services to include additional categories of students and exchange visitors. This highly anticipated expansion is part of a broader strategy to modernize operations and reduce the unprecedented wait times that have plagued the agency since the pandemic.",
      "Previously, premium processing—which guarantees a decision within 15 to 30 or 45 calendar days, depending on the form—was largely restricted to specific employment-based petitions. The lack of an expedited option for international students seeking critical work authorization has often led to lost job opportunities and significant financial hardship.",
      "The new rules will allow certain F-1 students seeking Optional Practical Training (OPT) and science, technology, engineering, and mathematics (STEM) OPT extensions to request premium processing for their Form I-765, Application for Employment Authorization."
    ],
    quote: '"We remain committed to addressing delays and providing timely decisions to all applicants. This expansion is a crucial step in fulfilling our mandate to facilitate lawful immigration while maintaining national security."',
    subTitle: "Phase 3 Rollout Details",
    subParagraphs: [
      "The latest expansion targets specific Form I-765 categories. To ensure a smooth rollout, USCIS is implementing the expansion in phases. The first phase will apply exclusively to pending applications, allowing those who have been waiting the longest to immediately request the expedited service.",
      "The subsequent phase will open premium processing for newly filed applications. However, USCIS has explicitly stated that they will monitor the impact of this expansion on their overall processing times. The agency retains the right to suspend the service if it begins to detrimentally affect the processing of non-premium applications.",
      "It is absolutely critical for applicants to follow the precise dates and filing instructions outlined on the USCIS website. Filing a premium processing request prematurely will result in rejection of the request."
    ],
    tags: ["OPT", "F1VISA"]
  },
  {
    id: "3",
    categorySlug: "visa-news",
    subCategorySlug: "b1-b2",
    categoryLabel: "B1/B2 (Tourist & Business)",
    readTime: "12 min read",
    title: "European Union Proposes Streamlined Digital Nomad Visa Framework",
    authorName: "Julian Thorne",
    authorRole: "Chief Policy Correspondent",
    date: "Nov 15, 2024",
    authorImage: IMAGES.avatar1,
    mainImage: IMAGES.immigration3,
    imageCaption: "Photo: Getty Images",
    paragraphs: [
      "The European Commission has drafted a revolutionary unified framework designed to standardize the digital nomad visa across all member states. Currently, digital nomads navigating Europe face a patchwork of different national programs, each with its own income thresholds, tax implications, and residency requirements. The proposed 'EU Nomad Pass' aims to replace this fragmented system with a single, streamlined process.",
      "The initiative comes in response to the growing global competition for remote talent. As highly skilled workers increasingly detach themselves from traditional, location-bound employment, nations are aggressively tailoring their immigration policies to attract this lucrative demographic. The lack of a cohesive strategy has arguably placed the EU at a disadvantage compared to more agile countries.",
      "Under the draft proposal, remote workers who secure the EU Nomad Pass would be granted the right to reside and work remotely in any participating member state for up to two years, with the possibility of renewal. Crucially, the pass would facilitate greater mobility within the Schengen Area, allowing nomads to legally split their time between multiple European destinations."
    ],
    quote: '"This represents the most significant shift in European labor mobility since the establishment of the Schengen Area itself. We are adapting our legal infrastructure to the realities of the 21st-century workforce."',
    subTitle: "Tax Reciprocity",
    subParagraphs: [
      "Negotiations are currently focusing on a Dual Residence Recognition model to address the most significant hurdle: taxation. One of the primary deterrents for digital nomads is the risk of double taxation—being taxed by both their home country and their temporary country of residence.",
      "The framework proposes a default rule where the nomad is primarily taxed in the member state where they spend the majority of the fiscal year (typically more than 183 days). For those who divide their time more evenly, a complex apportionment formula based on physical presence is being debated.",
      "While the proposal has been met with enthusiasm by remote work advocates, implementing it requires unanimous agreement among all member states. Countries with already successful and highly competitive national digital nomad programs may resist adopting a unified standard that could dilute their unique appeal."
    ],
    tags: ["DIGITALNOMAD", "B1B2"]
  },
  {
    id: "4",
    categorySlug: "visa-guides",
    subCategorySlug: "application-steps",
    categoryLabel: "Application Steps",
    readTime: "6 min read",
    title: "10 Common Mistakes in Naturalization Applications That Lead to Rejection",
    authorName: "Marcus Vance",
    authorRole: "Senior Immigration Analyst",
    date: "Dec 05, 2024",
    authorImage: IMAGES.avatar1,
    mainImage: IMAGES.immigration4,
    imageCaption: "Gathering documents is the first step.",
    paragraphs: ["Applying for naturalization (Form N-400) is the pinnacle..."],
    quote: '"Precision in an N-400 application cannot be overstated..."',
    subTitle: "Criminal Records",
    subParagraphs: ["Good moral character is a non-negotiable prerequisite..."],
    tags: ["NATURALIZATION", "GUIDE"]
  },
  {
    id: "5",
    categorySlug: "visa-news",
    subCategorySlug: "h1b-visa",
    categoryLabel: "H1B Visa",
    readTime: "9 min read",
    title: "Tech Industry Pushes for Cap Exemption on AI Specialty Petitions",
    authorName: "Sarah Jenkins",
    authorRole: "Policy Correspondent",
    date: "Dec 12, 2024",
    authorImage: IMAGES.avatar2,
    mainImage: IMAGES.immigration5,
    imageCaption: "Industry leaders argue quotas stifle AI.",
    paragraphs: ["In an unprecedented lobbying effort, a coalition of major Silicon Valley tech companies..."],
    quote: '"We are in a global talent war..."',
    subTitle: "Proposed Waiver Alternatives",
    subParagraphs: ["If a legislative cap exemption fails..."],
    tags: ["AI", "H1B"]
  },
  {
    id: "6",
    categorySlug: "visa-news",
    subCategorySlug: "consulate-alerts",
    categoryLabel: "Consulate Alerts",
    readTime: "4 min read",
    title: "Supreme Court Hearing on Dreamers Act Set for June",
    authorName: "Julian Thorne",
    authorRole: "Chief Policy Correspondent",
    date: "Jan 10, 2025",
    authorImage: IMAGES.avatar1,
    mainImage: IMAGES.immigration6,
    imageCaption: "Lawmakers gather.",
    paragraphs: ["A crucial hearing regarding DACA protections has been officially calendared..."],
    quote: '"This is a defining moment for hundreds of thousands of youth."',
    subTitle: "What to Expect",
    subParagraphs: ["Protests and advocacy groups are preparing..."],
    tags: ["DACA", "COURT"]
  },
  {
    id: "7",
    categorySlug: "visa-news",
    subCategorySlug: "uscis-updates",
    categoryLabel: "USCIS Updates",
    readTime: "7 min read",
    title: "Labor Shortages Drive New L-1 Visa Expediting",
    authorName: "Sarah Jenkins",
    authorRole: "Policy Correspondent",
    date: "Feb 14, 2025",
    authorImage: IMAGES.avatar2,
    mainImage: IMAGES.immigration1,
    imageCaption: "Supply chains require intra-company transferees.",
    paragraphs: ["To combat internal transfer bottlenecks, L-1 guidelines are being temporarily relaxed..."],
    quote: '"Global corporations need agility."',
    subTitle: "Implementation",
    subParagraphs: ["The rule change takes effect next month..."],
    tags: ["L1", "EMPLOYMENT"]
  },
  {
    id: "8",
    categorySlug: "visa-guides",
    subCategorySlug: "how-to",
    categoryLabel: "How-To Articles",
    readTime: "15 min read",
    title: "10 Common Mistakes in Citizenship Applications",
    authorName: "Marcus Vance",
    authorRole: "Senior Immigration Analyst",
    date: "Mar 01, 2025",
    authorImage: IMAGES.avatar1,
    mainImage: IMAGES.immigration2,
    imageCaption: "Avoid these pitfalls.",
    paragraphs: ["Applying for citizenship is stressful..."],
    quote: '"Read twice, file once."',
    subTitle: "Checklist",
    subParagraphs: ["Ensure forms are updated to the latest edition..."],
    tags: ["CITIZENSHIP"]
  },
  {
    id: "9",
    categorySlug: "visa-news",
    subCategorySlug: "b1-b2",
    categoryLabel: "B1/B2 (Tourist)",
    readTime: "3 min read",
    title: "ESTA Updates: New Protocols for European Travelers",
    authorName: "Julian Thorne",
    authorRole: "Chief Policy Correspondent",
    date: "Mar 05, 2025",
    authorImage: IMAGES.avatar1,
    mainImage: IMAGES.immigration3,
    imageCaption: "Aviation updates.",
    paragraphs: ["Travel protocols are shifting..."],
    quote: '"Expect longer processing windows for VWP travelers."',
    subTitle: "App Update",
    subParagraphs: ["The new mobile app allows for instant upload..."],
    tags: ["ESTA", "TRAVEL"]
  },
  {
    id: "10",
    categorySlug: "processing-times",
    subCategorySlug: "uscis-timelines",
    categoryLabel: "USCIS Timelines",
    readTime: "5 min read",
    title: "Processing Times Reveal Historic Drops in Green Card Backlogs",
    authorName: "Sarah Jenkins",
    authorRole: "Policy Correspondent",
    date: "Mar 10, 2025",
    authorImage: IMAGES.avatar2,
    mainImage: IMAGES.immigration4,
    imageCaption: "USCIS Dashboard shows green.",
    paragraphs: ["Digitization efforts are paying off immensely..."],
    quote: '"We expect a 40% reduction in paper handling."',
    subTitle: "Digital Shift",
    subParagraphs: ["Service centers are being restructured to handle electronic filings exclusively."],
    tags: ["GREENCARD"]
  },
  {
    id: "11",
    categorySlug: "visa-news",
    subCategorySlug: "green-card",
    categoryLabel: "Green Card",
    readTime: "6 min read",
    title: "Diversity Visa Lottery Pre-Registration Opens",
    authorName: "Marcus Vance",
    authorRole: "Senior Immigration Analyst",
    date: "Mar 12, 2025",
    authorImage: IMAGES.avatar1,
    mainImage: IMAGES.immigration5,
    imageCaption: "Millions prepare.",
    paragraphs: ["The portal has opened earlier than scheduled..."],
    quote: '"Check requirements very carefully before applying."',
    subTitle: "Eligibility",
    subParagraphs: ["Certain countries have been reassigned due to high migration metrics."],
    tags: ["DIVERSITY"]
  },
  {
    id: "12",
    categorySlug: "about",
    subCategorySlug: "mission-statement",
    categoryLabel: "Mission Statement",
    readTime: "2 min read",
    title: "Our Commitment to Fair & Accurate Immigration Reporting",
    authorName: "Editorial Board",
    authorRole: "Staff",
    date: "Jan 01, 2025",
    authorImage: IMAGES.avatar1,
    mainImage: IMAGES.immigration6,
    imageCaption: "The Digital Diplomat HQ",
    paragraphs: ["We pledge to bring you the truth about policies as they break..."],
    quote: '"Knowledge is the foundation of a successful migration journey."',
    subTitle: "Integrity",
    subParagraphs: ["We verify against state department cables directly."],
    tags: ["ABOUT"]
  },
  {
    id: "13",
    categorySlug: "visa-news",
    subCategorySlug: "consulate-alerts",
    categoryLabel: "Consulate Alerts",
    readTime: "3 min read",
    title: "Consulate Appointment Wait Times Drop in Major Hubs",
    authorName: "Sarah Jenkins",
    authorRole: "Policy Correspondent",
    date: "Mar 15, 2025",
    authorImage: IMAGES.avatar2,
    mainImage: IMAGES.immigration1,
    imageCaption: "Visas processed rapidly.",
    paragraphs: ["New data shows a significant decrease in wait times for B1/B2 visa interviews..."],
    quote: '"Staffing surges are helping."',
    subTitle: "Stats",
    subParagraphs: ["Interviews are down from 400 days to 90 days in key hubs."],
    tags: ["CONSULATE"]
  },
  {
    id: "14",
    categorySlug: "visa-news",
    subCategorySlug: "uscis-updates",
    categoryLabel: "USCIS Updates",
    readTime: "7 min read",
    title: "House Committee Passes New Employment Verification Bill",
    authorName: "Julian Thorne",
    authorRole: "Chief Policy Correspondent",
    date: "Mar 16, 2025",
    authorImage: IMAGES.avatar1,
    mainImage: IMAGES.immigration2,
    imageCaption: "Capitol Hill action.",
    paragraphs: ["The legislation aims to mandate E-Verify for all agricultural employers by the end of the fiscal year."],
    quote: '"Compliance is the focus moving forward."',
    subTitle: "E-Verify Timeline",
    subParagraphs: ["Gradual rollout is expected for small businesses."],
    tags: ["EVERIFY"]
  },
  {
    id: "15",
    categorySlug: "visa-news",
    subCategorySlug: "green-card",
    categoryLabel: "Green Card",
    readTime: "5 min read",
    title: "Immigration Clinics Provide Free Legal Aid",
    authorName: "Marcus Vance",
    authorRole: "Senior Immigration Analyst",
    date: "Mar 17, 2025",
    authorImage: IMAGES.avatar1,
    mainImage: IMAGES.immigration3,
    imageCaption: "Assistance on the road.",
    paragraphs: ["Mobile legal units are assisting thousands with TPS renewals across the Midwest."],
    quote: '"Legal representation makes all the difference in an approval rate."',
    subTitle: "Community Action",
    subParagraphs: ["Clinics are operating 7 days a week."],
    tags: ["AID"]
  }
];

export function getArticleById(id) {
  return mockArticles.find((a) => a.id === id) || mockArticles[0];
}

export function getNextArticle(currentId) {
  const currentIndex = mockArticles.findIndex((a) => a.id === currentId);
  if (currentIndex === -1 || currentIndex === mockArticles.length - 1) {
    return null; 
  }
  return mockArticles[currentIndex + 1];
}

export function getArticlesByCategorySlug(categorySlug) {
  return mockArticles.filter((a) => a.categorySlug === categorySlug);
}

export function getArticlesBySubcategorySlug(categorySlug, subCategorySlug) {
  return mockArticles.filter((a) => a.categorySlug === categorySlug && a.subCategorySlug === subCategorySlug);
}

export function getAllArticles() {
  return [...mockArticles].reverse(); // newest first
}
