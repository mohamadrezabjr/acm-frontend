"use client"
import { Github, Linkedin } from "lucide-react"
import Image from "next/image"
import { useTheme } from "@/lib/theme-context"

export function Footer() {
  const { theme, mounted } = useTheme()

  return (
    <footer className="bg-muted/30 border-t border-border py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-38 h-10 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">
                  <Image
                    src={theme === "dark" ? "/logo-dark.png" : "/logo.png"}
                    alt="لوگو"
                    width={180}
                    height={100}
                    className="inline-block mr-2 w-32 md:w-[180px]"
                  />
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">انجمن علمی ACM دانشگاه خوارزمی</p>
            <br></br>
            <p className="text-sm text-muted-foreground">پیشبرد علوم کامپیوتر به عنوان یک علم و حرفه</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">لینک‌های سریع</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#about" className="hover:text-foreground transition-colors">
                  درباره ما
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-foreground transition-colors">
                  رویدادها
                </a>
              </li>
              <li>
                <a href="#team" className="hover:text-foreground transition-colors">
                  تیم ما
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-foreground transition-colors">
                  تماس با ما
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">منابع</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  پورتال اعضا
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  قوانین رفتاری
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  اساسنامه
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  ACM بین‌المللی
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">ما را دنبال کنید</h4>
            <div className="flex gap-3">
              <a
                href="https://github.com/mohamadrezabjr"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a href="https://t.me/ACMkhu" className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Telegram">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 240 240">
                  <path fill="currentColor" d="M120 0C53.73 0 0 53.73 0 120s53.73 120 120 120 120-53.73 120-120S186.27 0 120 0zm55.07 80.73l-22.02 103.82c-1.66 7.21-6.01 8.97-12.21 5.61l-33.68-24.86-16.25 15.63c-1.8 1.8-3.32 3.32-6.79 3.32l2.44-34.56 62.99-56.96c2.73-2.44-.59-3.8-4.23-1.36l-77.72 48.85-33.45-10.44c-7.25-2.25-7.38-7.25 1.52-10.73l129.03-49.77c5.94-2.25 11.15 1.45 9.37 10.4z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/acm-khu/"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} انجمن دانشجویی ACM. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  )
}
