"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import LanguageTranslator from "./LanguageTranslator";
import RecommendedPopup from "./RecommendedPopup";

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
