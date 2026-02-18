"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Loader2, Send, Lock, ArrowRight, KeyRound } from "lucide-react"
import { Header } from "@/components/header"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { apiRequest } from "@/lib/api-client"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "verify" | "reset">("email")
  const [email, setEmail] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendTimer, setResendTimer] = useState(0)
  const router = useRouter()
  const { checkAuth } = useAuth()

  // Timer countdown for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await apiRequest("/auth/forgot-password/send-otp/", {
        method: "POST",
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setStep("verify")
        setResendTimer(120) // 2 minutes
      } else {
        const errorData = await response.json()
        setError(errorData.detail || "خطا در ارسال کد. لطفاً دوباره تلاش کنید.")
      }
    } catch (err: any) {
      setError("خطا در اتصال به سرور")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0) return

    setLoading(true)
    setError("")

    try {
      const response = await apiRequest("/auth/forgot-password/send-otp/", {
        method: "POST",
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setResendTimer(120)
      } else {
        const errorData = await response.json()
        if (errorData.wait_time) {
          setError(`لطفاً ${errorData.wait_time} ثانیه دیگر صبر کنید`)
          setResendTimer(errorData.wait_time)
        } else {
          setError(errorData.detail || "خطا در ارسال مجدد کد")
        }
      }
    } catch (err: any) {
      setError("خطا در اتصال به سرور")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      setError("کد باید 6 رقم باشد")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password/verify/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, otp: otpCode }),
      })

      if (response.ok) {
        const data = await response.json()

        // Save JWT tokens
        document.cookie = `access_token=${data.access}; path=/; max-age=86400; samesite=strict; ${
          process.env.NODE_ENV === "production" ? "secure;" : ""
        }`
        document.cookie = `refresh_token=${data.refresh}; path=/; max-age=604800; samesite=strict; ${
          process.env.NODE_ENV === "production" ? "secure;" : ""
        }`

        // Update auth context
        await checkAuth()

        // Move to reset step
        setStep("reset")
      } else {
        const errorData = await response.json()
        setError(errorData.detail || "کد وارد شده اشتباه است")
      }
    } catch (err: any) {
      setError("خطا در اتصال به سرور")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!newPassword || newPassword.length < 8) {
      setError("رمز عبور باید حداقل 8 کاراکتر باشد")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند")
      return
    }

    setLoading(true)

    try {
      const response = await apiRequest("/auth/forgot-password/reset/", {
        method: "POST",
        body: JSON.stringify({
          email,
          otp: otpCode,
          new_password: newPassword,
        }),
      })

      if (response.ok) {
        router.push("/")
      } else {
        const errorData = await response.json()
        setError(errorData.detail || "خطا در تغییر رمز عبور")
      }
    } catch (err: any) {
      setError("خطا در اتصال به سرور")
    } finally {
      setLoading(false)
    }
  }

  const handleSkipToHome = () => {
    router.push("/")
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4 pt-32">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">بازیابی رمز عبور</CardTitle>
            <CardDescription>
              {step === "email" && "ایمیل خود را وارد کنید تا کد تایید برای شما ارسال شود"}
              {step === "verify" && "کد 6 رقمی ارسال شده به ایمیل خود را وارد کنید"}
              {step === "reset" && "رمز عبور جدید خود را وارد کنید یا به صفحه اصلی بروید"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive text-right">{error}</p>
              </div>
            )}

            {/* Step 1: Enter Email */}
            {step === "email" && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-right block">
                    ایمیل
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="text-left"
                    dir="ltr"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      <Send className="ml-2 h-4 w-4" />
                      ارسال کد تایید
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Step 2: Verify OTP */}
            {step === "verify" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-right block text-sm text-muted-foreground">ایمیل</Label>
                  <p className="text-right font-medium" dir="ltr">
                    {email}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4" dir="ltr">
                  <InputOTP maxLength={6} value={otpCode} onChange={(value) => setOtpCode(value)} disabled={loading}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="flex gap-2 flex-wrap justify-end">
                  <Button variant="outline" onClick={handleResendOtp} disabled={resendTimer > 0 || loading} size="sm">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin ml-2" />
                        در حال ارسال...
                      </>
                    ) : resendTimer > 0 ? (
                      <>
                        ارسال مجدد ({Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, "0")})
                      </>
                    ) : (
                      "ارسال مجدد کد"
                    )}
                  </Button>
                  <Button onClick={handleVerifyOtp} disabled={loading || otpCode.length !== 6} size="sm">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin ml-2" />
                        در حال تایید...
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4 ml-2" />
                        تایید کد
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Reset Password or Continue */}
            {step === "reset" && (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-md p-3 mb-4">
                  <p className="text-sm text-green-600 dark:text-green-400 text-right">
                    کد تایید شد! شما الان وارد سیستم شده‌اید.
                  </p>
                </div>

                {/* Display verified OTP (read-only) */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-right block">کد تایید شده</Label>
                  <div className="flex justify-center" dir="ltr">
                    <InputOTP maxLength={6} value={otpCode} disabled>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-right block">
                      رمز عبور جدید
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="حداقل 8 کاراکتر"
                      className="text-right"
                      dir="ltr"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-right block">
                      تکرار رمز عبور جدید
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="تکرار رمز عبور"
                      className="text-right"
                      dir="ltr"
                      disabled={loading}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={handleSkipToHome} className="flex-1">
                      <ArrowRight className="ml-2 h-4 w-4" />
                      رفتن به صفحه اصلی
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          در حال تغییر...
                        </>
                      ) : (
                        <>
                          <Lock className="ml-2 h-4 w-4" />
                          تغییر رمز
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            <div className="mt-6 text-center text-sm">
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                بازگشت به صفحه ورود
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
