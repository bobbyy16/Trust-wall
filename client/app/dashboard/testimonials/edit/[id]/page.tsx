"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Star, Save, Loader2 } from "lucide-react";
import Link from "next/link";

interface Feedback {
  id: string;
  customerName: string;
  customerImage?: string;
  rating: number;
  message: string;
  createdAt: string;
}

interface TestimonialWall {
  id: string;
  widgetId: string;
  embedId: string;
  embedUrl: string;
  feedbacks: Feedback[];
  widget: {
    name: string;
  };
  createdAt: string;
}

const API_BASE_URL = "http://localhost:5000/api";

export default function EditTestimonialWallPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [testimonialWall, setTestimonialWall] =
    useState<TestimonialWall | null>(null);
  const [approvedFeedbacks, setApprovedFeedbacks] = useState<Feedback[]>([]);
  const [selectedFeedbacks, setSelectedFeedbacks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    fetchTestimonialWall();
  }, [user, authLoading, router, id]);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  });

  const fetchTestimonialWall = async () => {
    try {
      setLoading(true);

      // Get testimonial wall details
      const wallResponse = await fetch(`${API_BASE_URL}/testimonial-walls`, {
        headers: getAuthHeaders(),
      });

      if (!wallResponse.ok) {
        throw new Error("Failed to fetch testimonial walls");
      }

      const wallData = await wallResponse.json();
      const currentWall = wallData.testimonialWalls.find(
        (w: any) => w.id === id
      );

      if (!currentWall) {
        toast({
          title: "Error",
          description: "Testimonial wall not found",
          variant: "destructive",
        });
        router.push("/dashboard");
        return;
      }

      // Get detailed testimonial wall data
      const detailResponse = await fetch(
        `${API_BASE_URL}/testimonial-walls/widget/${currentWall.widget.id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (detailResponse.ok) {
        const detailData = await detailResponse.json();
        setTestimonialWall(detailData.testimonialWall);
        setSelectedFeedbacks(
          detailData.testimonialWall.feedbacks.map((f: Feedback) => f.id)
        );
      }

      // Get all approved feedbacks for this widget
      const approvedResponse = await fetch(
        `${API_BASE_URL}/testimonial-walls/approved-feedbacks/${currentWall.widget.id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (approvedResponse.ok) {
        const approvedData = await approvedResponse.json();
        setApprovedFeedbacks(approvedData.feedbacks);
      }
    } catch (error) {
      console.error("Error fetching testimonial wall:", error);
      toast({
        title: "Error",
        description: "Failed to load testimonial wall data",
        variant: "destructive",
      });
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackToggle = (feedbackId: string) => {
    setSelectedFeedbacks((prev) =>
      prev.includes(feedbackId)
        ? prev.filter((id) => id !== feedbackId)
        : [...prev, feedbackId]
    );
  };

  const handleSave = async () => {
    if (selectedFeedbacks.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one feedback",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_BASE_URL}/testimonial-walls/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          feedbackIds: selectedFeedbacks,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Testimonial wall updated successfully",
        });
        router.push("/dashboard");
      } else {
        throw new Error("Failed to update testimonial wall");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update testimonial wall",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!testimonialWall) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Testimonial Wall Not Found
          </h2>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Edit Testimonial Wall</h1>
          <p className="text-muted-foreground">
            Update testimonials for "{testimonialWall.widget?.name}" wall
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Available Feedbacks */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Available Testimonials</CardTitle>
                <CardDescription>
                  Select testimonials to display in your wall (
                  {selectedFeedbacks.length} selected)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {approvedFeedbacks.map((feedback) => (
                    <div
                      key={feedback.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedFeedbacks.includes(feedback.id)
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/50"
                      }`}
                      onClick={() => handleFeedbackToggle(feedback.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedFeedbacks.includes(feedback.id)}
                          onChange={() => handleFeedbackToggle(feedback.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">
                              {feedback.customerName}
                            </h4>
                            <div className="flex items-center">
                              {Array.from({ length: feedback.rating }).map(
                                (_, i) => (
                                  <Star
                                    key={i}
                                    className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                  />
                                )
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {feedback.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {approvedFeedbacks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No approved testimonials available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  How your testimonial wall will look
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedFeedbacks.length > 0 ? (
                    approvedFeedbacks
                      .filter((feedback) =>
                        selectedFeedbacks.includes(feedback.id)
                      )
                      .map((feedback) => (
                        <div
                          key={feedback.id}
                          className="p-4 border rounded-lg bg-background"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">
                              {feedback.customerName}
                            </h4>
                            <div className="flex items-center">
                              {Array.from({ length: feedback.rating }).map(
                                (_, i) => (
                                  <Star
                                    key={i}
                                    className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                  />
                                )
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {feedback.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Select testimonials to preview
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Embed Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Embed Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Embed URL:</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded block break-all">
                    {testimonialWall.embedUrl}
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard">Cancel</Link>
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || selectedFeedbacks.length === 0}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
