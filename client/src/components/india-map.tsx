import indiaMapImage from "@assets/india map_1750964484634.webp";

export default function IndiaMap() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-primary mb-4 text-center">
        भारत मानचित्र (India Map)
      </h3>
      
      <img 
        src={indiaMapImage}
        alt="India Map"
        className="w-full h-96 object-cover rounded-lg"
      />
    </div>
  );
}
