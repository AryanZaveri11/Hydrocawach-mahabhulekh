import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import IndiaMap from "@/components/india-map";
import LandRecordForm from "@/components/land-record-form";
import LoadingOverlay from "@/components/loading-overlay";

export default function Home() {
  const [language, setLanguage] = useState("hindi");
  const [selectedStateFromMap, setSelectedStateFromMap] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);

  const handleStateSelect = (stateId: number) => {
    setSelectedStateFromMap(stateId);
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <Header language={language} onLanguageChange={setLanguage} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">
            भूमि अभिलेख (Land Records)
          </h2>
          
          <p className="text-base text-gray-600">
            Bharat Bhulekh - A comprehensive land record system providing 7/12 extract, 8A extract, Property Card and other land documents online to citizens across India
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - India Map */}
          <IndiaMap 
            onStateSelect={handleStateSelect}
            selectedState={selectedStateFromMap}
          />

          {/* Right Column - Search Form */}
          <LandRecordForm selectedStateFromMap={selectedStateFromMap} />
        </div>

        
      </main>

      <Footer />
      <LoadingOverlay isVisible={isLoading} />
    </div>
  );
}
