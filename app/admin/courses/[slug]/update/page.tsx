"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Upload, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import TimePicker from "react-multi-date-picker/plugins/time_picker"
import "react-multi-date-picker/styles/colors/red.css"
import {
  apiRequest,
  fetchPersons,
  fetchTags,
  fetchAdminCourseBySlug,
  WeekdayFa,
  type Tag,
  type Person,
} from "@/lib/api-client"
import { DateObject } from "react-multi-date-picker"

interface Instructor {
  id: string
  person_id?: number | null
  type: "existing" | "new"
  user?: number | null
  first_name: string
  last_name: string
  bio: string
  position: string
}

interface TimePlan {
  id: string
  pk?: number | null
  weekday: string
  time_start: string
  time_end: string
}

export default function EditCoursePage() {
  const { user, loading, isCreator } = useAuth()
  const router = useRouter()
  const params = useParams()
  const slug = params?.slug as string
  const [dependencies, setDependencies] = useState<string[]>([])
  const dependencyOptions = [
    { key: "phone", label: "شماره موبایل"},
    { key: "student_id", label: "شماره دانشجویی" },
    { key: "first_name", label: "نام" },
    { key: "last_name", label: "نام خانوادگی" },
  ]

  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [timePlans, setTimePlans] = useState<TimePlan[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [availablePersons, setAvailablePersons] = useState<Person[]>([])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [newTagName, setNewTagName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const toggleDependency = (key: string) => {
    setDependencies((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]))
  }

  const [courseData, setCourseData] = useState({
    title: "",
    slug: "",
    description: "",
    startDateTime: null as any,
    endDateTime: null as any,
    registrationStartDateTime: null as any,
    registrationDeadlineDateTime: null as any,
    location: "",
    capacity: "",
    organizer: "",
    price: "",
    image: null as File | null,
    existingImageUrl: "" as string,
  })

  const weekdayOptions = Object.entries(WeekdayFa).map(([key, value]) => ({
    key,
    value,
  }))

  useEffect(() => {
    if (!loading && (!user || !isCreator())) {
      router.push("/auth/login")
    }
  }, [loading, user, router, isCreator])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        const tagsData = await fetchTags()
        setAvailableTags(tagsData)

        const personsData = await fetchPersons()
        setAvailablePersons(personsData)

        const courseDataFromAPI = await fetchAdminCourseBySlug(slug)

        setCourseData({
          title: courseDataFromAPI.title || "",
          slug: courseDataFromAPI.slug || "",
          description: courseDataFromAPI.description || "",
          startDateTime: courseDataFromAPI.start_date ? new DateObject(new Date(courseDataFromAPI.start_date)) : null,
          endDateTime: courseDataFromAPI.end_date ? new DateObject(new Date(courseDataFromAPI.end_date)) : null,
          registrationStartDateTime: courseDataFromAPI.registration_start_at
            ? new DateObject(new Date(courseDataFromAPI.registration_start_at))
            : null,
          registrationDeadlineDateTime: courseDataFromAPI.registration_deadline
            ? new DateObject(new Date(courseDataFromAPI.registration_deadline))
            : null,
          location: courseDataFromAPI.location || "",
          capacity: courseDataFromAPI.capacity?.toString() || "",
          organizer: courseDataFromAPI.organizer || "",
          price: courseDataFromAPI.price?.toString() || "",
          image: null,
          existingImageUrl: courseDataFromAPI.image || "",
        })

        // Set tags - convert string array to Tag objects
        if (courseDataFromAPI.tags && Array.isArray(courseDataFromAPI.tags)) {
          const mappedTags = courseDataFromAPI.tags.map((tagName: string, index: number) => ({
            id: Date.now() + index,
            name: tagName,
          }))
          setSelectedTags(mappedTags)
        }

        if (courseDataFromAPI.instructors) {
          const mappedInstructors = courseDataFromAPI.instructors.map((instructor: any, index: number) => ({
            id: `${instructor.id || Date.now()}-${index}`,
            person_id: instructor.id || null,
            type: instructor.id ? "existing" : "new",
            user: instructor.user || null,
            first_name: instructor.first_name || "",
            last_name: instructor.last_name || "",
            bio: instructor.bio || "",
            position: instructor.position || "",
          }))
          setInstructors(mappedInstructors)
        }

        if (courseDataFromAPI.time_plans) {
          const mappedTimePlans = courseDataFromAPI.time_plans.map((plan: any, index: number) => ({
            id: `${Date.now()}-${index}`,
            pk: plan.pk || null,
            weekday: plan.weekday || "",
            time_start: plan.time_start || "",
            time_end: plan.time_end || "",
          }))
          setTimePlans(mappedTimePlans)
        }

        if (courseDataFromAPI.image) {
          setImagePreview(courseDataFromAPI.image)
        }
        if (courseDataFromAPI.dependencies && Array.isArray(courseDataFromAPI.dependencies)) {
          setDependencies(courseDataFromAPI.dependencies)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        alert("خطا در بارگذاری اطلاعات دوره")
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchData()
    }
  }, [slug])

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !isCreator()) {
    return null
  }

  const addNewInstructor = () => {
    setInstructors([
      ...instructors,
      {
        id: Date.now().toString(),
        person_id: null,
        type: "new",
        user: null,
        first_name: "",
        last_name: "",
        bio: "",
        position: "",
      },
    ])
  }

  const addExistingInstructor = (personId: number) => {
    const person = availablePersons.find((p) => p.id === personId)
    if (person) {
      setInstructors([
        ...instructors,
        {
          id: Date.now().toString(),
          person_id: person.id,
          type: "existing",
          user: person.user,
          first_name: person.first_name,
          last_name: person.last_name,
          bio: person.bio || "",
          position: person.position || "",
        },
      ])
    }
  }

  const removeInstructor = (id: string) => {
    setInstructors(instructors.filter((instructor) => instructor.id !== id))
  }

  const updateInstructor = (id: string, field: keyof Instructor, value: string) => {
    setInstructors(
      instructors.map((instructor) => (instructor.id === id ? { ...instructor, [field]: value } : instructor)),
    )
  }

  const addTimePlan = () => {
    setTimePlans([
      ...timePlans,
      {
        id: Date.now().toString(),
        weekday: "",
        time_start: "",
        time_end: "",
      },
    ])
  }

  const removeTimePlan = (id: string) => {
    setTimePlans(timePlans.filter((plan) => plan.id !== id))
  }

  const updateTimePlan = (id: string, field: keyof TimePlan, value: string) => {
    setTimePlans(timePlans.map((plan) => (plan.id === id ? { ...plan, [field]: value } : plan)))
  }

  const addTag = (tagId: number) => {
    const tag = availableTags.find((t) => t.id === tagId)
    if (tag && !selectedTags.find((t) => t.id === tagId)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const addNewTag = () => {
    if (newTagName.trim()) {
      const newTag: Tag = {
        id: Date.now(),
        name: newTagName.trim(),
      }
      setSelectedTags([...selectedTags, newTag])
      setNewTagName("")
    }
  }

  const removeTag = (tagId: number) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId))
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

  const handleRemoveImage = () => {
    setCourseData({ ...courseData, image: null, existingImageUrl: "" })
    setImagePreview(null)
  }

  const formatDateTime = (dateValue: any) => {
    if (!dateValue) return null
    return dateValue.toDate().toISOString()
  }

  const validateForm = () => {
    const errors: string[] = []

    if (!courseData.title.trim()) {
      errors.push("عنوان دوره الزامی است")
    }
    if (!courseData.startDateTime) {
      errors.push("تاریخ شروع دوره الزامی است")
    }
    if (!courseData.endDateTime) {
      errors.push("تاریخ پایان دوره الزامی است")
    }
    if (!courseData.registrationDeadlineDateTime) {
      errors.push("مهلت ثبت‌نام الزامی است")
    }
    if (!courseData.location.trim()) {
      errors.push("مکان برگزاری الزامی است")
    }
    if (!courseData.capacity || Number.parseInt(courseData.capacity) <= 0) {
      errors.push("ظرفیت باید بیشتر از صفر باشد")
    }
    if (!courseData.organizer.trim()) {
      errors.push("برگزارکننده الزامی است")
    }
    if (!courseData.price) {
      errors.push("هزینه الزامی است (برای رایگان عدد 0 وارد کنید)")
    }

    if (errors.length > 0) {
      alert("لطفاً موارد زیر را تکمیل کنید:\n\n" + errors.join("\n"))
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!validateForm()) {
      setIsSubmitting(false)
      return
    }

    try {
      const payload = {
        title: courseData.title,
        slug: courseData.slug || undefined,
        description: courseData.description || undefined,
        tags: selectedTags.map((tag) => ({ name: tag.name })),
        start_date: formatDateTime(courseData.startDateTime),
        end_date: formatDateTime(courseData.endDateTime),
        registration_start_at: formatDateTime(courseData.registrationStartDateTime),
        registration_deadline: formatDateTime(courseData.registrationDeadlineDateTime),
        capacity: courseData.capacity ? Number.parseInt(courseData.capacity) : null,
        registered: 0,
        location: courseData.location,
        price: courseData.price ? Number.parseFloat(courseData.price) : 0,
        organizer: courseData.organizer,
        dependencies,
        instructors: instructors.map((instructor) => ({
          id: instructor.type === "existing" ? instructor.person_id : null,
          first_name: instructor.type === "new" ? instructor.first_name : "",
          last_name: instructor.type === "new" ? instructor.last_name : "",
          bio: instructor.bio,
          position: instructor.position,
        })),
        time_plans: timePlans.map((plan) => ({
          pk: plan.pk || null,
          weekday: plan.weekday,
          time_start: plan.time_start,
          time_end: plan.time_end,
        })),
      }

      const formData = new FormData()
      formData.append("data", JSON.stringify(payload))
      if (courseData.image) {
        formData.append("image", courseData.image)
      }

      const response = await apiRequest(`/admin/courses/${slug}/update/`, {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to update course")
      }

      const result = await response.json()

      alert("دوره با موفقیت ویرایش شد!")
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Error updating course:", error)
      alert("خطا در ویرایش دوره")
    } finally {
      setIsSubmitting(false)
    }
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
            <CardTitle className="text-2xl">ویرایش دوره آموزشی</CardTitle>
            <CardDescription>اطلاعات دوره را ویرایش کنید</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">اطلاعات اصلی</h3>

                <div className="space-y-2">
                  <Label htmlFor="title">عنوان دوره *</Label>
                  <Input
                    id="title"
                    value={courseData.title}
                    onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                    placeholder="مثال: دوره جامع برنامه‌نویسی پایتون"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">اسلاگ (اختیاری)</Label>
                  <Input
                    id="slug"
                    value={courseData.slug}
                    onChange={(e) => setCourseData({ ...courseData, slug: e.target.value })}
                    placeholder="مثال: python-course-2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">توضیحات دوره (اختیاری)</Label>
                  <Textarea
                    id="description"
                    value={courseData.description}
                    onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                    placeholder="توضیحات کامل درباره دوره..."
                    rows={5}
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
                      {imagePreview ? "تغییر تصویر" : "انتخاب تصویر"}
                    </Label>
                    {imagePreview && (
                      <>
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button type="button" variant="destructive" size="sm" onClick={handleRemoveImage}>
                          <X className="h-4 w-4 ml-1" />
                          حذف تصویر
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Tags Section */}
                <div className="space-y-2">
                  <Label>برچسب‌ها (اختیاری)</Label>
                  <div className="flex gap-2 mb-2">
                    <Select onValueChange={(value) => addTag(Number.parseInt(value))}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="انتخاب برچسب موجود" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTags.map((tag) => (
                          <SelectItem key={tag.id} value={tag.id.toString()}>
                            {tag.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2 flex-1">
                      <Input
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="برچسب جدید"
                      />
                      <Button type="button" variant="outline" onClick={addNewTag}>
                        افزودن
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <div key={tag.id} className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                        <span className="text-sm">{tag.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => removeTag(tag.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Date and Time Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">زمان‌بندی</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>تاریخ و ساعت شروع *</Label>
                    <DatePicker
                      value={courseData.startDateTime}
                      onChange={(date) => setCourseData({ ...courseData, startDateTime: date })}
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD HH:mm"
                      plugins={[<TimePicker key="time-picker" position="bottom" />]}
                      className="red"
                      containerStyle={{ width: "100%" }}
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "0 12px",
                        borderRadius: "15px",
                        backgroundColor: "hsl(var(--background))",
                      }}
                      calendarPosition="bottom-center"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>تاریخ و ساعت پایان *</Label>
                    <DatePicker
                      value={courseData.endDateTime}
                      onChange={(date) => setCourseData({ ...courseData, endDateTime: date })}
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD HH:mm"
                      plugins={[<TimePicker key="time-picker" position="bottom" />]}
                      className="red"
                      containerStyle={{ width: "100%" }}
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "0 12px",
                        borderRadius: "15px",
                        backgroundColor: "hsl(var(--background))",
                      }}
                      calendarPosition="bottom-center"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>تاریخ و ساعت شروع ثبت‌نام (اختیاری)</Label>
                    <DatePicker
                      value={courseData.registrationStartDateTime}
                      onChange={(date) => setCourseData({ ...courseData, registrationStartDateTime: date })}
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD HH:mm"
                      plugins={[<TimePicker key="time-picker" position="bottom" />]}
                      className="red"
                      containerStyle={{ width: "100%" }}
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "0 12px",
                        borderRadius: "15px",
                        backgroundColor: "hsl(var(--background))",
                      }}
                      calendarPosition="bottom-center"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>مهلت ثبت‌نام *</Label>
                    <DatePicker
                      value={courseData.registrationDeadlineDateTime}
                      onChange={(date) => setCourseData({ ...courseData, registrationDeadlineDateTime: date })}
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD HH:mm"
                      plugins={[<TimePicker key="time-picker" position="bottom" />]}
                      className="red"
                      containerStyle={{ width: "100%" }}
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "0 12px",
                        borderRadius: "15px",
                        backgroundColor: "hsl(var(--background))",
                      }}
                      calendarPosition="bottom-center"
                    />
                  </div>
                </div>
              </div>

              {/* Time Plans Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">برنامه زمانی کلاس‌ها</h3>
                  <Button type="button" variant="outline" onClick={addTimePlan}>
                    <Plus className="ml-2 h-4 w-4" />
                    افزودن زمان
                  </Button>
                </div>

                {timePlans.map((plan, index) => (
                  <Card key={plan.id} className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">زمان کلاس {index + 1}</h4>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeTimePlan(plan.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="space-y-2">
                            <Label>روز هفته</Label>
                            <Select
                              value={plan.weekday}
                              onValueChange={(value) => updateTimePlan(plan.id, "weekday", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="انتخاب روز" />
                              </SelectTrigger>
                              <SelectContent>
                                {weekdayOptions.map((day) => (
                                  <SelectItem key={day.key} value={day.key}>
                                    {day.value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>ساعت شروع</Label>
                            <Input
                              type="time"
                              value={plan.time_start}
                              onChange={(e) => updateTimePlan(plan.id, "time_start", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>ساعت پایان</Label>
                            <Input
                              type="time"
                              value={plan.time_end}
                              onChange={(e) => updateTimePlan(plan.id, "time_end", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {timePlans.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">هیچ برنامه زمانی اضافه نشده است</div>
                )}
              </div>

              {/* Location and Capacity */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">محل و ظرفیت</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">مکان برگزاری *</Label>
                    <Input
                      id="location"
                      value={courseData.location}
                      onChange={(e) => setCourseData({ ...courseData, location: e.target.value })}
                      placeholder="مثال: کلاس 201 ساختمان اصلی"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">ظرفیت *</Label>
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

              {/* Dependencies Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">نیازمندی‌های ثبت‌نام</h3>

                {dependencyOptions.map((dep) => (
                  <div key={dep.key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={dep.key}
                      checked={dependencies.includes(dep.key)}
                      onChange={() => toggleDependency(dep.key)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={dep.key}>{dep.label}</Label>
                  </div>
                ))}
              </div>

              {/* Instructors Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">اساتید</h3>
                  <div className="flex gap-2">
                    <Select onValueChange={(value) => addExistingInstructor(Number.parseInt(value))}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="انتخاب استاد موجود" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePersons.map((person) => (
                          <SelectItem key={person.id} value={person.id.toString()}>
                            {person.first_name} {person.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" onClick={addNewInstructor}>
                      <Plus className="ml-2 h-4 w-4" />
                      استاد جدید
                    </Button>
                  </div>
                </div>

                {instructors.map((instructor, index) => (
                  <Card key={instructor.id} className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            استاد {index + 1}{" "}
                            {instructor.type === "existing" && (
                              <span className="text-sm text-muted-foreground">(از لیست موجود)</span>
                            )}
                          </h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeInstructor(instructor.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {instructor.type === "new" ? (
                          <>
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label>نام</Label>
                                <Input
                                  value={instructor.first_name}
                                  onChange={(e) => updateInstructor(instructor.id, "first_name", e.target.value)}
                                  placeholder="نام"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>نام خانوادگی</Label>
                                <Input
                                  value={instructor.last_name}
                                  onChange={(e) => updateInstructor(instructor.id, "last_name", e.target.value)}
                                  placeholder="نام خانوادگی"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>سمت</Label>
                              <Input
                                value={instructor.position}
                                onChange={(e) => updateInstructor(instructor.id, "position", e.target.value)}
                                placeholder="مثال: استاد دانشگاه"
                              />
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
                          </>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-sm">
                              <strong>نام:</strong> {instructor.first_name} {instructor.last_name}
                            </p>
                            <p className="text-sm">
                              <strong>سمت:</strong> {instructor.position}
                            </p>
                            {instructor.bio && (
                              <p className="text-sm">
                                <strong>بیوگرافی:</strong> {instructor.bio}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {instructors.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">هیچ استادی اضافه نشده است</div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="button" onClick={handleSubmit} className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      در حال ذخیره...
                    </>
                  ) : (
                    "ذخیره تغییرات"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                  انصراف
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
