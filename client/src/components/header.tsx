import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LANGUAGES } from "@/lib/constants";
import hydrocawachLogo from "@assets/Hydrocawach logo PNG_1750944260281.png";

interface HeaderProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

export default function Header({ language, onLanguageChange }: HeaderProps) {
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
              <p className="text-sm text-muted-foreground">हाइड्रोकावाच भूमि अभिलेख</p>
            </div>
          </div>
          
          {/* Language Selector */}
          <div className="flex items-center space-x-4">
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LANGUAGES).map(([code, name]) => (
                  <SelectItem key={code} value={code}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
}
