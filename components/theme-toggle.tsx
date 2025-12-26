"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-context"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button variant="outline" size="icon" className="bg-transparent" onClick={toggleTheme}>
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">تغییر تم</span>
    </Button>
  )
}
