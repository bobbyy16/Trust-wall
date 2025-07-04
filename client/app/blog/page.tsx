"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight, User } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const blogPosts = [
  {
    id: "1",
    title: "The Psychology of Social Proof: Why Testimonials Work",
    excerpt:
      "Discover the science behind why customer testimonials are so effective at building trust and driving conversions.",
    author: "Sarah Johnson",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Psychology",
    image: "/placeholder.svg?height=200&width=400",
    featured: true,
  },
  {
    id: "2",
    title: "10 Best Practices for Collecting Customer Testimonials",
    excerpt: "Learn proven strategies to gather authentic, compelling testimonials that showcase your business value.",
    author: "Michael Chen",
    date: "2024-01-10",
    readTime: "7 min read",
    category: "Strategy",
    image: "/placeholder.svg?height=200&width=400",
    featured: false,
  },
  {
    id: "3",
    title: "How to Design Testimonial Walls That Convert",
    excerpt:
      "Design principles and best practices for creating testimonial displays that turn visitors into customers.",
    author: "Emily Rodriguez",
    date: "2024-01-05",
    readTime: "6 min read",
    category: "Design",
    image: "/placeholder.svg?height=200&width=400",
    featured: false,
  },
  {
    id: "4",
    title: "The ROI of Customer Testimonials: A Data-Driven Analysis",
    excerpt: "Explore real data showing how testimonials impact conversion rates, customer acquisition, and revenue.",
    author: "David Kim",
    date: "2023-12-28",
    readTime: "8 min read",
    category: "Analytics",
    image: "/placeholder.svg?height=200&width=400",
    featured: false,
  },
  {
    id: "5",
    title: "Building Trust in the Digital Age",
    excerpt: "How modern businesses can establish credibility and trust with online customers through social proof.",
    author: "Sarah Johnson",
    date: "2023-12-20",
    readTime: "4 min read",
    category: "Business",
    image: "/placeholder.svg?height=200&width=400",
    featured: false,
  },
  {
    id: "6",
    title: "Video Testimonials vs. Written Reviews: Which Performs Better?",
    excerpt: "A comprehensive comparison of different testimonial formats and their impact on customer behavior.",
    author: "Michael Chen",
    date: "2023-12-15",
    readTime: "6 min read",
    category: "Research",
    image: "/placeholder.svg?height=200&width=400",
    featured: false,
  },
]

const categories = ["All", "Psychology", "Strategy", "Design", "Analytics", "Business", "Research"]

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

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
              Trust Wall
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> Blog</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Insights, tips, and strategies for building trust through customer testimonials and social proof.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <Badge className="mb-4">Featured Post</Badge>
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img
                      src={featuredPost.image || "/placeholder.svg"}
                      alt={featuredPost.title}
                      className="h-64 w-full object-cover md:h-full"
                    />
                  </div>
                  <div className="md:w-1/2">
                    <CardContent className="p-8">
                      <div className="mb-4">
                        <Badge variant="secondary">{featuredPost.category}</Badge>
                      </div>
                      <CardTitle className="text-2xl mb-4">{featuredPost.title}</CardTitle>
                      <CardDescription className="text-base mb-6 leading-relaxed">
                        {featuredPost.excerpt}
                      </CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {featuredPost.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(featuredPost.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {featuredPost.readTime}
                        </div>
                      </div>
                      <Button asChild>
                        <Link href={`/blog/${featuredPost.id}`}>
                          Read Article
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{new Date(post.date).toLocaleDateString()}</span>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/blog/${post.id}`}>
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get the latest insights on customer testimonials and social proof delivered to your inbox.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md border border-input bg-background"
              />
              <Button>Subscribe</Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
