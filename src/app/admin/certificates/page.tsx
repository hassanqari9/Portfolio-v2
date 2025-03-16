"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Award, Calendar, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCertificate, setNewCertificate] = useState({
    title: "",
    issuer: "",
    description: "",
    date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
    link: ""
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch("/api/admin/certificates");
      if (response.ok) {
        const data = await response.json();
        setCertificates(data);
      } else {
        toast.error("Failed to fetch certificates");
      }
    } catch (error) {
      toast.error("An error occurred while fetching certificates");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCertificate = async () => {
    if (!newCertificate.title.trim() || !newCertificate.issuer.trim()) {
      toast.error("Title and issuer are required");
      return;
    }

    try {
      const response = await fetch("/api/admin/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCertificate),
      });

      if (response.ok) {
        toast.success("Certificate added successfully");
        setNewCertificate({
          title: "",
          issuer: "",
          description: "",
          date: new Date().toISOString().split('T')[0],
          link: ""
        });
        fetchCertificates();
      } else {
        toast.error("Failed to add certificate");
      }
    } catch (error) {
      toast.error("An error occurred while adding certificate");
    }
  };

  const handleDeleteCertificate = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/certificates/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Certificate deleted successfully");
        fetchCertificates();
      } else {
        toast.error("Failed to delete certificate");
      }
    } catch (error) {
      toast.error("An error occurred while deleting certificate");
    }
  };

  // Helper function to format date
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
        <h1 className="text-2xl font-bold">Certificates Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Add New Certificate</CardTitle>
            <CardDescription>Add a new certificate to your portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Certificate Title</Label>
              <Input
                id="title"
                placeholder="e.g. AWS Certified Developer"
                value={newCertificate.title}
                onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuer">Issuer</Label>
              <Input
                id="issuer"
                placeholder="e.g. Amazon Web Services"
                value={newCertificate.issuer}
                onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe your certificate"
                value={newCertificate.description}
                onChange={(e) => setNewCertificate({ ...newCertificate, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newCertificate.date}
                onChange={(e) => setNewCertificate({ ...newCertificate, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Certificate URL (optional)</Label>
              <Input
                id="link"
                placeholder="https://example.com/certificate"
                value={newCertificate.link}
                onChange={(e) => setNewCertificate({ ...newCertificate, link: e.target.value })}
              />
            </div>

            <Button onClick={handleAddCertificate} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Certificate
            </Button>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Manage Certificates</CardTitle>
            <CardDescription>View and manage your certificates</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : certificates.length > 0 ? (
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-2 bg-primary/10 rounded-md">
                          <Award className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{cert.title}</h3>
                          <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {formatDate(cert.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteCertificate(cert.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No certificates added yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 