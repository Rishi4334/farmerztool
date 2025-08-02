import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Camera, Upload, Info, Volume2, AlertTriangle, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { useVoice } from "@/hooks/use-voice";

export default function PlantDoctor() {
  const [, setLocation] = useLocation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { speak } = useVoice();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        simulateAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    // Simulate API call delay
    setTimeout(() => {
      setAnalysisResult({
        disease: "Early Blight",
        confidence: 87,
        severity: "medium",
        treatment: {
          immediate: [
            "Remove affected leaves immediately",
            "Apply copper-based fungicide",
            "Improve air circulation around plants"
          ],
          prevention: [
            "Water at soil level, avoid wetting leaves",
            "Use drip irrigation if possible",
            "Apply mulch around plants"
          ]
        }
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleSpeakResult = () => {
    if (analysisResult) {
      const text = `Disease detected: ${analysisResult.disease} with ${analysisResult.confidence}% confidence. Immediate actions: ${analysisResult.treatment.immediate.join(', ')}`;
      speak(text);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-farmer-green text-white p-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/")}
          className="mr-3 text-white hover:bg-farmer-green-light"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">Plant Doctor</h1>
      </header>

      <div className="p-4 pb-20">
        {/* Upload Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-farmer-green">Take a Photo of Your Crop</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-farmer-green transition-colors"
            >
              {selectedImage ? (
                <div className="space-y-4">
                  <img 
                    src={selectedImage} 
                    alt="Uploaded crop" 
                    className="max-w-full h-48 object-cover rounded-lg mx-auto"
                  />
                  <p className="text-sm text-gray-600">Image uploaded successfully</p>
                </div>
              ) : (
                <>
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Tap to take photo or upload image</p>
                  <Button className="bg-farmer-green text-white hover:bg-farmer-green-light">
                    <Camera className="mr-2 h-4 w-4" />
                    Open Camera
                  </Button>
                </>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Tips */}
            <div className="bg-blue-50 rounded-lg p-4 mt-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-2">Tips for best results:</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Take clear, close-up photos of affected leaves</li>
                    <li>• Ensure good lighting</li>
                    <li>• Include healthy parts for comparison</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Section */}
        {(isAnalyzing || analysisResult) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-farmer-green">Analysis Result</CardTitle>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-farmer-green mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing your crop image...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
                </div>
              ) : analysisResult && (
                <div className="space-y-6">
                  {/* Disease Detection Result */}
                  <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                        <span className="font-bold text-red-800">
                          {analysisResult.disease} Detected
                        </span>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {analysisResult.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-red-700 text-sm">Common fungal disease affecting tomato plants</p>
                  </div>

                  {/* Treatment Recommendations */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-farmer-green">Recommended Treatment:</h4>
                    
                    {/* Immediate Action */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <h5 className="font-medium text-green-800">Immediate Action:</h5>
                      </div>
                      <ul className="text-sm text-green-700 space-y-1">
                        {analysisResult.treatment.immediate.map((action: string, index: number) => (
                          <li key={index}>• {action}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Prevention */}
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-5 w-5 text-yellow-600 mr-2" />
                        <h5 className="font-medium text-yellow-800">Prevention:</h5>
                      </div>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        {analysisResult.treatment.prevention.map((prevention: string, index: number) => (
                          <li key={index}>• {prevention}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Voice Explanation Button */}
                    <Button 
                      onClick={handleSpeakResult}
                      className="w-full bg-farmer-orange text-white hover:bg-farmer-orange/90"
                    >
                      <Volume2 className="mr-2 h-4 w-4" />
                      Listen to Explanation
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
