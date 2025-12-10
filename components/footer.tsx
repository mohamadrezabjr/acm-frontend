import { Github, Linkedin, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">ACM</span>
              </div>
              <span className="font-semibold">انجمن دانشگاهی</span>
            </div>
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
              <a href="#" className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
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
