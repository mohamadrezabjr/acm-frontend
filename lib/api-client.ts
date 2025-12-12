// کلاینت API برای ارسال درخواست‌ها با توکن

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// دریافت توکن از کوکی
function getCookie(name: string): string | null {
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

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  })

  if (response.status === 401) {
    // توکن منقضی شده - تلاش برای refresh
    const refreshToken = getCookie("refresh_token")
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ refresh: refreshToken }),
        })

        if (refreshResponse.ok) {
          const data = await refreshResponse.json()
          // ذخیره توکن جدید
          document.cookie = `access_token=${data.access}; path=/; max-age=86400; samesite=strict`

          // تلاش مجدد درخواست اصلی
          headers["Authorization"] = `Bearer ${data.access}`
          return fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: "include",
          })
        }
      } catch (error) {
        console.error("Token refresh failed:", error)
        // ریدایرکت به صفحه لاگین
        window.location.href = "/auth/login"
      }
    }
  }

  return response
}
