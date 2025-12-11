"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">ACM</span>
            </div>
            <span className="font-semibold text-lg">انجمن دانشگاهی</span>
          </div>

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
              className="text-left py-2 text-foreground/80 hover:text-foreground transition-colors"
            >
              درباره ما
            </button>
            <button
              onClick={() => scrollToSection("events")}
              className="text-left py-2 text-foreground/80 hover:text-foreground transition-colors"
            >
              رویدادها
            </button>
            <Link
              href="/courses"
              onClick={() => setIsMenuOpen(false)}
              className="text-left py-2 text-foreground/80 hover:text-foreground transition-colors"
            >
              دوره‌ها
            </Link>
            <button
              onClick={() => scrollToSection("team")}
              className="text-left py-2 text-foreground/80 hover:text-foreground transition-colors"
            >
              تیم ما
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-left py-2 text-foreground/80 hover:text-foreground transition-colors"
            >
              تماس با ما
            </button>
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
          </nav>
        )}
      </div>
    </header>
  )
}
