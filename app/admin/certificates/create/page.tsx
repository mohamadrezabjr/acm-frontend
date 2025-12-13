"use client"

export const dynamic = "force-dynamic"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Download } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"

export default function CreateCertificatePage() {
  const { user, loading, isCreator } = useAuth()
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [certificateData, setCertificateData] = useState({
    participantName: "",
    eventName: "",
    date: "",
    organizer: "انجمن ACM دانشگاهی",
  })

  useEffect(() => {
    if (!loading && (!user || !isCreator())) {
      router.push("/auth/login")
    }
  }, [loading, user, router])

  useEffect(() => {
    drawCertificate()
  }, [certificateData])

  const drawCertificate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 1200
    canvas.height = 850

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#f0f9ff")
    gradient.addColorStop(1, "#e0f2fe")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Border
    ctx.strokeStyle = "#0369a1"
    ctx.lineWidth = 20
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80)

    // Inner border
    ctx.strokeStyle = "#0ea5e9"
    ctx.lineWidth = 2
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120)

    // Title
    ctx.fillStyle = "#0369a1"
    ctx.font = "bold 60px Arial"
    ctx.textAlign = "center"
    ctx.fillText("گواهینامه شرکت", canvas.width / 2, 180)

    // Subtitle
    ctx.font = "30px Arial"
    ctx.fillStyle = "#64748b"
    ctx.fillText("این گواهینامه به منظور تقدیر از", canvas.width / 2, 250)

    // Participant name
    ctx.font = "bold 50px Arial"
    ctx.fillStyle = "#0f172a"
    const nameText = certificateData.participantName || "[نام شرکت‌کننده]"
    ctx.fillText(nameText, canvas.width / 2, 340)

    // Event details
    ctx.font = "30px Arial"
    ctx.fillStyle = "#64748b"
    ctx.fillText("برای شرکت موفق در", canvas.width / 2, 420)

    ctx.font = "bold 40px Arial"
    ctx.fillStyle = "#0369a1"
    const eventText = certificateData.eventName || "[نام رویداد]"
    ctx.fillText(eventText, canvas.width / 2, 490)

    // Date
    ctx.font = "28px Arial"
    ctx.fillStyle = "#64748b"
    const dateText = certificateData.date
      ? `تاریخ: ${new Date(certificateData.date).toLocaleDateString("fa-IR")}`
      : "تاریخ: [تاریخ رویداد]"
    ctx.fillText(dateText, canvas.width / 2, 570)

    // Organizer
    ctx.font = "italic 32px Arial"
    ctx.fillStyle = "#0f172a"
    ctx.fillText(certificateData.organizer, canvas.width / 2, 680)

    // Signature line
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2 - 200, 750)
    ctx.lineTo(canvas.width / 2 + 200, 750)
    ctx.stroke()

    ctx.font = "24px Arial"
    ctx.fillStyle = "#64748b"
    ctx.fillText("امضای مسئول", canvas.width / 2, 785)
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = `certificate-${certificateData.participantName || "new"}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Generate image data
    const canvas = canvasRef.current
    const imageData = canvas?.toDataURL("image/png")

    console.log("Certificate Data to send to backend:", {
      ...certificateData,
      imageData,
    })

    // TODO: Send to Django backend
    // fetch('/api/certificates', { method: 'POST', body: JSON.stringify({ ...certificateData, imageData }) })

    alert("مدرک با موفقیت ایجاد شد! (داده‌ها در console لاگ شده‌اند)")
    handleDownload()
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

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">ایجاد مدرک جدید</CardTitle>
              <CardDescription>اطلاعات مدرک را وارد کنید</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="participantName">نام شرکت‌کننده *</Label>
                  <Input
                    id="participantName"
                    value={certificateData.participantName}
                    onChange={(e) => setCertificateData({ ...certificateData, participantName: e.target.value })}
                    placeholder="نام و نام خانوادگی"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventName">نام رویداد *</Label>
                  <Input
                    id="eventName"
                    value={certificateData.eventName}
                    onChange={(e) => setCertificateData({ ...certificateData, eventName: e.target.value })}
                    placeholder="مثال: کارگاه هوش مصنوعی"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">تاریخ رویداد *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={certificateData.date}
                    onChange={(e) => setCertificateData({ ...certificateData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizer">نام برگزارکننده *</Label>
                  <Input
                    id="organizer"
                    value={certificateData.organizer}
                    onChange={(e) => setCertificateData({ ...certificateData, organizer: e.target.value })}
                    placeholder="انجمن ACM دانشگاهی"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    ایجاد و دانلود مدرک
                  </Button>
                  <Button type="button" variant="outline" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>پیش‌نمایش مدرک</CardTitle>
              <CardDescription>مدرک به صورت زنده پیش‌نمایش می‌شود</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-white">
                <canvas ref={canvasRef} className="w-full h-auto" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
