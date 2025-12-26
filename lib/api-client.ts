const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Event types matching Django API response
export interface Tag {
  id: number
  name: string
}

export interface Person {
  id: number
  user?: number
  first_name: string
  last_name: string
  bio?: string
  position?: string
  avatar?: string
}

export interface TimePlan {
  weekday: string
  time_start: string
  time_end: string
}
export enum WeekdayFa {
  Sat = "شنبه",
  Sun = "یکشنبه",
  Mon = "دوشنبه",
  Tue = "سه‌شنبه",
  Wed = "چهارشنبه",
  Thu = "پنجشنبه",
  Fr = "جمعه",
}

export interface Event {
  slug: string
  title: string
  description: string
  tags: string[]
  start_date: string
  end_date: string
  registration_start_at: string
  registration_deadline: string
  capacity: number
  registered: number
  location: string
  price: number
  organizer: string
  image: string
  speakers: Person[]
  dependencies: string[]
}

export interface Course {
  slug: string
  title: string
  description: string
  tags: string[]
  start_date: string
  end_date: string
  registration_start_at: string
  registration_deadline: string
  capacity: number
  registered: number
  location: string
  price: number
  organizer: string
  image: string
  instructors: Person[]
  time_plans: TimePlan[]
  dependencies: string[]
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null
  return null
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getCookie("access_token")

  const headers: HeadersInit = {
    ...options.headers,
  }

  if (options.body instanceof FormData) {
    delete (headers as any)["Content-Type"]
  } else {
    headers["Content-Type"] = "application/json"
  }
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  })

  if (response.status === 403) {
    const refreshToken = getCookie("refresh_token")
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ refresh: refreshToken }),
        })

        if (refreshResponse.ok) {
          const data = await refreshResponse.json()
          document.cookie = `access_token=${data.access}; path=/; max-age=86400; samesite=strict`

          return fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: "include",
          })
        } else {
          document.cookie = "access_token=; path=/; max-age=0"
          document.cookie = "refresh_token=; path=/; max-age=0"
        }
      } catch (error) {
        document.cookie = "access_token=; path=/; max-age=0"
        document.cookie = "refresh_token=; path=/; max-age=0"
        console.error("Token refresh failed:", error)
        window.location.href = "/auth/login"
      }
    }
  }

  return response
}
export async function fetchTags(): Promise<Tag[]> {
  try {
    const response = await apiRequest("/tags/")
    return response.json()
  } catch (error) {
    console.error("Error fetching tags:", error)
    return []
  }
}
export async function fetchPersons(): Promise<Person[]> {
  try {
    const response = await apiRequest("/persons/")
    return response.json()
  } catch (error) {
    console.error("Error fetching persons:", error)
    return []
  }
}

const MOCK_EVENTS: Event[] = [
  {
    slug: "python-workshop",
    title: "رویداد پایتون",
    description: "یک رویداد آموزشی درباره پایتون و برنامه‌نویسی",
    tags: ["پایتون", "برنامه‌نویسی"],
    start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    registration_start_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    registration_deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    capacity: 50,
    registered: 30,
    location: "دانشکده علوم ریاضی و کامپیوتر",
    price: 0,
    organizer: "انجمن ACM",
    image: "/python-workshop.jpg",
    speakers: [
      {
        id: 1,
        first_name: "برنا",
        last_name: "محمدی",
        position: "جاوا دولوپر",
        bio: "i love java",
      },
    ],
    dependencies: [],
  },
]

const MOCK_COURSES: Course[] = [
  {
    slug: "web-development",
    title: "توسعه وب",
    description: "دوره جامع توسعه وب با HTML، CSS و JavaScript",
    tags: ["وب", "برنامه‌نویسی"],
    start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    registration_start_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    registration_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    capacity: 100,
    registered: 45,
    location: "دانشکده علوم ریاضی و کامپیوتر",
    price: 50000,
    organizer: "انجمن ACM",
    image: "/web-development.jpg",
    instructors: [
      {
        id: 2,
        first_name: "احمد",
        last_name: "کریمی",
        position: "استاد",
        bio: "متخصص توسعه وب",
      },
    ],
    time_plans: [
      { weekday: "شنبه", time_start: "18:00", time_end: "20:00" },
      { weekday: "دوشنبه", time_start: "18:00", time_end: "20:00" },
    ],
    dependencies: [],
  },
]

export async function fetchCourses(): Promise<Course[]> {
  try {
    const response = await apiRequest("/courses/")
    if (!response.ok) {
      throw new Error("Failed to fetch courses")
    }
    return response.json()
  } catch (error) {
    console.error("[v0] Fetching courses failed, using mock data:", error)
    return MOCK_COURSES
  }
}

export async function fetchCourseBySlug(slug: string): Promise<Course> {
  try {
    const response = await apiRequest(`/courses/${slug}/`)
    if (!response.ok) {
      throw new Error("Failed to fetch course")
    }
    return response.json()
  } catch (error) {
    console.error("[v0] Fetching course failed:", error)
    const mockCourse = MOCK_COURSES.find((c) => c.slug === slug)
    if (mockCourse) return mockCourse
    throw error
  }
}

export async function fetchEvents(): Promise<Event[]> {
  try {
    const response = await apiRequest("/events/")
    if (!response.ok) {
      throw new Error("Failed to fetch events")
    }
    return response.json()
  } catch (error) {
    console.error("[v0] Fetching events failed, using mock data:", error)
    return MOCK_EVENTS
  }
}

export async function fetchEventBySlug(slug: string): Promise<Event> {
  try {
    const response = await apiRequest(`/events/${slug}/`)
    if (!response.ok) {
      throw new Error("Failed to fetch event")
    }
    return response.json()
  } catch (error) {
    console.error("[v0] Fetching event failed:", error)
    const mockEvent = MOCK_EVENTS.find((e) => e.slug === slug)
    if (mockEvent) return mockEvent
    throw error
  }
}

export async function fetchUserEvents(): Promise<Event[]> {
  const response = await apiRequest("/profile/events/")
  if (!response.ok) {
    throw new Error("Failed to fetch user events")
  }
  return response.json()
}

export async function fetchUserCourses(): Promise<any[]> {
  const response = await apiRequest("/auth/me/courses/")
  if (!response.ok) {
    throw new Error("Failed to fetch user courses")
  }
  return response.json()
}

export async function updateUserProfile(data: {
  first_name?: string
  last_name?: string
  email?: string
  student_id?: string
  avatar?: string
}): Promise<any> {
  const response = await apiRequest("/auth/me/", {
    method: "PATCH",
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("Failed to update profile")
  }
  return response.json()
}

export async function uploadProfileImage(file: File): Promise<any> {
  const token = getCookie("access_token")

  const formData = new FormData()
  formData.append("profile_image", file)

  const headers: HeadersInit = {}
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}/auth/me/profile-image/`, {
    method: "POST",
    headers,
    credentials: "include",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to upload profile image")
  }
  return response.json()
}

export async function eventRegitserBySlug(slug: string): Promise<any> {
  const response = await apiRequest(`/events/registration/${slug}/`, {
    method: "POST",
  })

  if (response.status == 409) {
    return { detail: "ظرفیت رویداد پر شده است", type: "error" }
  } else if (response.status == 422) {
    return { detail: "شما قبلا در این رویداد ثبت نام کرده اید", type: "info" }
  } else if (response.status == 410) {
    return { detail: "مهلت ثبت نام تمام شده است", type: "error" }
  } else if (response.status == 201) {
    return {
      detail: "ثبت نام در رویداد با موفقیت انجام شد. می توانید در پروفایل خود اطلاعات رویداد را مشاهده کنید.",
      type: "success",
    }
  } else if (response.status == 400) {
    return { detail: "لطفا فیلد های مورد نیاز برای ثبت نام را پر کنید", type: "error" }
  } else {
    return { detail: "ثبت نام موفقیت امیز نبود", type: "error" }
  }
}

export async function courseRegitserBySlug(slug: string): Promise<any> {
  const response = await apiRequest(`/courses/registration/${slug}/`, {
    method: "POST",
  })

  if (response.status == 409) {
    return { detail: "ظرفیت دوره پر شده است", type: "error" }
  } else if (response.status == 422) {
    return { detail: "شما قبلا در این دوره ثبت نام کرده اید", type: "info" }
  } else if (response.status == 410) {
    return { detail: "مهلت ثبت نام تمام شده است", type: "error" }
  } else if (response.status == 201) {
    return {
      detail: "ثبت نام در دوره با موفقیت انجام شد. می توانید در پروفایل خود اطلاعات دوره را مشاهده کنید.",
      type: "success",
    }
  } else if (response.status == 400) {
    return { detail: "لطفا فیلد های مورد نیاز برای ثبت نام را پر کنید", type: "error" }
  } else {
    return { detail: "ثبت نام موفقیت امیز نبود", type: "error" }
  }
}

export const apiClient = {
  get: async (endpoint: string) => {
    try {
      const response = await apiRequest(endpoint, { method: "GET" })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const text = await response.text()

      // Check if response is actually JSON
      if (!text || text.startsWith("<")) {
        console.error(`[v0] API returned HTML instead of JSON. Endpoint: ${endpoint}`)
        throw new Error(`API error: Server returned HTML. Check if endpoint is correct: ${endpoint}`)
      }

      return { data: JSON.parse(text) }
    } catch (error) {
      console.error(`[v0] API GET failed for ${endpoint}:`, error)
      throw error
    }
  },
  post: async (endpoint: string, data?: any) => {
    const response = await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
    return { data: await response.json() }
  },
  patch: async (endpoint: string, data?: any) => {
    const response = await apiRequest(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
    return { data: await response.json() }
  },
  delete: async (endpoint: string) => {
    const response = await apiRequest(endpoint, { method: "DELETE" })
    return { data: await response.json() }
  },
}
