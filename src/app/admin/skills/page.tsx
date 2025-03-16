"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash } from "lucide-react";
import { toast } from "sonner";

export default function SkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: 75,
    category: "Frontend"
  });

  const categories = ["Frontend", "Backend", "Database", "DevOps", "Design", "Other"];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/admin/skills");
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      } else {
        toast.error("Failed to fetch skills");
      }
    } catch (error) {
      toast.error("An error occurred while fetching skills");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) {
      toast.error("Skill name is required");
      return;
    }

    try {
      const response = await fetch("/api/admin/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSkill),
      });

      if (response.ok) {
        toast.success("Skill added successfully");
        setNewSkill({
          name: "",
          level: 75,
          category: "Frontend"
        });
        fetchSkills();
      } else {
        toast.error("Failed to add skill");
      }
    } catch (error) {
      toast.error("An error occurred while adding skill");
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/skills/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Skill deleted successfully");
        fetchSkills();
      } else {
        toast.error("Failed to delete skill");
      }
    } catch (error) {
      toast.error("An error occurred while deleting skill");
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Skills Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Add New Skill</CardTitle>
            <CardDescription>Add a new skill to your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Skill Name</Label>
              <Input
                id="name"
                placeholder="e.g. React, Node.js, Figma"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newSkill.category}
                onValueChange={(value) => setNewSkill({ ...newSkill, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Skill Level: {newSkill.level}%</Label>
              <Slider
                id="level"
                min={0}
                max={100}
                step={5}
                value={[newSkill.level]}
                onValueChange={(value) => setNewSkill({ ...newSkill, level: value[0] })}
              />
            </div>

            <Button onClick={handleAddSkill} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Skill
            </Button>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Manage Skills</CardTitle>
            <CardDescription>View and manage your existing skills</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="Frontend">
              <TabsList className="mb-4 flex flex-wrap">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category} className="space-y-4">
                  {loading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : skills.filter(skill => skill.category === category).length > 0 ? (
                    skills
                      .filter(skill => skill.category === category)
                      .map((skill) => (
                        <div key={skill.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <div className="font-medium">{skill.name}</div>
                            <div className="text-sm text-muted-foreground">Level: {skill.level}%</div>
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteSkill(skill.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No skills in this category
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 