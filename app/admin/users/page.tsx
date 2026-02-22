"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Loader2, ArrowUpDown, ArrowUp, ArrowDown, User as UserIcon, Mail, Phone, IdCard } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { apiRequest } from "@/lib/api-client"
import Image from "next/image"

interface User {
  phone: string
  email: string
  first_name: string
  last_name: string
  avatar: string | null
  student_id: string
  position?: string
}

type SortField = "email" | "first_name" | "phone" | "student_id"
type SortOrder = "asc" | "desc"

export default function AdminUsersPage() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [filterField, setFilterField] = useState<string>("all")

  // Sort states
  const [sortField, setSortField] = useState<SortField>("first_name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  useEffect(() => {
    if (!loading && (!user || !isAdmin())) {
      router.push("/auth/login")
    }
  }, [loading, user, router, isAdmin])

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await apiRequest("/admin/users/")
        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoadingUsers(false)
      }
    }

    if (user && isAdmin()) {
      loadUsers()
    }
  }, [user, isAdmin])

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((usr) => {
        if (filterField === "all") {
          return (
            usr.first_name?.toLowerCase().includes(query) ||
            usr.last_name?.toLowerCase().includes(query) ||
            usr.email?.toLowerCase().includes(query) ||
            usr.phone?.toLowerCase().includes(query) ||
            usr.student_id?.toLowerCase().includes(query)
          )
        } else if (filterField === "name") {
          return usr.first_name?.toLowerCase().includes(query) || usr.last_name?.toLowerCase().includes(query)
        } else if (filterField === "email") {
          return usr.email?.toLowerCase().includes(query)
        } else if (filterField === "phone") {
          return usr.phone?.toLowerCase().includes(query)
        } else if (filterField === "student_id") {
          return usr.student_id?.toLowerCase().includes(query)
        }
        return true
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let compareValue = 0

      switch (sortField) {
        case "first_name":
          const nameA = `${a.first_name} ${a.last_name}`
          const nameB = `${b.first_name} ${b.last_name}`
          compareValue = nameA.localeCompare(nameB, "fa")
          break
        case "email":
          compareValue = (a.email || "").localeCompare(b.email || "", "en")
          break
        case "phone":
          compareValue = (a.phone || "").localeCompare(b.phone || "", "fa")
          break
        case "student_id":
          compareValue = (a.student_id || "").localeCompare(b.student_id || "", "en")
          break
      }

      return sortOrder === "asc" ? compareValue : -compareValue
    })

    return filtered
  }, [users, searchQuery, filterField, sortField, sortOrder])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
    }
    return sortOrder === "asc" ? <ArrowUp className="mr-2 h-4 w-4" /> : <ArrowDown className="mr-2 h-4 w-4" />
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
      <Header />
      <div className="min-h-screen bg-background pt-20">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowRight className="ml-2 h-4 w-4" />
                  بازگشت
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">مدیریت کاربران</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                لیست کاربران
              </CardTitle>
              <CardDescription>
                مشاهده و مدیریت کاربران سیستم ({filteredAndSortedUsers.length} کاربر)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">جستجو</label>
                  <Input
                    placeholder={
                      filterField === "all"
                        ? "جستجو در همه فیلدها..."
                        : filterField === "name"
                          ? "جستجو بر اساس نام..."
                          : filterField === "email"
                            ? "جستجو بر اساس ایمیل..."
                            : filterField === "phone"
                              ? "جستجو بر اساس شماره موبایل..."
                              : "جستجو بر اساس شماره دانشجویی..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">فیلتر بر اساس</label>
                  <Select value={filterField} onValueChange={setFilterField}>
                    <SelectTrigger>
                      <SelectValue placeholder="همه فیلدها" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه فیلدها</SelectItem>
                      <SelectItem value="name">نام</SelectItem>
                      <SelectItem value="email">ایمیل</SelectItem>
                      <SelectItem value="phone">شماره موبایل</SelectItem>
                      <SelectItem value="student_id">شماره دانشجویی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {loadingUsers ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : filteredAndSortedUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <UserIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{searchQuery ? "هیچ کاربری با این جستجو یافت نشد" : "هیچ کاربری وجود ندارد"}</p>
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[80px] text-right">آواتار</TableHead>
                        <TableHead className="min-w-[200px] text-right">
                          <Button variant="ghost" onClick={() => toggleSort("first_name")} className="h-8 px-2 -mr-2">
                            {getSortIcon("first_name")}
                            نام و نام خانوادگی
                          </Button>
                        </TableHead>
                        <TableHead className="min-w-[250px] text-right">
                          <Button variant="ghost" onClick={() => toggleSort("email")} className="h-8 px-2 -mr-2">
                            {getSortIcon("email")}
                            ایمیل
                          </Button>
                        </TableHead>
                        <TableHead className="min-w-[150px] text-right">
                          <Button variant="ghost" onClick={() => toggleSort("phone")} className="h-8 px-2 -mr-2">
                            {getSortIcon("phone")}
                            شماره موبایل
                          </Button>
                        </TableHead>
                        <TableHead className="min-w-[150px] text-right">
                          <Button variant="ghost" onClick={() => toggleSort("student_id")} className="h-8 px-2 -mr-2">
                            {getSortIcon("student_id")}
                            شماره دانشجویی
                          </Button>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedUsers.map((usr, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-start">
                              {usr.avatar ? (
                                <Image
                                  src={usr.avatar}
                                  alt={`${usr.first_name} ${usr.last_name}`}
                                  width={40}
                                  height={40}
                                  className="rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <UserIcon className="h-5 w-5 text-primary" />
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {usr.first_name} {usr.last_name}
                              </span>
                              {usr.position && (
                                <span className="text-xs text-muted-foreground">{usr.position}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right" dir="ltr">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="truncate max-w-[220px]" title={usr.email}>
                                {usr.email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right" dir="ltr">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{usr.phone || "-"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2">
                              <IdCard className="h-4 w-4 text-muted-foreground" />
                              <span>{usr.student_id || "-"}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Summary */}
              {!loadingUsers && filteredAndSortedUsers.length > 0 && (
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="gap-2">
                      <UserIcon className="h-3 w-3" />
                      {filteredAndSortedUsers.length} کاربر
                    </Badge>
                  </div>
                  {searchQuery && (
                    <div className="text-xs">
                      نتایج فیلتر شده از {users.length} کاربر
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  )
}
