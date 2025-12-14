"use client"


import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Award, LogOut, Plus, BookOpen } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading, isCreator, logout } = useAuth()

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

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>در حال بارگذاری...</div>
      </div>
    )
  }

  return (
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card for Event Management */}
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
                  مشاهده تمام رویدادها
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card for Courses Management */}
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
              <Link href="/courses">
                <Button variant="outline" className="w-full bg-transparent">
                  مشاهده تمام دوره‌ها
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card for Certificate Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <CardTitle>مدیریت مدارک</CardTitle>
                  <CardDescription>ایجاد و صدور مدارک شرکت در رویدادها</CardDescription>
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
                  مشاهده تمام مدارک
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
