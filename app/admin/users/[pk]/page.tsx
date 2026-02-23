"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  Loader2,
  User as UserIcon,
  Mail,
  Phone,
  IdCard,
  Save,
  Edit,
  X,
  Calendar,
  MapPin,
  Clock,
  Users,
  BookOpen,
  CalendarDays,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { apiRequest } from "@/lib/api-client"
import Image from "next/image"
import { toast } from "@/hooks/use-toast"

interface Person {
  id: number
  user: string | null
  email: string
  phone: string
  first_name: string
  last_name: string
  position: string | null
  bio: string | null
  student_id: string | null
  avatar: string | null
}

interface EventRegistration {
  id: number
  event: {
    id: number
    title: string
    slug: string
    description: string
    tags: string[]
    start_date: string
    end_date: string
    registration_start_at: string
    registration_deadline: string
    location: string
    price: number
    organizer: string
    registered: number
    capacity: number
    image: string
    speakers: any[]
    is_active: boolean
    dependencies: string[]
    is_full: boolean
  }
  person: Person
  first_name_at_registration: string
  last_name_at_registration: string
  email_at_registration: string
  phone_at_registration: string
  student_id_at_registration: string
  status: string
  joined_at: string
}

interface CourseRegistration {
  id: number
  course: {
    id: number
    title: string
    slug: string
    description: string | null
    tags: string[]
    start_date: string
    end_date: string
    registration_start_at: string
    registration_deadline: string
    location: string
    price: number
    organizer: string
    capacity: number
    registered: number
    image: string | null
    instructors: any[]
    time_plans: any[]
    is_active: boolean
    dependencies: string[]
    is_full: boolean
  }
  person: Person
  first_name_at_registration: string | null
  last_name_at_registration: string | null
  email_at_registration: string | null
  phone_at_registration: string | null
  student_id_at_registration: string | null
  status: string
  joined_at: string
}

interface UserDetail {
  phone: string
  email: string
  first_name: string
  last_name: string
  avatar: string | null
  student_id: string
  role: "superuser" | "admin" | "creator" | "user"
  events: EventRegistration[]
  courses: CourseRegistration[]
}

export default function UserDetailPage() {
  const { pk } = useParams<{ pk: string }>()
  const { user, loading, isAdmin, isSuperuser } = useAuth()
  const router = useRouter()
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [canEdit, setCanEdit] = useState(false)

  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    student_id: "",
  })

  useEffect(() => {
    if (!loading && (!user || !isAdmin())) {
      router.push("/auth/login")
    }
  }, [loading, user, router, isAdmin])

  useEffect(() => {
    const loadUserDetail = async () => {
      try {
        const response = await apiRequest(`/admin/users/${pk}/`)
        if (!response.ok) {
          throw new Error("Failed to fetch user details")
        }
        const data = await response.json()
        setUserDetail(data)
        setEditForm({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          student_id: data.student_id,
        })

        // Check if current user can edit this user
        // superuser can edit anyone
        // admin can edit creator and user roles only
        if (user) {
          if (isSuperuser()) {
            setCanEdit(true)
          } else if (isAdmin() && (data.role === "creator" || data.role === "user")) {
            setCanEdit(true)
          } else {
            setCanEdit(false)
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error)
        toast({
          title: "خطا",
          description: "خطا در بارگذاری اطلاعات کاربر",
          variant: "destructive",
        })
      } finally {
        setLoadingUser(false)
      }
    }

    if (user && isAdmin() && pk) {
      loadUserDetail()
    }
  }, [user, isAdmin, isSuperuser, pk])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await apiRequest(`/admin/users/${pk}/`, {
        method: "PATCH",
        body: JSON.stringify(editForm),
      })

      if (!response.ok) {
        throw new Error("Failed to update user")
      }

      const updatedData = await response.json()
      setUserDetail(updatedData)
      setIsEditing(false)
      toast({
        title: "موفق",
        description: "اطلاعات کاربر با موفقیت به‌روزرسانی شد",
      })
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "خطا",
        description: "خطا در به‌روزرسانی اطلاعات کاربر",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (userDetail) {
      setEditForm({
        first_name: userDetail.first_name,
        last_name: userDetail.last_name,
        email: userDetail.email,
        phone: userDetail.phone,
        student_id: userDetail.student_id,
      })
    }
    setIsEditing(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
      <div className="min-h-screen bg-background pt-20">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/admin/users">
                <Button variant="ghost" size="sm">
                  <ArrowRight className="ml-2 h-4 w-4" />
                  بازگشت
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">جزئیات کاربر</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {loadingUser ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : !userDetail ? (
            <Card>
              <CardContent className="py-12 text-center">
                <UserIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">کاربر یافت نشد</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* User Info Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <UserIcon className="h-5 w-5" />
                      اطلاعات کاربر
                    </CardTitle>
                    {!isEditing ? (
                      canEdit && (
                        <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
                          <Edit className="ml-2 h-4 w-4" />
                          ویرایش
                        </Button>
                      )
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={handleSave} size="sm" disabled={saving}>
                          {saving ? (
                            <>
                              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                              در حال ذخیره...
                            </>
                          ) : (
                            <>
                              <Save className="ml-2 h-4 w-4" />
                              ذخیره
                            </>
                          )}
                        </Button>
                        <Button onClick={handleCancel} size="sm" variant="outline" disabled={saving}>
                          <X className="ml-2 h-4 w-4" />
                          لغو
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar */}
                    <div className="flex justify-center md:justify-start">
                      {userDetail.avatar ? (
                        <Image
                          src={userDetail.avatar}
                          alt={`${userDetail.first_name} ${userDetail.last_name}`}
                          width={120}
                          height={120}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserIcon className="h-12 w-12 text-primary" />
                        </div>
                      )}
                    </div>

                    {/* User Details */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {isEditing ? (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="first_name">نام</Label>
                            <Input
                              id="first_name"
                              value={editForm.first_name}
                              onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last_name">نام خانوادگی</Label>
                            <Input
                              id="last_name"
                              value={editForm.last_name}
                              onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">ایمیل</Label>
                            <Input
                              id="email"
                              type="email"
                              dir="ltr"
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">شماره موبایل</Label>
                            <Input
                              id="phone"
                              dir="ltr"
                              value={editForm.phone}
                              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="student_id">شماره دانشجویی</Label>
                            <Input
                              id="student_id"
                              dir="ltr"
                              value={editForm.student_id}
                              onChange={(e) => setEditForm({ ...editForm, student_id: e.target.value })}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">نام و نام خانوادگی</p>
                            <p className="font-medium">
                              {userDetail.first_name} {userDetail.last_name}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              ایمیل
                            </p>
                            <p className="font-medium" dir="ltr">
                              {userDetail.email}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              شماره موبایل
                            </p>
                            <p className="font-medium" dir="ltr">
                              {userDetail.phone}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <IdCard className="h-4 w-4" />
                              شماره دانشجویی
                            </p>
                            <p className="font-medium">{userDetail.student_id || "-"}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              نقش
                            </p>
                            <div>
                              <Badge
                                variant={
                                  userDetail.role === "superuser"
                                    ? "destructive"
                                    : userDetail.role === "admin"
                                      ? "default"
                                      : userDetail.role === "creator"
                                        ? "secondary"
                                        : "outline"
                                }
                              >
                                {userDetail.role === "superuser"
                                  ? "سوپر ادمین"
                                  : userDetail.role === "admin"
                                    ? "ادمین"
                                    : userDetail.role === "creator"
                                      ? "سازنده محتوا"
                                      : "کاربر"}
                              </Badge>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Registrations Tabs */}
              <Card>
                <CardHeader>
                  <CardTitle>تاریخچه ثبت‌نام‌ها</CardTitle>
                  <CardDescription>
                    رویدادها و دوره‌هایی که کاربر در آنها ثبت‌نام کرده است
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="events" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="events" className="gap-2">
                        <CalendarDays className="h-4 w-4" />
                        رویدادها ({userDetail.events.length})
                      </TabsTrigger>
                      <TabsTrigger value="courses" className="gap-2">
                        <BookOpen className="h-4 w-4" />
                        دوره‌ها ({userDetail.courses.length})
                      </TabsTrigger>
                    </TabsList>

                    {/* Events Tab */}
                    <TabsContent value="events" dir="rtl" className="space-y-4 mt-4">
                      {userDetail.events.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>هیچ رویدادی ثبت‌نام نشده است</p>
                        </div>
                      ) : (
                        userDetail.events.map((registration) => (
                          <Card key={registration.id}>
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <CardTitle className="text-lg">
                                    <Link
                                      href={`/events/${registration.event.slug}`}
                                      className="hover:text-primary transition-colors"
                                    >
                                      {registration.event.title}
                                    </Link>
                                  </CardTitle>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      {formatDate(registration.event.start_date)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      {registration.event.location}
                                    </span>
                                  </div>
                                </div>
                                <Badge variant={registration.status === "confirmed" ? "default" : "secondary"}>
                                  {registration.status}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div>
                                  <p className="text-sm font-semibold mb-2 text-right">اطلاعات ثبت‌نام‌ : </p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm bg-muted/30 p-3 rounded-lg">
                                    <div className="text-right">
                                      <span className="text-muted-foreground">نام: </span>
                                      <span className="font-medium">
                                        {registration.first_name_at_registration} {registration.last_name_at_registration}
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-muted-foreground">ایمیل: </span>
                                      <span className="font-medium" dir="ltr">{registration.email_at_registration}</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-muted-foreground">موبایل: </span>
                                      <span className="font-medium" dir="ltr">{registration.phone_at_registration}</span>
                                    </div>
                                    {registration.student_id_at_registration && (
                                      <div className="text-right">
                                        <span className="text-muted-foreground">شماره دانشجویی: </span>
                                        <span className="font-medium">{registration.student_id_at_registration}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  زمان ثبت‌نام: {formatDate(registration.joined_at)}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </TabsContent>

                    {/* Courses Tab */}
                    <TabsContent value="courses" dir="rtl" className="space-y-4 mt-4">
                      {userDetail.courses.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>هیچ دوره‌ای ثبت‌نام نشده است</p>
                        </div>
                      ) : (
                        userDetail.courses.map((registration) => (
                          <Card key={registration.id}>
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <CardTitle className="text-lg">
                                    <Link
                                      href={`/courses/${registration.course.slug}`}
                                      className="hover:text-primary transition-colors"
                                    >
                                      {registration.course.title}
                                    </Link>
                                  </CardTitle>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      {formatDate(registration.course.start_date)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      {registration.course.location}
                                    </span>
                                  </div>
                                </div>
                                <Badge variant={registration.status === "confirmed" ? "default" : "secondary"}>
                                  {registration.status}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div>
                                  <p className="text-sm font-semibold mb-2 text-right">اطلاعات ثبت‌نام‌ :</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm bg-muted/30 p-3 rounded-lg">
                                    {registration.first_name_at_registration && (
                                      <div className="text-right">
                                        <span className="text-muted-foreground">نام: </span>
                                        <span className="font-medium">
                                          {registration.first_name_at_registration} {registration.last_name_at_registration}
                                        </span>
                                      </div>
                                    )}
                                    {registration.email_at_registration && (
                                      <div className="text-right">
                                        <span className="text-muted-foreground">ایمیل: </span>
                                        <span className="font-medium" dir="ltr">{registration.email_at_registration}</span>
                                      </div>
                                    )}
                                    {registration.phone_at_registration && (
                                      <div className="text-right">
                                        <span className="text-muted-foreground">موبایل: </span>
                                        <span className="font-medium" dir="ltr">{registration.phone_at_registration}</span>
                                      </div>
                                    )}
                                    {registration.student_id_at_registration && (
                                      <div className="text-right">
                                        <span className="text-muted-foreground">شماره دانشجویی: </span>
                                        <span className="font-medium">{registration.student_id_at_registration}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  زمان ثبت‌نام: {formatDate(registration.joined_at)}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
