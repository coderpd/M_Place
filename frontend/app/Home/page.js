import Header from "./Header"
import ContactSection from "./ContactSection";
import Footer from "./Footer";

export default function Homepage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      
      <main>
        <ContactSection/>
      </main>
      <Footer/>

    </div>
  );
}
