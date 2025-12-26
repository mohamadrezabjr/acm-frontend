"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Clock, Users, ArrowLeft, User, Loader2 } from "lucide-react"
import Link from "next/link"
import { fetchCourseBySlug, type Course, WeekdayFa, courseRegitserBySlug, apiRequest } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const router = useRouter()
  
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    student_id: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCourse()
  }, [slug])

  useEffect(() => {
    if (popupMessage) {
      const timer = setTimeout(() => setPopupMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [popupMessage]);

  const loadCourse = async () => {
    try {
      setLoading(true)
      const data = await fetchCourseBySlug(slug)
      setCourse(data)
    } catch (err) {
      console.error("Failed to fetch course:", err)
      setError("دوره یافت نشد")
    } finally {
      setLoading(false)
    }
  }

  const getRegistrationStatus = () => {
    if (!course) return { canRegister: false, message: "" }

    const now = new Date()
    const deadline = new Date(course.registration_deadline)
    const isFull = course.registered >= course.capacity
    const isExpired = now > deadline

    if (isFull) return { canRegister: false, message: "ظرفیت تکمیل است" }
    if (isExpired) return { canRegister: false, message: "مهلت ثبت‌نام تمام شده" }
    return { canRegister: true, message: "" }
  }

  const getMissingFields = () => {
    if (!course || !user) return [];
    
    const missing: string[] = [];
    
    course.dependencies.forEach(field => {
      if (field === "email" && !user.email) {
        missing.push("email");
      } else if (field === "first_name" && !user.firstName) {
        missing.push("first_name");
      } else if (field === "last_name" && !user.lastName) {
        missing.push("last_name");
      } else if (field === "student_id" && !user.studentId) {
        missing.push("student_id");
      }
    });
    
    return missing;
  };

  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      email: "ایمیل",
      first_name: "نام",
      last_name: "نام خانوادگی",
      student_id: "شماره دانشجویی"
    };
    return labels[field] || field;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const missingFields = getMissingFields();

    missingFields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      
      if (!value || value.trim() === "") {
        errors[field] = `${getFieldLabel(field)} الزامی است`;
        return;
      }

      if (field === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[field] = "فرمت ایمیل صحیح نیست";
        }
      }

      if (field === "student_id") {
        if (!/^\d{10}$/.test(value)) {
          errors[field] = "شماره دانشجویی باید 10 رقم باشد";
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData: Record<string, string> = {};
      const updateForm = new FormData();
      const missingFields = getMissingFields();
      
      missingFields.forEach(field => {
        updateData[field] = formData[field as keyof typeof formData];
      });
      
      updateForm.append('data', JSON.stringify(updateData))

      const response = await apiRequest("/profile/update/", {
        method: "PUT",
        body: updateForm,
      });

      if (!response.ok) {
        throw new Error("خطا در به‌روزرسانی اطلاعات");
      }

      // بستن فرم
      setShowRegistrationForm(false);
      
      // ثبت‌نام در دوره
      const result = await courseRegitserBySlug(course!.slug);
      setPopupType(result.type);
      setPopupMessage(result.detail);
      
      // بارگذاری مجدد اطلاعات کاربر
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setPopupType("error");
      setPopupMessage("خطا در به‌روزرسانی اطلاعات. لطفاً دوباره تلاش کنید");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async () => {
    // بررسی لاگین
    if (!user) {
      setPopupType("info");
      setPopupMessage("لطفاً ابتدا وارد حساب کاربری خود شوید یا ثبت‌نام کنید");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
      return;
    }

    // بررسی فیلدهای ناقص
    const missingFields = getMissingFields();
    
    if (missingFields.length === 0) {
      // همه اطلاعات کامل است، مستقیم ثبت‌نام کن
      const result = await courseRegitserBySlug(course!.slug);
      setPopupType(result.type);
      setPopupMessage(result.detail);
    } else {
      // فرم تکمیل اطلاعات را نمایش بده
      setShowRegistrationForm(true);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </main>
      </>
    )
  }

  if (error || !course) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 flex flex-col items-center justify-center">
          <p className="text-xl text-destructive mb-4">{error || "دوره یافت نشد"}</p>
          <Link href="/courses">
            <Button>بازگشت به دوره‌ها</Button>
          </Link>
        </main>
      </>
    )
  }
  
  const availableSeats = course.capacity - course.registered
  const isAlmostFull = availableSeats < course.capacity * 0.2
  const isFull = availableSeats <= 0
  const registrationStatus = getRegistrationStatus()

  const formatJustTime = (time: string) => toPersianNumber(time.slice(0, 5))
  const toPersianNumber = (value: string | number) =>
    value.toString().replace(/\d/g, (d) => (+d).toLocaleString("fa-IR"))

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        {/* Hero Section */}
        <div className="relative h-[400px] overflow-hidden">
          <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 right-0 left-0 p-8">
            <div className="container mx-auto max-w-4xl">
              <Link href="/courses">
                <Button variant="ghost" className="mb-4 text-white hover:bg-white/20">
                  <ArrowLeft className="ml-2 w-4 h-4" />
                  بازگشت به دوره‌ها
                </Button>
              </Link>
              <div className="flex gap-2 flex-wrap mb-4">
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-foreground">{course.title}</h1>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>درباره دوره</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-muted-foreground" style={{ whiteSpace: "pre-line" }}>{course.description}</p>
                </CardContent>
              </Card>

              {/* Instructors */}
              {course.instructors && course.instructors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>اساتید دوره</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {course.instructors.map((instructor, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{instructor.first_name} {instructor.last_name}</h3>
                            <p className="text-sm text-primary mb-1">{instructor.position}</p>
                            <p className="text-sm text-muted-foreground">{instructor.bio}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card */}
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>ثبت‌نام</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">تاریخ شروع</div>
                        <div className="font-medium">{new Date(course.start_date).toLocaleDateString("fa-IR")}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">تاریخ پایان</div>
                        <div className="font-medium">{new Date(course.end_date).toLocaleDateString("fa-IR")}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">مهلت ثبت‌نام</div>
                        <div className="font-medium">
                          {new Date(course.registration_deadline).toLocaleDateString("fa-IR")}
                        </div>
                      </div>
                    </div>
                    {course.time_plans && course.time_plans.length > 0 && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-muted-foreground">برنامه زمانی</div>

                          {course.time_plans.map((time_plan, index) => (
                            <div key={`${time_plan.weekday}-${time_plan.time_start}`} className="font-medium">
                              {WeekdayFa[time_plan.weekday as keyof typeof WeekdayFa]} ,{" "}
                              {formatJustTime(time_plan.time_start)} - {formatJustTime(time_plan.time_end)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">مکان</div>
                        <div className="font-medium">{course.location}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">ظرفیت</div>
                        <div className="font-medium">
                          {course.registered} / {course.capacity} نفر
                        </div>
                        {isAlmostFull && !isFull && registrationStatus.canRegister && (
                          <Badge variant="destructive" className="mt-1">
                            ظرفیت محدود!
                          </Badge>
                        )}
                        {!registrationStatus.canRegister && isFull && (
                          <Badge variant="destructive" className="mt-1">
                            ظرفیت تکمیل است
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-muted-foreground">برگزارکننده</div>
                        <div className="font-medium">{course.organizer}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    {registrationStatus.canRegister ? (
                      <>
                        <div className="text-2xl font-bold text-center mb-4">
                          {course.price === 0 ? "رایگان" : `${course.price.toLocaleString("fa-IR")} تومان`}
                        </div>
                        <Button className="w-full" size="lg" onClick={handleRegister}>
                          ثبت‌نام در دوره
                        </Button>
                      </>
                    ) : (
                      <Button className="w-full" size="lg" variant="destructive" disabled>
                        {registrationStatus.message}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Share Card */}
              <Card>
                <CardHeader>
                  <CardTitle>اشتراک‌گذاری</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">این دوره را با دوستان خود به اشتراک بگذارید</p>
                  <Button variant="outline" className="w-full bg-transparent">
                    کپی لینک
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Popup */}
      {popupMessage && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className={`
            flex items-start gap-4 p-4 rounded-2xl shadow-2xl backdrop-blur-sm
            border-2 max-w-md w-full mx-4
            ${popupType === "success" ? "bg-green-50/95 border-green-200" : ""}
            ${popupType === "error" ? "bg-red-50/95 border-red-200" : ""}
            ${popupType === "info" ? "bg-blue-50/95 border-blue-200" : ""}
          `}>
            <div className={`
              flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
              ${popupType === "success" ? "bg-green-100" : ""}
              ${popupType === "error" ? "bg-red-100" : ""}
              ${popupType === "info" ? "bg-blue-100" : ""}
            `}>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="flex-1 pt-1">
              <p className={`
                font-medium leading-relaxed
                ${popupType === "success" ? "text-green-900" : ""}
                ${popupType === "error" ? "text-red-900" : ""}
                ${popupType === "info" ? "text-blue-900" : ""}
              `}>
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

      {/* Registration Form Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>تکمیل اطلاعات</CardTitle>
              <p className="text-sm text-muted-foreground">
                لطفاً اطلاعات زیر را برای تکمیل ثبت‌نام وارد کنید
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {getMissingFields().map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium mb-2">
                      {getFieldLabel(field)} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      value={formData[field as keyof typeof formData]}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, [field]: e.target.value }));
                        if (formErrors[field]) {
                          setFormErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors[field];
                            return newErrors;
                          });
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors[field] ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder={`${getFieldLabel(field)} را وارد کنید`}
                      disabled={isSubmitting}
                    />
                    {formErrors[field] && (
                      <p className="text-red-500 text-sm mt-1">{formErrors[field]}</p>
                    )}
                  </div>
                ))}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowRegistrationForm(false);
                      setFormErrors({});
                      setFormData({ email: "", first_name: "", last_name: "", student_id: "" });
                    }}
                    disabled={isSubmitting}
                  >
                    انصراف
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="ml-2 w-4 h-4 animate-spin" />
                        در حال ثبت...
                      </>
                    ) : (
                      "تکمیل ثبت‌نام"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
