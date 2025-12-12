const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Event types matching Django API response
export interface Speaker {
  user: string | null
  name: string
  position: string
  bio: string
}

export interface Event {
  slug: string
  title: string
  description : string
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
  speakers: Speaker[]
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
    "Content-Type": "application/json",
    ...options.headers,
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
        }
      } catch (error) {
        console.error("Token refresh failed:", error)
        window.location.href = "/auth/login"
      }
    }
  }

  return response
}

export async function fetchEvents(): Promise<Event[]> {
  const response = await apiRequest("/events/")
  if (!response.ok) {
    throw new Error("Failed to fetch events")
  }
  return response.json()
}

export async function fetchEventBySlug(slug: string): Promise<Event> {
  const response = await apiRequest(`/events/${slug}/`)
  if (!response.ok) {
    throw new Error("Failed to fetch event")
  }
  return response.json()
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
