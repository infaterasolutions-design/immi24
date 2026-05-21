import Link from "next/link";

export async function generateMetadata() {
  return {
    title: "About Us | United States Immigration News",
    description:
      "Learn about United States Immigration News — your trusted source for real-time U.S. immigration news, visa updates, policy developments, and more.",
    alternates: {
      canonical: "https://www.unitedstatesimmigrationnews.com/about-us/",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function AboutUsPage() {
  return (
    <main className="max-w-screen-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <article className="max-w-4xl mx-auto prose prose-slate prose-lg">
        <h1 className="text-3xl md:text-4xl font-extrabold headline-font tracking-tight text-slate-900 mb-6">
          About Us
        </h1>

        <p>
          <Link href="/">United States Immigration News</Link> is a dedicated
          platform focused on delivering timely, accurate, and
          easy-to-understand updates on U.S. immigration.
        </p>
        <p>
          We cover the latest developments in immigration policies, visa
          processes, and government updates to help individuals stay informed in
          an ever-changing landscape. Our goal is to simplify complex immigration
          topics and make reliable information accessible to a global audience.
        </p>
        <p>
          Whether you are planning to study, work, or settle in the United
          States, our platform is designed to keep you informed with clear and
          relevant insights.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Our Mission
        </h2>
        <p>
          At <Link href="/">United States Immigration News</Link>, our mission
          is to provide accurate, timely, and easy-to-understand immigration
          information to individuals around the world.
        </p>
        <p>
          We aim to simplify complex immigration policies and updates so that
          our readers can stay informed and make better decisions. By focusing on
          clarity, reliability, and relevance, we strive to be a trusted source
          for those navigating the U.S. immigration process.
        </p>
        <p>
          Our goal is not just to share news, but to make immigration
          information more accessible, transparent, and useful for everyone.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          What We Cover
        </h2>
        <p>
          At <Link href="/">United States Immigration News</Link>, we cover a
          wide range of topics related to U.S. immigration to keep our readers
          informed and up to date.
        </p>
        <p>Our content includes:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Visa updates (H1B, F1, B1/B2, L1, O1, and more)</li>
          <li>Green Card and permanent residency pathways</li>
          <li>USCIS announcements and processing updates</li>
          <li>Work permits (EAD) and employment-related policies</li>
          <li>
            Immigration rules, policy changes, and government announcements
          </li>
          <li>Step-by-step guides and practical insights</li>
        </ul>
        <p>
          We focus on delivering clear, concise, and relevant information that
          helps readers understand the latest developments in U.S. immigration.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Our Audience
        </h2>
        <p>
          <Link href="/">United States Immigration News</Link> serves a diverse,
          global audience actively seeking information about U.S. immigration.
        </p>
        <p>Our readers include:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Students planning to study in the United States</li>
          <li>
            Skilled professionals exploring work visas and job opportunities
          </li>
          <li>Families applying for immigration or sponsorship</li>
          <li>
            Individuals and applicants navigating visa processes and legal
            requirements
          </li>
        </ul>
        <p>
          Our audience is highly engaged and intent-driven, meaning they are not
          just browsing — they are actively researching, planning, and making
          important decisions related to immigration.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Our Editorial Standards
        </h2>
        <p>
          At <Link href="/">United States Immigration News</Link>, we are
          committed to maintaining high editorial standards to ensure the quality
          and reliability of our content.
        </p>
        <p>Our content is:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Based on official sources, including U.S. government announcements
            and verified documentation
          </li>
          <li>
            Independently researched to provide accurate and relevant insights
          </li>
          <li>Fact-checked and reviewed before publication</li>
          <li>
            Written in a clear and simplified format to make complex immigration
            topics easy to understand
          </li>
        </ul>
        <p>
          We prioritize accuracy, clarity, and transparency in every piece of
          content we publish, so our readers can rely on us for trustworthy
          information.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Why Trust Us
        </h2>
        <p>
          At <Link href="/">United States Immigration News</Link>, trust is at
          the core of everything we publish.
        </p>
        <p>
          We focus on delivering accurate, unbiased, and clearly explained
          information without exaggeration or misleading claims. Our content is
          designed to help readers understand immigration updates with
          confidence.
        </p>
        <p>What sets us apart:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Reliable Information:</strong> We rely on verified sources
            and official updates
          </li>
          <li>
            <strong>Clarity Over Complexity:</strong> We simplify complex
            immigration topics into easy-to-understand content
          </li>
          <li>
            <strong>Consistency:</strong> We regularly update our content to
            reflect the latest developments
          </li>
          <li>
            <strong>Transparency:</strong> We clearly distinguish between
            editorial content and any sponsored material
          </li>
        </ul>
        <p>
          Our goal is to build a platform that readers can depend on for
          credible and straightforward immigration news.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Our Growth &amp; Presence
        </h2>
        <p>
          <Link href="/">United States Immigration News</Link> is a growing
          platform reaching a global audience interested in U.S. immigration.
        </p>
        <p>
          Our presence continues to expand across digital platforms, with
          increasing readership and engagement from users actively seeking
          immigration updates, visa information, and policy changes.
        </p>
        <p>We are building a strong and connected community through:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Website traffic from a global audience</li>
          <li>Growing engagement across social media platforms</li>
          <li>Consistent sharing and interaction with our content</li>
        </ul>
        <p>
          Our growth reflects the trust our audience places in us and our
          commitment to delivering reliable immigration news.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Work With Us / Collaborations
        </h2>
        <p>
          <Link href="/">United States Immigration News</Link> welcomes
          partnerships and collaborations with organizations that align with our
          audience and content focus.
        </p>
        <p>We work with:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Immigration law firms and licensed professionals</li>
          <li>Educational institutions and consultants</li>
          <li>Job platforms and recruitment services</li>
          <li>Relocation, travel, and settlement service providers</li>
        </ul>
        <p>We offer opportunities for:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Sponsored content and native placements</li>
          <li>Brand promotions and campaigns</li>
          <li>Long-term partnerships</li>
        </ul>
        <p>
          All collaborations are carefully reviewed to ensure they meet our
          standards of credibility, transparency, and relevance.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Contact / Connect With Us
        </h2>
        <p>
          If you would like to get in touch with{" "}
          <Link href="/">United States Immigration News</Link>, we&apos;re here
          to help.
        </p>
        <p>
          Whether you have questions, feedback, or collaboration inquiries, you
          can reach us through the following:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            📩 Email:{" "}
            <a href="mailto:contact@unitedstatesimmigrationnews.com">
              contact@unitedstatesimmigrationnews.com
            </a>
          </li>
          <li>
            🌐 Website:{" "}
            <Link href="/">United States Immigration News</Link>
          </li>
          <li>
            📄 Contact Page:{" "}
            <Link href="/contact-us/">Contact Us</Link>
          </li>
        </ul>
        <p>
          You can also connect with us on our social platforms to stay updated
          with the latest immigration news and updates.
        </p>
      </article>
    </main>
  );
}
