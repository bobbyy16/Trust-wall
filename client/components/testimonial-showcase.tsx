"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechCorp",
    image: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "Trust Wall transformed how we collect and display customer feedback. Our conversion rate increased by 40% after implementing their testimonial widgets.",
  },
  {
    name: "Michael Chen",
    role: "Founder",
    company: "StartupXYZ",
    image: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "The customization options are incredible. We were able to match our brand perfectly and the integration was seamless.",
  },
  {
    name: "Emily Rodriguez",
    role: "E-commerce Manager",
    company: "ShopPlus",
    image: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "Customer trust is everything in e-commerce. Trust Wall helps us showcase authentic reviews that actually convert visitors into buyers.",
  },
];

export function TestimonialShowcase() {
  return (
    <section id="demo" className="py-20 lg:py-32 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4"
          >
            Loved by thousands of businesses
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground"
          >
            See how companies like yours are using Trust Wall to build
            credibility and drive growth.
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-background/50 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Badge variant="outline" className="text-sm px-4 py-2">
            Join 10,000+ satisfied customers
          </Badge>
        </motion.div>
      </div>
    </section>
  );
}
