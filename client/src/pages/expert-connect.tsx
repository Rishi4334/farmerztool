
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserCheck, ShoppingCart, Building, Headphones, Phone, MessageCircle, Eye, X, Send } from "lucide-react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ExpertConnect() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [chatMode, setChatMode] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  const expertCategories = [
    {
      icon: UserCheck,
      title: "Agronomists",
      subtitle: "Crop experts",
      color: "text-green-500"
    },
    {
      icon: ShoppingCart,
      title: "Buyers",
      subtitle: "Direct sales",
      color: "text-blue-500"
    },
    {
      icon: Building,
      title: "Scheme Advisors",
      subtitle: "Government aid",
      color: "text-purple-500"
    },
    {
      icon: Headphones,
      title: "Support",
      subtitle: "Technical help",
      color: "text-farmer-orange"
    }
  ];

  const availableExperts = [
    {
      id: 1,
      name: "Dr. Ravi Kumar",
      specialty: "Crop Disease Specialist",
      experience: "15+ years",
      languages: ["Telugu", "Hindi", "English"],
      rating: 4.8,
      isOnline: true,
      responseTime: "< 5 min",
      phone: "+91-9876543210"
    },
    {
      id: 2,
      name: "Priya Sharma",
      specialty: "Organic Farming Expert",
      experience: "12+ years",
      languages: ["Hindi", "English"],
      rating: 4.9,
      isOnline: true,
      responseTime: "< 10 min",
      phone: "+91-9876543211"
    },
    {
      id: 3,
      name: "Rajesh Patel",
      specialty: "Market Analyst",
      experience: "8+ years",
      languages: ["Hindi", "Gujarati", "English"],
      rating: 4.7,
      isOnline: false,
      responseTime: "< 30 min",
      phone: "+91-9876543212"
    }
  ];

  const recentConsultations = [
    {
      id: 1,
      type: "disease",
      title: "Tomato Disease Query",
      expert: "Dr. Ravi Kumar",
      description: "Consulted about leaf spots on tomato plants",
      time: "2 hours ago",
      status: "solved",
      color: "green",
      solution: "Applied neem oil spray as recommended. Disease spreading has stopped and new growth looks healthy."
    },
    {
      id: 2,
      type: "market",
      title: "Rice Buyer Contact",
      expert: "Market Connect",
      description: "Connected with buyer offering ₹2,400/quintal",
      time: "Yesterday",
      status: "pending",
      color: "blue",
      solution: "Waiting for buyer to confirm order quantity and delivery date."
    },
    {
      id: 3,
      type: "scheme",
      title: "PM-KISAN Application",
      expert: "Scheme Advisor",
      description: "Help with application renewal process",
      time: "3 days ago",
      status: "completed",
      color: "purple",
      solution: "Application successfully submitted. Payment expected in next installment cycle."
    }
  ];

  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);

  const handleCall = (expert: any) => {
    if (!expert.isOnline) {
      toast({
        title: "Expert Offline",
        description: `${expert.name} is currently offline. Please try chat or schedule a call.`,
        variant: "destructive"
      });
      return;
    }
    
    setSelectedExpert(expert);
    toast({
      title: "Calling...",
      description: `Connecting you to ${expert.name} at ${expert.phone}`,
    });
  };

  const handleChat = (expert: any) => {
    setSelectedExpert(expert);
    setChatMode(true);
    setChatMessages([
      {
        sender: "expert",
        text: `Hello! I'm ${expert.name}. How can I help you today?`,
        time: new Date().toLocaleTimeString()
      }
    ]);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      sender: "user",
      text: message,
      time: new Date().toLocaleTimeString()
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessage("");

    // Simulate expert response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: "expert",
        text: "Thank you for your question. Let me help you with that...",
        time: new Date().toLocaleTimeString()
      }]);
    }, 1000);
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
        <h1 className="text-xl font-bold">Expert Connect</h1>
      </header>

      <div className="p-4 pb-20">
        {/* Expert Categories */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {expertCategories.map((category, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-farmer-green">
              <CardContent className="p-4 text-center">
                <category.icon className={`h-10 w-10 mx-auto mb-3 ${category.color}`} />
                <p className="font-medium">{category.title}</p>
                <p className="text-xs text-gray-600">{category.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Available Experts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-farmer-green">Available Now</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableExperts.map((expert) => (
                <div key={expert.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-farmer-green/10 rounded-full flex items-center justify-center mr-4">
                      <UserCheck className="h-6 w-6 text-farmer-green" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">{expert.name}</p>
                        {expert.isOnline && (
                          <div className="flex items-center ml-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                            <span className="text-xs text-green-600">Online</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{expert.specialty}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-gray-500">⭐ {expert.rating}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{expert.experience}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{expert.responseTime}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {expert.languages.map((lang, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button 
                      size="sm" 
                      className="bg-farmer-green text-white hover:bg-farmer-green-light"
                      onClick={() => handleCall(expert)}
                    >
                      <Phone className="mr-1 h-3 w-3" />
                      Call
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-farmer-green text-farmer-green hover:bg-farmer-green hover:text-white"
                      onClick={() => handleChat(expert)}
                    >
                      <MessageCircle className="mr-1 h-3 w-3" />
                      Chat
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Consultations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-farmer-green">Recent Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentConsultations.map((consultation) => (
                <div key={consultation.id} className={`p-4 border-l-4 rounded-r-lg ${
                  consultation.color === 'green' ? 'border-green-500 bg-green-50' :
                  consultation.color === 'blue' ? 'border-blue-500 bg-blue-50' :
                  'border-purple-500 bg-purple-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{consultation.title}</p>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={consultation.status === 'solved' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {consultation.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{consultation.time}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Consulted with {consultation.expert}
                      </p>
                      <p className="text-sm text-gray-700 mb-3">{consultation.description}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`text-sm ${
                          consultation.color === 'green' ? 'text-green-700 hover:text-green-800' :
                          consultation.color === 'blue' ? 'text-blue-700 hover:text-blue-800' :
                          'text-purple-700 hover:text-purple-800'
                        }`}
                        onClick={() => setSelectedConsultation(consultation)}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        {consultation.status === 'solved' ? 'View Solution' : 'View Details'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="border-farmer-green text-farmer-green hover:bg-farmer-green hover:text-white"
                onClick={() => toast({ title: "Emergency Help", description: "Connecting you to emergency support..." })}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Emergency Help
              </Button>
              <Button 
                variant="outline" 
                className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                onClick={() => toast({ title: "Schedule Call", description: "Opening scheduler..." })}
              >
                <Phone className="mr-2 h-4 w-4" />
                Schedule Call
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Dialog */}
      <Dialog open={chatMode} onOpenChange={() => { setChatMode(false); setSelectedExpert(null); }}>
        <DialogContent className="max-w-md h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-farmer-green">
              Chat with {selectedExpert?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-3 p-4">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-lg p-3 ${
                  msg.sender === 'user' ? 'bg-farmer-green text-white' : 'bg-gray-100'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 p-4 border-t">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} className="bg-farmer-green">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Consultation Details Dialog */}
      <Dialog open={!!selectedConsultation} onOpenChange={() => setSelectedConsultation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-farmer-green">{selectedConsultation?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Expert</p>
              <p className="text-gray-800">{selectedConsultation?.expert}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Description</p>
              <p className="text-gray-800">{selectedConsultation?.description}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <Badge variant={selectedConsultation?.status === 'solved' ? 'default' : 'secondary'}>
                {selectedConsultation?.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Solution/Details</p>
              <p className="text-gray-800">{selectedConsultation?.solution}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Call Dialog */}
      <Dialog open={!!selectedExpert && !chatMode} onOpenChange={() => setSelectedExpert(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-farmer-green">Calling {selectedExpert?.name}</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-farmer-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-10 w-10 text-farmer-green animate-pulse" />
            </div>
            <p className="text-lg font-medium mb-2">{selectedExpert?.specialty}</p>
            <p className="text-gray-600 mb-4">{selectedExpert?.phone}</p>
            <p className="text-sm text-gray-500">
              In a production environment, this would initiate a real call or video consultation.
            </p>
            <Button 
              className="mt-6 bg-red-500 hover:bg-red-600"
              onClick={() => setSelectedExpert(null)}
            >
              End Call
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
