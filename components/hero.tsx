import { Button } from "@/components/ui/button"
import { ArrowRight, Code2, Users, Calendar } from "lucide-react"
import NetworkPlexus from '@/components/NetworkPlexus'

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4">
      <NetworkPlexus />
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-8">
          

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">انجمن دانشجویی ACM</h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance">
            به جامعه‌ای از دانشجویان علاقه‌مند به کاوش در علوم کامپیوتر، ساخت پروژه‌های نوآورانه و شکل‌دهی به آینده فناوری
            بپیوندید
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 group">
              عضو شوید
              <ArrowRight className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline">
              مشاهده رویدادها
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
              <Code2 className="w-12 h-12 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">کارگاه‌های فنی</h3>
              <p className="text-muted-foreground">
                فناوری‌های پیشرفته را از طریق کارگاه‌های عملی و جلسات برنامه‌نویسی یاد بگیرید
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 text-secondary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">شبکه اجتماعی</h3>
              <p className="text-muted-foreground">با دانشجویان هم‌فکر و متخصصان صنعت ارتباط برقرار کنید</p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
              <Calendar className="w-12 h-12 text-accent mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">رویدادهای منظم</h3>
              <p className="text-muted-foreground">در هاکاتون‌ها، مسابقات و جلسات سخنرانی مهمانان شرکت کنید</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
