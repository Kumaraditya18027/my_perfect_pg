// import Image from "next/image";
import AppDownloadSection from "@/components/AppPart";
import Footer from "@/components/Footer";
import LandingPage from "@/components/LandingHero";
import PopularPGSection from "@/components/PopularPg";
import StudentSuccessSection from "@/components/StudentSuccess";

export default function Home() {
  return (
    <>
      <LandingPage />
      <PopularPGSection />
      <StudentSuccessSection />
      <AppDownloadSection />
      <Footer />
    </>
  );
}
