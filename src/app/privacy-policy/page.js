import Link from "next/link";

export async function generateMetadata() {
  return {
    title: "Privacy Policy | United States Immigration News",
    description:
      "Read the Privacy Policy of United States Immigration News to understand how we collect, use, and protect your personal information.",
    alternates: {
      canonical:
        "https://www.unitedstatesimmigrationnews.com/privacy-policy/",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-screen-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <article className="max-w-4xl mx-auto prose prose-slate prose-lg">
        <h1 className="text-3xl md:text-4xl font-extrabold headline-font tracking-tight text-slate-900 mb-6">
          Privacy Policy
        </h1>

        <p>
          At <Link href="/">United States Immigration News</Link>, we are
          committed to safeguarding your privacy and ensuring transparency in
          how your information is collected and used. This Privacy Policy
          outlines the types of information we collect, how we use it, and the
          choices available to you.
        </p>
        <p>
          By accessing or using our services, you acknowledge and agree to the
          terms described in this policy.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Information We Collect
        </h2>
        <p>
          We collect certain types of information to provide, improve, and
          maintain the functionality of{" "}
          <Link href="/">United States Immigration News</Link>. The data we
          collect falls into the following categories.
        </p>

        <h3 className="text-lg md:text-xl font-semibold headline-font text-slate-800 mt-6 mb-3">
          Personal Information
        </h3>
        <p>
          We may collect personal information that you voluntarily provide when
          interacting with our website. This may include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Your name</li>
          <li>Email address</li>
          <li>Information submitted through contact forms</li>
          <li>Subscription details for newsletters or updates</li>
        </ul>
        <p>
          This information is collected only when you choose to provide it and
          is used solely for the intended purpose, such as responding to
          inquiries or sending updates.
        </p>

        <h3 className="text-lg md:text-xl font-semibold headline-font text-slate-800 mt-6 mb-3">
          Usage / Non-Personal Data
        </h3>
        <p>
          We may automatically collect certain information when you access or
          use our website. This may include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Device type and operating system</li>
          <li>Pages visited on the website</li>
          <li>Time and duration of visits</li>
          <li>Referring website URLs</li>
        </ul>
        <p>
          This data helps us understand user behavior, analyze trends, and
          improve the overall performance and usability of the website.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          How We Use Information
        </h2>
        <p>
          The information we collect is used to ensure the smooth operation of{" "}
          <Link href="/">United States Immigration News</Link> and to improve
          your overall experience on our website.
        </p>
        <p>
          We may use the collected information for the following purposes:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            To operate, maintain, and manage the website effectively
          </li>
          <li>
            To improve website content, functionality, and user experience
          </li>
          <li>To respond to your inquiries, messages, or requests</li>
          <li>
            To send newsletters, updates, or notifications (only if you have
            subscribed)
          </li>
          <li>
            To analyze website traffic, usage patterns, and user behavior
          </li>
          <li>
            To enhance website performance and optimize content relevance
          </li>
          <li>To maintain the security and integrity of the website</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Cookies and Tracking Technologies
        </h2>
        <p>
          <Link href="/">United States Immigration News</Link> uses cookies and
          similar tracking technologies to enhance your browsing experience,
          improve website functionality, and better understand how users
          interact with our content.
        </p>
        <p>We may use the following types of cookies:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Essential Cookies:</strong> Necessary for the basic
            operation of the website
          </li>
          <li>
            <strong>Functional Cookies:</strong> Help remember your preferences
            and settings
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Allow us to analyze user
            behavior and improve performance
          </li>
          <li>
            <strong>Advertising Cookies:</strong> Used to deliver relevant
            advertisements (if applicable)
          </li>
        </ul>
        <p>
          You have the option to control or disable cookies through your browser
          settings. However, disabling cookies may affect certain features and
          functionality of the website.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Third-Party Services
        </h2>
        <p>
          <Link href="/">United States Immigration News</Link> may use
          third-party services including:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Analytics Providers:</strong> To track and analyze website
            traffic
          </li>
          <li>
            <strong>Advertising Partners:</strong> To display advertisements
            (if applicable)
          </li>
          <li>
            <strong>Content Platforms:</strong> To embed videos, social media
            posts, or other external media
          </li>
        </ul>
        <p>
          We ensure that any third-party services we work with are selected
          carefully and used only for legitimate business and operational
          purposes.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Data Sharing and Disclosure
        </h2>
        <p>
          <Link href="/">United States Immigration News</Link> does not sell,
          rent, or trade your personal information.
        </p>
        <p>
          We may share information only when necessary, such as:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>To comply with legal obligations</li>
          <li>To protect our rights, users, or website security</li>
          <li>
            With trusted service providers who support website operations
          </li>
        </ul>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Data Retention
        </h2>
        <p>
          We retain your personal information only for as long as necessary to
          fulfill the purposes outlined in this Privacy Policy. Once the data is
          no longer needed, we take reasonable steps to securely delete or
          anonymize it.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Data Security
        </h2>
        <p>
          We implement appropriate technical and organizational measures to
          protect your information from unauthorized access, disclosure,
          alteration, or misuse. However, no method of data transmission over
          the internet is completely secure.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          User Rights and Choices
        </h2>
        <p>
          Depending on your location and applicable laws, you may have the
          right to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access the personal information we hold about you</li>
          <li>Request corrections to inaccurate or incomplete data</li>
          <li>Request deletion of your personal information</li>
          <li>
            Withdraw consent where data processing is based on your consent
          </li>
          <li>
            Opt out of receiving newsletters or promotional communications
          </li>
        </ul>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Children&apos;s Privacy
        </h2>
        <p>
          <Link href="/">United States Immigration News</Link> is not intended
          for use by individuals under the age of 13, and we do not knowingly
          collect personal information from children.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          External Links
        </h2>
        <p>
          Our website may contain links to third-party websites. We are not
          responsible for the privacy practices or content of those external
          websites.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Changes to This Privacy Policy
        </h2>
        <p>
          We reserve the right to update or modify this Privacy Policy at any
          time. Any changes will be posted on this page with an updated date.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Contact Information
        </h2>
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
      </article>
    </main>
  );
}
