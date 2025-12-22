"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Edit, Trash2, Power, Loader2, Plus } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { apiRequest, fetchCourses } from "@/lib/api-client"

interface Course {
  id: number
  title: string
  slug: string
  start_date: string
  end_date: string
  location: string
  capacity: number
  registered: number
  price: number
  is_active: boolean
  organizer: string
}

export default function AdminCoursesPage() {
  const { user, loading, isCreator } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (!loading && (!user || !isCreator())) {
      router.push("/auth/login")
    }
  }, [loading, user, router, isCreator])

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses()
        setCourses(data)
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setLoadingCourses(false)
      }
    }

    if (user && isCreator()) {
      loadCourses()
    }
  }, [user, isCreator])

  const handleDelete = async () => {
    if (!selectedCourse) return

    setActionLoading(true)
    try {
      const response = await apiRequest(`/admin/courses/${selectedCourse.slug}/delete/`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCourses(courses.filter((c) => c.id !== selectedCourse.id))
        alert("دوره با موفقیت حذف شد")
      } else {
        throw new Error("Failed to delete course")
      }
    } catch (error) {
      console.error("Error deleting course:", error)
      alert("خطا در حذف دوره")
    } finally {
      setActionLoading(false)
      setDeleteDialogOpen(false)
      setSelectedCourse(null)
    }
  }

  const handleToggleActive = async () => {
    if (!selectedCourse) return

    setActionLoading(true)
    try {
      const response = await apiRequest(`/admin/courses/${selectedCourse.slug}/deactivate/`, {
        method: "POST",
      })

      if (response.ok) {
        setCourses(
          courses.map((c) =>
            c.id === selectedCourse.id ? { ...c, is_active: !c.is_active } : c
          )
        )
        alert(`دوره با موفقیت ${selectedCourse.is_active ? "غیرفعال" : "فعال"} شد`)
      } else {
        throw new Error("Failed to toggle course status")
      }
    } catch (error) {
      console.error("Error toggling course status:", error)
      alert("خطا در تغییر وضعیت دوره")
    } finally {
      setActionLoading(false)
      setDeactivateDialogOpen(false)
      setSelectedCourse(null)
    }
  }

  const openDeleteDialog = (course: Course) => {
    setSelectedCourse(course)
    setDeleteDialogOpen(true)
  }

  const openDeactivateDialog = (course: Course) => {
    setSelectedCourse(course)
    setDeactivateDialogOpen(true)
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowRight className="ml-2 h-4 w-4" />
                  بازگشت
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">مدیریت دوره‌ها</h1>
            </div>
            <Link href="/admin/courses/create">
              <Button>
                <Plus className="ml-2 h-4 w-4" />
                ایجاد دوره جدید
              </Button>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>لیست دوره‌ها</CardTitle>
              <CardDescription>مدیریت و ویرایش دوره‌های آموزشی</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingCourses ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>هیچ دوره‌ای ثبت نشده است</p>
                  <Link href="/admin/courses/create">
                    <Button className="mt-4">
                      <Plus className="ml-2 h-4 w-4" />
                      ایجاد اولین دوره
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">عنوان</TableHead>
                        <TableHead className="min-w-[120px]">تاریخ شروع</TableHead>
                        <TableHead className="min-w-[150px]">مکان</TableHead>
                        <TableHead className="min-w-[100px] text-center">ظرفیت</TableHead>
                        <TableHead className="min-w-[120px]">هزینه</TableHead>
                        <TableHead className="min-w-[100px]">وضعیت</TableHead>
                        <TableHead className="min-w-[180px] text-left">عملیات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium max-w-[250px]">
                            <div className="truncate" title={course.title}>
                              {course.title}
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {new Date(course.start_date).toLocaleDateString("fa-IR")}
                          </TableCell>
                          <TableCell>
                            <div className="truncate max-w-[150px]" title={course.location}>
                              {course.location}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-sm">
                              {course.registered}/{course.capacity}
                            </span>
                          </TableCell>
                          <TableCell>
                            {course.price === 0 ? (
                              <Badge variant="secondary">رایگان</Badge>
                            ) : (
                              <span className="text-sm whitespace-nowrap">
                                {course.price.toLocaleString()} تومان
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={course.is_active ? "default" : "secondary"}>
                              {course.is_active ? "فعال" : "غیرفعال"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2 justify-end">
                              <Link href={`/admin/courses/${course.slug}/update/`}>
                                <Button variant="outline" size="sm" title="ویرایش">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDeactivateDialog(course)}
                                title={course.is_active ? "غیرفعال کردن" : "فعال کردن"}
                              >
                                <Power className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openDeleteDialog(course)}
                                title="حذف"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>آیا مطمئن هستید؟</DialogTitle>
              <DialogDescription>
                این عملیات قابل بازگشت نیست. دوره "{selectedCourse?.title}" به طور کامل حذف
                خواهد شد.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={actionLoading}>
                انصراف
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    در حال حذف...
                  </>
                ) : (
                  "حذف"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Deactivate Confirmation Dialog */}
        <Dialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تغییر وضعیت دوره</DialogTitle>
              <DialogDescription>
                آیا می‌خواهید دوره "{selectedCourse?.title}" را{" "}
                {selectedCourse?.is_active ? "غیرفعال" : "فعال"} کنید؟
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeactivateDialogOpen(false)} disabled={actionLoading}>
                انصراف
              </Button>
              <Button onClick={handleToggleActive} disabled={actionLoading}>
                {actionLoading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    در حال تغییر...
                  </>
                ) : (
                  "تایید"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
