import { useState } from "react";
import hydrocawachLogo from "@assets/Hydrocawach logo PNG_1750944260281.png";

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {/* Hydrocawach Logo */}
            <div className="w-12 h-12 flex items-center justify-center">
              <img src={hydrocawachLogo} alt="Hydrocawach Technologies" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Hydrocawach</h1>
              <p className="text-sm text-muted-foreground">हाइड्रोकावाच </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
