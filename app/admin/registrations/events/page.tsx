"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { fetchAdminEventRegistrations, type AdminEventRegistration } from "@/lib/api-client"

type SortField = "joined_at" | "event_title" | "user_name" | "status"
type SortOrder = "asc" | "desc"

export default function AdminEventRegistrationsPage() {
  const { user, loading, isCreator } = useAuth()
  const router = useRouter()
  const [registrations, setRegistrations] = useState<AdminEventRegistration[]>([])
  const [loadingRegistrations, setLoadingRegistrations] = useState(true)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  // Sort states
  const [sortField, setSortField] = useState<SortField>("joined_at")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  useEffect(() => {
    if (!loading && (!user || !isCreator())) {
      router.push("/auth/login")
    }
  }, [loading, user, router, isCreator])

  useEffect(() => {
    const loadRegistrations = async () => {
      try {
        const data = await fetchAdminEventRegistrations()
        setRegistrations(data)
      } catch (error) {
        console.error("Error fetching event registrations:", error)
      } finally {
        setLoadingRegistrations(false)
      }
    }

    if (user && isCreator()) {
      loadRegistrations()
    }
  }, [user, isCreator])

  // Get unique events for filter dropdown
  const uniqueEvents = useMemo(() => {
    const events = registrations.map((reg) => ({
      id: reg.event.id,
      title: reg.event.title,
    }))
    const unique = Array.from(new Map(events.map((e) => [e.id, e])).values())
    return unique.sort((a, b) => a.title.localeCompare(b.title, "fa"))
  }, [registrations])

  // Get unique statuses for filter dropdown
  const uniqueStatuses = useMemo(() => {
    const statuses = Array.from(new Set(registrations.map((reg) => reg.status)))
    return statuses.sort()
  }, [registrations])

  // Filter and sort registrations
  const filteredAndSortedRegistrations = useMemo(() => {
    let filtered = registrations

    // Apply search filter (searches in user name, email, student ID, and event title)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (reg) =>
          reg.person.first_name.toLowerCase().includes(query) ||
          reg.person.last_name.toLowerCase().includes(query) ||
          reg.email_at_registration.toLowerCase().includes(query) ||
          reg.student_id_at_registration?.toLowerCase().includes(query) ||
          reg.event.title.toLowerCase().includes(query),
      )
    }

    // Apply event filter
    if (selectedEvent !== "all") {
      filtered = filtered.filter((reg) => reg.event.id.toString() === selectedEvent)
    }

    // Apply status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((reg) => reg.status === selectedStatus)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let compareValue = 0

      switch (sortField) {
        case "joined_at":
          compareValue = new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime()
          break
        case "event_title":
          compareValue = a.event.title.localeCompare(b.event.title, "fa")
          break
        case "user_name":
          const nameA = `${a.person.first_name} ${a.person.last_name}`
          const nameB = `${b.person.first_name} ${b.person.last_name}`
          compareValue = nameA.localeCompare(nameB, "fa")
          break
        case "status":
          compareValue = a.status.localeCompare(b.status)
          break
      }

      return sortOrder === "asc" ? compareValue : -compareValue
    })

    return filtered
  }, [registrations, searchQuery, selectedEvent, selectedStatus, sortField, sortOrder])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
    }
    return sortOrder === "asc" ? <ArrowUp className="mr-2 h-4 w-4" /> : <ArrowDown className="mr-2 h-4 w-4" />
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "accepted":
        return "default"
      case "pending":
        return "secondary"
      case "rejected":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "accepted":
        return "تایید شده"
      case "pending":
        return "در انتظار"
      case "rejected":
        return "رد شده"
      default:
        return status
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
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
            <h1 className="text-2xl font-bold">ثبت‌نام‌های رویدادها</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>لیست ثبت‌نام‌ها</CardTitle>
            <CardDescription>
              مشاهده و مدیریت ثبت‌نام‌های رویدادها ({filteredAndSortedRegistrations.length} مورد)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">جستجو</label>
                <Input
                  placeholder="نام، ایمیل، شماره دانشجویی یا رویداد..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">رویداد</label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue placeholder="همه رویدادها" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه رویدادها</SelectItem>
                    {uniqueEvents.map((event) => (
                      <SelectItem key={event.id} value={event.id.toString()}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">وضعیت</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="همه وضعیت‌ها" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                    {uniqueStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {getStatusLabel(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loadingRegistrations ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : filteredAndSortedRegistrations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>
                  {searchQuery || selectedEvent !== "all" || selectedStatus !== "all"
                    ? "هیچ ثبت‌نامی با این فیلترها یافت نشد"
                    : "هیچ ثبت‌نامی وجود ندارد"}
                </p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[80px] text-right">شناسه</TableHead>
                      <TableHead className="min-w-[200px] text-right">
                        <Button variant="ghost" onClick={() => toggleSort("user_name")} className="h-8 px-2 -mr-2">
                          {getSortIcon("user_name")}
                          کاربر
                        </Button>
                      </TableHead>
                      <TableHead className="min-w-[200px] text-right">
                        <Button variant="ghost" onClick={() => toggleSort("event_title")} className="h-8 px-2 -mr-2">
                          {getSortIcon("event_title")}
                          رویداد
                        </Button>
                      </TableHead>
                      <TableHead className="min-w-[180px] text-right">ایمیل</TableHead>
                      <TableHead className="min-w-[140px] text-right">شماره دانشجویی</TableHead>
                      <TableHead className="min-w-[120px] text-right">
                        <Button variant="ghost" onClick={() => toggleSort("status")} className="h-8 px-2 -mr-2">
                          {getSortIcon("status")}
                          وضعیت
                        </Button>
                      </TableHead>
                      <TableHead className="min-w-[150px] text-right">
                        <Button variant="ghost" onClick={() => toggleSort("joined_at")} className="h-8 px-2 -mr-2">
                          {getSortIcon("joined_at")}
                          تاریخ ثبت‌نام
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedRegistrations.map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell className="font-medium text-right">#{registration.id}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {registration.person.first_name} {registration.person.last_name}
                            </span>
                            {registration.person.position && (
                              <span className="text-xs text-muted-foreground">{registration.person.position}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="truncate max-w-[200px]" title={registration.event.title}>
                            {registration.event.title}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="truncate max-w-[180px]" title={registration.email_at_registration}>
                            {registration.email_at_registration}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{registration.student_id_at_registration || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={getStatusBadgeVariant(registration.status)}>
                            {getStatusLabel(registration.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-right">
                          {new Date(registration.joined_at).toLocaleDateString("fa-IR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
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
    </div>
  )
}
