"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { apiClient, type Event } from "@/lib/api-client"

export function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiClient.get("/events/")
        const allEvents = response.data.results || response.data

        // فیلتر رویدادهای آینده (که هنوز شروع نشده‌اند)
        const upcomingEvents = allEvents
          .filter((event: Event) => new Date(event.start_date) > new Date())
          .sort((a: Event, b: Event) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
          .slice(0, 3)

        setEvents(upcomingEvents)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-muted-foreground">در حال بارگذاری...</p>
          </div>
        </div>
      </section>
    )
  }

  if (events.length === 0) {
    return null
  }

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">رویدادهای آینده</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            در کارگاه‌ها، هاکاتون‌ها و فرصت‌های شبکه‌سازی شرکت کنید
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {events.map((event) => {
            const isFull = event.is_full
            const isDeadlinePassed = new Date(event.registration_deadline) < new Date()
            const isRegistrationClosed = isFull || isDeadlinePassed

            return (
              <Card
                key={event.slug}
                className="overflow-hidden group hover:shadow-xl transition-shadow p-0 flex flex-col"
              >
                <div className="relative aspect-[1/1.414] overflow-hidden bg-muted">
                  <img
                    src={event.image || "/placeholder.svg?height=200&width=400"}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {event.price === 0 ? (
                    <Badge className="absolute top-2 left-2 bg-green-500">رایگان</Badge>
                  ) : (
                    <Badge className="absolute top-2 left-2 bg-blue-500">
                      {event.price.toLocaleString("fa-IR")} تومان
                    </Badge>
                  )}
                  {isRegistrationClosed && (
                    <Badge className="absolute top-2 right-2 bg-red-500">
                      {isFull ? "ظرفیت تکمیل است" : "مهلت ثبت‌نام تمام شده"}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2 text-right">{event.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 text-right">{event.description}</p>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.start_date).toLocaleDateString("fa-IR")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <Link href={`/events/${event.slug}`} className="mt-auto">
                    <Button variant="outline" className="w-full group/btn bg-transparent">
                      مشاهده جزئیات
                      <ArrowRight className="mr-2 w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <Link href="/events">
            <Button size="lg" variant="outline">
              مشاهده همه رویدادها
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
