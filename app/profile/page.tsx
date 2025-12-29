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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CalendarDays,
  MapPin,
  BookOpen,
  UserIcon,
  Award as IdCard,
  Calendar,
  Loader2,
  Edit,
  Save,
  X,
  Camera,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import {
  fetchUserEvents,
  fetchUserCourses,
  updateUserProfile,
  type UserEventRegistration,
  type UserCourseRegistration,
} from "@/lib/api-client"

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth()
  const router = useRouter()
  const [userEvents, setUserEvents] = useState<UserEventRegistration[]>([])
  const [userCourses, setUserCourses] = useState<UserCourseRegistration[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
  })

  // تابع تبدیل اعداد فارسی به انگلیسی
  const convertPersianToEnglish = (str: string) => {
    const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٢", "٢", "٢", "٢"]

    let result = str
    for (let i = 0; i < 10; i++) {
      result = result.replace(new RegExp(persianNumbers[i], "g"), i.toString())
      result = result.replace(new RegExp(arabicNumbers[i], "g"), i.toString())
    }
    return result
  }

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
        studentId: user.studentId || "",
      })
      setImagePreview(user.avatar || null)
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    setLoadingData(true)
    try {
      const [events, courses] = await Promise.all([fetchUserEvents(), fetchUserCourses()])
      setUserEvents(events)
      setUserCourses(courses)
    } catch (error) {
      console.error("Error loading user data:", error)
      toast({
        title: "خطا",
        description: "بارگذاری اطلاعات کاربر با خطا مواجه شد",
        variant: "destructive",
      })
    } finally {
      setLoadingData(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const formData = new FormData()

      // Add profile data as JSON
      const profileData = {
        first_name: editForm.firstName,
        last_name: editForm.lastName,
        student_id: editForm.studentId ? convertPersianToEnglish(editForm.studentId) : undefined,
      }
      formData.append("data", JSON.stringify(profileData))

      // Add image if selected
      if (selectedImage) {
        formData.append("avatar", selectedImage)
      }

      const response = await updateUserProfile(formData)

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      toast({
        title: "موفقیت",
        description: "پروفایل با موفقیت به‌روزرسانی شد",
        variant: "default",
      })
      setIsEditing(false)
      setSelectedImage(null)
      refreshUser()
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast({
        title: "خطا",
        description: "خطا در به‌روزرسانی پروفایل",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setSelectedImage(null)
    setImagePreview(user?.avatar || null)
    setEditForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      studentId: user?.studentId || "",
    })
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
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-right">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              پروفایل کاربری
            </h1>
            <p className="text-muted-foreground mt-2">مدیریت اطلاعات و فعالیت‌های خود</p>
          </div>

          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="info" className="gap-2">
                <UserIcon className="w-4 h-4" />
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
              {/* Admin Tab Trigger */}
              {user.role === "admin" && (
                <TabsTrigger value="admin" className="gap-2">
                  <IdCard className="w-4 h-4" />
                  <span className="hidden sm:inline">مدیریت</span>
                </TabsTrigger>
              )}
            </TabsList>

            {/* User Info Tab */}
            <TabsContent value="info">
              <Card className="border-2 shadow-lg">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                  <div className="text-right flex-1 space-y-1.5">
                    <CardTitle className="text-right">اطلاعات کاربری</CardTitle>
                    <CardDescription className="text-right">مشاهده و ویرایش اطلاعات حساب کاربری</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="mr-4">
                      <Edit className="w-4 h-4 mr-2" />
                      ویرایش
                    </Button>
                  ) : (
                    <div className="flex gap-2 mr-4">
                      <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={saving}>
                        <X className="w-4 h-4 mr-2" />
                        انصراف
                      </Button>
                      <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        ذخیره
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar and Name Section */}
                  <div className="flex items-center gap-6 flex-row-reverse pb-6 border-b">
                    <Avatar className="relative">
                      <AvatarImage src={imagePreview || "/placeholder.svg"} alt={user.firstName} />
                      <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
                      {isEditing && (
                        <label
                          htmlFor="profileImage"
                          className="absolute bottom-0 left-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 shadow-lg"
                        >
                          <Camera className="w-4 h-4" />
                          <input
                            id="profileImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                        </label>
                      )}
                    </Avatar>
                    <div className="flex-1 text-right">
                      <h2 className="text-2xl font-bold">
                        {user.firstName} {user.lastName}
                      </h2>
                      {user.position && <p className="text-primary font-medium mt-1">{user.position}</p>}
                      <div className="flex gap-2 mt-2 justify-end">
                        <Badge variant="secondary" className="text-sm">
                          {user.role === "admin" ? "مدیر" : user.role === "creator" ? "ایجادکننده" : "کاربر"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-muted-foreground text-right block">
                        نام <span className="text-destructive">*</span>
                      </Label>
                      {isEditing ? (
                        <Input
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                          className="border-2 focus:border-primary text-right"
                          placeholder="نام خود را وارد کنید"
                        />
                      ) : (
                        <p className="text-lg font-medium text-right">{user.firstName || "-"}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-muted-foreground text-right block">
                        نام خانوادگی
                      </Label>
                      {isEditing ? (
                        <Input
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                          className="border-2 focus:border-primary text-right"
                          placeholder="نام خانوادگی خود را وارد کنید"
                        />
                      ) : (
                        <p className="text-lg font-medium text-right">{user.lastName || "-"}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-muted-foreground text-right block">
                        شماره موبایل <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-medium text-right flex-1">{user.phone}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-muted-foreground text-right block">
                        ایمیل <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex items-center gap-2" dir="ltr">
                        <p className="text-lg font-medium text-left flex-1">{user.email || "-"}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-muted-foreground text-right block">
                        شماره دانشجویی
                      </Label>
                      {isEditing ? (
                        <Input
                          value={editForm.studentId}
                          onChange={(e) => setEditForm({ ...editForm, studentId: e.target.value })}
                          maxLength={10}
                          className="border-2 focus:border-primary text-right"
                          placeholder="1234567890"
                        />
                      ) : (
                        <p className="text-lg font-medium text-right">{user.studentId || "-"}</p>
                      )}
                    </div>

                    {user.position && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-muted-foreground text-right block">سمت</Label>
                        <p className="text-lg font-medium text-right">{user.position}</p>
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
                  <CardTitle className="text-right">رویدادهای ثبت‌نام شده</CardTitle>
                  <CardDescription className="text-right">لیست رویدادهایی که در آنها ثبت‌نام کرده‌اید</CardDescription>
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
                      {userEvents.map((registration) => {
                        const event = registration.event
                        return (
                          <Card key={event.slug} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row-reverse">
                              <div className="w-full md:w-48 h-32 overflow-hidden">
                                <img
                                  src={event.image || "/placeholder.svg"}
                                  alt={event.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <CardContent className="flex-1 p-4 text-right">
                                <div className="flex items-start justify-between mb-2 flex-row-reverse">
                                  <h3 className="font-semibold text-lg text-right">{event.title}</h3>
                                  <Badge
                                    variant={registration.status === "accepted" ? "default" : "secondary"}
                                    className="ml-2"
                                  >
                                    {registration.status === "accepted" ? "تایید شده" : registration.status}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-end">
                                  <div className="flex items-center gap-1">
                                    <span>{new Date(event.start_date).toLocaleDateString("fa-IR")}</span>
                                    <Calendar className="w-4 h-4" />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span>{event.location}</span>
                                    <MapPin className="w-4 h-4" />
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-3 justify-end flex-wrap">
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
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses">
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-right">دوره‌های ثبت‌نام شده</CardTitle>
                  <CardDescription className="text-right">لیست دوره‌هایی که در آنها ثبت‌نام کرده‌اید</CardDescription>
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
                      {userCourses.map((registration) => {
                        const course = registration.course
                        return (
                          <Card key={course.slug} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row-reverse">
                              <div className="w-full md:w-48 h-32 overflow-hidden">
                                <img
                                  src={course.image || "/placeholder.svg"}
                                  alt={course.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <CardContent className="flex-1 p-4 text-right">
                                <div className="flex items-start justify-between mb-2 flex-row-reverse">
                                  <h3 className="font-semibold text-lg text-right">{course.title}</h3>
                                  <Badge
                                    variant={registration.status === "accepted" ? "default" : "secondary"}
                                    className="ml-2"
                                  >
                                    {registration.status === "accepted" ? "تایید شده" : registration.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2 text-right">
                                  {course.instructors.length > 0 && (
                                    <>
                                      استاد:{" "}
                                      {course.instructors.map((i) => `${i.first_name} ${i.last_name}`).join("، ")}
                                    </>
                                  )}
                                </p>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-end mb-2">
                                  {course.start_date && (
                                    <div className="flex items-center gap-1">
                                      <span>{new Date(course.start_date).toLocaleDateString("fa-IR")}</span>
                                      <Calendar className="w-4 h-4" />
                                    </div>
                                  )}
                                  {course.schedule && (
                                    <div className="flex items-center gap-1">
                                      <span>{course.schedule}</span>
                                      <Clock className="w-4 h-4" />
                                    </div>
                                  )}
                                  {course.location && (
                                    <div className="flex items-center gap-1">
                                      <span>{course.location}</span>
                                      <MapPin className="w-4 h-4" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2 mt-3 justify-end flex-wrap">
                                  {course.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="secondary">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <Link href={`/courses/${course.slug}`}>
                                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                                    مشاهده جزئیات
                                  </Button>
                                </Link>
                              </CardContent>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Admin Tab */}
            {user.role === "admin" && (
              <TabsContent value="admin">
                <Card className="border-2 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-right">پنل مدیریت</CardTitle>
                    <CardDescription className="text-right">دسترسی به بخش‌های مدیریتی سایت</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <Link href="/admin/dashboard">
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                          <CardContent className="p-6 flex flex-col items-center text-center">
                            <IdCard className="w-10 h-10 text-primary mb-4" />
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
