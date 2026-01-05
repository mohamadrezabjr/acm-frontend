"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  Award,
  Plus,
  BookOpen,
  Users,
  TrendingUp,
  Settings,
  FileText,
  ArrowRight,
  Activity,
} from "lucide-react"
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <main className="container mx-auto px-4 py-8 pt-24 space-y-8">
          {/* Welcome Header with Gradient */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              داشبورد مدیریت
            </h1>
            <p className="text-muted-foreground">
              خوش آمدید {user?.first_name} {user?.last_name}
            </p>
          </div>

          {/* Redesigned Statistics Cards with Better Visuals */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">آمار و گزارش‌ها</h2>
            </div>
            {loadingStats ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">کاربران</CardTitle>
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Users className="h-5 w-5 text-blue-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-500">{stats?.total_users || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">کل کاربران ثبت‌نام شده</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">رویدادها</CardTitle>
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-green-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-500">{stats?.total_events || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">رویدادهای ایجاد شده</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">دوره‌ها</CardTitle>
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <BookOpen className="h-5 w-5 text-purple-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-500">{stats?.total_courses || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">دوره‌های آموزشی</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ثبت‌نام‌ها</CardTitle>
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-orange-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-500">{stats?.total_registrations || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">کل ثبت‌نام‌های انجام شده</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Redesigned Management Cards with Grouped Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">دسترسی سریع</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="group hover:shadow-xl transition-all hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-xl group-hover:from-green-500/30 group-hover:to-green-500/10 transition-colors">
                        <Calendar className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">رویدادها</CardTitle>
                        <CardDescription className="text-xs">مدیریت رویدادهای انجمن</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/admin/events/create">
                    <Button className="w-full justify-between group/btn" size="sm">
                      <span className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        ایجاد رویداد جدید
                      </span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/admin/events">
                    <Button variant="outline" className="w-full justify-between group/btn bg-transparent" size="sm">
                      <span>مشاهده همه رویدادها</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-xl group-hover:from-purple-500/30 group-hover:to-purple-500/10 transition-colors">
                        <BookOpen className="h-6 w-6 text-purple-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">دوره‌ها</CardTitle>
                        <CardDescription className="text-xs">مدیریت دوره‌های آموزشی</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/admin/courses/create">
                    <Button className="w-full justify-between group/btn" size="sm">
                      <span className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        ایجاد دوره جدید
                      </span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/admin/courses">
                    <Button variant="outline" className="w-full justify-between group/btn bg-transparent" size="sm">
                      <span>مشاهده همه دوره‌ها</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-xl group-hover:from-blue-500/30 group-hover:to-blue-500/10 transition-colors">
                        <FileText className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">ثبت‌نام‌ها</CardTitle>
                        <CardDescription className="text-xs">مدیریت ثبت‌نام کاربران</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/admin/registrations/events">
                    <Button className="w-full justify-between group/btn" size="sm">
                      <span>ثبت‌نام‌های رویدادها</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/admin/registrations/courses">
                    <Button variant="outline" className="w-full justify-between group/btn bg-transparent" size="sm">
                      <span>ثبت‌نام‌های دوره‌ها</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-amber-500/20 to-amber-500/5 rounded-xl group-hover:from-amber-500/30 group-hover:to-amber-500/10 transition-colors">
                        <Award className="h-6 w-6 text-amber-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">مدارک</CardTitle>
                        <CardDescription className="text-xs">صدور گواهی‌نامه‌ها</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/admin/certificates/create">
                    <Button className="w-full justify-between group/btn" size="sm">
                      <span className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        ایجاد مدرک جدید
                      </span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/admin/certificates">
                    <Button variant="outline" className="w-full justify-between group/btn bg-transparent" size="sm">
                      <span>مشاهده همه مدارک</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-xl group-hover:from-blue-500/30 group-hover:to-blue-500/10 transition-colors">
                        <Users className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">کاربران</CardTitle>
                        <CardDescription className="text-xs">مدیریت کاربران</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/admin/users">
                    <Button className="w-full justify-between group/btn" size="sm">
                      <span>مدیریت کاربران</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/admin/users/roles">
                    <Button variant="outline" className="w-full justify-between group/btn bg-transparent" size="sm">
                      <span>مدیریت نقش‌ها</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-gray-500/20 to-gray-500/5 rounded-xl group-hover:from-gray-500/30 group-hover:to-gray-500/10 transition-colors">
                        <Settings className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">تنظیمات</CardTitle>
                        <CardDescription className="text-xs">پیکربندی سیستم</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/admin/settings">
                    <Button className="w-full justify-between group/btn" size="sm">
                      <span>تنظیمات عمومی</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/admin/settings/tags">
                    <Button variant="outline" className="w-full justify-between group/btn bg-transparent" size="sm">
                      <span>مدیریت تگ‌ها</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Improved Recent Activity Section with Better Card Design */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-t-4 border-t-green-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-500" />
                      رویدادهای اخیر
                    </CardTitle>
                    <CardDescription>آخرین رویدادهای ایجاد شده</CardDescription>
                  </div>
                  <Link href="/admin/events">
                    <Button variant="ghost" size="sm">
                      مشاهده همه
                      <ArrowRight className="mr-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
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
                        className="block p-4 rounded-lg border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all group"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                              {event.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(event.start_date).toLocaleDateString("fa-IR")}
                            </p>
                          </div>
                          <div className="text-left bg-primary/10 rounded-lg px-3 py-1">
                            <p className="text-xs text-muted-foreground">ثبت‌نام</p>
                            <p className="text-sm font-bold text-primary">
                              {event.registered}/{event.capacity}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">رویدادی ثبت نشده است</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-purple-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-purple-500" />
                      دوره‌های اخیر
                    </CardTitle>
                    <CardDescription>آخرین دوره‌های ایجاد شده</CardDescription>
                  </div>
                  <Link href="/admin/courses">
                    <Button variant="ghost" size="sm">
                      مشاهده همه
                      <ArrowRight className="mr-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
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
                        className="block p-4 rounded-lg border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all group"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                              {course.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(course.start_date).toLocaleDateString("fa-IR")}
                            </p>
                          </div>
                          <div className="text-left bg-primary/10 rounded-lg px-3 py-1">
                            <p className="text-xs text-muted-foreground">ثبت‌نام</p>
                            <p className="text-sm font-bold text-primary">
                              {course.registered}/{course.capacity}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">دوره‌ای ثبت نشده است</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      </div>
    </>
  )
}
