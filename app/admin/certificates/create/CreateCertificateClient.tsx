"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Download, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useAuth } from "@/hooks/useAuth"

export default function CreateCertificateClient() {
  const { user, loading, isCreator } = useAuth()
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [certificateData, setCertificateData] = useState({
    participantName: "",
    eventName: "",
    date: "",
    organizer: "انجمن ACM دانشگاهی",
  })

  /* -------------------- Auth Guard -------------------- */
  useEffect(() => {
    if (!loading && (!user || !isCreator())) {
      router.replace("/auth/login")
    }
  }, [loading, user, router])

  /* -------------------- Draw Certificate -------------------- */
  useEffect(() => {
    drawCertificate()
  }, [certificateData])

  const drawCertificate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 1200
    canvas.height = 850

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#f0f9ff")
    gradient.addColorStop(1, "#e0f2fe")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = "#0369a1"
    ctx.lineWidth = 20
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80)

    ctx.strokeStyle = "#0ea5e9"
    ctx.lineWidth = 2
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120)

    ctx.textAlign = "center"

    ctx.fillStyle = "#0369a1"
    ctx.font = "bold 60px Arial"
    ctx.fillText("گواهینامه شرکت", canvas.width / 2, 180)

    ctx.font = "30px Arial"
    ctx.fillStyle = "#64748b"
    ctx.fillText("این گواهینامه به منظور تقدیر از", canvas.width / 2, 250)

    ctx.font = "bold 50px Arial"
    ctx.fillStyle = "#0f172a"
    ctx.fillText(
      certificateData.participantName || "[نام شرکت‌کننده]",
      canvas.width / 2,
      340
    )

    ctx.font = "30px Arial"
    ctx.fillStyle = "#64748b"
    ctx.fillText("برای شرکت موفق در", canvas.width / 2, 420)

    ctx.font = "bold 40px Arial"
    ctx.fillStyle = "#0369a1"
    ctx.fillText(
      certificateData.eventName || "[نام رویداد]",
      canvas.width / 2,
      490
    )

    ctx.font = "28px Arial"
    ctx.fillStyle = "#64748b"
    ctx.fillText(
      certificateData.date
        ? `تاریخ: ${new Date(certificateData.date).toLocaleDateString("fa-IR")}`
        : "تاریخ: [تاریخ رویداد]",
      canvas.width / 2,
      570
    )

    ctx.font = "italic 32px Arial"
    ctx.fillStyle = "#0f172a"
    ctx.fillText(certificateData.organizer, canvas.width / 2, 680)

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

  /* -------------------- Actions -------------------- */
  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = `certificate-${certificateData.participantName || "new"}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleDownload()
  }

  /* -------------------- States -------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
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

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">ایجاد مدرک جدید</CardTitle>
              <CardDescription>اطلاعات مدرک را وارد کنید</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="نام شرکت‌کننده"
                  required
                  value={certificateData.participantName}
                  onChange={(e) =>
                    setCertificateData({
                      ...certificateData,
                      participantName: e.target.value,
                    })
                  }
                />

                <Input
                  placeholder="نام رویداد"
                  required
                  value={certificateData.eventName}
                  onChange={(e) =>
                    setCertificateData({
                      ...certificateData,
                      eventName: e.target.value,
                    })
                  }
                />

                <Input
                  type="date"
                  required
                  value={certificateData.date}
                  onChange={(e) =>
                    setCertificateData({
                      ...certificateData,
                      date: e.target.value,
                    })
                  }
                />

                <Input
                  placeholder="برگزارکننده"
                  required
                  value={certificateData.organizer}
                  onChange={(e) =>
                    setCertificateData({
                      ...certificateData,
                      organizer: e.target.value,
                    })
                  }
                />

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    ایجاد و دانلود
                  </Button>
                  <Button type="button" variant="outline" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>پیش‌نمایش</CardTitle>
              <CardDescription>پیش‌نمایش زنده مدرک</CardDescription>
            </CardHeader>
            <CardContent>
              <canvas ref={canvasRef} className="w-full bg-white rounded-lg" />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
