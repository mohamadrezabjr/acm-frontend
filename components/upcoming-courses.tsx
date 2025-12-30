"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, ArrowRight, Users, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { apiClient, type Person, type Course } from "@/lib/api-client"


export function UpcomingCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiClient.get("/courses/")
        const allCourses = response.data.results || response.data

        // فیلتر دوره‌های آینده (که هنوز شروع نشده‌اند)
        const upcomingCourses = allCourses
          .filter((course: Course) => new Date(course.start_date) > new Date())
          .sort((a: Course, b: Course) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
          .slice(0, 3)

        setCourses(upcomingCourses)
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-muted-foreground">در حال بارگذاری...</p>
          </div>
        </div>
      </section>
    )
  }

  if (courses.length === 0) {
    return null
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">دوره‌های آموزشی آینده</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            در دوره‌های آموزشی تخصصی شرکت کنید و مهارت‌های جدید کسب کنید
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {courses.map((course) => {
            const isFull = course.is_full
            const isDeadlinePassed = new Date(course.registration_deadline) < new Date()
            const isRegistrationClosed = isFull || isDeadlinePassed

            return (
              <Card key={course.slug} className="overflow-hidden group hover:shadow-xl transition-shadow">
                <div className="relative aspect-[1/1.414] overflow-hidden bg-muted">
                  <img
                    src={course.image || "/placeholder.svg?height=200&width=400"}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {course.price === 0 ? (
                    <Badge className="absolute top-2 left-2 bg-green-500">رایگان</Badge>
                  ) : (
                    <Badge className="absolute top-2 left-2 bg-blue-500">
                      {course.price.toLocaleString("fa-IR")} تومان
                    </Badge>
                  )}
                  {isRegistrationClosed && (
                    <Badge className="absolute top-2 right-2 bg-red-500">
                      {isFull ? "ظرفیت تکمیل است" : "مهلت ثبت‌نام تمام شده"}
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(course.start_date).toLocaleDateString("fa-IR")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="w-4 h-4" />
                    <span>{course.instructors.map((i) => `${i.first_name} ${i.last_name}`).join("، ")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{course.location}</span>
                  </div>
                  <Link href={`/courses/${course.slug}`}>
                    <Button variant="outline" className="w-full group/btn bg-transparent">
                      مشاهده جزئیات
                      <ArrowRight className="mr-2 w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <Link href="/courses">
            <Button size="lg" variant="outline">
              مشاهده همه دوره‌ها
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
