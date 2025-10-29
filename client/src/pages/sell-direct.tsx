import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Eye, Edit } from "lucide-react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function SellDirect() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    crop: "",
    quantity: "",
    location: "",
    description: "",
    pricePerUnit: ""
  });

  const [user, setUser] = useState<any>(() => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  });

  const { data: crops } = useQuery({
    queryKey: ["/api/crops"],
  });

  const { data: userListings = [], refetch: refetchListings } = useQuery({
    queryKey: ["/api/listings/user", user?._id],
    enabled: !!user?._id,
  });

  const createListingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create listing");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
      refetchListings();
      toast({
        title: "Success!",
        description: "Your listing has been created successfully.",
      });
      setFormData({
        crop: "",
        quantity: "",
        location: "",
        description: "",
        pricePerUnit: ""
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      });
    },
  });

  const activeListings = [
    {
      id: 1,
      crop: "Rice - Premium Quality",
      quantity: 50,
      location: "Warangal",
      price: 2200,
      status: "active",
      inquiries: 3
    },
    {
      id: 2,
      crop: "Tomato - Organic",
      quantity: 20,
      location: "Nizamabad",
      price: 3100,
      status: "sold",
      inquiries: 0
    }
  ];

  const priceCalculation = {
    marketPrice: 2450,
    transportCost: 150,
    storageCost: 50,
    platformFee: 49,
    netPrice: 2201
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !user._id) {
      toast({
        title: "Error",
        description: "Please login to create a listing",
        variant: "destructive",
      });
      setTimeout(() => setLocation("/login"), 1500);
      return;
    }

    if (!formData.crop || !formData.quantity || !formData.pricePerUnit || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createListingMutation.mutate({
      userId: user._id,
      cropId: formData.crop,
      quantity: formData.quantity,
      pricePerUnit: formData.pricePerUnit,
      location: formData.location,
      description: formData.description,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        <h1 className="text-xl font-bold">Sell Direct</h1>
      </header>

      <div className="p-4 pb-20">
        {/* List Product Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-farmer-green">List Your Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="crop" className="text-sm font-medium text-gray-700">Product</Label>
                <Select onValueChange={(value) => handleInputChange("crop", value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {crops?.map((crop: any) => (
                      <SelectItem key={crop._id} value={crop._id}>
                        {crop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity (Quintals)</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="pricePerUnit" className="text-sm font-medium text-gray-700">Price per Quintal (₹)</Label>
                <Input
                  id="pricePerUnit"
                  type="number"
                  placeholder="Enter price"
                  value={formData.pricePerUnit}
                  onChange={(e) => handleInputChange("pricePerUnit", e.target.value)}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Your village/district"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Additional details about your product"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* AI Price Calculation */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-bold text-green-800 mb-3">AI Price Calculation</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex justify-between">
                    <span>Market Price:</span>
                    <span>₹{priceCalculation.marketPrice}/quintal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transport Cost:</span>
                    <span>₹{priceCalculation.transportCost}/quintal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage Cost:</span>
                    <span>₹{priceCalculation.storageCost}/quintal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee (2%):</span>
                    <span>₹{priceCalculation.platformFee}/quintal</span>
                  </div>
                  <hr className="border-green-300 my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Your Net Price:</span>
                    <span>₹{priceCalculation.netPrice}/quintal</span>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-farmer-green text-white hover:bg-farmer-green-light">
                <Plus className="mr-2 h-4 w-4" />
                List Product
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Active Listings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-farmer-green">Your Active Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userListings.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No listings yet. Create your first listing above!</p>
              ) : (
                userListings.map((listing: any) => (
                <div key={listing._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{listing.description || "Product Listing"}</p>
                      <p className="text-sm text-gray-600">
                        {listing.quantity} quintals • {listing.location}
                      </p>
                    </div>
                    <Badge variant={listing.isActive ? "default" : "secondary"}>
                      {listing.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-farmer-green">
                      ₹{listing.pricePerUnit.toLocaleString()}/quintal
                    </p>
                    <div className="flex items-center space-x-2">
                      {listing.isActive && (
                        <Button variant="outline" size="sm" className="text-farmer-orange border-farmer-orange">
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">₹1,55,000</p>
                <p className="text-sm text-blue-600">Total Earnings</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">70</p>
                <p className="text-sm text-green-600">Quintals Sold</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
