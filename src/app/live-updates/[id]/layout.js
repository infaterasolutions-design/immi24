export async function generateMetadata({ params }) {
  return {
    alternates: {
      canonical: `https://www.unitedstatesimmigrationnews.com/live-updates/${params.id}`,
      languages: {
        'en-US': `https://www.unitedstatesimmigrationnews.com/live-updates/${params.id}`,
        'x-default': `https://www.unitedstatesimmigrationnews.com/live-updates/${params.id}`,
      },
    },
  }
}

export default function Layout({ children }) {
  return children;
}
