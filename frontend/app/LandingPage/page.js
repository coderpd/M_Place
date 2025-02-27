import Home from "./Home";
import Navbar from "./Navbar";
import Services from "./Services";
import ContactSection from "./ContactSection";
import Footer from "./Footer";


export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
     <Navbar/>
     <Home/>
     <Services/>
     <ContactSection/>
     <Footer/>
    </div>
  );
}