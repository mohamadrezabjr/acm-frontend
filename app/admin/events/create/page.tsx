"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Upload, ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import TimePicker from "react-multi-date-picker/plugins/time_picker"
import "react-multi-date-picker/styles/colors/red.css"
import { apiRequest } from "@/lib/api-client"

interface Tag {
  id: number
  name: string
}

interface Person {
  id: number
  user?: number
  first_name: string
  last_name: string
  bio?: string
  position?: string
}

interface Speaker {
  id: string
  person_id?: number | null
  type: "existing" | "new"
  user?: number | null
  first_name: string
  last_name: string
  bio: string
  position: string
}

export default function CreateEventPage() {
  const { user, loading, isCreator } = useAuth()
  const router = useRouter()
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [availablePersons, setAvailablePersons] = useState<Person[]>([])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [newTagName, setNewTagName] = useState("")

  // Event form data with DatePicker values
  const [eventData, setEventData] = useState({
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
  })

  useEffect(() => {
    if (!loading && (!user || !isCreator())) {
      router.push("/auth/login")
    }
  }, [loading, user, router, isCreator])

  useEffect(() => {
    // Fetch tags from backend
    const fetchTags = async () => {
      try {
        const response = await apiRequest("/tags")
        const data = await response.json()
        setAvailableTags(data)
      } catch (error) {
        console.error("Error fetching tags:", error)
      }
    }

    // Fetch persons from backend
    const fetchPersons = async () => {
      try {
        const response = await apiRequest("/persons")
        const data = await response.json()
        setAvailablePersons(data)
      } catch (error) {
        console.error("Error fetching persons:", error)
      }
    }

    fetchTags()
    fetchPersons()
  }, [])

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

  const addNewSpeaker = () => {
    setSpeakers([
      ...speakers,
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

  const addExistingSpeaker = (personId: number) => {
    const person = availablePersons.find((p) => p.id === personId)
    if (person) {
      setSpeakers([
        ...speakers,
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

  const removeSpeaker = (id: string) => {
    setSpeakers(speakers.filter((speaker) => speaker.id !== id))
  }

  const updateSpeaker = (id: string, field: keyof Speaker, value: string) => {
    setSpeakers(speakers.map((speaker) => (speaker.id === id ? { ...speaker, [field]: value } : speaker)))
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
      setEventData({ ...eventData, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Convert DatePicker value to ISO format for backend
  const formatDateTime = (dateValue: any) => {
    if (!dateValue) return null
    // DatePicker با تقویم شمسی داده می‌ده، تبدیل به ISO
    return dateValue.toDate().toISOString()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prepare backend payload
    const payload = {
      title: eventData.title,
      slug: eventData.slug || undefined,
      description: eventData.description || undefined,
      tags: selectedTags.map((tag) => ({ name: tag.name })),
      start_date: formatDateTime(eventData.startDateTime),
      end_date: formatDateTime(eventData.endDateTime),
      registration_start_at: formatDateTime(eventData.registrationStartDateTime),
      registration_deadline: formatDateTime(eventData.registrationDeadlineDateTime),
      capacity: eventData.capacity ? parseInt(eventData.capacity) : null,
      registered: 0,
      location: eventData.location,
      price: eventData.price ? parseFloat(eventData.price) : 0,
      organizer: eventData.organizer,
      speakers: speakers.map((speaker) => ({
        id: speaker.type === "existing" ? speaker.person_id : null,
        first_name: speaker.type === "new" ? speaker.first_name : "",
        last_name: speaker.type === "new" ? speaker.last_name : "",
        bio: speaker.bio,
        position: speaker.position,
      })),
    }

    console.log("Event Data to send to backend:", JSON.stringify(payload))

    try {
      const formData = new FormData()
      formData.append("data", JSON.stringify(payload))
      if (eventData.image) {
        formData.append("image", eventData.image)
      }

      // Send to Django backend
      console.log(formData)
      const response = await apiRequest('/events/create/', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to create event')
      }
      
      const result = await response.json()

      alert("رویداد با موفقیت ایجاد شد!")
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Error creating event:", error)
      alert("خطا در ایجاد رویداد")
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
            <CardTitle className="text-2xl">ایجاد رویداد جدید</CardTitle>
            <CardDescription>اطلاعات رویداد را با دقت وارد کنید</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">اطلاعات اصلی</h3>

                <div className="space-y-2">
                  <Label htmlFor="title">عنوان رویداد *</Label>
                  <Input
                    id="title"
                    value={eventData.title}
                    onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                    placeholder="مثال: کارگاه هوش مصنوعی"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">اسلاگ (اختیاری)</Label>
                  <Input
                    id="slug"
                    value={eventData.slug}
                    onChange={(e) => setEventData({ ...eventData, slug: e.target.value })}
                    placeholder="مثال: ai-workshop-2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">توضیحات رویداد (اختیاری)</Label>
                  <Textarea
                    id="description"
                    value={eventData.description}
                    onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                    placeholder="توضیحات کامل درباره رویداد..."
                    rows={5}
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
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags Section */}
                <div className="space-y-2">
                  <Label>برچسب‌ها (اختیاری)</Label>
                  <div className="flex gap-2 mb-2">
                    <Select onValueChange={(value) => addTag(parseInt(value))}>
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
                      value={eventData.startDateTime}
                      onChange={(date) => setEventData({ ...eventData, startDateTime: date })}
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD HH:mm"
                      plugins={[<TimePicker position="bottom" />]}
                      className="red"
                      containerStyle={{ width: "100%" }}
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "0 12px",
                        borderRadius: "6px",
                        border: "1px solid hsl(var(--input))",
                        backgroundColor: "hsl(var(--background))",
                      }}
                      calendarPosition="bottom-center"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>تاریخ و ساعت پایان *</Label>
                    <DatePicker
                      value={eventData.endDateTime}
                      onChange={(date) => setEventData({ ...eventData, endDateTime: date })}
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD HH:mm"
                      plugins={[<TimePicker position="bottom" />]}
                      className="red"
                      containerStyle={{ width: "100%" }}
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "0 12px",
                        borderRadius: "6px",
                        border: "1px solid hsl(var(--input))",
                        backgroundColor: "hsl(var(--background))",
                      }}
                      calendarPosition="bottom-center"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>تاریخ و ساعت شروع ثبت‌نام (اختیاری)</Label>
                    <DatePicker
                      value={eventData.registrationStartDateTime}
                      onChange={(date) => setEventData({ ...eventData, registrationStartDateTime: date })}
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD HH:mm"
                      plugins={[<TimePicker position="bottom" />]}
                      className="red"
                      containerStyle={{ width: "100%" }}
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "0 12px",
                        borderRadius: "6px",
                        border: "1px solid hsl(var(--input))",
                        backgroundColor: "hsl(var(--background))",
                      }}
                      calendarPosition="bottom-center"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>مهلت ثبت‌نام *</Label>
                    <DatePicker
                      value={eventData.registrationDeadlineDateTime}
                      onChange={(date) => setEventData({ ...eventData, registrationDeadlineDateTime: date })}
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD HH:mm"
                      plugins={[<TimePicker position="bottom" />]}
                      className="red"
                      containerStyle={{ width: "100%" }}
                      style={{
                        width: "100%",
                        height: "40px",
                        padding: "0 12px",
                        borderRadius: "6px",
                        border: "1px solid hsl(var(--input))",
                        backgroundColor: "hsl(var(--background))",
                      }}
                      calendarPosition="bottom-center"
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
                  <div className="flex gap-2">
                    <Select onValueChange={(value) => addExistingSpeaker(parseInt(value))}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="انتخاب سخنران موجود" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePersons.map((person) => (
                          <SelectItem key={person.id} value={person.id.toString()}>
                            {person.first_name} {person.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" onClick={addNewSpeaker}>
                      <Plus className="ml-2 h-4 w-4" />
                      سخنران جدید
                    </Button>
                  </div>
                </div>

                {speakers.map((speaker, index) => (
                  <Card key={speaker.id} className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            سخنران {index + 1}{" "}
                            {speaker.type === "existing" && (
                              <span className="text-sm text-muted-foreground">(از لیست موجود)</span>
                            )}
                          </h4>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeSpeaker(speaker.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {speaker.type === "new" ? (
                          <>
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label>نام</Label>
                                <Input
                                  value={speaker.first_name}
                                  onChange={(e) => updateSpeaker(speaker.id, "first_name", e.target.value)}
                                  placeholder="نام"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>نام خانوادگی</Label>
                                <Input
                                  value={speaker.last_name}
                                  onChange={(e) => updateSpeaker(speaker.id, "last_name", e.target.value)}
                                  placeholder="نام خانوادگی"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>سمت</Label>
                              <Input
                                value={speaker.position}
                                onChange={(e) => updateSpeaker(speaker.id, "position", e.target.value)}
                                placeholder="مثال: استاد دانشگاه"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>بیوگرافی</Label>
                              <Textarea
                                value={speaker.bio}
                                onChange={(e) => updateSpeaker(speaker.id, "bio", e.target.value)}
                                placeholder="توضیحات مختصر درباره سخنران..."
                                rows={3}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-sm">
                              <strong>نام:</strong> {speaker.first_name} {speaker.last_name}
                            </p>
                            <p className="text-sm">
                              <strong>سمت:</strong> {speaker.position}
                            </p>
                            {speaker.bio && (
                              <p className="text-sm">
                                <strong>بیوگرافی:</strong> {speaker.bio}
                              </p>
                            )}
                          </div>
                        )}
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
                <Button type="button" onClick={handleSubmit} className="flex-1">
                  ایجاد رویداد
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
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