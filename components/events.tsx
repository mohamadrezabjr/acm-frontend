import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { eventsData } from "@/lib/events-data"

export function Events() {
  const events = eventsData.slice(0, 3)

  return (
    <section id="events" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">رویدادهای آینده</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            در کارگاه‌ها، هاکاتون‌ها و فرصت‌های شبکه‌سازی شرکت کنید
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{event.name}</CardTitle>
                <CardDescription className="line-clamp-2">{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.startDate).toLocaleDateString("fa-IR")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <Link href={`/events/${event.id}`}>
                  <Button variant="outline" className="w-full group/btn bg-transparent">
                    مشاهده جزئیات
                    <ArrowRight className="mr-2 w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
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
