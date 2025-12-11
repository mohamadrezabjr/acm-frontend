"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Users, ArrowLeft, Filter, ArrowUpDown, User } from "lucide-react"
import Link from "next/link"
import { coursesData } from "@/lib/courses-data"
import { useState, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"

const ITEMS_PER_PAGE = 6

export default function CoursesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTag, setSelectedTag] = useState<string>("همه")
  const [priceFilter, setPriceFilter] = useState<string>("همه")
  const [sortBy, setSortBy] = useState<string>("startDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    coursesData.forEach((course) => {
      course.tags.forEach((tag) => tags.add(tag))
    })
    return ["همه", ...Array.from(tags)]
  }, [])

  const filteredAndSortedCourses = useMemo(() => {
    let filtered = coursesData

    if (selectedTag !== "همه") {
      filtered = filtered.filter((course) => course.tags.includes(selectedTag))
    }

    if (priceFilter === "رایگان") {
      filtered = filtered.filter((course) => course.price === 0)
    } else if (priceFilter === "پولی") {
      filtered = filtered.filter((course) => course.price > 0)
    }

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "startDate":
          comparison = a.startDate.localeCompare(b.startDate, "fa")
          break
        case "capacity":
          comparison = a.capacity - b.capacity
          break
        case "registered":
          comparison = a.registered - b.registered
          break
        case "name":
          comparison = a.name.localeCompare(b.name, "fa")
          break
        case "price":
          comparison = a.price - b.price
          break
        default:
          return 0
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return sorted
  }, [selectedTag, priceFilter, sortBy, sortOrder])

  const totalPages = Math.ceil(filteredAndSortedCourses.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentCourses = filteredAndSortedCourses.slice(startIndex, endIndex)

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag)
    setCurrentPage(1)
  }

  const handlePriceFilterChange = (filter: string) => {
    setPriceFilter(filter)
    setCurrentPage(1)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    setCurrentPage(1)
  }

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-20 px-4 pt-24">
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

          <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 flex-1">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <Select value={selectedTag} onValueChange={handleTagChange}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="فیلتر بر اساس تگ" />
                </SelectTrigger>
                <SelectContent>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm text-muted-foreground whitespace-nowrap">قیمت:</span>
              <Select value={priceFilter} onValueChange={handlePriceFilterChange}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="همه قیمت‌ها" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="همه">همه قیمت‌ها</SelectItem>
                  <SelectItem value="رایگان">رایگان</SelectItem>
                  <SelectItem value="پولی">پولی</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm text-muted-foreground whitespace-nowrap">مرتب‌سازی:</span>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="مرتب‌سازی" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="startDate">تاریخ شروع</SelectItem>
                  <SelectItem value="name">نام دوره</SelectItem>
                  <SelectItem value="capacity">ظرفیت</SelectItem>
                  <SelectItem value="registered">تعداد ثبت‌نام</SelectItem>
                  <SelectItem value="price">قیمت</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={toggleSortOrder} className="shrink-0 bg-transparent">
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{filteredAndSortedCourses.length} دوره یافت شد</span>
            <span className="text-xs">ترتیب: {sortOrder === "asc" ? "صعودی ↑" : "نزولی ↓"}</span>
          </div>

          {currentCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">دوره‌ای یافت نشد</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {currentCourses.map((course) => (
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
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                قبلی
              </Button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                بعدی
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
