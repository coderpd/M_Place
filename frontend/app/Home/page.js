import Header from "./Header"
import ContactSection from "./ContactSection";
import Footer from "./Footer";
import FeaturesSection from "./Features";

export default function Homepage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <main>
        <FeaturesSection/>
        <ContactSection/>
        <Footer/>
      </main>
      

    </div>
  );
}
