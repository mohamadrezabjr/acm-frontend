import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Clock, Users, ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import { getCourseById, getAllCourseIds } from "@/lib/courses-data"

export function generateStaticParams() {
  return getAllCourseIds().map((id) => ({
    id: id,
  }))
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const course = getCourseById(id)

  if (!course) {
    notFound()
  }

  const availableSeats = course.capacity - course.registered
  const isAlmostFull = availableSeats < course.capacity * 0.2

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img src={course.image || "/placeholder.svg"} alt={course.name} className="w-full h-full object-cover" />
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{course.name}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>درباره دوره</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed text-muted-foreground">{course.description}</p>
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
                          <h3 className="font-semibold text-lg">{instructor.name}</h3>
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
                      <div className="font-medium">{new Date(course.startDate).toLocaleDateString("fa-IR")}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-muted-foreground">مهلت ثبت‌نام</div>
                      <div className="font-medium">
                        {new Date(course.registrationDeadline).toLocaleDateString("fa-IR")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-muted-foreground">برنامه زمانی</div>
                      <div className="font-medium">{course.schedule}</div>
                    </div>
                  </div>
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
                      <div className="font-medium">{course.organizer}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-2xl font-bold text-center mb-4">
                    {course.price === 0 ? "رایگان" : `${course.price.toLocaleString("fa-IR")} تومان`}
                  </div>
                  <Button className="w-full" size="lg">
                    ثبت‌نام در دوره
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
  )
}
