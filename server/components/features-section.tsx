"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Palette, Code, Shield, BarChart3, Zap, Star, Users, Globe } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: MessageSquare,
    title: "Easy Feedback Collection",
    description:
      "Create beautiful feedback forms that your customers love to fill out. Collect ratings, reviews, and testimonials effortlessly.",
    badge: "Core Feature",
  },
  {
    icon: Palette,
    title: "Customizable Designs",
    description: "Choose from multiple testimonial wall designs or customize them to match your brand perfectly.",
    badge: "Design",
  },
  {
    icon: Code,
    title: "Easy Integration",
    description: "Embed testimonial walls anywhere with a simple code snippet. Works with any website or platform.",
    badge: "Developer",
  },
  {
    icon: Shield,
    title: "Moderation Tools",
    description: "Review and approve testimonials before they go live. Maintain quality and brand reputation.",
    badge: "Security",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track performance, conversion rates, and customer satisfaction with detailed analytics.",
    badge: "Analytics",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Testimonials update in real-time across all your embedded widgets automatically.",
    badge: "Performance",
  },
  {
    icon: Star,
    title: "Rating System",
    description: "Collect star ratings alongside written testimonials for better social proof.",
    badge: "Engagement",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work with your team to manage testimonials and feedback efficiently.",
    badge: "Collaboration",
  },
  {
    icon: Globe,
    title: "Global CDN",
    description: "Fast loading testimonials worldwide with our global content delivery network.",
    badge: "Performance",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4"
          >
            Everything you need to build trust
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground"
          >
            Powerful features to collect, manage, and showcase customer testimonials that drive conversions.
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 bg-muted/20 backdrop-blur-sm hover:bg-muted/30 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
