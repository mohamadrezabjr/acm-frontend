"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Header } from "@/components/header"
import { Loader2, Mail } from "lucide-react"
import { verifyRegistrationOTP, resendRegistrationOTP } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"

export default function VerifyEmailPage() {
  const router = useRouter()
  const { checkAuth } = useAuth()
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(120) // 2 minutes
  const [canResend, setCanResend] = useState(false)

  // Check if registration_id exists
  useEffect(() => {
    const registrationId = document.cookie
      .split("; ")
      .find((row) => row.startsWith("registration_id="))
      ?.split("=")[1]

    if (!registrationId) {
      router.push("/auth/register")
    }
  }, [router])

  // Countdown timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("لطفاً کد شش رقمی را وارد کنید")
      return
    }

    setLoading(true)
    setError("")

    try {
      const result = await verifyRegistrationOTP(otp)

      if (result.success && result.tokens) {
        // Store tokens in cookies
        document.cookie = `access_token=${result.tokens.access}; path=/; max-age=86400; samesite=strict; ${
          process.env.NODE_ENV === "production" ? "secure;" : ""
        }`
        document.cookie = `refresh_token=${result.tokens.refresh}; path=/; max-age=604800; samesite=strict; ${
          process.env.NODE_ENV === "production" ? "secure;" : ""
        }`

        // Remove registration_id cookie
        document.cookie = "registration_id=; path=/; max-age=0"

        // Update auth state and redirect
        await checkAuth()
        router.push("/")
      } else if (result.error) {
        setError(result.error)
      }
    } catch (err) {
      setError("خطایی رخ داده است. لطفاً دوباره تلاش کنید")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    setResendLoading(true)
    setError("")

    try {
      const result = await resendRegistrationOTP()

      if (result.success) {
        setResendTimer(120) // Reset to 2 minutes
        setCanResend(false)
        setOtp("") // Clear OTP input
      } else if (result.remainingTime) {
        setResendTimer(result.remainingTime)
        setCanResend(false)
        setError(result.error || "")
      } else {
        setError(result.error || "خطا در ارسال مجدد کد")
      }
    } catch (err) {
      setError("خطایی رخ داده است")
    } finally {
      setResendLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4 py-12 pt-32">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">تایید ایمیل</CardTitle>
            <CardDescription>کد شش رقمی ارسال شده به ایمیل خود را وارد کنید</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive text-center">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex justify-center" dir="ltr">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => {
                    setOtp(value)
                    setError("")
                  }}
                  disabled={loading}
                >
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

              <Button onClick={handleVerify} className="w-full" size="lg" disabled={loading || otp.length !== 6}>
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    در حال تایید...
                  </>
                ) : (
                  "تایید کد"
                )}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">کد را دریافت نکرده‌اید؟</p>
                <Button
                  variant="outline"
                  onClick={handleResend}
                  disabled={!canResend || resendLoading}
                  className="w-full bg-transparent"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      در حال ارسال...
                    </>
                  ) : canResend ? (
                    "دریافت مجدد کد"
                  ) : (
                    `دریافت مجدد کد (${formatTime(resendTimer)})`
                  )}
                </Button>
              </div>
            </div>

            <div className="text-center text-sm">
              <button
                onClick={() => {
                  document.cookie = "registration_id=; path=/; max-age=0"
                  router.push("/auth/register")
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                بازگشت به صفحه ثبت‌نام
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
