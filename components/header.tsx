"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image";


export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, loading, logout, isAdmin, isCreator } = useAuth()

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-50 h-10 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">
              <Image
                src="/logo.png"
                alt="لوگو"
                width={120}
                height={100}
                className="inline-block mr-2"
              />

              </span>
            </div>
            {/* <span className="font-semibold text-lg">انجمن ACM</span> */}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("about")}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              درباره ما
            </button>

            <Link href="/events" className="text-foreground/80 hover:text-foreground transition-colors">
              رویداد ها
            </Link>

            <Link href="/courses" className="text-foreground/80 hover:text-foreground transition-colors">
              دوره‌ها
            </Link>
            <button
              onClick={() => scrollToSection("team")}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              تیم ما
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              تماس با ما
            </button>

            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <User className="w-4 h-4" />
                        {user.firstName}
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
                  <div className="flex items-center gap-2">
                    <Link href="/auth/login">
                      <Button variant="outline" size="sm">
                        ورود
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        ثبت‌نام
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2" aria-label="Toggle menu">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            <button
              onClick={() => scrollToSection("about")}
              className="text-right py-2 text-foreground/80 hover:text-foreground transition-colors"
            >
              درباره ما
            </button>
            <Link
              href="/events"
              onClick={() => setIsMenuOpen(false)}
              className="text-right py-2 text-foreground/80 hover:text-foreground transition-colors"
            >
              رویداد ها
            </Link>
            <Link
              href="/courses"
              onClick={() => setIsMenuOpen(false)}
              className="text-right py-2 text-foreground/80 hover:text-foreground transition-colors"
            >
              دوره‌ها
            </Link>
            <button
              onClick={() => scrollToSection("team")}
              className="text-right py-2 text-foreground/80 hover:text-foreground transition-colors"
            >
              تیم ما
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-right py-2 text-foreground/80 hover:text-foreground transition-colors"
            >
              تماس با ما
            </button>

            {!loading && (
              <>
                {user ? (
                  <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border">
                    <div className="px-2 py-2">
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{user.phone}</p>
                    </div>
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <User className="ml-2 h-4 w-4" />
                        پروفایل
                      </Button>
                    </Link>
                    {isCreator() && (
                      <Link href="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
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
                      className="w-full text-destructive"
                    >
                      <LogOut className="ml-2 h-4 w-4" />
                      خروج
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mt-2">
                    <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        ورود
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
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
