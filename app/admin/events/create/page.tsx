"use client"

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
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Speaker {
  id: string
  name: string
  position: string
  description: string
}

export default function CreateEventPage() {
  const { user, loading, isCreator } = useAuth()
  const router = useRouter()
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Event form data
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    startDate: "",
    registrationDeadline: "",
    time: "",
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

  const addSpeaker = () => {
    setSpeakers([
      ...speakers,
      {
        id: Date.now().toString(),
        name: "",
        position: "",
        description: "",
      },
    ])
  }

  const removeSpeaker = (id: string) => {
    setSpeakers(speakers.filter((speaker) => speaker.id !== id))
  }

  const updateSpeaker = (id: string, field: keyof Speaker, value: string) => {
    setSpeakers(speakers.map((speaker) => (speaker.id === id ? { ...speaker, [field]: value } : speaker)))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setEventData({ ...eventData, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Prepare data to send to backend
    const formData = new FormData()
    formData.append("name", eventData.name)
    formData.append("description", eventData.description)
    formData.append("startDate", eventData.startDate)
    formData.append("registrationDeadline", eventData.registrationDeadline)
    formData.append("time", eventData.time)
    formData.append("location", eventData.location)
    formData.append("capacity", eventData.capacity)
    formData.append("organizer", eventData.organizer)
    formData.append("price", eventData.price)
    formData.append("speakers", JSON.stringify(speakers))

    if (eventData.image) {
      formData.append("image", eventData.image)
    }

    console.log("Event Data to send to backend:", {
      ...eventData,
      speakers,
      image: eventData.image?.name,
    })

    // TODO: Send formData to Django backend
    // fetch('/api/events', { method: 'POST', body: formData })

    alert("رویداد با موفقیت ایجاد شد! (داده‌ها در console لاگ شده‌اند)")
    router.push("/admin/dashboard")
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
            <CardTitle className="text-2xl">ایجاد رویداد جدید</CardTitle>
            <CardDescription>اطلاعات رویداد را با دقت وارد کنید</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">اطلاعات اصلی</h3>

                <div className="space-y-2">
                  <Label htmlFor="name">نام رویداد *</Label>
                  <Input
                    id="name"
                    value={eventData.name}
                    onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
                    placeholder="مثال: کارگاه هوش مصنوعی"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">توضیحات رویداد *</Label>
                  <Textarea
                    id="description"
                    value={eventData.description}
                    onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                    placeholder="توضیحات کامل درباره رویداد..."
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">تصویر رویداد</Label>
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

              {/* Date and Time Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">زمان‌بندی</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">تاریخ شروع رویداد *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={eventData.startDate}
                      onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">ساعت رویداد *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={eventData.time}
                      onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registrationDeadline">مهلت ثبت‌نام *</Label>
                    <Input
                      id="registrationDeadline"
                      type="date"
                      value={eventData.registrationDeadline}
                      onChange={(e) => setEventData({ ...eventData, registrationDeadline: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location and Capacity */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">محل و ظرفیت</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">مکان رویداد *</Label>
                    <Input
                      id="location"
                      value={eventData.location}
                      onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                      placeholder="مثال: سالن کنفرانس دانشگاه"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">ظرفیت *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={eventData.capacity}
                      onChange={(e) => setEventData({ ...eventData, capacity: e.target.value })}
                      placeholder="تعداد نفرات"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizer">برگزارکننده *</Label>
                    <Input
                      id="organizer"
                      value={eventData.organizer}
                      onChange={(e) => setEventData({ ...eventData, organizer: e.target.value })}
                      placeholder="نام برگزارکننده"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">هزینه (تومان) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={eventData.price}
                      onChange={(e) => setEventData({ ...eventData, price: e.target.value })}
                      placeholder="0 برای رایگان"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Speakers Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">سخنرانان</h3>
                  <Button type="button" variant="outline" onClick={addSpeaker}>
                    <Plus className="ml-2 h-4 w-4" />
                    افزودن سخنران
                  </Button>
                </div>

                {speakers.map((speaker, index) => (
                  <Card key={speaker.id} className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">سخنران {index + 1}</h4>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeSpeaker(speaker.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>نام سخنران</Label>
                            <Input
                              value={speaker.name}
                              onChange={(e) => updateSpeaker(speaker.id, "name", e.target.value)}
                              placeholder="نام و نام خانوادگی"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>سمت</Label>
                            <Input
                              value={speaker.position}
                              onChange={(e) => updateSpeaker(speaker.id, "position", e.target.value)}
                              placeholder="مثال: استاد دانشگاه"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>توضیحات</Label>
                          <Textarea
                            value={speaker.description}
                            onChange={(e) => updateSpeaker(speaker.id, "description", e.target.value)}
                            placeholder="توضیحات مختصر درباره سخنران..."
                            rows={3}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {speakers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">هیچ سخنرانی اضافه نشده است</div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  ایجاد رویداد
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
