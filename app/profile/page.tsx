"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, User, Settings, BookOpen, CalendarDays, Edit, Save, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { fetchUserEvents, updateUserProfile, uploadProfileImage, type Event } from "@/lib/api-client"

export const dynamic = "force-dynamic"

export default function ProfilePage() {
  const { user, loading, isCreator } = useAuth()
  const router = useRouter()

  const [userEvents, setUserEvents] = useState<Event[]>([])
  const [userCourses, setUserCourses] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        studentId: user.studentId || "",
      })
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    setLoadingData(true)
    try {
      const [events, courses] = await Promise.all([fetchUserEvents(), null])
      setUserEvents(events)
    } catch (error) {
      console.error("Failed to load user data:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      await updateUserProfile({
        first_name: editForm.firstName,
        last_name: editForm.lastName,
        email: editForm.email || undefined,
        student_id: editForm.studentId || undefined,
      })
      setIsEditing(false)
      window.location.reload()
    } catch (error) {
      console.error("Failed to update profile:", error)
      alert("خطا در به‌روزرسانی پروفایل")
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      await uploadProfileImage(file)
      window.location.reload()
    } catch (error) {
      console.error("Failed to upload image:", error)
      alert("خطا در آپلود تصویر")
    } finally {
      setUploadingImage(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-12 px-4" dir="rtl">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              پروفایل کاربری
            </h1>
            <p className="text-muted-foreground mt-2">مدیریت اطلاعات و فعالیت‌های خود</p>
          </div>

          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="info" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">اطلاعات</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="gap-2">
                <CalendarDays className="w-4 h-4" />
                <span className="hidden sm:inline">رویدادها</span>
              </TabsTrigger>
              <TabsTrigger value="courses" className="gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">دوره‌ها</span>
              </TabsTrigger>
              {isCreator() && (
                <TabsTrigger value="admin" className="gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">مدیریت</span>
                </TabsTrigger>
              )}
            </TabsList>

            {/* User Info Tab */}
            <TabsContent value="info">
              <Card className="border-2 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>اطلاعات کاربری</CardTitle>
                    <CardDescription>مشاهده و ویرایش اطلاعات حساب کاربری</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 ml-2" />
                      ویرایش
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} disabled={saving}>
                        <X className="w-4 h-4 ml-2" />
                        انصراف
                      </Button>
                      <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                        {saving ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Save className="w-4 h-4 ml-2" />}
                        ذخیره
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg ring-4 ring-primary/20">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage || "/placeholder.svg"}
                            alt={user.firstName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-white" />
                        )}
                      </div>
                      {isEditing && (
                        <label
                          htmlFor="profileImage"
                          className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 shadow-lg"
                        >
                          {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit className="w-4 h-4" />}
                          <input
                            id="profileImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploadingImage}
                          />
                        </label>
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold">
                        {user.firstName} {user.lastName}
                      </h2>
                      {user.position && <p className="text-primary font-medium mt-1">{user.position}</p>}
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="text-sm">
                          {user.role === "admin" ? "مدیر" : user.role === "creator" ? "ایجادکننده" : "کاربر"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-muted-foreground">نام</Label>
                      {isEditing ? (
                        <Input
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                          className="border-2 focus:border-primary"
                        />
                      ) : (
                        <p className="text-lg font-medium">{user.firstName || "-"}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-muted-foreground">نام خانوادگی</Label>
                      {isEditing ? (
                        <Input
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                          className="border-2 focus:border-primary"
                        />
                      ) : (
                        <p className="text-lg font-medium">{user.lastName || "-"}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-muted-foreground">شماره موبایل</Label>
                      <p className="text-lg font-medium">{user.phone}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-muted-foreground">ایمیل</Label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="border-2 focus:border-primary"
                        />
                      ) : (
                        <p className="text-lg font-medium">{user.email || "-"}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-muted-foreground">شماره دانشجویی</Label>
                      {isEditing ? (
                        <Input
                          value={editForm.studentId}
                          onChange={(e) => setEditForm({ ...editForm, studentId: e.target.value })}
                          maxLength={10}
                          className="border-2 focus:border-primary"
                        />
                      ) : (
                        <p className="text-lg font-medium">{user.studentId || "-"}</p>
                      )}
                    </div>
                    {user.position && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-muted-foreground">سمت</Label>
                        <p className="text-lg font-medium">{user.position}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events">
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle>رویدادهای ثبت‌نام شده</CardTitle>
                  <CardDescription>لیست رویدادهایی که در آنها ثبت‌نام کرده‌اید</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : userEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">هنوز در هیچ رویدادی ثبت‌نام نکرده‌اید</p>
                      <Link href="/events">
                        <Button className="mt-4">مشاهده رویدادها</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userEvents.map((event) => (
                        <Card key={event.slug} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-48 h-32 overflow-hidden">
                              <img
                                src={event.image || "/placeholder.svg"}
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <CardContent className="flex-1 p-4">
                              <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(event.start_date).toLocaleDateString("fa-IR")}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {event.location}
                                </div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                {event.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <Link href={`/events/${event.slug}`}>
                                <Button variant="outline" size="sm" className="mt-4 bg-transparent">
                                  مشاهده جزئیات
                                </Button>
                              </Link>
                            </CardContent>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses">
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle>دوره‌های ثبت‌نام شده</CardTitle>
                  <CardDescription>لیست دوره‌هایی که در آنها ثبت‌نام کرده‌اید</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : userCourses.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">هنوز در هیچ دوره‌ای ثبت‌نام نکرده‌اید</p>
                      <Link href="/courses">
                        <Button className="mt-4">مشاهده دوره‌ها</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userCourses.map((course) => (
                        <Card key={course.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-48 h-32 overflow-hidden">
                              <img
                                src={course.image || "/placeholder.svg"}
                                alt={course.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <CardContent className="flex-1 p-4">
                              <h3 className="font-semibold text-lg mb-2">{course.name}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                استاد: {course.instructors?.join("، ")}
                              </p>
                              <Link href={`/courses/${course.id}`}>
                                <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                                  مشاهده جزئیات
                                </Button>
                              </Link>
                            </CardContent>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Admin Tab */}
            {isCreator() && (
              <TabsContent value="admin">
                <Card className="border-2 shadow-lg">
                  <CardHeader>
                    <CardTitle>پنل مدیریت</CardTitle>
                    <CardDescription>دسترسی به بخش‌های مدیریتی سایت</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <Link href="/admin/dashboard">
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                          <CardContent className="p-6 flex flex-col items-center text-center">
                            <Settings className="w-10 h-10 text-primary mb-4" />
                            <h3 className="font-semibold">داشبورد</h3>
                            <p className="text-sm text-muted-foreground">مشاهده آمار کلی</p>
                          </CardContent>
                        </Card>
                      </Link>
                      <Link href="/admin/events/create">
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                          <CardContent className="p-6 flex flex-col items-center text-center">
                            <CalendarDays className="w-10 h-10 text-primary mb-4" />
                            <h3 className="font-semibold">ایجاد رویداد</h3>
                            <p className="text-sm text-muted-foreground">افزودن رویداد جدید</p>
                          </CardContent>
                        </Card>
                      </Link>
                      <Link href="/admin/courses/create">
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                          <CardContent className="p-6 flex flex-col items-center text-center">
                            <BookOpen className="w-10 h-10 text-primary mb-4" />
                            <h3 className="font-semibold">ایجاد دوره</h3>
                            <p className="text-sm text-muted-foreground">افزودن دوره جدید</p>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </>
  )
}
