"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Briefcase, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [newExperience, setNewExperience] = useState({
    company: "",
    position: "",
    location: "",
    description: "",
    startDate: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
    endDate: "",
    current: true,
    logo: ""
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch("/api/admin/experience");
      if (response.ok) {
        const data = await response.json();
        setExperiences(data);
      } else {
        toast.error("Failed to fetch experiences");
      }
    } catch (error) {
      toast.error("An error occurred while fetching experiences");
    } finally {
      setLoading(false);
    }
  };

  const handleAddExperience = async () => {
    if (!newExperience.company.trim() || !newExperience.position.trim()) {
      toast.error("Company and position are required");
      return;
    }

    try {
      const response = await fetch("/api/admin/experience", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExperience),
      });

      if (response.ok) {
        toast.success("Experience added successfully");
        setNewExperience({
          company: "",
          position: "",
          location: "",
          description: "",
          startDate: new Date().toISOString().split('T')[0],
          endDate: "",
          current: true,
          logo: ""
        });
        fetchExperiences();
      } else {
        toast.error("Failed to add experience");
      }
    } catch (error) {
      toast.error("An error occurred while adding experience");
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/experience/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Experience deleted successfully");
        fetchExperiences();
      } else {
        toast.error("Failed to delete experience");
      }
    } catch (error) {
      toast.error("An error occurred while deleting experience");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Experience Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Add New Experience</CardTitle>
            <CardDescription>Add a new work experience to your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="e.g. Acme Inc."
                value={newExperience.company}
                onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                placeholder="e.g. Senior Developer"
                value={newExperience.position}
                onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. New York, NY"
                value={newExperience.location}
                onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your responsibilities and achievements"
                value={newExperience.description}
                onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newExperience.startDate}
                  onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newExperience.endDate}
                  onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                  disabled={newExperience.current}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="current"
                checked={newExperience.current}
                onCheckedChange={(checked) => setNewExperience({ ...newExperience, current: checked })}
              />
              <Label htmlFor="current">Current Position</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL (optional)</Label>
              <Input
                id="logo"
                placeholder="https://example.com/logo.png"
                value={newExperience.logo}
                onChange={(e) => setNewExperience({ ...newExperience, logo: e.target.value })}
              />
            </div>

            <Button onClick={handleAddExperience} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Experience
            </Button>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Manage Experiences</CardTitle>
            <CardDescription>View and manage your work experiences</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : experiences.length > 0 ? (
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-2 bg-primary/10 rounded-md">
                          <Briefcase className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{exp.position}</h3>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(exp.startDate)} - {
                              exp.current 
                                ? 'Present' 
                                : exp.endDate 
                                  ? formatDate(exp.endDate)
                                  : 'Present'
                            }
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteExperience(exp.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No experiences added yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 