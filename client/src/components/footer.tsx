export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-semibold mb-4">भारत भूलेख (Bharat Bhulekh)</h4>
            <p className="text-sm text-primary-foreground/80">
              Comprehensive land records system for all Indian states and union territories.
            </p>
            <p className="text-xs text-primary-foreground/60 mt-2">
              Powered by Hydrocawach Technologies
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">सेवाएं (Services)</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>7/12 Extract</li>
              <li>8A Extract</li>
              <li>Property Card</li>
              <li>K-Prat</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">संपर्क (Contact)</h4>
            <p className="text-sm text-primary-foreground/80">
              भारत सरकार | Government of India<br />
              भूमि संसाधन विभाग | Department of Land Resources
            </p>
          </div>
        </div>
        <div className="border-t border-primary-foreground/30 mt-8 pt-8 text-center text-sm text-primary-foreground/80">
          © 2024 Bharat Bhulekh. All rights reserved. | Developed by Hydrocawach Technologies
        </div>
      </div>
    </footer>
  );
}
