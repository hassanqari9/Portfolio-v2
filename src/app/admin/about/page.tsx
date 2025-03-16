"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileText, Image, Save } from "lucide-react";

interface AboutData {
  id?: string;
  title: string;
  description: string;
  image?: string | null;
}

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [aboutData, setAboutData] = useState<AboutData>({
    title: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/admin/about");
        const data = await response.json();
        if (data) {
          setAboutData(data);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
        toast.error("Failed to load about data");
      }
    }

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/about", {
        method: aboutData.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aboutData),
      });

      if (!response.ok) {
        throw new Error("Failed to save about data");
      }

      toast.success("About information saved successfully");
    } catch (error) {
      console.error("Error saving about data:", error);
      toast.error("Failed to save about data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight gradient-text">About</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and introduction.
        </p>
      </div>

      <Card className="w-full border border-border/40 bg-background/60 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <FileText size={18} />
            </div>
            <CardTitle>Edit About Information</CardTitle>
          </div>
          <CardDescription>
            Update your personal information that will be displayed on your portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={aboutData.title}
                onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                placeholder="Welcome to My Portfolio"
                className="rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={aboutData.description}
                onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
                placeholder="I'm a passionate developer with expertise in..."
                className="rounded-lg min-h-[150px]"
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="flex items-center gap-2">
                <Image size={16} className="text-muted-foreground" />
                Image URL (optional)
              </Label>
              <Input
                id="image"
                value={aboutData.image || ""}
                onChange={(e) => setAboutData({ ...aboutData, image: e.target.value })}
                placeholder="https://example.com/your-image.jpg"
                className="rounded-lg"
              />
              {aboutData.image && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-sm opacity-50"></div>
                    <img
                      src={aboutData.image}
                      alt="Preview"
                      className="relative w-32 h-32 object-cover rounded-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/150";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" className="rounded-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-background border-t-transparent rounded-full"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" /> Save Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 