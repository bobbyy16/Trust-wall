"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Testimonial {
  id: string
  customerName: string
  customerImage?: string
  rating: number
  message: string
  createdAt: string
}

interface WallDesign1Props {
  testimonials: Testimonial[]
  title?: string
}

export function WallDesign1({ testimonials, title = "What our customers say" }: WallDesign1Props) {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-muted-foreground text-lg">
          Don't just take our word for it - hear from our satisfied customers
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <blockquote className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.message}"</blockquote>

              <div className="flex items-center gap-3">
                {testimonial.customerImage ? (
                  <img
                    src={testimonial.customerImage || "/placeholder.svg"}
                    alt={testimonial.customerName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">{testimonial.customerName.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-sm">{testimonial.customerName}</p>
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
  )
}
