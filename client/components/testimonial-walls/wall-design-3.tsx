"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

interface Testimonial {
  id: string
  customerName: string
  customerImage?: string
  rating: number
  message: string
  createdAt: string
}

interface WallDesign3Props {
  testimonials: Testimonial[]
  title?: string
}

export function WallDesign3({ testimonials, title = "Testimonials" }: WallDesign3Props) {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <Quote className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <div className="w-24 h-1 bg-primary mx-auto mb-4" />
        <p className="text-muted-foreground text-lg">Authentic feedback from our valued customers</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {testimonials.map((testimonial, index) => (
          <Card key={testimonial.id} className={`relative overflow-hidden ${index === 0 ? "lg:col-span-2" : ""}`}>
            <div className="absolute top-4 right-4 opacity-10">
              <Quote className="h-12 w-12 text-primary" />
            </div>

            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <blockquote
                className={`text-muted-foreground leading-relaxed mb-8 ${index === 0 ? "text-xl" : "text-lg"}`}
              >
                "{testimonial.message}"
              </blockquote>

              <div className="flex items-center gap-4">
                {testimonial.customerImage ? (
                  <img
                    src={testimonial.customerImage || "/placeholder.svg"}
                    alt={testimonial.customerName}
                    className="h-14 w-14 rounded-full object-cover border-2 border-primary/20"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold">
                    {testimonial.customerName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-lg">{testimonial.customerName}</p>
                  <p className="text-muted-foreground">
                    {new Date(testimonial.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
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
