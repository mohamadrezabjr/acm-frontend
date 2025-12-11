"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Header } from "@/components/header"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [mobileData, setMobileData] = useState({ mobile: "", password: "" })
  const [studentData, setStudentData] = useState({ studentId: "", password: "" })

  const handleMobileLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login with mobile:", mobileData)
    // Send to backend
  }

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login with student ID:", studentData)
    // Send to backend
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4 pt-32">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">ورود</CardTitle>
            <CardDescription>برای ورود به حساب کاربری خود اطلاعات را وارد کنید</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="mobile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mobile">شماره موبایل</TabsTrigger>
                <TabsTrigger value="student">شماره دانشجویی</TabsTrigger>
              </TabsList>

              <TabsContent value="mobile">
                <form onSubmit={handleMobileLogin} className="space-y-4 mt-4">
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
                      title="شماره موبایل باید با 09 شروع شود و 11 رقم باشد"
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
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    ورود
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="student">
                <form onSubmit={handleStudentLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-id">شماره دانشجویی</Label>
                    <Input
                      id="student-id"
                      type="text"
                      placeholder="1234567890"
                      value={studentData.studentId}
                      onChange={(e) => setStudentData({ ...studentData, studentId: e.target.value })}
                      required
                      pattern="[0-9]{10}"
                      title="شماره دانشجویی باید 10 رقم باشد"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-password">رمز عبور</Label>
                    <div className="relative">
                      <Input
                        id="student-password"
                        type={showPassword ? "text" : "password"}
                        value={studentData.password}
                        onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    ورود
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm">
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
