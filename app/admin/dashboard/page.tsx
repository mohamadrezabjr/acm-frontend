"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Award, LogOut, Plus, BookOpen, Users, TrendingUp, Settings, FileText } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { apiRequest } from "@/lib/api-client"
import { Loader2 } from "lucide-react"

interface DashboardStats {
  total_users: number
  total_events: number
  total_courses: number
  total_registrations: number
  recent_events: Array<{
    id: number
    title: string
    slug: string
    registered: number
    capacity: number
    start_date: string
  }>
  recent_courses: Array<{
    id: number
    title: string
    slug: string
    registered: number
    capacity: number
    start_date: string
  }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading, isCreator, logout } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push("/auth/login")
      return
    }

    if (!isCreator()) {
      router.push("/")
      return
    }
  }, [user, loading, isCreator, router])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiRequest("/admin/dashboard-stats/")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setLoadingStats(false)
      }
    }

    if (user && isCreator()) {
      fetchStats()
    }
  }, [user, isCreator])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">پنل مدیریت ACM</h1>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-muted-foreground">خوش آمدید، </span>
                <span className="font-semibold">{user.firstName}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="ml-2 h-4 w-4" />
                خروج
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Statistics Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">آمار کلی</h2>
            {loadingStats ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">کاربران</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
                    <p className="text-xs text-muted-foreground">کل کاربران ثبت‌نام شده</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">رویدادها</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.total_events || 0}</div>
                    <p className="text-xs text-muted-foreground">رویدادهای ایجاد شده</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">دوره‌ها</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.total_courses || 0}</div>
                    <p className="text-xs text-muted-foreground">دوره‌های آموزشی</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ثبت‌نام‌ها</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.total_registrations || 0}</div>
                    <p className="text-xs text-muted-foreground">کل ثبت‌نام‌های انجام شده</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Management Cards */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">مدیریت</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Event Management */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>مدیریت رویدادها</CardTitle>
                      <CardDescription>ایجاد و مدیریت رویدادهای انجمن</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/admin/events/create">
                    <Button className="w-full">
                      <Plus className="ml-2 h-4 w-4" />
                      ایجاد رویداد جدید
                    </Button>
                  </Link>
                  <Link href="/admin/events">
                    <Button variant="outline" className="w-full bg-transparent">
                      مدیریت رویدادها
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Courses Management */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <BookOpen className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle>مدیریت دوره‌ها</CardTitle>
                      <CardDescription>ایجاد و مدیریت دوره‌های آموزشی</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/admin/courses/create">
                    <Button className="w-full" variant="default">
                      <Plus className="ml-2 h-4 w-4" />
                      ایجاد دوره جدید
                    </Button>
                  </Link>
                  <Link href="/admin/courses">
                    <Button variant="outline" className="w-full bg-transparent">
                      مدیریت دوره‌ها
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Registration Management */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <CardTitle>مدیریت ثبت‌نام‌ها</CardTitle>
                      <CardDescription>مشاهده و مدیریت ثبت‌نام کاربران</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/admin/registrations/events">
                    <Button className="w-full" variant="default">
                      ثبت‌نام‌های رویدادها
                    </Button>
                  </Link>
                  <Link href="/admin/registrations/courses">
                    <Button variant="outline" className="w-full bg-transparent">
                      ثبت‌نام‌های دوره‌ها
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Certificate Management */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary/10 rounded-lg">
                      <Award className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <CardTitle>مدیریت مدارک</CardTitle>
                      <CardDescription>ایجاد و صدور گواهی‌نامه‌ها</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/admin/certificates/create">
                    <Button className="w-full" variant="secondary">
                      <Plus className="ml-2 h-4 w-4" />
                      ایجاد مدرک جدید
                    </Button>
                  </Link>
                  <Link href="/admin/certificates">
                    <Button variant="outline" className="w-full bg-transparent">
                      مدیریت مدارک
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* User Management */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <Users className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <CardTitle>مدیریت کاربران</CardTitle>
                      <CardDescription>مشاهده و مدیریت کاربران</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/admin/users">
                    <Button className="w-full" variant="default">
                      مدیریت کاربران
                    </Button>
                  </Link>
                  <Link href="/admin/users/roles">
                    <Button variant="outline" className="w-full bg-transparent">
                      مدیریت نقش‌ها
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500/10 rounded-lg">
                      <Settings className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <CardTitle>تنظیمات</CardTitle>
                      <CardDescription>تنظیمات سیستم و پیکربندی</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/admin/settings">
                    <Button className="w-full" variant="default">
                      تنظیمات عمومی
                    </Button>
                  </Link>
                  <Link href="/admin/settings/tags">
                    <Button variant="outline" className="w-full bg-transparent">
                      مدیریت تگ‌ها
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Events */}
            <Card>
              <CardHeader>
                <CardTitle>رویدادهای اخیر</CardTitle>
                <CardDescription>آخرین رویدادهای ایجاد شده</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                ) : stats?.recent_events && stats.recent_events.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recent_events.map((event) => (
                      <Link
                        key={event.slug}
                        href={`/admin/events/${event.slug}`}
                        className="block p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(event.start_date).toLocaleDateString("fa-IR")}
                            </p>
                          </div>
                          <div className="text-left">
                            <p className="text-xs text-muted-foreground">ثبت‌نام</p>
                            <p className="text-sm font-semibold">
                              {event.registered}/{event.capacity}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    رویدادی ثبت نشده است
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Courses */}
            <Card>
              <CardHeader>
                <CardTitle>دوره‌های اخیر</CardTitle>
                <CardDescription>آخرین دوره‌های ایجاد شده</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingStats ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                ) : stats?.recent_courses && stats.recent_courses.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recent_courses.map((course) => (
                      <Link
                        key={course.slug}
                        href={`/admin/courses/${course.slug}`}
                        className="block p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{course.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(course.start_date).toLocaleDateString("fa-IR")}
                            </p>
                          </div>
                          <div className="text-left">
                            <p className="text-xs text-muted-foreground">ثبت‌نام</p>
                            <p className="text-sm font-semibold">
                              {course.registered}/{course.capacity}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    دوره‌ای ثبت نشده است
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  )
}