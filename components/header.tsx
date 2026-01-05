"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, loading, logout, isAdmin, isCreator } = useAuth()
  const { theme, mounted } = useTheme()

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
            <div className="flex items-center justify-center">
              {mounted && (
                <Image
                  src={theme === "dark" ? "/logo-dark.png" : "/logo.png"}
                  alt="لوگو"
                  width={120}
                  height={100}
                  className="w-20 md:w-[120px] transition-opacity group-hover:opacity-90"
                />
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => scrollToSection("about")}
              className="px-3 py-2 rounded-md text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-all"
            >
              درباره ما
            </button>

            <Link
              href="/events"
              className="px-3 py-2 rounded-md text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-all"
            >
              رویداد ها
            </Link>

            <Link
              href="/courses"
              className="px-3 py-2 rounded-md text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-all"
            >
              دوره‌ها
            </Link>

            <button
              onClick={() => scrollToSection("team")}
              className="px-3 py-2 rounded-md text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-all"
            >
              تیم ما
            </button>

            <button
              onClick={() => scrollToSection("contact")}
              className="px-3 py-2 rounded-md text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-all"
            >
              تماس با ما
            </button>

            <div className="h-6 w-px bg-border/50 mx-2" />

            <ThemeToggle />

            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-accent/30 hover:bg-accent/50 border-border/50 mr-2"
                      >
                        <User className="w-4 h-4" />
                        <span className="font-medium">{user.firstName}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>حساب کاربری</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <User className="ml-2 h-4 w-4" />
                          پروفایل
                        </Link>
                      </DropdownMenuItem>
                      {isCreator() && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin/dashboard" className="cursor-pointer">
                            <Settings className="ml-2 h-4 w-4" />
                            پنل مدیریت
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                        <LogOut className="ml-2 h-4 w-4" />
                        خروج
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2 mr-2">
                    <Link href="/auth/login">
                      <Button variant="ghost" size="sm" className="font-medium">
                        ورود
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-sm"
                      >
                        ثبت‌نام
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-accent/50 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-1 animate-in slide-in-from-top-2">
            <button
              onClick={() => scrollToSection("about")}
              className="text-right px-3 py-2.5 rounded-md text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-all"
            >
              درباره ما
            </button>
            <Link
              href="/events"
              onClick={() => setIsMenuOpen(false)}
              className="text-right px-3 py-2.5 rounded-md text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-all"
            >
              رویداد ها
            </Link>
            <Link
              href="/courses"
              onClick={() => setIsMenuOpen(false)}
              className="text-right px-3 py-2.5 rounded-md text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-all"
            >
              دوره‌ها
            </Link>
            <button
              onClick={() => scrollToSection("team")}
              className="text-right px-3 py-2.5 rounded-md text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-all"
            >
              تیم ما
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-right px-3 py-2.5 rounded-md text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-all"
            >
              تماس با ما
            </button>

            {!loading && (
              <>
                {user ? (
                  <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border/50">
                    <div className="px-3 py-2 rounded-md bg-accent/30">
                      <p className="font-medium text-sm">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{user.phone}</p>
                    </div>
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                        <User className="ml-2 h-4 w-4" />
                        پروفایل
                      </Button>
                    </Link>
                    {isCreator() && (
                      <Link href="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                          <Settings className="ml-2 h-4 w-4" />
                          پنل مدیریت
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="w-full justify-start text-destructive hover:text-destructive"
                    >
                      <LogOut className="ml-2 h-4 w-4" />
                      خروج
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border/50">
                    <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        ورود
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 w-full shadow-sm"
                      >
                        ثبت‌نام
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
