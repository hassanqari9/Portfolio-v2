"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";

export default function ContactPage() {
  const [contact, setContact] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    github: "",
    linkedin: "",
    twitter: ""
  });

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      const response = await fetch("/api/admin/contact");
      if (response.ok) {
        const data = await response.json();
        setContact(data);
        if (data) {
          setFormData({
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
            github: data.github || "",
            linkedin: data.linkedin || "",
            twitter: data.twitter || ""
          });
        }
      } else {
        toast.error("Failed to fetch contact information");
      }
    } catch (error) {
      toast.error("An error occurred while fetching contact information");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      const method = contact ? "PUT" : "POST";
      const response = await fetch("/api/admin/contact", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Contact information saved successfully");
        fetchContact();
      } else {
        toast.error("Failed to save contact information");
      }
    } catch (error) {
      toast.error("An error occurred while saving contact information");
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contact Information</h1>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>Manage your contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </Label>
                <Input
                  id="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Phone (optional)
                </Label>
                <Input
                  id="phone"
                  placeholder="+1 (123) 456-7890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Address (optional)
                </Label>
                <Textarea
                  id="address"
                  placeholder="Your location or address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Social Media</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="github" className="flex items-center gap-2">
                      <Github className="h-4 w-4" /> GitHub URL (optional)
                    </Label>
                    <Input
                      id="github"
                      placeholder="https://github.com/yourusername"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" /> LinkedIn URL (optional)
                    </Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/yourusername"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="flex items-center gap-2">
                      <Twitter className="h-4 w-4" /> Twitter URL (optional)
                    </Label>
                    <Input
                      id="twitter"
                      placeholder="https://twitter.com/yourusername"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full">
                Save Contact Information
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 