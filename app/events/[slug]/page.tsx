"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Clock, Users, ArrowLeft, User, Loader2 } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { fetchEventBySlug, type Event } from "@/lib/api-client"

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()

  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEvent()
  }, [slug])

  const loadEvent = async () => {
    try {
      setLoading(true)
      const data = await fetchEventBySlug(slug)
      setEvent(data)
    } catch (err) {
      console.error("Failed to fetch event:", err)
      setError("رویداد یافت نشد")
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </main>
      </>
    )
  }

  if (error || !event) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 flex flex-col items-center justify-center">
          <p className="text-xl text-destructive mb-4">{error || "رویداد یافت نشد"}</p>
          <Link href="/events">
            <Button>بازگشت به رویدادها</Button>
          </Link>
        </main>
      </>
    )
  }

  const availableSeats = event.capacity - event.registered
  const isAlmostFull = availableSeats < event.capacity * 0.2

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        {/* Hero Section */}
        <div className="relative h-[400px] overflow-hidden">
          <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 right-0 left-0 p-8">
            <div className="container mx-auto max-w-4xl">
              <Link href="/events">
                <Button variant="ghost" className="mb-4 hover:bg-white/20 text-foreground">
                  <ArrowLeft className="ml-2 w-4 h-4" />
                  بازگشت به رویدادها
                </Button>
              </Link>
              <div className="flex gap-2 flex-wrap mb-4">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-primary">{event.title}</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-4xl px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
            {/* Description */}
            {event.description && event.description.length >0 && (
              <Card>
                <CardHeader>
                  <CardTitle>درباره رویداد</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-muted-foreground" style={{ whiteSpace: "pre-line" }}>{event.description}</p>
                </CardContent>
              </Card>)}
              {/* Speakers */}
              {event.speakers && event.speakers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>سخنرانان</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {event.speakers.map((speaker, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{speaker.first_name} {speaker.last_name}</h3>
                            <p className="text-sm text-primary mb-1">{speaker.position}</p>
                            <p className="text-sm text-muted-foreground">{speaker.bio}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>ثبت‌نام</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">تاریخ شروع</div>
                        <div className="font-medium">{new Date(event.start_date).toLocaleDateString("fa-IR")}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">تاریخ پایان</div>
                        <div className="font-medium">{new Date(event.end_date).toLocaleDateString("fa-IR")}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">مهلت ثبت‌نام</div>
                        <div className="font-medium">
                          {new Date(event.registration_deadline).toLocaleDateString("fa-IR")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">ساعت</div>
                        <div className="font-medium">{formatTime(event.start_date)}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">مکان</div>
                        <div className="font-medium">{event.location}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">ظرفیت</div>
                        <div className="font-medium">
                          {event.registered} / {event.capacity} نفر
                        </div>
                        {isAlmostFull && (
                          <Badge variant="destructive" className="mt-1">
                            ظرفیت محدود!
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">برگزارکننده</div>
                        <div className="font-medium">{event.organizer}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-2xl font-bold text-center mb-4">
                      {event.price === 0 ? "رایگان" : `${event.price.toLocaleString("fa-IR")} تومان`}
                    </div>
                    <Button className="w-full" size="lg">
                      ثبت‌نام در رویداد
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Share Card */}
              <Card>
                <CardHeader>
                  <CardTitle>اشتراک‌گذاری</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">این رویداد را با دوستان خود به اشتراک بگذارید</p>
                  <Button variant="outline" className="w-full bg-transparent">
                    کپی لینک
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
