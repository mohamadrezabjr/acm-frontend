"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Users, ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import { coursesData } from "@/lib/courses-data"

export default function CoursesPage() {
  return (
    <main className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="ml-2 w-4 h-4" />
              بازگشت به صفحه اصلی
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">دوره‌های آموزشی</h1>
          <p className="text-xl text-muted-foreground">دوره‌های جامع و حرفه‌ای انجمن ACM</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesData.map((course) => (
            <Card key={course.id} className="overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant={course.price === 0 ? "default" : "secondary"} className="font-bold">
                    {course.price === 0 ? "رایگان" : `${course.price.toLocaleString("fa-IR")} تومان`}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex gap-2 flex-wrap mb-2">
                  {course.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-xl">{course.name}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>شروع: {new Date(course.startDate).toLocaleDateString("fa-IR")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{course.schedule}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{course.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>
                    {course.registered} / {course.capacity} نفر
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{course.instructors.length} استاد</span>
                </div>
                <Link href={`/courses/${course.id}`}>
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    مشاهده جزئیات
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
