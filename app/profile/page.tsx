"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, User, Settings, BookOpen, CalendarDays, Edit, Save, X, Loader2, Camera } from "lucide-react"
import Link from "next/link"
import { fetchUserEvents, updateUserProfile, uploadProfileImage, type Event } from "@/lib/api-client"

export default function ProfilePage() {
  const { user, loading, isCreator } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [userEvents, setUserEvents] = useState<Event[]>([])
  const [userCourses, setUserCourses] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)

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
      setProfileImage(user.image || null)
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const imageUrl = await uploadProfileImage(file)
      setProfileImage(imageUrl)
    } catch (error) {
      console.error("Failed to upload image:", error)
      alert("خطا در آپلود تصویر")
    } finally {
      setUploadingImage(false)
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
      <main dir="rtl" className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto max-w-5xl">
          <div className="relative mb-8 rounded-2xl bg-gradient-to-l from-primary/10 via-primary/5 to-transparent p-8 border border-primary/10">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-primary/60 p-1 shadow-lg">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <img
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-14 h-14 text-primary" />
                    )}
                  </div>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="absolute bottom-0 left-0 w-9 h-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                >
                  {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="text-center md:text-right flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {user.firstName} {user.lastName}
                </h1>
                {user.position && <p className="text-lg text-primary font-medium mb-2">{user.position}</p>}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {user.role === "admin" ? "مدیر" : user.role === "creator" ? "ایجادکننده" : "کاربر"}
                  </Badge>
                  {user.studentId && (
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      شماره دانشجویی: {user.studentId}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px] bg-muted/50 p-1 rounded-xl">
              <TabsTrigger
                value="info"
                className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">اطلاعات</span>
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <CalendarDays className="w-4 h-4" />
                <span className="hidden sm:inline">رویدادها</span>
              </TabsTrigger>
              <TabsTrigger
                value="courses"
                className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">دوره‌ها</span>
              </TabsTrigger>
              {isCreator() && (
                <TabsTrigger
                  value="admin"
                  className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">مدیریت</span>
                </TabsTrigger>
              )}
            </TabsList>

            {/* User Info Tab */}
            <TabsContent value="info">
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30">
                  <div>
                    <CardTitle>اطلاعات کاربری</CardTitle>
                    <CardDescription>مشاهده و ویرایش اطلاعات حساب کاربری</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                      <Edit className="w-4 h-4" />
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
                <CardContent className="space-y-6 pt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">نام</Label>
                      {isEditing ? (
                        <Input
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                          className="text-right"
                        />
                      ) : (
                        <p className="font-medium text-lg">{user.firstName || "-"}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">نام خانوادگی</Label>
                      {isEditing ? (
                        <Input
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                          className="text-right"
                        />
                      ) : (
                        <p className="font-medium text-lg">{user.lastName || "-"}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">شماره موبایل</Label>
                      <p className="font-medium text-lg">{user.phone}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">ایمیل</Label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="text-right"
                          dir="ltr"
                        />
                      ) : (
                        <p className="font-medium text-lg" dir="ltr">
                          {user.email || "-"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">شماره دانشجویی</Label>
                      {isEditing ? (
                        <Input
                          value={editForm.studentId}
                          onChange={(e) => setEditForm({ ...editForm, studentId: e.target.value })}
                          maxLength={10}
                          className="text-right"
                          dir="ltr"
                        />
                      ) : (
                        <p className="font-medium text-lg" dir="ltr">
                          {user.studentId || "-"}
                        </p>
                      )}
                    </div>
                    {user.position && (
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-sm">سمت</Label>
                        <p className="font-medium text-lg">{user.position}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events">
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b bg-muted/30">
                  <CardTitle>رویدادهای ثبت‌نام شده</CardTitle>
                  <CardDescription>لیست رویدادهایی که در آنها ثبت‌نام کرده‌اید</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {loadingData ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : userEvents.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        <CalendarDays className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-4">هنوز در هیچ رویدادی ثبت‌نام نکرده‌اید</p>
                      <Link href="/events">
                        <Button>مشاهده رویدادها</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userEvents.map((event) => (
                        <Card key={event.slug} className="overflow-hidden hover:shadow-md transition-shadow">
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
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b bg-muted/30">
                  <CardTitle>دوره‌های ثبت‌نام شده</CardTitle>
                  <CardDescription>لیست دوره‌هایی که در آنها ثبت‌نام کرده‌اید</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {loadingData ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : userCourses.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-4">هنوز در هیچ دوره‌ای ثبت‌نام نکرده‌اید</p>
                      <Link href="/courses">
                        <Button>مشاهده دوره‌ها</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userCourses.map((course) => (
                        <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
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
                <Card className="border-0 shadow-lg">
                  <CardHeader className="border-b bg-muted/30">
                    <CardTitle>پنل مدیریت</CardTitle>
                    <CardDescription>دسترسی به بخش‌های مدیریتی سایت</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <Link href="/admin/dashboard">
                        <Card className="hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer group">
                          <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                              <Settings className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="font-semibold">داشبورد</h3>
                            <p className="text-sm text-muted-foreground">مشاهده آمار کلی</p>
                          </CardContent>
                        </Card>
                      </Link>
                      <Link href="/admin/events/create">
                        <Card className="hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer group">
                          <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                              <CalendarDays className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="font-semibold">ایجاد رویداد</h3>
                            <p className="text-sm text-muted-foreground">افزودن رویداد جدید</p>
                          </CardContent>
                        </Card>
                      </Link>
                      <Link href="/admin/courses/create">
                        <Card className="hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer group">
                          <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                              <BookOpen className="w-7 h-7 text-primary" />
                            </div>
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
