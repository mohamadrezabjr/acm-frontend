export const dynamic = "force-dynamic"
;("use client")

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X, Upload, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"

interface Instructor {
  id: string
  name: string
  position: string
  bio: string
}

export default function CreateCoursePage() {
  const { user, loading, isCreator } = useAuth()
  const router = useRouter()
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [courseData, setCourseData] = useState({
    name: "",
    description: "",
    startDate: "",
    registrationDeadline: "",
    schedule: "",
    location: "",
    capacity: "",
    organizer: "",
    price: "",
    image: null as File | null,
  })

  useEffect(() => {
    if (!loading && (!user || !isCreator())) {
      router.push("/auth/login")
    }
  }, [loading, user, router])

  const addInstructor = () => {
    setInstructors([
      ...instructors,
      {
        id: Date.now().toString(),
        name: "",
        position: "",
        bio: "",
      },
    ])
  }

  const removeInstructor = (id: string) => {
    setInstructors(instructors.filter((instructor) => instructor.id !== id))
  }

  const updateInstructor = (id: string, field: keyof Instructor, value: string) => {
    setInstructors(
      instructors.map((instructor) => (instructor.id === id ? { ...instructor, [field]: value } : instructor)),
    )
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCourseData({ ...courseData, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("name", courseData.name)
    formData.append("description", courseData.description)
    formData.append("startDate", courseData.startDate)
    formData.append("registrationDeadline", courseData.registrationDeadline)
    formData.append("schedule", courseData.schedule)
    formData.append("location", courseData.location)
    formData.append("capacity", courseData.capacity)
    formData.append("organizer", courseData.organizer)
    formData.append("price", courseData.price)
    formData.append("instructors", JSON.stringify(instructors))

    if (courseData.image) {
      formData.append("image", courseData.image)
    }

    console.log("Course Data to send to backend:", {
      ...courseData,
      instructors,
      image: courseData.image?.name,
    })

    alert("دوره با موفقیت ایجاد شد! (داده‌ها در console لاگ شده‌اند)")
    router.push("/admin/dashboard")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !isCreator()) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/admin/dashboard">
            <Button variant="ghost">
              <ArrowRight className="ml-2 h-4 w-4" />
              بازگشت به داشبورد
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">ایجاد دوره جدید</CardTitle>
            <CardDescription>اطلاعات دوره آموزشی را با دقت وارد کنید</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">اطلاعات اصلی</h3>

                <div className="space-y-2">
                  <Label htmlFor="name">نام دوره *</Label>
                  <Input
                    id="name"
                    value={courseData.name}
                    onChange={(e) => setCourseData({ ...courseData, name: e.target.value })}
                    placeholder="مثال: دوره جامع برنامه‌نویسی پایتون"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">توضیحات دوره *</Label>
                  <Textarea
                    id="description"
                    value={courseData.description}
                    onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                    placeholder="توضیحات کامل درباره دوره..."
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">تصویر دوره</Label>
                  <div className="flex items-center gap-4">
                    <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <Label
                      htmlFor="image"
                      className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md cursor-pointer hover:bg-secondary/80"
                    >
                      <Upload className="h-4 w-4" />
                      انتخاب تصویر
                    </Label>
                    {imagePreview && (
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Instructors Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">اساتید</h3>
                  <Button type="button" variant="outline" onClick={addInstructor}>
                    <Plus className="ml-2 h-4 w-4" />
                    افزودن استاد
                  </Button>
                </div>

                {instructors.map((instructor, index) => (
                  <Card key={instructor.id} className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">استاد {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeInstructor(instructor.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>نام استاد</Label>
                            <Input
                              value={instructor.name}
                              onChange={(e) => updateInstructor(instructor.id, "name", e.target.value)}
                              placeholder="نام و نام خانوادگی"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>سمت</Label>
                            <Input
                              value={instructor.position}
                              onChange={(e) => updateInstructor(instructor.id, "position", e.target.value)}
                              placeholder="مثال: استادیار دانشگاه"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>بیوگرافی</Label>
                          <Textarea
                            value={instructor.bio}
                            onChange={(e) => updateInstructor(instructor.id, "bio", e.target.value)}
                            placeholder="توضیحات مختصر درباره استاد..."
                            rows={3}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {instructors.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">هیچ استادی اضافه نشده است</div>
                )}
              </div>

              {/* Schedule Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">زمان‌بندی</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">تاریخ شروع *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={courseData.startDate}
                      onChange={(e) => setCourseData({ ...courseData, startDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registrationDeadline">مهلت ثبت‌نام *</Label>
                    <Input
                      id="registrationDeadline"
                      type="date"
                      value={courseData.registrationDeadline}
                      onChange={(e) => setCourseData({ ...courseData, registrationDeadline: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="schedule">برنامه زمانی *</Label>
                    <Input
                      id="schedule"
                      value={courseData.schedule}
                      onChange={(e) => setCourseData({ ...courseData, schedule: e.target.value })}
                      placeholder="مثال: شنبه و دوشنبه، 17:00 - 19:00"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location and Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">محل و جزئیات</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">مکان برگزاری *</Label>
                    <Input
                      id="location"
                      value={courseData.location}
                      onChange={(e) => setCourseData({ ...courseData, location: e.target.value })}
                      placeholder="مثال: آزمایشگاه کامپیوتر شماره 2"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">ظرفیت ثبت‌نام *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={courseData.capacity}
                      onChange={(e) => setCourseData({ ...courseData, capacity: e.target.value })}
                      placeholder="تعداد نفرات"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizer">برگزارکننده *</Label>
                    <Input
                      id="organizer"
                      value={courseData.organizer}
                      onChange={(e) => setCourseData({ ...courseData, organizer: e.target.value })}
                      placeholder="نام برگزارکننده"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">هزینه (تومان) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={courseData.price}
                      onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
                      placeholder="0 برای رایگان"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  ایجاد دوره
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  انصراف
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
