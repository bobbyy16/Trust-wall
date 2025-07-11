"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface Widget {
  id: string;
  name: string;
  embedId: string;
}

interface Feedback {
  id: string;
  customerName: string;
  customerImage?: string;
  rating: number;
  message: string;
  createdAt: string;
}

export default function NewTestimonialWallPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedFeedbacks, setSelectedFeedbacks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchWidgets();
    }
  }, [user]);

  useEffect(() => {
    if (selectedWidget) {
      fetchApprovedFeedbacks(selectedWidget);
    }
  }, [selectedWidget]);

  const fetchWidgets = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/widgets", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWidgets(data.widgets || []);
      }
    } catch (error) {
      console.error("Error fetching widgets:", error);
    }
  };

  const fetchApprovedFeedbacks = async (widgetId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/testimonial-walls/approved-feedbacks/${widgetId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data.feedbacks || []);
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const handleFeedbackToggle = (feedbackId: string) => {
    setSelectedFeedbacks((prev) =>
      prev.includes(feedbackId)
        ? prev.filter((id) => id !== feedbackId)
        : [...prev, feedbackId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedWidget) {
      setError("Please select a widget");
      return;
    }

    if (selectedFeedbacks.length === 0) {
      setError("Please select at least one feedback");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/testimonial-walls",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            widgetId: selectedWidget,
            feedbackIds: selectedFeedbacks,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Testimonial wall created successfully",
        });
        router.push("/dashboard");
      } else {
        setError(data.message || "Failed to create testimonial wall");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Create Testimonial Wall</h1>
          <p className="text-muted-foreground">
            Select approved feedbacks to display in your testimonial wall
          </p>
        </div>

        <div className="max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Select Widget</CardTitle>
                <CardDescription>
                  Choose which widget's feedbacks to display
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="widget">Widget</Label>
                  <Select
                    value={selectedWidget}
                    onValueChange={setSelectedWidget}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a widget" />
                    </SelectTrigger>
                    <SelectContent>
                      {widgets.map((widget) => (
                        <SelectItem key={widget.id} value={widget.id}>
                          {widget.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {selectedWidget && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Feedbacks</CardTitle>
                  <CardDescription>
                    Choose which approved feedbacks to include in your
                    testimonial wall
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {feedbacks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No approved feedbacks found for this widget.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {feedbacks.map((feedback) => (
                        <div
                          key={feedback.id}
                          className="flex items-start space-x-3 p-4 border rounded-lg"
                        >
                          <Checkbox
                            id={feedback.id}
                            checked={selectedFeedbacks.includes(feedback.id)}
                            onCheckedChange={() =>
                              handleFeedbackToggle(feedback.id)
                            }
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold">
                                {feedback.customerName}
                              </h4>
                              <div className="flex items-center">
                                {Array.from({ length: feedback.rating }).map(
                                  (_, i) => (
                                    <Star
                                      key={i}
                                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                    />
                                  )
                                )}
                              </div>
                            </div>
                            <p className="text-muted-foreground">
                              {feedback.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(
                                feedback.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={
                  isLoading || !selectedWidget || selectedFeedbacks.length === 0
                }
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Testimonial Wall
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
