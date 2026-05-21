import ContactForm from "@/components/ContactForm";

export function generateMetadata() {
  return {
    title: "Contact Us | United States Immigration News",
    description:
      "Get in touch with United States Immigration News. Reach out for questions, feedback, business inquiries, or collaboration ideas.",
    alternates: {
      canonical: "https://www.unitedstatesimmigrationnews.com/contact-us/",
    },
  };
}

export default function ContactUsPage() {
  return (
    <main className="max-w-screen-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <article className="max-w-4xl mx-auto prose prose-slate prose-lg">
        <h1 className="text-3xl md:text-4xl font-extrabold headline-font tracking-tight text-slate-900 mb-6">
          Get in Touch
        </h1>

        <p>We&apos;d love to hear from you.</p>

        <p>
          Whether you have a question, feedback, business inquiry, or
          collaboration idea, feel free to reach out. Our team is here to assist
          you and will respond as soon as possible.
        </p>

        <ContactForm />

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Important Note
        </h2>
        <p>
          The content on United States Immigration News is provided for
          informational purposes only and does not constitute legal advice. For
          personalized guidance, please consult a qualified professional.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          Location
        </h2>
        <p>
          Serving a global audience interested in U.S. immigration updates.
        </p>

        <h2 className="text-xl md:text-2xl font-bold headline-font text-slate-900 mt-8 mb-4">
          General Inquiries
        </h2>
        <p>
          For questions related to our content, updates, or general feedback:
        </p>
        <p>📩 Email: contact@unitedstatesimmigrationnews.com</p>
      </article>
    </main>
  );
}
