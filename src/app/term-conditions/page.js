import Link from "next/link";

export function generateMetadata() {
  return {
    title: "Terms & Conditions | United States Immigration News",
    description:
      "Read the Terms and Conditions of United States Immigration News governing your access and use of our website, content, and services.",
    alternates: {
      canonical:
        "https://www.unitedstatesimmigrationnews.com/term-conditions/",
    },
  };
}

export default function TermConditionsPage() {
  return (
    <main className="max-w-screen-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <article className="max-w-4xl mx-auto prose prose-slate prose-lg">
        <h1 className="text-3xl md:text-4xl font-extrabold headline-font tracking-tight text-slate-900 mb-6">
          Terms &amp; Conditions
        </h1>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Introduction
        </h2>
        <p>Welcome to United States Immigration News.</p>
        <p>
          These Terms and Conditions govern your access to and use of our
          website, including all content, features, and services provided
          through it. By accessing or using this website, you agree to comply
          with and be bound by these Terms.
        </p>
        <p>
          If you do not agree with any part of these Terms and Conditions, you
          should discontinue use of the website immediately.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Definitions
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            &quot;Website&quot; refers to United States Immigration News
          </li>
          <li>
            &quot;We,&quot; &quot;Us,&quot; or &quot;Our&quot; refer to the
            operators and owners of United States Immigration News
          </li>
          <li>
            &quot;User,&quot; &quot;You,&quot; or &quot;Your&quot; refer to any
            individual accessing or using the website
          </li>
          <li>
            &quot;Content&quot; refers to all materials available on the website
          </li>
          <li>
            &quot;Services&quot; refers to any features, tools, newsletters, or
            information provided through the website
          </li>
        </ul>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Use of Website
        </h2>
        <p>
          You agree to use United States Immigration News only for lawful
          purposes. You must not:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Use the website in any way that may damage or disrupt its
            functionality
          </li>
          <li>
            Attempt to gain unauthorized access to any part of the website
          </li>
          <li>
            Engage in hacking, data mining, or scraping without permission
          </li>
          <li>
            Use the website to distribute harmful, misleading, or illegal
            content
          </li>
        </ul>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Intellectual Property Rights
        </h2>
        <p>
          All content on United States Immigration News is the property of the
          website or its content providers and is protected by applicable
          intellectual property laws. You must not:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Copy, reproduce, or republish content without prior written
            permission
          </li>
          <li>
            Distribute, modify, or create derivative works from the content
          </li>
          <li>
            Use any content for commercial purposes without authorization
          </li>
        </ul>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          User Content
        </h2>
        <p>
          If you submit or share any content on United States Immigration News,
          you are solely responsible for the content you provide. By submitting
          content, you agree that it is accurate, lawful, and does not violate
          any third-party rights.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Information Disclaimer
        </h2>
        <p>
          The content published on United States Immigration News is provided
          for general informational purposes only and should not be considered
          legal advice. We strongly recommend consulting a qualified immigration
          attorney for advice specific to your situation.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Third-Party Links
        </h2>
        <p>
          Our website may contain links to third-party websites for additional
          information. We do not control, endorse, or assume responsibility for
          the content or practices of any third-party websites.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Limitation of Liability
        </h2>
        <p>
          To the fullest extent permitted by applicable law, United States
          Immigration News and its operators shall not be held liable for any
          damages arising from your use of the website, including errors or
          omissions in content, inaccuracies, or decisions made based on
          information provided.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Indemnification
        </h2>
        <p>
          You agree to defend, indemnify, and hold harmless United States
          Immigration News, its owners, operators, and affiliates from any
          claims, liabilities, or expenses arising out of your use of the
          website or violation of these Terms.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Privacy Policy Reference
        </h2>
        <p>
          Your use of United States Immigration News is also governed by our{" "}
          <Link href="/privacy-policy/" className="text-primary underline">
            Privacy Policy
          </Link>
          . By using this website, you acknowledge that you have read and agree
          to the Privacy Policy.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Termination of Use
        </h2>
        <p>
          We reserve the right to suspend or terminate your access to United
          States Immigration News at any time if we believe you have violated
          these Terms or engaged in any activity that may harm the website or
          its users.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Governing Law
        </h2>
        <p>
          These Terms and Conditions shall be governed by the laws of the United
          States. Any disputes arising from the use of this website shall be
          subject to the jurisdiction of the appropriate courts within the
          United States.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Changes to Terms
        </h2>
        <p>
          We reserve the right to update or modify these Terms and Conditions at
          any time. Changes become effective immediately upon publication. Your
          continued use of the website constitutes your acceptance of the
          revised Terms.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Contact Information
        </h2>
        <p>
          📩 Email:{" "}
          <a
            href="mailto:contact@unitedstatesimmigrationnews.com"
            className="text-primary underline"
          >
            contact@unitedstatesimmigrationnews.com
          </a>
        </p>
        <p>
          🌐 Website:{" "}
          <Link href="/" className="text-primary underline">
            United States Immigration News
          </Link>
        </p>
        <p>
          📄 Contact Page:{" "}
          <Link href="/contact-us/" className="text-primary underline">
            /contact-us/
          </Link>
        </p>
      </article>
    </main>
  );
}
