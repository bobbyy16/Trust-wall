"use client";

import { useParams, useSearchParams } from "next/navigation";
import { EmbeddableTestimonialWall } from "@/components/embeddable-testimonial-wall";

export default function EmbedWallPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const embedId = params.embedId as string;

  const design = (searchParams.get("design") as "1" | "2" | "3") || "1";
  const maxItems = Number.parseInt(searchParams.get("maxItems") || "6");
  const showTitle = searchParams.get("showTitle") !== "false";
  const customTitle = searchParams.get("title") || undefined;

  return (
    <div className="min-h-screen bg-background p-4">
      <EmbeddableTestimonialWall
        embedId={embedId}
        design={design}
        maxItems={maxItems}
        showTitle={showTitle}
        customTitle={customTitle}
      />
    </div>
  );
}
