"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [mobileData, setMobileData] = useState({ mobile: "", password: "" })
  const [emailData, setEmailData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleMobileLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await login(mobileData.mobile, mobileData.password, false)
    } catch (err: any) {
      setError(err.message || "خطا در ورود. لطفاً دوباره تلاش کنید.")
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await login(emailData.email, emailData.password, false)
    } catch (err: any) {
      setError(err.message || "خطا در ورود. لطفاً دوباره تلاش کنید.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4 pt-32">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-right">
            <CardTitle className="text-3xl font-bold">ورود</CardTitle>
            <CardDescription>برای ورود به حساب کاربری خود اطلاعات را وارد کنید</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive text-right">{error}</p>
              </div>
            )}

            <Tabs defaultValue="mobile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="mobile">شماره موبایل</TabsTrigger>
                <TabsTrigger value="email">ایمیل</TabsTrigger>
              </TabsList>

              <TabsContent value="mobile">
                <form onSubmit={handleMobileLogin} className="space-y-4 text-right">
                  <div className="space-y-2">
                    <Label htmlFor="mobile">شماره موبایل</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="09123456789"
                      value={mobileData.mobile}
                      onChange={(e) => setMobileData({ ...mobileData, mobile: e.target.value })}
                      required
                      pattern="09[0-9]{9}"
                      title="شماره موبایل باید با 09 شروع شده و 11 رقم باشد"
                      disabled={loading}
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile-password">رمز عبور</Label>
                    <div className="relative">
                      <Input
                        id="mobile-password"
                        type={showPassword ? "text" : "password"}
                        value={mobileData.password}
                        onChange={(e) => setMobileData({ ...mobileData, password: e.target.value })}
                        required
                        disabled={loading}
                        className="text-right pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        در حال ورود...
                      </>
                    ) : (
                      "ورود"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="email">
                <form onSubmit={handleEmailLogin} className="space-y-4 text-right">
                  <div className="space-y-2">
                    <Label htmlFor="email">ایمیل</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={emailData.email}
                      onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                      required
                      disabled={loading}
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-password">رمز عبور</Label>
                    <div className="relative">
                      <Input
                        id="email-password"
                        type={showPassword ? "text" : "password"}
                        value={emailData.password}
                        onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                        required
                        disabled={loading}
                        className="text-right pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        در حال ورود...
                      </>
                    ) : (
                      "ورود"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-right text-sm">
              <span className="text-muted-foreground">حساب کاربری ندارید؟</span>{" "}
              <Link href="/auth/register" className="text-primary hover:underline font-medium">
                ثبت‌نام کنید
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
