"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Clock, Users, ArrowLeft, User, Loader2 } from "lucide-react"
import Link from "next/link"
import { fetchCourseBySlug, type Course, WeekdayFa } from "@/lib/api-client"

import { Header } from "@/components/header"

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCourse()
  }, [slug])

  const loadCourse = async () => {
    try {
      setLoading(true)
      const data = await fetchCourseBySlug(slug)
      setCourse(data)
    } catch (err) {
      console.error("Failed to fetch event:", err)
      setError("رویداد یافت نشد")
    } finally {
      setLoading(false)
    }
  }

  const getRegistrationStatus = () => {
    if (!course) return { canRegister: false, message: "" }

    const now = new Date()
    const deadline = new Date(course.registration_deadline)
    const isFull = course.registered >= course.capacity
    const isExpired = now > deadline

    if (isFull) return { canRegister: false, message: "ظرفیت تکمیل است" }
    if (isExpired) return { canRegister: false, message: "مهلت ثبت‌نام تمام شده" }
    return { canRegister: true, message: "" }
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

  if (error || !course) {
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
  const availableSeats = course.capacity - course.registered
  const isAlmostFull = availableSeats < course.capacity * 0.2
  const isFull = availableSeats <= 0
  const registrationStatus = getRegistrationStatus()

  const formatJustTime = (time: string) => toPersianNumber(time.slice(0, 5))
  const toPersianNumber = (value: string | number) =>
    value.toString().replace(/\d/g, (d) => (+d).toLocaleString("fa-IR"))

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        {/* Hero Section */}
        <div className="relative h-[400px] overflow-hidden">
          <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 right-0 left-0 p-8">
            <div className="container mx-auto max-w-4xl">
              <Link href="/courses">
                <Button variant="ghost" className="mb-4 text-white hover:bg-white/20">
                  <ArrowLeft className="ml-2 w-4 h-4" />
                  بازگشت به دوره‌ها
                </Button>
              </Link>
              <div className="flex gap-2 flex-wrap mb-4">
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">{course.title}</h1>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>درباره دوره</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-muted-foreground" style={{ whiteSpace: "pre-line" }}>{course.description}</p>
                </CardContent>
              </Card>

              {/* Instructors */}
              {course.instructors && course.instructors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>اساتید دوره</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {course.instructors.map((instructor, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{instructor.first_name} {instructor.last_name}</h3>
                            <p className="text-sm text-primary mb-1">{instructor.position}</p>
                            <p className="text-sm text-muted-foreground">{instructor.bio}</p>
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
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>ثبت‌نام</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">تاریخ شروع</div>
                        <div className="font-medium">{new Date(course.start_date).toLocaleDateString("fa-IR")}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">تاریخ پایان</div>
                        <div className="font-medium">{new Date(course.end_date).toLocaleDateString("fa-IR")}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">مهلت ثبت‌نام</div>
                        <div className="font-medium">
                          {new Date(course.registration_deadline).toLocaleDateString("fa-IR")}
                        </div>
                      </div>
                    </div>
                    {course.time_plans && course.time_plans.length > 0 && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-muted-foreground">برنامه زمانی</div>

                          {course.time_plans.map((time_plan, index) => (
                            <div key={`${time_plan.weekday}-${time_plan.time_start}`} className="font-medium">
                              {WeekdayFa[time_plan.weekday as keyof typeof WeekdayFa]} ,{" "}
                              {formatJustTime(time_plan.time_start)} - {formatJustTime(time_plan.time_end)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">مکان</div>
                        <div className="font-medium">{course.location}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">ظرفیت</div>
                        <div className="font-medium">
                          {course.registered} / {course.capacity} نفر
                        </div>
                        {isAlmostFull && !isFull && registrationStatus.canRegister && (
                          <Badge variant="destructive" className="mt-1">
                            ظرفیت محدود!
                          </Badge>
                        )}
                        {!registrationStatus.canRegister && isFull && (
                          <Badge variant="destructive" className="mt-1">
                            ظرفیت تکمیل است
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">برگزارکننده</div>
                        <div className="font-medium">{course.organizer}</div>
                      </div>
                    </div>
                  </div>
                  {registrationStatus.canRegister ? (
                    <div className="pt-4 border-t">
                      <div className="text-2xl font-bold text-center mb-4">
                        {course.price === 0 ? "رایگان" : `${course.price.toLocaleString("fa-IR")} تومان`}
                      </div>
                      <Button className="w-full" size="lg">
                        ثبت‌نام در دوره
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-4 border-t">
                      <Button className="w-full" size="lg" variant="destructive" disabled>
                        {registrationStatus.message}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Share Card */}
              <Card>
                <CardHeader>
                  <CardTitle>اشتراک‌گذاری</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">این دوره را با دوستان خود به اشتراک بگذارید</p>
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
