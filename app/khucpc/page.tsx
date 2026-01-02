"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import { Trophy, Calendar, Users, Code, Award, Target, Clock, Play, ChevronRight, Star, ArrowRight, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function KhuCPCPage() {
  const router = useRouter()
  const [activeYear, setActiveYear] = useState("1403")
  const { user, loading, isCreator, logout } = useAuth()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push("/auth/login")
      return
    }

    if (!isCreator()) {
      router.push("/")
      return
    }
  }, [user, loading, isCreator, router])

  // Sample data - replace with real data later
  const stats = [
    { icon: Trophy, label: "دوره‌های برگزار شده", value: "2" },
    { icon: Users, label: "شرکت‌کنندگان", value: "107" },
    { icon: Award, label: "تیم‌های برتر", value: "6" },
    { icon: Code, label: "مسائل حل شده", value: "26" },
  ]

  const timeline = [
    {
      year: "1404",
      title: "دومین دوره KhuCPC",
      description: "دومین دوره با حضور 62 تیم شرکت‌کننده",
      status: "گذشته",
      date: "20 اردیبهشت 1404",
      link: "/khucpc/1404",
    },
    {
      year: "1403",
      title: "اولین دوره KhuCPC",
      description: "آغاز مسابقات با حضور 45 تیم",
      status: "گذشته",
      date: "15 اردیبهشت 1403",
      link: "/khucpc/1403",
    },
  ]

  const gallery = {
    "1404": [],
    "1403": [],
  }
  if (loading || !user) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )
}
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="flex justify-start mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowRight className="w-4 h-4" />
                بازگشت به صفحه اصلی
              </Button>
            </Link>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 text-lg px-4 py-2" variant="secondary">
              <Trophy className="w-4 h-4 ml-2 inline-block" />
              مسابقات برنامه‌نویسی الگوریتمی
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-l from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              KhuCPC
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              مسابقات برنامه‌نویسی دانشگاه خوارزمی
            </p>
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              رقابتی هیجان‌انگیز برای تمامی علاقه‌مندان به الگوریتم‌ها و حل مسئله. مهارت‌های خود را به چالش بکشید و با
              بهترین‌ها رقابت کنید.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8">
                ثبت‌نام در دوره جدید
                <ChevronRight className="w-5 h-5 mr-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                مشاهده دوره‌های قبل
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">درباره KhuCPC</h2>
              <div className="w-20 h-1 bg-gradient-to-l from-primary to-secondary mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <Target className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-right">هدف مسابقه</h3>
                  <p className="text-muted-foreground text-right leading-relaxed">
                    ارتقای مهارت‌های برنامه‌نویسی و حل مسئله، آماده‌سازی دانشجویان برای مسابقات ICPC و ایجاد فضایی رقابتی و
                    آموزشی برای علاقه‌مندان به الگوریتم‌ها.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-secondary/50 transition-colors">
                <CardContent className="p-6">
                  <Code className="w-12 h-12 text-secondary mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-right">فرمت مسابقه</h3>
                  <p className="text-muted-foreground text-right leading-relaxed">
                    مسابقه به صورت تیمی (3 نفره) برگزار می‌شود. هر تیم در مدت 5 ساعت باید مسائل الگوریتمی را حل کند.
                    مسابقه مشابه فرمت ICPC برگزار می‌گردد.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-accent/50 transition-colors">
                <CardContent className="p-6">
                  <Clock className="w-12 h-12 text-accent mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-right">زمان برگزاری</h3>
                  <p className="text-muted-foreground text-right leading-relaxed">
                    مسابقات KhuCPC هر ساله در فصل پاییز (ماه آذر) برگزار می‌شود و یکی از مهم‌ترین رویدادهای علمی دانشگاه
                    خوارزمی محسوب می‌گردد.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <Award className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-right">جوایز</h3>
                  <p className="text-muted-foreground text-right leading-relaxed">
                    تیم‌های برتر مسابقه جوایز نقدی و گواهینامه دریافت می‌کنند. همچنین فرصت معرفی به شرکت‌های مطرح فناوری
                    اطلاعات فراهم می‌شود.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">تاریخچه مسابقات</h2>
              <div className="w-20 h-1 bg-gradient-to-l from-primary to-secondary mx-auto" />
            </div>
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="relative pr-12 border-r-4 border-primary/20">
                  <div className="absolute right-0 top-0 transform translate-x-1/2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      {item.status === "آینده" ? (
                        <Star className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Trophy className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                  <Card className="mr-4 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-right flex-1">
                          <Badge variant={item.status === "آینده" ? "default" : "secondary"} className="mb-2">
                            {item.status}
                          </Badge>
                          <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                          <p className="text-muted-foreground mb-3">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 ml-2" />
                          {item.date}
                        </div>
                        {item.link && (
                          <Link href={item.link}>
                            <Button variant="ghost" size="sm">
                              مشاهده گزارش کامل
                              <ChevronRight className="w-4 h-4 mr-2" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">گالری تصاویر و ویدیوها</h2>
            <div className="w-20 h-1 bg-gradient-to-l from-primary to-secondary mx-auto mb-6" />
            <p className="text-muted-foreground max-w-2xl mx-auto">خاطرات به‌یادماندنی از دوره‌های قبلی مسابقات</p>
          </div>

          <Tabs defaultValue="1404" value={activeYear} onValueChange={setActiveYear} className="max-w-6xl mx-auto">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="1404">1404</TabsTrigger>
              <TabsTrigger value="1403">1403</TabsTrigger>
            </TabsList>

            {Object.entries(gallery).map(([year, items]) => (
              <TabsContent key={year} value={year}>
                {items.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="max-w-md mx-auto">
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                        <Play className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">گالری خالی است</h3>
                      <p className="text-muted-foreground mb-6">
                        تصاویر و ویدیوهای مسابقات سال {year} به زودی اضافه خواهد شد
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {items.map((item, index) => (
                      <Card key={index} className="overflow-hidden group hover:shadow-lg transition-shadow">
                        <CardContent className="p-0">
                          <div className="relative aspect-video bg-muted">
                            <Image
                              src={item.url || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {item.type === "video" && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                                  <Play className="w-8 h-8 text-primary mr-1" />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="p-4 text-right">
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                <div className="text-center mt-8">
                  <Link href={`/khucpc/${year}`}>
                    <Button size="lg" variant="outline">
                      مشاهده گزارش کامل سال {year}
                      <ChevronRight className="w-5 h-5 mr-2" />
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">قوانین و مقررات</h2>
              <div className="w-20 h-1 bg-gradient-to-l from-primary to-secondary mx-auto" />
            </div>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 text-right">
                  <h3 className="text-lg font-bold mb-2">1. ترکیب تیم</h3>
                  <p className="text-muted-foreground">
                    هر تیم شامل 3 نفر دانشجو می‌باشد. یک دستگاه رایانه و یک صفحه‌کلید در اختیار هر تیم قرار می‌گیرد.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-right">
                  <h3 className="text-lg font-bold mb-2">2. زمان مسابقه</h3>
                  <p className="text-muted-foreground">
                    مدت زمان مسابقه 5 ساعت است و تیم‌ها باید در این مدت حداکثر تعداد مسائل را با صحت بالا حل کنند.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-right">
                  <h3 className="text-lg font-bold mb-2">3. زبان‌های برنامه‌نویسی</h3>
                  <p className="text-muted-foreground">زبان‌های مجاز شامل: C++، Java، Python و C می‌باشند.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-right">
                  <h3 className="text-lg font-bold mb-2">4. نحوه امتیازدهی</h3>
                  <p className="text-muted-foreground">
                    تیم‌ها بر اساس تعداد مسائل حل شده و زمان صرف شده رتبه‌بندی می‌شوند. جریمه زمانی برای هر پاسخ نادرست در
                    نظر گرفته می‌شود.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Trophy className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">آماده‌ای برای چالش؟</h2>
            <p className="text-lg text-muted-foreground mb-8">
              در دومین دوره مسابقات KhuCPC شرکت کنید و مهارت‌های خود را به نمایش بگذارید
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8">
                ثبت‌نام کنید
                <ChevronRight className="w-5 h-5 mr-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                تماس با ما
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
