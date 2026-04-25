"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import dynamic from "next/dynamic";

const LanguageTranslator = dynamic(() => import("./LanguageTranslator"), { ssr: false });
const RecommendedPopup = dynamic(() => import("./RecommendedPopup"), { ssr: false });

/**
 * Conditionally renders the public site chrome (Header, Footer, etc.)
 * only when the user is NOT on an /admin route.
 */
export default function PublicLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
      <LanguageTranslator />
      <RecommendedPopup />
    </>
  );
}
