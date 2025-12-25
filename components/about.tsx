import { BookOpen, Award, Lightbulb, Rocket } from "lucide-react"

export function About() {
  return (
    <section id="about" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">درباره انجمن ما</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            ما یک سازمان دانشجویی هستیم که به پیشبرد علوم کامپیوتر به عنوان یک علم و حرفه اختصاص دارد
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">یادگیری و رشد</h3>
                <p className="text-muted-foreground">
                  به منابع آموزشی دسترسی پیدا کنید، در کارگاه‌ها شرکت کنید و مهارت‌های خود را در حوزه‌های مختلف علوم
                  کامپیوتر توسعه دهید
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">رقابت و برتری</h3>
                <p className="text-muted-foreground">
                  در مسابقات برنامه‌نویسی و هاکاتون‌ها شرکت کنید و استعدادهای خود را در سطح منطقه‌ای و ملی به نمایش بگذارید
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">نوآوری و خلق</h3>
                <p className="text-muted-foreground">
                  روی پروژه‌های دنیای واقعی کار کنید، با همکاران همکاری کنید و ایده‌های نوآورانه خود را به واقعیت تبدیل
                  کنید
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">شروع حرفه شغلی</h3>
                <p className="text-muted-foreground">
                  با رهبران صنعت ارتباط برقرار کنید، در نمایشگاه‌های شغلی شرکت کنید و برای سفر حرفه‌ای خود در فناوری آماده
                  شوید
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-8 md:p-12 border border-border">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">۲۰+</div>
              <div className="text-muted-foreground">اعضای فعال</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">۲۰+</div>
              <div className="text-muted-foreground">رویداد در سال</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">۱۵+</div>
              <div className="text-muted-foreground">شرکای صنعتی</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">۵</div>
              <div className="text-muted-foreground">سال فعالیت</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
