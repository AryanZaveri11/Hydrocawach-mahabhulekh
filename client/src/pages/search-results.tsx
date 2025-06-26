import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function SearchResults() {
  const [language, setLanguage] = useState("hindi");
  const searchParams = new URLSearchParams(window.location.search);
  const requestId = searchParams.get("requestId");

  // In a real implementation, this would fetch the search results
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["/api/search-results", requestId],
    enabled: !!requestId,
    queryFn: async () => {
      // Mock data for demonstration
      return {
        searchRequestId: requestId,
        records: [
          {
            id: 1,
            propertyUid: "12345678901",
            surveyNumber: "123",
            subdivisionNumber: "1",
            ownerName: "राम शर्मा",
            fatherName: "श्याम शर्मा",
            area: "500 sq ft",
            classification: "Residential",
            type: "7-12",
            recordData: {
              ownershipType: "Individual",
              landType: "Urban",
              registrationDate: "2020-01-15",
              lastUpdated: "2023-12-01"
            }
          },
          {
            id: 2,
            propertyUid: "12345678902",
            surveyNumber: "124",
            subdivisionNumber: "2",
            ownerName: "सीता पटेल",
            fatherName: "गीता पटेल",
            area: "750 sq ft",
            classification: "Commercial",
            type: "property-card",
            recordData: {
              ownershipType: "Individual",
              landType: "Urban",
              registrationDate: "2019-05-20",
              lastUpdated: "2023-11-15"
            }
          }
        ],
        total: 2
      };
    },
  });

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header language={language} onLanguageChange={setLanguage} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground">खोज परिणाम लोड हो रहे हैं...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header language={language} onLanguageChange={setLanguage} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              वापस जाएं (Go Back)
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-primary">
            खोज परिणाम (Search Results)
          </h1>
        </div>

        {searchResults?.records && searchResults.records.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-lg text-muted-foreground">
                {searchResults.total} रिकॉर्ड मिले ({searchResults.total} records found)
              </p>
            </div>

            <div className="grid gap-6">
              {searchResults.records.map((record: any) => (
                <Card key={record.id} className="bg-white shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span>सर्वे नंबर {record.surveyNumber}</span>
                        {record.subdivisionNumber && (
                          <span>/ {record.subdivisionNumber}</span>
                        )}
                      </CardTitle>
                      <Badge variant="secondary">
                        {record.type.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            संपत्ति यूआईडी (Property UID)
                          </label>
                          <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {record.propertyUid}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            मालिक का नाम (Owner Name)
                          </label>
                          <p className="text-lg font-semibold">{record.ownerName}</p>
                        </div>
                        {record.fatherName && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              पिता का नाम (Father's Name)
                            </label>
                            <p>{record.fatherName}</p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            क्षेत्रफल (Area)
                          </label>
                          <p>{record.area}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            वर्गीकरण (Classification)
                          </label>
                          <p>{record.classification}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            अंतिम अपडेट (Last Updated)
                          </label>
                          <p>{record.recordData?.lastUpdated}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex space-x-4">
                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                          <Download className="h-4 w-4 mr-2" />
                          डाउनलोड करें (Download)
                        </Button>
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          विवरण देखें (View Details)
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              कोई रिकॉर्ड नहीं मिला
            </h3>
            <p className="text-gray-600 mb-6">
              आपकी खोज के मानदंडों से मेल खाने वाला कोई भूमि रिकॉर्ड नहीं मिला।
            </p>
            <Link href="/">
              <Button>
                नई खोज करें (New Search)
              </Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
