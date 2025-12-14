// app/admin/courses/create/CreateCourseClient.tsx

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import {
  Plus,
  X,
  Upload,
  ArrowRight,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useAuth } from "@/lib/auth-context"

interface Instructor {
  id: string
  name: string
  position: string
  bio: string
}

export default function CreateCourseClient() {
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

  /* -------------------- Auth Guard -------------------- */
  useEffect(() => {
    if (!loading && (!user || !isCreator())) {
      router.replace("/auth/login")
    }
  }, [loading, user, router])

  /* -------------------- Instructors -------------------- */
  const addInstructor = () => {
    setInstructors((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", position: "", bio: "" },
    ])
  }

  const removeInstructor = (id: string) => {
    setInstructors((prev) => prev.filter((i) => i.id !== id))
  }

  const updateInstructor = (
    id: string,
    field: keyof Instructor,
    value: string
  ) => {
    setInstructors((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    )
  }

  /* -------------------- Image Upload -------------------- */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCourseData((prev) => ({ ...prev, image: file }))

    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  /* -------------------- Submit -------------------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    Object.entries(courseData).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value as string)
    })

    formData.append("instructors", JSON.stringify(instructors))

    console.log("Course Data to send to backend:", {
      ...courseData,
      instructors,
      image: courseData.image?.name,
    })

    alert("دوره با موفقیت ایجاد شد!")
    router.push("/admin/dashboard")
  }

  /* -------------------- States -------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !isCreator()) return null

  /* -------------------- UI -------------------- */
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
            <CardDescription>
              اطلاعات دوره آموزشی را با دقت وارد کنید
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ---- اطلاعات اصلی ---- */}
              <div className="space-y-4">
                <Label>نام دوره *</Label>
                <Input
                  required
                  value={courseData.name}
                  onChange={(e) =>
                    setCourseData({ ...courseData, name: e.target.value })
                  }
                />

                <Label>توضیحات *</Label>
                <Textarea
                  required
                  rows={5}
                  value={courseData.description}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              {/* ---- اساتید ---- */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">اساتید</h3>
                  <Button type="button" variant="outline" onClick={addInstructor}>
                    <Plus className="ml-2 h-4 w-4" />
                    افزودن استاد
                  </Button>
                </div>

                {instructors.map((ins, idx) => (
                  <Card key={ins.id} className="bg-muted/30">
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex justify-between items-center">
                        <span>استاد {idx + 1}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeInstructor(ins.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <Input
                        placeholder="نام استاد"
                        value={ins.name}
                        onChange={(e) =>
                          updateInstructor(ins.id, "name", e.target.value)
                        }
                      />
                      <Input
                        placeholder="سمت"
                        value={ins.position}
                        onChange={(e) =>
                          updateInstructor(ins.id, "position", e.target.value)
                        }
                      />
                      <Textarea
                        rows={3}
                        placeholder="بیوگرافی"
                        value={ins.bio}
                        onChange={(e) =>
                          updateInstructor(ins.id, "bio", e.target.value)
                        }
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* ---- دکمه‌ها ---- */}
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
