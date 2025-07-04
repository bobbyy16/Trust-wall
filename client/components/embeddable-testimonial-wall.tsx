"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  customerName: string;
  customerImage?: string;
  rating: number;
  message: string;
  createdAt: string;
}

interface TestimonialWall {
  widget: {
    name: string;
  };
  feedbacks: Testimonial[];
  totalFeedbacks: number;
  averageRating: number;
}

interface EmbeddableTestimonialWallProps {
  embedId: string;
  design?: "1" | "2" | "3";
  maxItems?: number;
  showTitle?: boolean;
  customTitle?: string;
}

export function EmbeddableTestimonialWall({
  embedId,
  design = "1",
  maxItems = 6,
  showTitle = true,
  customTitle,
}: EmbeddableTestimonialWallProps) {
  const [testimonialWall, setTestimonialWall] =
    useState<TestimonialWall | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTestimonialWall();
  }, [embedId]);

  const fetchTestimonialWall = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/testimonial-walls/embed/${embedId}`
      );
      if (response.ok) {
        const data = await response.json();
        setTestimonialWall(data.testimonialWall);
      } else {
        setError("Testimonial wall not found");
      }
    } catch (error) {
      console.error("Error fetching testimonial wall:", error);
      setError("Failed to load testimonial wall");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !testimonialWall) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        {error || "Testimonial wall not found"}
      </div>
    );
  }

  const displayedTestimonials = testimonialWall.feedbacks.slice(0, maxItems);
  const title = customTitle || `${testimonialWall.widget.name} Reviews`;

  return (
    <div className="w-full">
      {showTitle && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{testimonialWall.averageRating.toFixed(1)}</span>
            </div>
            <span>•</span>
            <span>{testimonialWall.totalFeedbacks} reviews</span>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayedTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="h-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <blockquote className="text-sm text-muted-foreground mb-4 leading-relaxed">
                "{testimonial.message}"
              </blockquote>

              <div className="flex items-center gap-3">
                {testimonial.customerImage ? (
                  <img
                    src={testimonial.customerImage || "/placeholder.svg"}
                    alt={testimonial.customerName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">
                      {testimonial.customerName.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">
                    {testimonial.customerName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
