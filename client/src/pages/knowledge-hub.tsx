import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Sprout, Tractor, Building, Leaf, Volume2, Play, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { useVoice } from "@/hooks/use-voice";

export default function KnowledgeHub() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { speak } = useVoice();

  const categories = [
    { icon: Sprout, title: "Crop Care", color: "text-green-500" },
    { icon: Tractor, title: "Machinery", color: "text-blue-500" },
    { icon: Building, title: "Gov Schemes", color: "text-purple-500" },
    { icon: Leaf, title: "Organic", color: "text-farmer-green" }
  ];

  const featuredArticles = [
    {
      id: 1,
      title: "Water-Saving Irrigation Techniques",
      description: "Learn how to reduce water usage by 40% while maintaining crop yield...",
      readTime: "5 min read",
      category: "Crop Care",
      image: "🌱"
    },
    {
      id: 2,
      title: "PM-KISAN Scheme Updates",
      description: "New eligibility criteria and application process for 2024...",
      readTime: "3 min read",
      category: "Government",
      image: "🏛️"
    },
    {
      id: 3,
      title: "Pest Control Without Chemicals",
      description: "Natural methods to protect your crops from common pests...",
      readTime: "7 min read",
      category: "Organic",
      image: "🐛"
    }
  ];

  const videoTutorials = [
    {
      id: 1,
      title: "Soil Testing at Home",
      description: "Learn simple soil testing methods",
      duration: "12 min",
      language: "Telugu"
    },
    {
      id: 2,
      title: "Drip Irrigation Setup",
      description: "Step-by-step installation guide",
      duration: "8 min",
      language: "Hindi"
    },
    {
      id: 3,
      title: "Organic Fertilizer Making",
      description: "Create your own compost",
      duration: "15 min",
      language: "English"
    }
  ];

  const handleListenArticle = (article: any) => {
    speak(`Article: ${article.title}. ${article.description}`);
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
        <h1 className="text-xl font-bold">Knowledge Hub</h1>
      </header>

      <div className="p-4 pb-20">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search farming tips, schemes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
            <Search className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {categories.map((category, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <category.icon className={`h-8 w-8 mx-auto mb-2 ${category.color}`} />
                <p className="font-medium">{category.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Articles */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-farmer-green">Featured This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {featuredArticles.map((article, index) => (
                <div key={article.id} className={`${index < featuredArticles.length - 1 ? 'border-b border-gray-100 pb-4' : ''}`}>
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{article.image}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-farmer-green mb-2">{article.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{article.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {article.readTime}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleListenArticle(article)}
                          className="text-farmer-green hover:bg-farmer-green hover:text-white"
                        >
                          <Volume2 className="h-4 w-4 mr-1" />
                          Listen
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Video Tutorials */}
        <Card>
          <CardHeader>
            <CardTitle className="text-farmer-green">Video Tutorials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {videoTutorials.map((video) => (
                <div key={video.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-16 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Play className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{video.title}</p>
                    <p className="text-sm text-gray-600">{video.description}</p>
                    <div className="flex items-center mt-1 space-x-3">
                      <span className="text-xs text-gray-500">{video.duration}</span>
                      <span className="text-xs text-farmer-green">{video.language}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-farmer-green text-farmer-green">
                    <Play className="h-3 w-3 mr-1" />
                    Watch
                  </Button>
                </div>
              ))}
            </div>

            {/* Quick Tips */}
            <div className="mt-6 p-4 bg-farmer-green/10 rounded-lg">
              <h4 className="font-bold text-farmer-green mb-3">Today's Quick Tip</h4>
              <p className="text-sm text-gray-700 mb-3">
                Water your crops early morning or late evening to reduce water loss due to evaporation. 
                This simple practice can save up to 30% water.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => speak("Today's quick tip: Water your crops early morning or late evening to reduce water loss due to evaporation. This simple practice can save up to 30% water.")}
                className="border-farmer-green text-farmer-green"
              >
                <Volume2 className="h-3 w-3 mr-1" />
                Listen to Tip
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
