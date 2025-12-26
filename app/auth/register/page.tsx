"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import { useAuth } from "@/lib/auth-context"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    studentId: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  // تابع تبدیل اعداد فارسی به انگلیسی
  const convertPersianToEnglish = (str: string) => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    
    let result = str;
    for (let i = 0; i < 10; i++) {
      result = result.replace(new RegExp(persianNumbers[i], 'g'), i.toString());
      result = result.replace(new RegExp(arabicNumbers[i], 'g'), i.toString());
    }
    return result;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName) newErrors.firstName = "نام الزامی است"
    
    // تبدیل اعداد فارسی به انگلیسی برای validation
    const mobileEnglish = convertPersianToEnglish(formData.mobile);
    const studentIdEnglish = convertPersianToEnglish(formData.studentId);
    
    if (!formData.mobile) {
      newErrors.mobile = "شماره موبایل الزامی است"
    } else if (!/^09[0-9]{9}$/.test(mobileEnglish)) {
      newErrors.mobile = "شماره موبایل نامعتبر است"
    }
    if (!formData.email) {
      newErrors.email = "ایمیل الزامی است"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "ایمیل نامعتبر است"
    }
    if (formData.studentId && !/^[0-9]{10}$/.test(studentIdEnglish)) {
      newErrors.studentId = "شماره دانشجویی باید 10 رقم باشد"
    }
    if (formData.lastName && formData.lastName.trim() === "") {
      newErrors.lastName = "نام خانوادگی نامعتبر است"
    }
    if (!formData.password) {
      newErrors.password = "رمز عبور الزامی است"
    } else if (formData.password.length < 8) {
      newErrors.password = "رمز عبور باید حداقل 8 کاراکتر باشد"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "رمز عبور و تکرار آن یکسان نیستند"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setLoading(true)
      try {
        await register({
          firstName: formData.firstName,
          lastName: formData.lastName || undefined,
          phone: convertPersianToEnglish(formData.mobile),
          email: formData.email,
          studentId: formData.studentId ? convertPersianToEnglish(formData.studentId) : undefined,
          password: formData.password,
        })
      } catch (err: any) {
        setErrors({ submit: err.message || "خطا در ثبت‌نام. لطفاً دوباره تلاش کنید." })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4 py-12 pt-32">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">ثبت‌نام</CardTitle>
            <CardDescription>برای ایجاد حساب کاربری اطلاعات خود را وارد کنید</CardDescription>
          </CardHeader>
          <CardContent>
            {errors.submit && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive text-center">{errors.submit}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* نام و نام خانوادگی */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    نام <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className={errors.firstName ? "border-destructive" : ""}
                    disabled={loading}
                  />
                  {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">نام خانوادگی (اختیاری)</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className={errors.lastName ? "border-destructive" : ""}
                    disabled={loading}
                  />
                  {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                </div>
              </div>

              {/* شماره موبایل و ایمیل */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">
                    شماره موبایل <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="09123456789"
                    value={formData.mobile}
                    onChange={(e) => handleChange("mobile", e.target.value)}
                    className={errors.mobile ? "border-destructive" : ""}
                    disabled={loading}
                  />
                  {errors.mobile && <p className="text-xs text-destructive">{errors.mobile}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    ایمیل <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={errors.email ? "border-destructive" : ""}
                    disabled={loading}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
              </div>

              {/* شماره دانشجویی */}
              <div className="space-y-2">
                <Label htmlFor="studentId">شماره دانشجویی (اختیاری)</Label>
                <Input
                  id="studentId"
                  type="text"
                  placeholder="1234567890"
                  value={formData.studentId}
                  onChange={(e) => handleChange("studentId", e.target.value)}
                  className={errors.studentId ? "border-destructive" : ""}
                  disabled={loading}
                />
                {errors.studentId && <p className="text-xs text-destructive">{errors.studentId}</p>}
                <p className="text-xs text-muted-foreground">در صورت وارد کردن، باید 10 رقم باشد</p>
              </div>

              {/* رمز عبور و تکرار */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">
                    رمز عبور <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className={errors.password ? "border-destructive" : ""}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                  <p className="text-xs text-muted-foreground">حداقل 8 کاراکتر</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    تکرار رمز عبور <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className={errors.confirmPassword ? "border-destructive" : ""}
                    disabled={loading}
                  />
                  {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    در حال ثبت‌نام...
                  </>
                ) : (
                  "ثبت‌نام"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">قبلاً ثبت‌نام کرده‌اید؟</span>{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                وارد شوید
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
