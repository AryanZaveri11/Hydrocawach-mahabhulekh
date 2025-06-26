import { Button } from "@/components/ui/button";
import indiaMapImage from "@assets/india map_1750964484634.webp";

interface IndiaMapProps {
  onStateSelect: (stateId: number) => void;
  selectedState?: number;
}

const MAJOR_STATES = [
  { id: 14, name: "महाराष्ट्र", code: "MH" },
  { id: 27, name: "उत्तर प्रदेश", code: "UP" },
  { id: 11, name: "कर्नाटक", code: "KA" },
  { id: 7, name: "गुजरात", code: "GJ" },
  { id: 21, name: "राजस्थान", code: "RJ" },
  { id: 23, name: "तमिलनाडु", code: "TN" },
];

export default function IndiaMap({ onStateSelect, selectedState }: IndiaMapProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-primary mb-4 text-center">
        भारत मानचित्र (India Map)
      </h3>
      
      {/* Interactive India map with administrative divisions */}
      <div className="relative w-full h-96 bg-gradient-to-b from-blue-50 to-green-50 rounded-lg border-2 border-primary/20 overflow-hidden">
        <img 
          src={indiaMapImage}
          alt="India Map"
          className="w-full h-full object-cover rounded-lg"
        />
        
        {/* Interactive state overlay buttons */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-2 text-xs">
            {MAJOR_STATES.map((state) => (
              <Button
                key={state.id}
                variant={selectedState === state.id ? "default" : "secondary"}
                size="sm"
                className="bg-primary/80 text-primary-foreground px-2 py-1 rounded shadow hover:bg-primary transition-colors"
                onClick={() => onStateSelect(state.id)}
              >
                {state.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
