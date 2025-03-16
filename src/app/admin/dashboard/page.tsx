"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Briefcase, FileText, FolderKanban, Users } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    skills: 0,
    experiences: 0,
    projects: 0,
    certificates: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch stats from API endpoints
        const [skillsRes, experiencesRes, projectsRes, certificatesRes] = await Promise.allSettled([
          fetch("/api/admin/skills"),
          fetch("/api/admin/experience"),
          fetch("/api/admin/projects"),
          fetch("/api/admin/certificates")
        ]);

        // Process results
        const skillsData = skillsRes.status === "fulfilled" && skillsRes.value.ok ? await skillsRes.value.json() : [];
        const experiencesData = experiencesRes.status === "fulfilled" && experiencesRes.value.ok ? await experiencesRes.value.json() : [];
        const projectsData = projectsRes.status === "fulfilled" && projectsRes.value.ok ? await projectsRes.value.json() : [];
        const certificatesData = certificatesRes.status === "fulfilled" && certificatesRes.value.ok ? await certificatesRes.value.json() : [];

        setStats({
          skills: Array.isArray(skillsData) ? skillsData.length : 0,
          experiences: Array.isArray(experiencesData) ? experiencesData.length : 0,
          projects: Array.isArray(projectsData) ? projectsData.length : 0,
          certificates: Array.isArray(certificatesData) ? certificatesData.length : 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Skills",
      value: stats.skills,
      description: "Total skills added",
      icon: <Users className="h-5 w-5 text-primary" />,
      href: "/admin/skills"
    },
    {
      title: "Experience",
      value: stats.experiences,
      description: "Work experiences",
      icon: <Briefcase className="h-5 w-5 text-primary" />,
      href: "/admin/experience"
    },
    {
      title: "Projects",
      value: stats.projects,
      description: "Portfolio projects",
      icon: <FolderKanban className="h-5 w-5 text-primary" />,
      href: "/admin/projects"
    },
    {
      title: "Certificates",
      value: stats.certificates,
      description: "Certifications earned",
      icon: <Award className="h-5 w-5 text-primary" />,
      href: "/admin/certificates"
    }
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Link key={index} href={card.href} className="block w-full">
            <Card className="hover:shadow-md transition-shadow w-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
                <div className="p-2 bg-primary/10 rounded-full">{card.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? (
                    <div className="h-8 w-16 bg-muted/60 rounded animate-pulse"></div>
                  ) : (
                    card.value
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{card.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your portfolio content</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              href="/admin/about" 
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="p-2 bg-primary/10 rounded-md">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Update About</h3>
                <p className="text-xs text-muted-foreground">Edit your profile information</p>
              </div>
            </Link>
            <Link 
              href="/admin/skills" 
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="p-2 bg-primary/10 rounded-md">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Manage Skills</h3>
                <p className="text-xs text-muted-foreground">Add or remove skills</p>
              </div>
            </Link>
            <Link 
              href="/admin/projects" 
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="p-2 bg-primary/10 rounded-md">
                <FolderKanban className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Add Project</h3>
                <p className="text-xs text-muted-foreground">Showcase your work</p>
              </div>
            </Link>
            <Link 
              href="/admin/experience" 
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="p-2 bg-primary/10 rounded-md">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Add Experience</h3>
                <p className="text-xs text-muted-foreground">Update work history</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
            <CardDescription>Status of your portfolio sections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">About Section</span>
                <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">
                  Complete
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: "100%" }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Skills</span>
                <span className={`text-xs ${stats.skills > 0 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"} px-2 py-1 rounded`}>
                  {stats.skills > 0 ? "Added" : "Pending"}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={stats.skills > 0 ? "bg-green-500 h-full" : "bg-amber-500 h-full"} 
                  style={{ width: stats.skills > 0 ? "100%" : "0%" }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Experience</span>
                <span className={`text-xs ${stats.experiences > 0 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"} px-2 py-1 rounded`}>
                  {stats.experiences > 0 ? "Added" : "Pending"}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={stats.experiences > 0 ? "bg-green-500 h-full" : "bg-amber-500 h-full"} 
                  style={{ width: stats.experiences > 0 ? "100%" : "0%" }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Projects</span>
                <span className={`text-xs ${stats.projects > 0 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"} px-2 py-1 rounded`}>
                  {stats.projects > 0 ? "Added" : "Pending"}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={stats.projects > 0 ? "bg-green-500 h-full" : "bg-amber-500 h-full"} 
                  style={{ width: stats.projects > 0 ? "100%" : "0%" }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 