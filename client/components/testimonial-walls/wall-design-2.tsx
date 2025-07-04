"use client"

import { Star } from "lucide-react"

interface Testimonial {
  id: string
  customerName: string
  customerImage?: string
  rating: number
  message: string
  createdAt: string
}

interface WallDesign2Props {
  testimonials: Testimonial[]
  title?: string
}

export function WallDesign2({ testimonials, title = "Customer Stories" }: WallDesign2Props) {
  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
          Real experiences from real customers who love what we do
        </p>
      </div>

      <div className="space-y-8">
        {testimonials.map((testimonial, index) => (
          <div key={testimonial.id} className={`flex items-center gap-8 ${index % 2 === 1 ? "flex-row-reverse" : ""}`}>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <blockquote className="text-lg leading-relaxed text-muted-foreground">"{testimonial.message}"</blockquote>

              <div className="flex items-center gap-4">
                {testimonial.customerImage ? (
                  <img
                    src={testimonial.customerImage || "/placeholder.svg"}
                    alt={testimonial.customerName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">{testimonial.customerName.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <p className="font-semibold">{testimonial.customerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-px h-32 bg-border hidden lg:block" />

            <div className="flex-1 flex justify-center">
              <div className="w-64 h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                <Star className="h-16 w-16 text-primary/20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
