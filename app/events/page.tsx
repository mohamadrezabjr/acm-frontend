"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, ArrowLeft, Filter, ArrowUpDown, User, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useMemo, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { fetchEvents, type Event } from "@/lib/api-client"

const ITEMS_PER_PAGE = 6

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTag, setSelectedTag] = useState<string>("همه")
  const [priceFilter, setPriceFilter] = useState<string>("همه")
  const [sortBy, setSortBy] = useState<string>("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const data = await fetchEvents()
      setEvents(data)
    } catch (err) {
      console.error("Failed to fetch events:", err)
      setError("خطا در بارگذاری رویدادها")
    } finally {
      setLoading(false)
    }
  }

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    events.forEach((event) => {
      event.tags.forEach((tag) => tags.add(tag))
    })
    return ["همه", ...Array.from(tags)]
  }, [events])

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events

    if (selectedTag !== "همه") {
      filtered = filtered.filter((event) => event.tags.includes(selectedTag))
    }

    if (priceFilter === "رایگان") {
      filtered = filtered.filter((event) => event.price === 0)
    } else if (priceFilter === "پولی") {
      filtered = filtered.filter((event) => event.price > 0)
    }

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
          break
        case "title":
          comparison = a.title.localeCompare(b.title, "fa")
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
  }, [events, selectedTag, priceFilter, sortBy, sortOrder])

  const totalPages = Math.ceil(filteredAndSortedEvents.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentEvents = filteredAndSortedEvents.slice(startIndex, endIndex)

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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
  }

  const getRegistrationStatus = (event: Event) => {
    const now = new Date()
    const deadline = new Date(event.registration_deadline)
    const isFull = event.is_full
    const isExpired = now > deadline

    if (isFull) return { status: "full", text: "ظرفیت تکمیل است" }
    if (isExpired) return { status: "expired", text: "مهلت ثبت‌نام تمام شده" }
    return { status: "open", text: "ثبت‌نام فعال" }
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">همه رویدادها</h1>
            <p className="text-xl text-muted-foreground">لیست کامل رویدادها، کارگاه‌ها و هاکاتون‌های انجمن ACM</p>
          </div>

          {/* Filters */}
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
                  <SelectItem value="date">تاریخ</SelectItem>
                  <SelectItem value="title">عنوان</SelectItem>
                  <SelectItem value="price">قیمت</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={toggleSortOrder} className="shrink-0 bg-transparent">
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
            <span>{filteredAndSortedEvents.length} رویداد یافت شد</span>
            <span className="text-xs">ترتیب: {sortOrder === "asc" ? "صعودی ↑" : "نزولی ↓"}</span>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-xl text-destructive">{error}</p>
              <Button onClick={loadEvents} className="mt-4">
                تلاش مجدد
              </Button>
            </div>
          ) : currentEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">رویدادی یافت نشد</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentEvents.map((event) => {
                const regStatus = getRegistrationStatus(event)

                return (
                  <Card key={event.slug} className="overflow-hidden group hover:shadow-xl transition-shadow">
                    {/* Image Section */}
                    <div className="relative aspect-[1/1.414] overflow-hidden bg-muted">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Price Badge */}
                      <div className="absolute top-2 left-2 z-10">
                        <Badge variant={event.price === 0 ? "default" : "secondary"} className="font-bold">
                          {event.price === 0 ? "رایگان" : `${event.price.toLocaleString("fa-IR")} تومان`}
                        </Badge>
                      </div>

                      {/* Registration Status */}
                      {regStatus.status !== "open" && (
                        <div className="absolute top-2 right-2 z-10">
                          <Badge variant="destructive" className="font-bold">
                            {regStatus.text}
                          </Badge>
                        </div>
                      )}

                      {/* Bottom Fade */}
                      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

                      {/* Tags inside image */}
                      <div className="absolute bottom-4 right-4 flex gap-2 flex-wrap z-10">
                        {event.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="
                              backdrop-blur-sm
                              bg-secondary/80
                              text-secondary-foreground
                              border border-secondary/30
                            "
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <CardHeader className="pt-2">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                    </CardHeader>

                    {/* Details */}
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.start_date).toLocaleDateString("fa-IR")}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(event.start_date)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{event.organizer}</span>
                      </div>

                      <Link href={`/events/${event.slug}`}>
                        <Button
                          variant="outline"
                          className="w-full mt-4 bg-transparent"
                          disabled={regStatus.status !== "open"}
                        >
                          مشاهده جزئیات
                        </Button>
                      </Link>

                      {/* Share Button */}
                      <Button
                        variant="outline"
                        className="w-full mt-4 bg-transparent"
                        onClick={() => console.log("Share event")}
                      >
                        به اشتراک بگذارید
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
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
