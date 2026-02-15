"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  MapPin,
  User,
  Settings,
  BookOpen,
  CalendarDays,
  Edit,
  Save,
  X,
  Loader2,
  Clock,
  LayoutDashboard,
  Key,
  Send,
  Lock,
} from "lucide-react"
import Link from "next/link"
import {
  fetchUserEvents,
  fetchUserCourses,
  apiRequest,
  type UserEventRegistration,
  type UserCourseRegistration,
  WeekdayFa,
} from "@/lib/api-client"
import { toast } from "@/hooks/use-toast"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

export default function ProfilePage() {
  const { user, loading, isCreator } = useAuth()
  const router = useRouter()

  const [popupMessage, setPopupMessage] = useState<string | null>(null)
  const [popupType, setPopupType] = useState<"success" | "error" | "info">("info")

  const [userEvents, setUserEvents] = useState<UserEventRegistration[]>([])
  const [userCourses, setUserCourses] = useState<UserCourseRegistration[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [removeImage, setRemoveImage] = useState<boolean>(false)

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    phone: "",
  })

  // Password change states
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [passwordStep, setPasswordStep] = useState<"request" | "verify" | "change">("request")
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [otpVerified, setOtpVerified] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [passwordError, setPasswordError] = useState("")

  // تابع تبدیل اعداد فارسی به انگلیسی
  const convertPersianToEnglish = (str: string) => {
    const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٢", "٢", "٢", "٢"]

    let result = str
    for (let i = 0; i < 10; i++) {
      result = result.replace(new RegExp(persianNumbers[i], "g"), i.toString())
      result = result.replace(new RegExp(arabicNumbers[i], "g"), i.toString())
    }
    return result
  }
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
  }
  const formatJustTime = (time: string) => toPersianNumber(time.slice(0, 5))
  const toPersianNumber = (value: string | number) =>
    value.toString().replace(/\d/g, (d) => (+d).toLocaleString("fa-IR"))

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [loading, user, router])

    useEffect(() => {
      if (popupMessage) {
        const timer = setTimeout(() => setPopupMessage(null), 5000)
        return () => clearTimeout(timer)
      }
    }, [popupMessage])

  // Timer countdown for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        studentId: user.studentId || "",
        phone: user.phone || "",
      })
      if (user.avatar === "null"){
        setImagePreview(null)
      } else {
        setImagePreview(user.avatar || null)
      }      
loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    setLoadingData(true)
    try {
      const [events, courses] = await Promise.all([fetchUserEvents(), fetchUserCourses()])
      setUserEvents(events)
      setUserCourses(courses)
    } catch (error) {
      console.error("Error loading user data:", error)
      toast({
        title: "خطا",
        description: "بارگذاری اطلاعات کاربر با خطا مواجه شد",
        variant: "destructive",
      })
    } finally {
      setLoadingData(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setRemoveImage(false)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setSelectedImage(null)
    setRemoveImage(true)
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const formData = new FormData()

      const profileData = {
        first_name: editForm.firstName,
        last_name: editForm.lastName,
        student_id: editForm.studentId ? convertPersianToEnglish(editForm.studentId) : undefined,
        phone: editForm.phone ? convertPersianToEnglish(editForm.phone) : undefined,
      }
      formData.append("data", JSON.stringify(profileData))

      if (selectedImage) {
        formData.append("avatar", selectedImage)
      }

      if (removeImage) {
        formData.append("remove-image", "true")
      }

      const response = await apiRequest("/profile/update/", {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()

        if (error.phone) {
          throw new Error ("شماره موبایل در سیستم وجود دارد")
        }
        else {
          throw new Error("خطا در به‌روزرسانی پروفایل")
        }
      }

      setIsEditing(false)
      setSelectedImage(null)
    } catch (error) {
        setPopupType("error");
        setPopupMessage(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setSelectedImage(null)
    if (user.avatar == "null") {
      setImagePreview(null)
    } else {
    setImagePreview(user?.avatar || null)
    }
    setEditForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      studentId: user?.studentId || "",
      phone: user?.phone || "",
    })
  }

  const handleRequestOtp = async () => {
    setSendingOtp(true)
    setPasswordError("")
    try {
      const response = await apiRequest("/auth/change-password/send-otp/", {
        method: "POST",
      })

      if (response.ok) {
        setOtpSent(true)
        setPasswordStep("verify")
        setResendTimer(120) // 2 minutes
        toast({
          title: "موفق",
          description: "کد تایید به ایمیل شما ارسال شد",
        })
      } else {
        const error = await response.json()
        let error_message = "خطا در ارسال کد"
        if (error.revalidation_time) {
          setOtpSent(true)
          setPasswordStep("verify")
          setResendTimer(parseInt(error.remaining_revalidation))
          error_message = "کد قبلا برای شما ارسال شده است"
        } else if (error.cant_change_password){
          error_message = "شما به تازگی رمز خود را عوض کرده اید. لطفا دقایقی بعد تلاش کنید"
        }
        setPasswordError(error_message || "خطا در ارسال کد")
      }
    } catch (error) {
      setPasswordError("خطا در اتصال به سرور")
    } finally {
      setSendingOtp(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    
    setSendingOtp(true)
    setPasswordError("")
    try {
      const response = await apiRequest("/auth/change-password/send-otp/", {
        method: "POST",
      })

      if (response.ok) {
        setResendTimer(120)
        toast({
          title: "موفق",
          description: "کد تایید مجدداً ارسال شد",
        })
      } else {
        const error = await response.json()
        if (error.remaining_revalidation) {
          setPasswordError(`لطفاً ${parseInt(error.remaining_revalidation)} ثانیه دیگر صبر کنید`)
          setResendTimer(parseInt(error.remaining_revalidation))
        } else {
          setPasswordError(error.detail || "خطا در ارسال مجدد کد")
        }
      }
    } catch (error) {
      setPasswordError("خطا در اتصال به سرور")
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      setPasswordError("کد باید 6 رقم باشد")
      return
    }

    setVerifyingOtp(true)
    setPasswordError("")
    try {
      const response = await apiRequest("/auth/change-password/verify/", {
        method: "POST",
        body: JSON.stringify({ otp: otpCode }),
      })

      if (response.ok) {
        setOtpVerified(true)
        setPasswordStep("change")
        toast({
          title: "موفق",
          description: "کد تایید با موفقیت تایید شد",
        })
      } else {
        const error = await response.json()
        setPasswordError(error.detail || "کد وارد شده اشتباه است")
      }
    } catch (error) {
      setPasswordError("خطا در اتصال به سرور")
    } finally {
      setVerifyingOtp(false)
    }
  }

  const handleChangePassword = async () => {
    setPasswordError("")

    if (!newPassword || newPassword.length < 8) {
      setPasswordError("رمز عبور باید حداقل 8 کاراکتر باشد")
      return
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("رمز عبور و تکرار آن یکسان نیستند")
      return
    }

    setChangingPassword(true)
    try {
      const response = await apiRequest("/auth/change-password/", {
        method: "POST",
        body: JSON.stringify({
          otp: otpCode,
          new_password: newPassword,
        }),
      })
      const result = await response.json()
      if (result.success) {
        toast({
          title: "موفق",
          description: "رمز عبور با موفقیت تغییر یافت",
        })
        // Reset all states
        setShowPasswordChange(false)
        setPasswordStep("request")
        setOtpSent(false)
        setOtpCode("")
        setOtpVerified(false)
        setNewPassword("")
        setConfirmNewPassword("")
        setResendTimer(0)

        // Store tokens in cookies
        document.cookie = `access_token=${result.tokens.access}; path=/; max-age=86400; samesite=strict; ${
          process.env.NODE_ENV === "production" ? "secure;" : ""
        }`
        document.cookie = `refresh_token=${result.tokens.refresh}; path=/; max-age=604800; samesite=strict; ${
          process.env.NODE_ENV === "production" ? "secure;" : ""
        }`

      } else {
        if (result.expired) {
          setPasswordError("کد منقضی شده است. کد جدید دریافت کنید.")
          setPasswordStep("request")
          setOtpSent(false)
          setOtpCode("")
          setOtpVerified(false)
          setNewPassword("")
          setConfirmNewPassword("")
          setResendTimer(0)
        } else if (result.invalid_otp) {
          setPasswordError("کد وارد شده اشتباه است")
          setPasswordStep("request")
          setOtpSent(false)
          setOtpCode("")
          setOtpVerified(false)
          setNewPassword("")
          setConfirmNewPassword("")
          setResendTimer(0)
        }else if (result.cant_change_password){
          setPasswordError("شما به تازگی رمز عبور خود را عوض کرده اید. لطفا دقایقی بعد تلاش کنید")
          setPasswordStep("request")
          setOtpSent(false)
          setOtpCode("")
          setOtpVerified(false)
          setNewPassword("")
          setConfirmNewPassword("")
          setResendTimer(0)
        } else {
          setPasswordError("خطا در تغییر رمز عبور")
        }
    }
    } catch (error) {
      setPasswordError("خطا در اتصال به سرور")
    } finally {
      setChangingPassword(false)
    }
  }

  const handleCancelPasswordChange = () => {
    setShowPasswordChange(false)
    setPasswordStep("request")
    setOtpSent(false)
    setOtpCode("")
    setOtpVerified(false)
    setNewPassword("")
    setConfirmNewPassword("")
    setPasswordError("")
    setResendTimer(0)
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-right">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              پروفایل کاربری
            </h1>
            <p className="text-muted-foreground mt-2">مدیریت اطلاعات و فعالیت‌های خود</p>
          </div>

          <Tabs defaultValue="info" className="w-full" dir="rtl">
            <TabsList className="flex w-full">
              <TabsTrigger value="info" className="gap-2 flex-1">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">اطلاعات کاربری</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="gap-2 flex-1">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">رویدادهای ثبت نام شده</span>
              </TabsTrigger>
              <TabsTrigger value="courses" className="gap-2 flex-1">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">دوره های ثبت نام شده</span>
              </TabsTrigger>
              {isCreator() && (
                <TabsTrigger value="admin" className="gap-2 flex-1">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">مدیریت</span>
                </TabsTrigger>
              )}
            </TabsList>

            {/* User Info Tab */}
            <TabsContent value="info">
              <Card className="border-2 shadow-lg">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                  <div className="text-right flex-1 space-y-1.5">
                    <CardTitle className="text-right">اطلاعات کاربری</CardTitle>
                    <CardDescription className="text-right">مشاهده و ویرایش اطلاعات حساب کاربری</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="mr-4">
                      <Edit className="w-4 h-4 mr-2" />
                      ویرایش
                    </Button>
                  ) : (
                    <div className="flex gap-2 mr-4">
                      <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={saving}>
                        <X className="w-4 h-4 mr-2" />
                        انصراف
                      </Button>
                      <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        ذخیره
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar and Name Section */}
                  <div className="flex items-center gap-6 flex-row-reverse pb-6 border-b">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg ring-4 ring-primary/20">
                        {imagePreview ? (
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt={user.firstName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-white" />
                        )}
                      </div>
                      {isEditing && (
                        <>
                          <label
                            htmlFor="profileImage"
                            className="absolute bottom-0 left-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 shadow-lg"
                          >
                            <Edit className="w-4 h-4" />
                            <input
                              id="profileImage"
                              type="file"
                              accept="image/*"
                              onChange={handleImageSelect}
                              className="hidden"
                            />
                          </label>
                          {imagePreview && (
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute bottom-0 right-0 p-2 bg-destructive text-destructive-foreground rounded-full cursor-pointer hover:bg-destructive/90 shadow-lg"
                              title="حذف عکس"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                    <div className="flex-1 text-right">
                      <h2 className="text-2xl font-bold">
                        {editForm.firstName} {editForm.lastName}
                      </h2>
                      {user.position && <p className="text-primary font-medium mt-1">{user.position}</p>}
                      <div className="flex gap-2 mt-2 justify-end">
                        <Badge variant="secondary" className="text-sm">
                          {user.role === "admin" ? "مدیر" : user.role === "creator" ? "ایجادکننده" : "کاربر"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid gap-6 md:grid-cols-2">
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-muted-foreground text-right block">
                        نام <span className="text-destructive">*</span>
                      </Label>
                      {isEditing ? (
                        <Input
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                          className="border-2 focus:border-primary text-right"
                          placeholder="نام خود را وارد کنید"
                        />
                      ) : (
                        <p className="text-lg font-medium text-right">{editForm.firstName || "-"}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-muted-foreground text-right block">
                        نام خانوادگی
                      </Label>
                      {isEditing ? (
                        <Input
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                          className="border-2 focus:border-primary text-right"
                          placeholder="نام خانوادگی خود را وارد کنید"
                        />
                      ) : (
                        <p className="text-lg font-medium text-right">{editForm.lastName || "-"}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-muted-foreground text-right block">
                        ایمیل <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex items-center gap-2" dir="ltr">
                        <p className="text-lg font-medium text-left flex-1">{user.email || "-"}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-muted-foreground text-right block">

                        شماره موبایل <span className="text-destructive"></span>
                      </Label>
                      {isEditing ? (
                        <Input
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          maxLength={11}
                          className="border-2 focus:border-primary text-right"
                          placeholder="09123456789"
                        />
                      ) : (
                        <p className="text-lg font-medium text-right flex-1">{editForm.phone || "-"}</p>
                      )}
                      <div className="flex items-center gap-2">
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-muted-foreground text-right block">
                        شماره دانشجویی
                      </Label>
                      {isEditing ? (
                        <Input
                          value={editForm.studentId}
                          onChange={(e) => setEditForm({ ...editForm, studentId: e.target.value })}
                          maxLength={10}
                          className="border-2 focus:border-primary text-right"
                          placeholder="1234567890"
                        />
                      ) : (
                        <p className="text-lg font-medium text-right">{editForm.studentId || "-"}</p>
                      )}
                    </div>

                    {user.position && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-muted-foreground text-right block">سمت</Label>
                        <p className="text-lg font-medium text-right">{user.position}</p>
                      </div>
                    )}
                  </div>

                  {/* Password Change Section */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <Button
                        variant={showPasswordChange ? "outline" : "default"}
                        onClick={() => {
                          if (showPasswordChange) {
                            handleCancelPasswordChange()
                          } else {
                            setShowPasswordChange(true)
                          }
                        }}
                        className="gap-2"
                      >
                        <Key className="w-4 h-4" />
                        {showPasswordChange ? "لغو تغییر رمز" : "تغییر رمز عبور"}
                      </Button>
                    </div>

                    {showPasswordChange && (
                      <div className="space-y-6 bg-muted/30 p-6 rounded-lg">
                        {/* Step 1: Request OTP */}
                        {passwordStep === "request" && (
                          <div className="space-y-4">
                            <div className="text-right space-y-2">
                              <h3 className="font-semibold text-lg">درخواست کد تایید</h3>
                              <p className="text-sm text-muted-foreground">
                                برای تغییر رمز عبور، کد تایید 6 رقمی به ایمیل شما ارسال می‌شود
                              </p>
                            </div>
                            <Button
                              onClick={handleRequestOtp}
                              disabled={sendingOtp}
                              className="w-full sm:w-auto gap-2"
                            >
                              {sendingOtp ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  در حال ارسال...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  ارسال کد تایید
                                </>
                              )}
                            </Button>
                            {passwordError && (
                              <p className="text-sm text-destructive text-right">{passwordError}</p>
                            )}
                          </div>
                        )}

                        {/* Step 2: Verify OTP */}
                        {passwordStep === "verify" && !otpVerified && (
                          <div className="space-y-4">
                            <div className="text-right space-y-2">
                              <h3 className="font-semibold text-lg">تایید کد</h3>
                              <p className="text-sm text-muted-foreground">
                                کد 6 رقمی ارسال شده به ایمیل خود را وارد کنید
                              </p>
                            </div>

                            <div className="flex flex-col items-center gap-4" dir="ltr">
                              <InputOTP
                                maxLength={6}
                                value={otpCode}
                                onChange={(value) => setOtpCode(value)}
                                disabled={verifyingOtp}
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

                            <div className="flex gap-2 flex-wrap justify-end">
                              <Button
                                variant="outline"
                                onClick={handleResendOtp}
                                disabled={resendTimer > 0 || sendingOtp}
                                size="sm"
                              >
                                {sendingOtp ? (
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
                              <Button
                                onClick={handleVerifyOtp}
                                disabled={verifyingOtp || otpCode.length !== 6}
                                size="sm"
                              >
                                {verifyingOtp ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                                    در حال تایید...
                                  </>
                                ) : (
                                  "تایید کد"
                                )}
                              </Button>
                            </div>

                            {passwordError && (
                              <p className="text-sm text-destructive text-right">{passwordError}</p>
                            )}
                          </div>
                        )}

                        {/* Step 3: Change Password */}
                        {passwordStep === "change" && otpVerified && (
                          <div className="space-y-4">
                            <div className="text-right space-y-2">
                              <h3 className="font-semibold text-lg">تعیین رمز عبور جدید</h3>
                              <p className="text-sm text-muted-foreground">
                                رمز عبور جدید خود را وارد کنید (حداقل 8 کاراکتر)
                              </p>
                            </div>

                            {/* Display verified OTP (read-only) */}
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold text-right block">
                                کد تایید
                              </Label>
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
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="confirmNewPassword" className="text-right block">
                                تکرار رمز عبور جدید
                              </Label>
                              <Input
                                id="confirmNewPassword"
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                placeholder="تکرار رمز عبور"
                                className="text-right"
                                dir="ltr"
                              />
                            </div>

                            <Button
                              onClick={handleChangePassword}
                              disabled={changingPassword}
                              className="w-full sm:w-auto gap-2"
                            >
                              {changingPassword ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  در حال تغییر رمز...
                                </>
                              ) : (
                                <>
                                  <Lock className="w-4 h-4" />
                                  تغییر رمز عبور
                                </>
                              )}
                            </Button>

                            {passwordError && (
                              <p className="text-sm text-destructive text-right">{passwordError}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events">
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-right">رویدادهای ثبت‌نام شده</CardTitle>
                  <CardDescription className="text-right">لیست رویدادهایی که در آنها ثبت‌نام کرده‌اید</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : userEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">هنوز در هیچ رویدادی ثبت‌نام نکرده‌اید</p>
                      <Link href="/events">
                        <Button className="mt-4">مشاهده رویدادها</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userEvents.map((registration) => {
                        const event = registration.event
                        return (
                          <Card key={event.slug} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row-reverse">
                              <div className="w-full md:w-48 h-32 overflow-hidden">
                                <img
                                  src={event.image || "/placeholder.svg"}
                                  alt={event.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <CardContent className="flex-1 p-4 text-right">
                                <div className="flex items-start justify-between mb-2 flex-row-reverse">
                                  <h3 className="font-semibold text-lg text-right">{event.title}</h3>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-end">
                                  <div className="flex items-center gap-1">
                                    <span>{new Date(event.start_date).toLocaleDateString("fa-IR")}</span>
                                    <Calendar className="w-4 h-4" />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span>{event.location}</span>
                                    <MapPin className="w-4 h-4" />
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-3 justify-end flex-wrap">
                                  {event.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="secondary">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <Link href={`/events/${event.slug}`}>
                                  <Button variant="outline" size="sm" className="mt-4 bg-transparent">
                                    مشاهده جزئیات
                                  </Button>
                                </Link>
                              </CardContent>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses">
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-right">دوره‌های ثبت‌نام شده</CardTitle>
                  <CardDescription className="text-right">لیست دوره‌هایی که در آنها ثبت‌نام کرده‌اید</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : userCourses.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">هنوز در هیچ دوره‌ای ثبت‌نام نکرده‌اید</p>
                      <Link href="/courses">
                        <Button className="mt-4">مشاهده دوره‌ها</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userCourses.map((registration) => {
                        const course = registration.course
                        return (
                          <Card key={course.slug} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row-reverse">
                              <div className="w-full md:w-48 h-32 overflow-hidden">
                                <img
                                  src={course.image || "/placeholder.svg"}
                                  alt={course.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <CardContent className="flex-1 p-4 text-right">
                                <div className="flex items-start justify-between mb-2 flex-row-reverse">
                                  <h3 className="font-semibold text-lg text-right">{course.title}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2 text-right">
                                  {course.instructors.length > 0 && (
                                    <>
                                      {course.instructors.map((i) => `${i.first_name} ${i.last_name}`).join("، ")}
                                      {" : "}اساتید
                                    </>
                                  )}
                                </p>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-end mb-2">
                                  {course.start_date && (
                                    <div className="flex items-center gap-1">
                                      <span>{new Date(course.start_date).toLocaleDateString("fa-IR")}</span>
                                      <Calendar className="w-4 h-4" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-end mb-2">
                                  {course.time_plans && course.time_plans.length > 0 && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      {course.time_plans.map((time_plan, index) => (
                                        <span key={`${index}`}>
                                          {WeekdayFa[time_plan.weekday as keyof typeof WeekdayFa]} {"ها"},{" "}
                                          {formatJustTime(time_plan.time_start)} - {formatJustTime(time_plan.time_end)}
                                        </span>
                                      ))}
                                      <Clock className="w-4 h-4" />
                                    </div>
                                  )}
                                  {course.location && (
                                    <div className="flex items-center gap-1">
                                      <span>{course.location}</span>
                                      <MapPin className="w-4 h-4" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2 mt-3 justify-end flex-wrap">
                                  {course.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="secondary">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <Link href={`/courses/${course.slug}`}>
                                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                                    مشاهده جزئیات
                                  </Button>
                                </Link>
                              </CardContent>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
                  {/* Popup */}
      {popupMessage && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div
            className={`
            flex items-start gap-4 p-4 rounded-2xl shadow-2xl backdrop-blur-sm
            border-2 max-w-md w-full mx-4
            ${popupType === "success" ? "bg-green-50/95 border-green-200" : ""}
            ${popupType === "error" ? "bg-red-50/95 border-red-200" : ""}
            ${popupType === "info" ? "bg-blue-50/95 border-blue-200" : ""}
          `}
          >
            <div
              className={`
              flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
              ${popupType === "success" ? "bg-green-100" : ""}
              ${popupType === "error" ? "bg-red-100" : ""}
              ${popupType === "info" ? "bg-blue-100" : ""}
            `}
            >
              {popupType === "success" && (
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {popupType === "error" && (
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {popupType === "info" && (
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1 pt-1">
              <p
                className={`
                font-medium leading-relaxed
                ${popupType === "success" ? "text-green-900" : ""}
                ${popupType === "error" ? "text-red-900" : ""}
                ${popupType === "info" ? "text-blue-900" : ""}
              `}
              >
                {popupMessage}
              </p>
            </div>
            <button
              onClick={() => setPopupMessage(null)}
              className={`
                flex-shrink-0 p-1 rounded-lg transition-colors
                ${popupType === "success" ? "hover:bg-green-100 text-green-600" : ""}
                ${popupType === "error" ? "hover:bg-red-100 text-red-600" : ""}
                ${popupType === "info" ? "hover:bg-blue-100 text-blue-600" : ""}
              `}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

            {/* Admin Tab */}
            {isCreator() && (
              <TabsContent value="admin">
                <Card className="border-2 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-right">پنل مدیریت</CardTitle>
                    <CardDescription className="text-right">دسترسی به بخش‌های مدیریتی سایت</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <Link href="/admin/dashboard">
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                          <CardContent className="p-6 flex flex-col items-center text-center">
                            <LayoutDashboard className="w-10 h-10 text-primary mb-4" />
                            <h3 className="font-semibold">داشبورد</h3>
                            <p className="text-sm text-muted-foreground">مشاهده آمار کلی</p>
                          </CardContent>
                        </Card>
                      </Link>
                      <Link href="/admin/events/create">
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                          <CardContent className="p-6 flex flex-col items-center text-center">
                            <CalendarDays className="w-10 h-10 text-primary mb-4" />
                            <h3 className="font-semibold">ایجاد رویداد</h3>
                            <p className="text-sm text-muted-foreground">افزودن رویداد جدید</p>
                          </CardContent>
                        </Card>
                      </Link>
                      <Link href="/admin/courses/create">
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                          <CardContent className="p-6 flex flex-col items-center text-center">
                            <BookOpen className="w-10 h-10 text-primary mb-4" />
                            <h3 className="font-semibold">ایجاد دوره</h3>
                            <p className="text-sm text-muted-foreground">افزودن دوره جدید</p>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </>
  )
}
