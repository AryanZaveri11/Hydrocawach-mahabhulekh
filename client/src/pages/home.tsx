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
          <p className="text-lg text-muted-foreground mb-6">
            गाव नमुना नंबर ७/१२, ८अ, मालमत्ता पत्रक व क-प्रत पाहणे
          </p>
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

        {/* Government Services Links */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-primary mb-6 text-center">
            संबंधित सेवा (Related Services)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Digital Satbara equivalent */}
            <a href="#" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-lg mb-2 overflow-hidden">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1555992336-03a23c7b20ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64')"
                  }}
                />
              </div>
              <span className="text-xs text-center font-medium">डिजिटल सतबारा</span>
            </a>

            {/* E-Sign Services */}
            <a href="#" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-50 rounded-lg mb-2 overflow-hidden">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64')"
                  }}
                />
              </div>
              <span className="text-xs text-center font-medium">ई-साइन</span>
            </a>

            {/* Land Records */}
            <a href="#" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-yellow-50 rounded-lg mb-2 overflow-hidden">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&h=64')"
                  }}
                />
              </div>
              <span className="text-xs text-center font-medium">भूमि अभिलेख</span>
            </a>

            {/* Registry Services */}
            <a href="#" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-red-50 rounded-lg mb-2 flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
              <span className="text-xs text-center font-medium">रजिस्ट्री</span>
            </a>

            {/* Court Services */}
            <a href="#" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-50 rounded-lg mb-2 flex items-center justify-center">
                <span className="text-2xl">⚖️</span>
              </div>
              <span className="text-xs text-center font-medium">न्यायालय</span>
            </a>

            {/* Survey Maps */}
            <a href="#" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-indigo-50 rounded-lg mb-2 flex items-center justify-center">
                <span className="text-2xl">🗺️</span>
              </div>
              <span className="text-xs text-center font-medium">सर्वे नकाशे</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
      <LoadingOverlay isVisible={isLoading} />
    </div>
  );
}
