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
  weekday : string
  time_start : string
  time_end: string
}
export enum WeekdayFa {
  Sat = 'شنبه',
  Sun = 'یکشنبه',
  Mon = 'دوشنبه',
  Tue = 'سه‌شنبه',
  Wed = 'چهارشنبه',
  Thu = 'پنجشنبه',
  Fr = 'جمعه',
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
    delete (headers as any)['Content-Type']
  } else {
    headers['Content-Type'] = 'application/json'
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
export async function fetchTags (): Promise<Tag[]> {
      try {
        const response = await apiRequest("/tags/")
        return response.json()
      } catch (error) {
        console.error("Error fetching tags:", error)
        return []
      }
    }
export async function fetchPersons (): Promise<Person[]> {
      try {
        const response = await apiRequest("/persons/")
        return response.json()
      } catch (error) {
        console.error("Error fetching persons:", error)
        return []
      }
    }
export async function fetchCourses(): Promise<Course[]> {
  const response = await apiRequest("/courses/")
  if (!response.ok) {
    throw new Error("Failed to fetch courses")
  }
  return response.json()
}

export async function fetchCourseBySlug(slug: string): Promise<Course> {
  const response = await apiRequest(`/courses/${slug}/`)
  if (!response.ok) {
    throw new Error("Failed to fetch course")
  }
  return response.json()
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

export async function eventRegitserBySlug(slug : string) : Promise<any> {
  const response = await apiRequest(`/events/registration/${slug}/`, {
    method : 'POST',
  })


  if (response.status == 409){
        return {'detail' : "ظرفیت رویداد پر شده است"}
  }
  else  if (response.status == 422){
        return {'detail' : "شما قبلا در این رویداد ثبت نام کرده اید"}
  }
  else  if (response.status == 410){
        return {'detail' : "مهلت ثبت نام تمام شده است"}
  }
  else if (response.status == 201){
    return {'detail' : "ثبت نام در رویداد با موفقیت انجام شد. می توانید در پروفایل خود اطلاعات رویداد را مشاهده کنید."}
  }
  else {
      return {"detail" : "ثبت نام موفقیت امیز نبود"}
  }
  
}

export async function courseRegitserBySlug(slug : string) : Promise<any> {
  const response = await apiRequest(`/courses/registration/${slug}/`, {
    method : 'POST',
  })


  if (response.status == 409){
        return {'detail' : "ظرفیت دوره پر شده است"}
  }
  else  if (response.status == 422){
        return {'detail' : "شما قبلا در این دوره ثبت نام کرده اید"}
  }
  else  if (response.status == 410){
        return {'detail' : "مهلت ثبت نام تمام شده است"}
  }
  else if (response.status == 201){
    return {'detail' : "ثبت نام در دوره با موفقیت انجام شد. می توانید در پروفایل خود اطلاعات دوره را مشاهده کنید."}
  }
  else {
      return {"detail" : "ثبت نام موفقیت امیز نبود"}
  }
  
}
