"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { WallDesign1 } from "@/components/testimonial-walls/wall-design-1";

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

export default function EmbedTestimonialPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const embedId = params.embedId as string;
  const design = searchParams.get("design") || "1";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !testimonialWall) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          {error || "Testimonial wall not found"}
        </p>
      </div>
    );
  }

  const renderWall = () => {
    const title = `${testimonialWall.widget.name} Reviews`;
    return (
      <WallDesign1
        testimonials={testimonialWall.feedbacks}
        title={searchParams.get("showTitle") !== "false" ? title : undefined}
      />
    );
  };

  return <div className="min-h-screen bg-background">{renderWall()}</div>;
}
