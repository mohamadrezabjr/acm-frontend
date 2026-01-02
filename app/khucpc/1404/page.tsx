"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Trophy, Award, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useEffect } from "react"

export default function KhuCPC1404Page() {
  const router = useRouter()
  
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
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-12 md:py-20 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/khucpc">
              <Button variant="ghost" size="sm">
                ← بازگشت به KhuCPC
              </Button>
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4" variant="secondary">
              گزارش مسابقه
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance text-right">
              گزارش کامل مسابقات KhuCPC سال 1404
            </h1>
            <p className="text-lg text-muted-foreground mb-6 text-right text-pretty">
              دومین دوره: رشد، توسعه و رقابتی فراتر از انتظارات
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-right justify-end" dir="rtl">
              <div className="flex items-center gap-2">
                <span>20 اردیبهشت 1404</span>
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <span>سالن کنفرانس دانشگاه خوارزمی</span>
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <span>62 تیم شرکت‌کننده</span>
                <Users className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <article className="py-16" dir="rtl">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg text-right">
            {/* Introduction */}
            <h2 className="text-3xl font-bold mb-6 text-right">دومین دوره: رشد و توسعه</h2>
            <p className="text-lg leading-relaxed mb-6">
              یک سال از برگزاری اولین دوره KhuCPC می‌گذشت و انتظارات برای دوره دوم بالا بود. تیم برگزارکننده با بهره‌گیری
              از تجربیات سال گذشته و با توجه به بازخوردهای دریافتی، برنامه‌ریزی دقیق‌تری را برای این دوره در نظر گرفته
              بود. موفقیت دوره قبل باعث شد که این بار نه تنها دانشجویان دانشگاه خوارزمی، بلکه تیم‌هایی از دانشگاه‌های دیگر
              نیز برای شرکت در این رویداد ثبت‌نام کنند.
            </p>

            <div className="my-8 rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="پوستر تبلیغاتی KhuCPC 1404"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center mt-2">پوستر رسمی دومین دوره KhuCPC</p>
            </div>

            {/* Preparation */}
            <h2 className="text-3xl font-bold mb-6 mt-12 text-right">آماده‌سازی و تدارکات</h2>
            <p className="leading-relaxed mb-4">
              تیم برگزارکننده ماه‌ها قبل از مسابقه شروع به برنامه‌ریزی کرده بود. این بار تعداد مسائل از 12 به 14 افزایش
              یافت و سطح دشواری آن‌ها نیز بالاتر رفت. کمیته علمی مسابقه متشکل از اساتید برجسته و دانشجویان دکتری، مسائلی
              طراحی کردند که نه تنها دانش الگوریتمی بلکه خلاقیت و مهارت حل مسئله را نیز می‌سنجیدند.
            </p>
            <p className="leading-relaxed mb-4">
              با توجه به افزایش تعداد شرکت‌کنندگان از 45 به 62 تیم، تدارکات بیشتری نیز لازم بود. سالن بزرگ‌تری انتخاب شد،
              سیستم‌های رایانه‌ای به‌روزرسانی گردیدند و تیم پشتیبانی فنی تقویت شد تا بتوانند به سرعت به هر مشکل احتمالی
              رسیدگی کنند.
            </p>

            <div className="grid grid-cols-2 gap-4 my-8">
              <div className="rounded-lg overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="آماده‌سازی سالن"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="تست سیستم‌ها"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Registration Day */}
            <h2 className="text-3xl font-bold mb-6 mt-12 text-right">روز مسابقه: استقبال گسترده</h2>
            <p className="leading-relaxed mb-4">
              صبح روز بیستم اردیبهشت، ساعت 8 صبح، سالن کنفرانس شلوغ‌تر از همیشه بود. تیم‌هایی از شهرهای مختلف حضور داشتند
              و این تنوع، انرژی خاصی به فضا می‌بخشید. فرآیند ثبت‌نام با استفاده از سیستم بارکد خوانی سریع‌تر از سال گذشته
              انجام شد و تیم‌ها در مدت کوتاهی به جایگاه‌های خود رفتند.
            </p>
            <p className="leading-relaxed mb-4">
              یکی از نوآوری‌های این دوره، ارائه یک دفترچه راهنما به هر تیم بود که شامل نکات مهم در مورد سیستم داوری، نحوه
              ارسال کدها، و پاسخ به سوالات متداول بود. همچنین یک سیستم پرسش و پاسخ آنلاین نیز راه‌اندازی شده بود تا تیم‌ها
              بتوانند در صورت ابهام در صورت مسائل، سوال خود را مطرح کنند.
            </p>

            <div className="my-8 rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="تیم‌ها در حال ثبت نام"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center mt-2">فضای پر انرژی ثبت نام صبح روز مسابقه</p>
            </div>

            {/* Opening Ceremony */}
            <h2 className="text-3xl font-bold mb-6 mt-12 text-right">مراسم افتتاحیه و حضور مهمانان ویژه</h2>
            <p className="leading-relaxed mb-4">
              مراسم افتتاحیه امسال باشکوه‌تر از سال گذشته برگزار شد. علاوه بر رئیس انجمن علمی و اساتید دانشگاه خوارزمی،
              چند نفر از قهرمانان مسابقات برنامه‌نویسی کشوری نیز به عنوان مهمان ویژه حضور داشتند. آن‌ها با اشتراک تجربیات
              خود از مسابقات بین‌المللی، الهام بخش بسیاری از شرکت‌کنندگان شدند.
            </p>
            <p className="leading-relaxed mb-4">
              دکتر رضایی، معاون آموزشی دانشکده، در سخنانی کوتاه از تلاش تیم برگزارکننده تشکر کرد و اعلام کرد که دانشکده
              برنامه دارد از برگزاری منظم این مسابقات حمایت کند و آن را به یک رویداد سالانه تبدیل نماید. این خبر با
              استقبال گرم حاضران مواجه شد.
            </p>

            <div className="grid grid-cols-3 gap-4 my-8">
              <div className="rounded-lg overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="سخنرانی مهمانان"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="جمعیت شرکت کنندگان"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="فضای مراسم افتتاحیه"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Competition Start */}
            <h2 className="text-3xl font-bold mb-6 mt-12 text-right">آغاز رقابت: چالش‌های سخت‌تر</h2>
            <p className="leading-relaxed mb-4">
              ساعت 9:30 صبح، سیگنال شروع به صدا درآمد. این بار مسائل سخت‌تر بودند و از همان ساعات اولیه مشخص شد که رقابت
              نزدیک و هیجان‌انگیز خواهد بود. 14 مسئله طراحی شده بودند که 4 مسئله آن‌ها به قدری پیچیده بودند که انتظار
              می‌رفت تنها تیم‌های برتر بتوانند آن‌ها را حل کنند.
            </p>
            <p className="leading-relaxed mb-4">
              مسائل این دوره شامل الگوریتم‌های پیشرفته‌ای مانند الگوریتم‌های گراف پیچیده، برنامه‌نویسی پویا روی ساختارهای
              درختی، و مسائل هندسه محاسباتی بودند. یکی از مسائل که بعدها به عنوان سخت‌ترین مسئله مسابقه شناخته شد، تنها
              توسط 3 تیم حل شد.
            </p>

            <div className="bg-muted/50 p-6 rounded-lg my-8 border-r-4 border-primary">
              <div className="flex items-start gap-3">
                <Trophy className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2 text-right">آمار مسابقه</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-right">
                      <div className="font-semibold">تعداد مسائل:</div>
                      <div className="text-muted-foreground">14 مسئله</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">مدت زمان:</div>
                      <div className="text-muted-foreground">5 ساعت</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">تیم‌های شرکت‌کننده:</div>
                      <div className="text-muted-foreground">62 تیم</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">کل ارسال‌ها:</div>
                      <div className="text-muted-foreground">687 submission</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 my-8">
              <div className="rounded-lg overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="تیم ها در حال حل مسئله"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="نمایی از scoreboard"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="فضای مسابقه"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Competition Highlights */}
            <h2 className="text-3xl font-bold mb-6 mt-12 text-right">لحظات به یاد ماندنی</h2>
            <p className="leading-relaxed mb-4">
              یکی از لحظات هیجان‌انگیز مسابقه در ساعت 12 ظهر رخ داد. تا آن زمان، سه تیم در صدر جدول قرار داشتند که هر
              کدام 9 مسئله را حل کرده بودند. رقابت برای حل مسئله دهم، فضای سالن را پر از تنش و هیجان کرد. هر چند دقیقه
              یک بار، scoreboard به‌روزرسانی می‌شد و جایگاه تیم‌ها تغییر می‌کرد.
            </p>
            <p className="leading-relaxed mb-4">
              در ساعت 13:45، یعنی 45 دقیقه قبل از پایان مسابقه، یک تیم از دانشگاه صنعتی شریف موفق شد مسئله یازدهم را حل
              کند و به صدر جدول برسد. این باعث شد که تیم‌های دیگر با انگیزه بیشتری به حل مسائل باقی‌مانده بپردازند. 15
              دقیقه به پایان مسابقه مانده بود که دو تیم دیگر نیز موفق به حل مسئله یازدهم شدند و رقابت برای عنوان قهرمانی
              تا لحظات آخر ادامه یافت.
            </p>

            <div className="my-8 rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="لحظات پایانی مسابقه"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center mt-2">تنش و هیجان در لحظات پایانی مسابقه</p>
            </div>

            {/* End and Results */}
            <h2 className="text-3xl font-bold mb-6 mt-12 text-right">پایان مسابقه و محاسبه نتایج</h2>
            <p className="leading-relaxed mb-4">
              ساعت 14:30، زنگ پایان به صدا درآمد. تیم‌ها با خستگی اما رضایت از تلاش انجام شده، از پشت سیستم‌های خود بلند
              شدند. برخی از تیم‌ها که موفق به حل تعداد زیادی از مسائل شده بودند، شادمانی خود را پنهان نمی‌کردند، در حالی
              که برخی دیگر که انتظارات بیشتری داشتند، کمی ناامید به نظر می‌رسیدند، اما همگی از تجربه شرکت در این رویداد
              قدردانی می‌کردند.
            </p>
            <p className="leading-relaxed mb-4">
              محاسبه نتایج نهایی حدود 40 دقیقه طول کشید. سیستم رتبه‌بندی بر اساس تعداد مسائل حل شده و در صورت تساوی، بر
              اساس زمان کل صرف شده برای حل مسائل بود. سرانجام، نتایج اعلام شد و تیم‌های برتر مشخص گردیدند.
            </p>

            <div className="grid grid-cols-2 gap-4 my-8">
              <div className="rounded-lg overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="لحظه اعلام نتایج"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="واکنش تیم ها"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Winners */}
            <h2 className="text-3xl font-bold mb-6 mt-12 text-right">قهرمانان دوره دوم</h2>
            <p className="leading-relaxed mb-6">
              این دوره با رقابت نزدیک‌تری نسبت به دوره قبل همراه بود. تیم برنده با حل 11 مسئله و زمان کل 1180 دقیقه،
              عنوان قهرمانی را کسب کرد. جالب اینکه تیم‌های دوم و سوم نیز 11 مسئله را حل کرده بودند و تنها با اختلاف زمان
              از یکدیگر جدا شدند که نشان از سطح بالای رقابت داشت.
            </p>

            <div className="grid md:grid-cols-3 gap-6 my-8">
              {/* First Place */}
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-2 border-yellow-500 rounded-lg p-6">
                <div className="text-5xl text-center mb-3">🥇</div>
                <h3 className="text-xl font-bold text-center mb-2">تیم [نام تیم اول]</h3>
                <div className="text-center text-sm text-muted-foreground mb-4">مقام اول</div>
                <div className="space-y-2 text-sm text-right">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">مسائل حل شده:</span>
                    <span className="font-semibold">11</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">زمان کل:</span>
                    <span className="font-semibold">1180 دقیقه</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t text-xs text-right space-y-1">
                  <div>[نام عضو اول]</div>
                  <div>[نام عضو دوم]</div>
                  <div>[نام عضو سوم]</div>
                </div>
              </div>

              {/* Second Place */}
              <div className="bg-gradient-to-br from-gray-400/10 to-gray-500/10 border-2 border-gray-400 rounded-lg p-6">
                <div className="text-5xl text-center mb-3">🥈</div>
                <h3 className="text-xl font-bold text-center mb-2">تیم [نام تیم دوم]</h3>
                <div className="text-center text-sm text-muted-foreground mb-4">مقام دوم</div>
                <div className="space-y-2 text-sm text-right">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">مسائل حل شده:</span>
                    <span className="font-semibold">11</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">زمان کل:</span>
                    <span className="font-semibold">1235 دقیقه</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t text-xs text-right space-y-1">
                  <div>[نام عضو اول]</div>
                  <div>[نام عضو دوم]</div>
                  <div>[نام عضو سوم]</div>
                </div>
              </div>

              {/* Third Place */}
              <div className="bg-gradient-to-br from-orange-600/10 to-orange-700/10 border-2 border-orange-600 rounded-lg p-6">
                <div className="text-5xl text-center mb-3">🥉</div>
                <h3 className="text-xl font-bold text-center mb-2">تیم [نام تیم سوم]</h3>
                <div className="text-center text-sm text-muted-foreground mb-4">مقام سوم</div>
                <div className="space-y-2 text-sm text-right">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">مسائل حل شده:</span>
                    <span className="font-semibold">11</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">زمان کل:</span>
                    <span className="font-semibold">1298 دقیقه</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t text-xs text-right space-y-1">
                  <div>[نام عضو اول]</div>
                  <div>[نام عضو دوم]</div>
                  <div>[نام عضو سوم]</div>
                </div>
              </div>
            </div>

            {/* Closing Ceremony */}
            <h2 className="text-3xl font-bold mb-6 mt-12 text-right">مراسم اختتامیه و جوایز ویژه</h2>
            <p className="leading-relaxed mb-4">
              مراسم اختتامیه امسال با شکوه بیشتری برگزار شد. علاوه بر جوایز نقدی برای تیم‌های برتر، جوایز ویژه‌ای نیز برای
              بهترین تیم دانشجویی سال اول، بهترین تیم دختران، و اولین تیمی که مسئله سخت را حل کرد، در نظر گرفته شده بود.
            </p>
            <p className="leading-relaxed mb-4">
              یکی از لحظات احساسی مراسم، تقدیر از تیم برگزارکننده بود که ماه‌ها برای موفقیت این رویداد تلاش کرده بودند.
              دانشجویان با تشویق گرم از زحمات آن‌ها قدردانی کردند. همچنین از حامیان مالی مسابقه که امسال بیشتر از سال
              گذشته بودند، تشکر به عمل آمد.
            </p>

            <div className="grid grid-cols-2 gap-4 my-8">
              <div className="rounded-lg overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="مراسم اهدای جوایز"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="شادی تیم قهرمان"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <h2 className="text-3xl font-bold mb-6 mt-12 text-right">پایان دوره دوم و نگاهی به آینده</h2>
            <p className="leading-relaxed mb-4">
              دومین دوره KhuCPC با موفقیتی فراتر از انتظارات به پایان رسید. افزایش تعداد شرکت‌کنندگان، حضور تیم‌های بین
              دانشگاهی، و ارتقای سطح مسائل، همه نشان می‌داد که این مسابقه به سمت تبدیل شدن به یک رویداد برجسته در سطح
              دانشگاه‌های کشور در حرکت است.
            </p>
            <p className="leading-relaxed mb-4">
              بازخوردهای دریافتی از شرکت‌کنندگان بسیار مثبت بود. بسیاری از آن‌ها اعلام کردند که این تجربه به آن‌ها کمک کرده
              تا نقاط قوت و ضعف خود را بهتر بشناسند و برای مسابقات بعدی و حتی مسابقات بین‌المللی آماده شوند. برخی از
              تیم‌های شرکت‌کننده نیز اعلام آمادگی کردند که در برگزاری دوره‌های بعدی به عنوان داوطلب همکاری کنند.
            </p>
            <p className="leading-relaxed mb-4">
              با پایان این دوره، برنامه‌ریزی برای دوره سوم آغاز شد. هدف، تبدیل KhuCPC به بزرگ‌ترین مسابقه برنامه‌نویسی
              دانشگاه‌های تهران و حتی جذب تیم‌های بین‌المللی است. با حمایت دانشگاه و اشتیاق دانشجویان، این هدف دور از ذهن
              نیست.
            </p>

            <div className="bg-primary/10 p-6 rounded-lg my-8 text-center">
              <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
              <p className="font-semibold text-lg mb-2">سپاسگزاریم از حضور شما</p>
              <p className="text-sm text-muted-foreground">منتظر دیدار شما در دوره سوم KhuCPC هستیم</p>
            </div>
          </div>
        </div>
      </article>

      {/* Gallery Section */}
      <section className="py-16 bg-muted/30 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-right">گالری تصاویر</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-muted rounded-lg overflow-hidden hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <Image
                    src={`/placeholder_photo.png?height=300&width=300&text=Photo ${i + 1}`}
                    alt={`تصویر ${i + 1}`}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">می‌خواهید در دوره بعدی شرکت کنید؟</h2>
            <p className="text-muted-foreground mb-6">برای اطلاع از زمان برگزاری دوره بعدی، صفحه اصلی را دنبال کنید</p>
            <Link href="/khucpc">
              <Button size="lg">بازگشت به صفحه اصلی KhuCPC</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
