"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
export default function EventsListPage() {
  const router = useRouter()
  const { user, loading, isCreator } = useAuth()
  

  useEffect(() => {
    if (!loading && (!user || !isCreator)) {
      router.push("/auth/login")
    }
  }, [router, user, isCreator])

    if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>در حال بارگذاری...</div>
      </div>
    )
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
        <h1 className="text-2xl font-bold mb-6">لیست رویدادها</h1>
        <p className="text-muted-foreground">لیست رویدادها در اینجا نمایش داده می‌شود</p>
      </main>
    </div>
  )
}
