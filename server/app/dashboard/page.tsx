"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, MessageSquare, Star, Users, Plus, Edit, Trash2, Copy, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Widget {
  id: string
  name: string
  embedId: string
  createdAt: string
}

interface Feedback {
  id: string
  customerName: string
  customerImage?: string
  rating: number
  message: string
  approved: boolean
  createdAt: string
  widget: {
    name: string
  }
}

interface TestimonialWall {
  id: string
  embedId: string
  embedUrl: string
  widget: {
    name: string
  }
  feedbackCount: number
  averageRating: number
  createdAt: string
}

const API_BASE_URL = "http://localhost:5000/api"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [testimonialWalls, setTestimonialWalls] = useState<TestimonialWall[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalWidgets: 0,
    totalFeedbacks: 0,
    averageRating: 0,
    approvedFeedbacks: 0,
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    fetchDashboardData()
  }, [user, router])

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  })

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch widgets
      const widgetsResponse = await fetch(`${API_BASE_URL}/widgets`, {
        headers: getAuthHeaders(),
      })
      const widgetsData = await widgetsResponse.json()

      // Fetch feedbacks
      const feedbacksResponse = await fetch(`${API_BASE_URL}/feedbacks`, {
        headers: getAuthHeaders(),
      })
      const feedbacksData = await feedbacksResponse.json()

      // Fetch testimonial walls
      const wallsResponse = await fetch(`${API_BASE_URL}/testimonial-walls`, {
        headers: getAuthHeaders(),
      })
      const wallsData = await wallsResponse.json()

      if (widgetsResponse.ok) {
        setWidgets(widgetsData.widgets || [])
      }

      if (feedbacksResponse.ok) {
        setFeedbacks(feedbacksData.feedbacks || [])
      }

      if (wallsResponse.ok) {
        setTestimonialWalls(wallsData.testimonialWalls || [])
      }

      // Calculate stats
      const totalFeedbacks = feedbacksData.feedbacks?.length || 0
      const approvedFeedbacks = feedbacksData.feedbacks?.filter((f: Feedback) => f.approved).length || 0
      const averageRating =
        totalFeedbacks > 0
          ? feedbacksData.feedbacks.reduce((sum: number, f: Feedback) => sum + f.rating, 0) / totalFeedbacks
          : 0

      setStats({
        totalWidgets: widgetsData.widgets?.length || 0,
        totalFeedbacks,
        averageRating: Math.round(averageRating * 10) / 10,
        approvedFeedbacks,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyEmbedCode = (embedId: string) => {
    const embedCode = `<iframe src="http://localhost:3000/embed/widget/${embedId}" width="100%" height="600" frameborder="0"></iframe>`
    navigator.clipboard.writeText(embedCode)
    toast({
      title: "Copied!",
      description: "Embed code copied to clipboard",
    })
  }

  const approveFeedback = async (feedbackId: string, approved: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedbacks/${feedbackId}/approval`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ approved }),
      })

      if (response.ok) {
        setFeedbacks(feedbacks.map((f) => (f.id === feedbackId ? { ...f, approved } : f)))
        toast({
          title: "Success",
          description: `Feedback ${approved ? "approved" : "rejected"}`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update feedback",
        variant: "destructive",
      })
    }
  }

  const deleteWidget = async (widgetId: string) => {
    if (!confirm("Are you sure you want to delete this widget?")) return

    try {
      const response = await fetch(`${API_BASE_URL}/widgets/${widgetId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        setWidgets(widgets.filter((w) => w.id !== widgetId))
        toast({
          title: "Success",
          description: "Widget deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete widget",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Here's what's happening with your testimonials.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Widgets</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWidgets}</div>
              <p className="text-xs text-muted-foreground">Active feedback forms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFeedbacks}</div>
              <p className="text-xs text-muted-foreground">Customer submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <p className="text-xs text-muted-foreground">Out of 5 stars</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approvedFeedbacks}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalFeedbacks > 0 ? Math.round((stats.approvedFeedbacks / stats.totalFeedbacks) * 100) : 0}%
                approval rate
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="widgets" className="space-y-6">
          <TabsList>
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonial Walls</TabsTrigger>
          </TabsList>

          <TabsContent value="widgets" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Widgets</h2>
              <Button asChild>
                <Link href="/dashboard/widgets/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Widget
                </Link>
              </Button>
            </div>

            {widgets.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No widgets yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first widget to start collecting customer feedback.
                </p>
                <Button asChild>
                  <Link href="/dashboard/widgets/new">Create Your First Widget</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {widgets.map((widget) => (
                  <Card key={widget.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {widget.name}
                        <Badge variant="secondary">Active</Badge>
                      </CardTitle>
                      <CardDescription>Created {new Date(widget.createdAt).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Embed Code:</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded block break-all">
                          {`<iframe src="http://localhost:3000/embed/widget/${widget.embedId}" width="100%" height="600" frameborder="0"></iframe>`}
                        </code>
                      </div>
                      <div className="flex items-center justify-between">
                        <Button size="sm" variant="outline" onClick={() => copyEmbedCode(widget.embedId)}>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/embed/widget/${widget.embedId}`} target="_blank">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteWidget(widget.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recent Feedback</h2>
            </div>

            {feedbacks.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No feedback yet</h3>
                <p className="text-muted-foreground">
                  Share your widget embed code to start collecting customer feedback.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {feedbacks.map((feedback) => (
                  <Card key={feedback.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{feedback.customerName}</h3>
                            <div className="flex items-center">
                              {Array.from({ length: feedback.rating }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <Badge variant={feedback.approved ? "default" : "secondary"}>
                              {feedback.approved ? "Approved" : "Pending"}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{feedback.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {feedback.widget.name} • {new Date(feedback.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          {!feedback.approved && (
                            <Button size="sm" onClick={() => approveFeedback(feedback.id, true)}>
                              Approve
                            </Button>
                          )}
                          {feedback.approved && (
                            <Button size="sm" variant="outline" onClick={() => approveFeedback(feedback.id, false)}>
                              Reject
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Testimonial Walls</h2>
              <Button asChild>
                <Link href="/dashboard/testimonials/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Wall
                </Link>
              </Button>
            </div>

            {testimonialWalls.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No testimonial walls yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first testimonial wall to showcase approved feedback.
                </p>
                <Button asChild>
                  <Link href="/dashboard/testimonials/new">Create Your First Wall</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {testimonialWalls.map((wall) => (
                  <Card key={wall.id}>
                    <CardHeader>
                      <CardTitle>{wall.widget.name} Wall</CardTitle>
                      <CardDescription>
                        {wall.feedbackCount} testimonials • {wall.averageRating} avg rating
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Embed URL:</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded block break-all">{wall.embedUrl}</code>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={wall.embedUrl} target="_blank">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Preview
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
