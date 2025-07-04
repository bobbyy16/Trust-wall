"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Award, Heart } from "lucide-react"
import { motion } from "framer-motion"

const team = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Former VP of Marketing at TechCorp with 10+ years in customer experience.",
  },
  {
    name: "Michael Chen",
    role: "CTO",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Full-stack engineer passionate about building tools that help businesses grow.",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Design",
    image: "/placeholder.svg?height=200&width=200",
    bio: "UX designer focused on creating beautiful, user-friendly experiences.",
  },
  {
    name: "David Kim",
    role: "Head of Customer Success",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Dedicated to helping our customers succeed and grow their businesses.",
  },
]

const values = [
  {
    icon: Users,
    title: "Customer First",
    description: "Everything we do is focused on helping our customers build trust and grow their businesses.",
  },
  {
    icon: Target,
    title: "Simplicity",
    description: "We believe powerful tools should be simple to use. Complexity is the enemy of adoption.",
  },
  {
    icon: Award,
    title: "Quality",
    description: "We're committed to delivering high-quality products that our customers can rely on.",
  },
  {
    icon: Heart,
    title: "Authenticity",
    description: "Authentic testimonials build real trust. We help showcase genuine customer experiences.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6"
            >
              Building trust through
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {" "}
                authentic testimonials
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-muted-foreground mb-8"
            >
              We're on a mission to help businesses showcase authentic customer feedback and build lasting trust with
              their audience.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center gap-8 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline">Founded 2023</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">10,000+ Users</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Remote First</Badge>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="prose prose-lg mx-auto text-muted-foreground">
                <p className="text-lg leading-relaxed mb-6">
                  Trust Wall was born from a simple observation: businesses struggle to collect and showcase customer
                  testimonials effectively. Traditional methods were either too complex, too expensive, or simply didn't
                  convert well.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  Our founders, having experienced this pain firsthand while running their previous companies, decided
                  to build the solution they wished existed. A platform that makes collecting testimonials effortless
                  and displaying them beautiful.
                </p>
                <p className="text-lg leading-relaxed">
                  Today, we're proud to help thousands of businesses build trust with their customers through authentic,
                  well-designed testimonial experiences.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-32 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center border-0 bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground">The people behind Trust Wall</p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center border-0 bg-muted/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
                    />
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to join our mission?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Help us build the future of customer testimonials and social proof.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Badge variant="outline" className="text-sm px-4 py-2">
                We're hiring! Check out our careers page
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
