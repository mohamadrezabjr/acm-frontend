"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Trophy, Award } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function KhuCPC1403Page() {
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
              گزارش کامل مسابقات KhuCPC سال 1403
            </h1>
            <p className="text-lg text-muted-foreground mb-6 text-right text-pretty">
              داستان اولین دوره مسابقات برنامه‌نویسی دانشگاه خوارزمی
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-right justify-end" dir="rtl">
              <div className="flex items-center gap-2">
                <span>15 اردیبهشت 1403</span>
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <span>سالن کنفرانس دانشگاه خوارزمی</span>
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <span>45 تیم شرکت‌کننده</span>
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
            <h2 className="text-3xl font-bold mb-6 text-right">آغاز یک سنت جدید</h2>
            <p className="text-lg leading-relaxed mb-6">
              صبح روز پانزدهم اردیبهشت ماه سال 1403، سالن کنفرانس دانشگاه خوارزمی میزبان رویدادی خاص بود. اولین دوره
              مسابقات برنامه‌نویسی الگوریتمی KhuCPC، رویایی که ماه‌ها برای تحقق آن تلاش شده بود، سرانجام به واقعیت پیوست.
              این مسابقه نه تنها یک رقابت ساده بود، بلکه آغاز یک سنت جدید در دانشگاه خوارزمی محسوب می‌شد.
            </p>

            <div className="my-8 rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="سالن مسابقه قبل از شروع"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center mt-2">سالن کنفرانس قبل از شروع مسابقه</p>
            </div>

            {/* Registration */}
            <h2 className="text-3xl font-bold mb-6 mt-12 text-right">ثبت‌نام و استقبال چشمگیر</h2>
            <p className="leading-relaxed mb-4">
              از ساعت 8 صبح، دانشجویان مشتاق شروع به حضور در سالن کردند. استقبال از این مسابقه فراتر از انتظارات بود؛ 45
              تیم سه‌نفره متشکل از 135 دانشجوی برتر رشته کامپیوتر و مهندسی نرم‌افزار برای شرکت در این رویداد ثبت‌نام کرده
              بودند. هر تیم با دریافت شماره میز و یک بسته شامل دفترچه قوانین، نقشه سالن و یک کیت خوش‌آمدگویی، به جایگاه
              خود هدایت شد.
            </p>

            <div className="grid grid-cols-2 gap-4 my-8">
              <div className="rounded-lg overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="ثبت نام شرکت کنندگان"
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
                    alt="تیم ها در حال آماده شدن"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Opening Ceremony */}
            <h2 className="text-3xl font-bold mb-6 mt-12 text-right">مراسم افتتاحیه و کلمات انگیزشی</h2>
            <p className="leading-relaxed mb-4">
              ساعت 9 صبح، مراسم افتتاحیه با سخنرانی آقای دکتر محمدی، رئیس انجمن علمی ACM دانشگاه خوارزمی، آغاز شد. ایشان
              با اشاره به اهمیت برنامه‌نویسی رقابتی و نقش آن در توسعه مهارت‌های حل مسئله، همه شرکت‌کنندگان را به تلاش و
              پشتکار تشویق کردند.
            </p>
            <p className="leading-relaxed mb-4">
              سپس آقای دکتر احمدی، استاد برجسته رشته علوم کامپیوتر، با ارائه یک سخنرانی کوتاه اما تاثیرگذار، از اهمیت
              یادگیری از شکست‌ها و ارزش رقابت سالم سخن گفتند. کلمات ایشان انگیزه و انرژی تازه‌ای به شرکت‌کنندگان بخشید.
            </p>

            <div className="my-8 rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="مراسم افتتاحیه"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center mt-2">
                دکتر محمدی در حال سخنرانی در مراسم افتتاحیه
              </p>
            </div>

            {/* Competition Start */}
            <h2 className="text-3xl font-bold mb-6 mt-12 text-right">شروع نبرد با الگوریتم‌ها</h2>
            <p className="leading-relaxed mb-4">
              ساعت 9:30 دقیقاً، سیگنال شروع مسابقه به صدا درآمد. سکوت عمیقی بر سالن حاکم شد که تنها با صدای کلیک ماوس‌ها و
              تایپ روی کیبوردها شکسته می‌شد. تیم‌ها با دریافت 12 مسئله الگوریتمی با سطوح مختلف دشواری، سفر 5 ساعته خود را
              در دنیای الگوریتم‌ها آغاز کردند.
            </p>
            <p className="leading-relaxed mb-4">
              مسائل این دوره طیف گسترده‌ای از موضوعات را پوشش می‌دادند: از مسائل ساده‌ای که با یک الگوریتم Greedy قابل حل
              بودند، تا مسائل پیچیده‌تر که نیاز به استفاده از برنامه‌نویسی پویا، گراف‌ها و درخت‌ها داشتند. برخی مسائل نیز به
              قدری چالش‌برانگیز بودند که تنها تیم‌های برتر توانستند آن‌ها را حل کنند.
            </p>

            <div className="bg-muted/50 p-6 rounded-lg my-8 border-r-4 border-primary">
              <div className="flex items-start gap-3">
                <Trophy className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2 text-right">آمار مسابقه</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-right">
                      <div className="font-semibold">تعداد مسائل:</div>
                      <div className="text-muted-foreground">12 مسئله</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">مدت زمان:</div>
                      <div className="text-muted-foreground">5 ساعت</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">تیم‌های شرکت‌کننده:</div>
                      <div className="text-muted-foreground">45 تیم</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">کل ارسال‌ها:</div>
                      <div className="text-muted-foreground">428 submission</div>
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
                    alt="تیم ها در حال کد نویسی"
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
              <div className="rounded-lg overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="تمرکز شرکت کنندگان"
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Competition Atmosphere */}
            <h2 className="text-3xl font-bold mb-6 mt-12 text-right">فضای رقابتی و هیجان‌انگیز</h2>
            <p className="leading-relaxed mb-4">
              در طول مسابقه، جو رقابتی اما دوستانه‌ای بر سالن حاکم بود. هر بار که یک تیم موفق به حل یک مسئله می‌شد، پیام
              "Accepted" روی صفحه scoreboard ظاهر می‌شد و شادی اعضای تیم پخش می‌گردید. برخی تیم‌ها با استراتژی تقسیم کار،
              هر عضو را مسئول حل دسته‌ای از مسائل کرده بودند، در حالی که برخی دیگر ترجیح می‌دادند به صورت مشترک روی هر
              مسئله کار کنند.
            </p>
            <p className="leading-relaxed mb-4">
              یکی از لحظات هیجان‌انگیز مسابقه، رقابت نزدیک بین دو تیم برتر در ساعات پایانی بود. هر دو تیم 11 مسئله را حل
              کرده بودند و در تلاش برای حل مسئله دوازدهم بودند. این رقابت تا لحظات پایانی ادامه یافت و سرانجام تیم
              "الگوریتم" با حل مسئله آخر در 10 دقیقه مانده به پایان مسابقه، عنوان قهرمانی را کسب کرد.
            </p>

            {/* End and Results */}
            <h2 className="text-3xl font-bold mb-6 mt-12 text-right">پایان مسابقه و اعلام نتایج</h2>
            <p className="leading-relaxed mb-4">
              ساعت 14:30، سیگنال پایان مسابقه به صدا درآمد. خستگی در چهره‌ها نمایان بود، اما رضایت و غرور از تلاش انجام
              شده نیز در نگاه‌ها موج می‌زد. تیم برگزارکننده با سرعت شروع به محاسبه نتایج نهایی کرد. بعد از 30 دقیقه، نتایج
              رسمی اعلام شد.
            </p>

            <div className="my-8 rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="لحظه اعلام نتایج"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center mt-2">لحظه اعلام نتایج نهایی</p>
            </div>

            {/* Winners */}
            <h2 className="text-3xl font-bold mb-6 mt-12 text-right">قهرمانان دوره اول</h2>
            <p className="leading-relaxed mb-6">
              تیم "الگوریتم" با حل 12 مسئله و زمان کل 1250 دقیقه، عنوان قهرمانی را کسب کرد. این تیم متشکل از علی احمدی،
              محمد رضایی و سارا محمدی بود که با هماهنگی عالی و استراتژی درست، توانستند تمامی مسائل را حل کنند.
            </p>

            <div className="grid md:grid-cols-3 gap-6 my-8">
              {/* First Place */}
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-2 border-yellow-500 rounded-lg p-6">
                <div className="text-5xl text-center mb-3">🥇</div>
                <h3 className="text-xl font-bold text-center mb-2">تیم الگوریتم</h3>
                <div className="text-center text-sm text-muted-foreground mb-4">مقام اول</div>
                <div className="space-y-2 text-sm text-right">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">مسائل حل شده:</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">زمان کل:</span>
                    <span className="font-semibold">1250 دقیقه</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t text-xs text-right space-y-1">
                  <div>علی احمدی</div>
                  <div>محمد رضایی</div>
                  <div>سارا محمدی</div>
                </div>
              </div>

              {/* Second Place */}
              <div className="bg-gradient-to-br from-gray-400/10 to-gray-500/10 border-2 border-gray-400 rounded-lg p-6">
                <div className="text-5xl text-center mb-3">🥈</div>
                <h3 className="text-xl font-bold text-center mb-2">تیم کدنویسان</h3>
                <div className="text-center text-sm text-muted-foreground mb-4">مقام دوم</div>
                <div className="space-y-2 text-sm text-right">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">مسائل حل شده:</span>
                    <span className="font-semibold">11</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">زمان کل:</span>
                    <span className="font-semibold">1320 دقیقه</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t text-xs text-right space-y-1">
                  <div>رضا کریمی</div>
                  <div>فاطمه حسینی</div>
                  <div>امیر نوری</div>
                </div>
              </div>

              {/* Third Place */}
              <div className="bg-gradient-to-br from-orange-600/10 to-orange-700/10 border-2 border-orange-600 rounded-lg p-6">
                <div className="text-5xl text-center mb-3">🥉</div>
                <h3 className="text-xl font-bold text-center mb-2">تیم برنامه‌نویسان</h3>
                <div className="text-center text-sm text-muted-foreground mb-4">مقام سوم</div>
                <div className="space-y-2 text-sm text-right">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">مسائل حل شده:</span>
                    <span className="font-semibold">10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">زمان کل:</span>
                    <span className="font-semibold">1405 دقیقه</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t text-xs text-right space-y-1">
                  <div>مهدی جعفری</div>
                  <div>زهرا اکبری</div>
                  <div>حسین موسوی</div>
                </div>
              </div>
            </div>

            {/* Closing Ceremony */}
            <h2 className="text-3xl font-bold mb-6 mt-12 text-right">مراسم اختتامیه و اهدای جوایز</h2>
            <p className="leading-relaxed mb-4">
              مراسم اختتامیه با حضور معاون دانشکده و جمعی از اساتید برگزار شد. در این مراسم، علاوه بر اهدای جوایز به
              تیم‌های برتر، از تمامی شرکت‌کنندگان و برگزارکنندگان تقدیر به عمل آمد. جوایز شامل جوایز نقدی، کتاب‌های تخصصی
              برنامه‌نویسی، و گواهینامه‌های افتخار بود.
            </p>
            <p className="leading-relaxed mb-4">
              آقای دکتر صادقی، معاون دانشکده، در سخنرانی پایانی خود از تلاش تیم برگزارکننده تقدیر کرد و وعده داد که
              دانشکده از برگزاری دوره‌های بعدی این مسابقه با امکانات بهتر حمایت خواهد کرد. این اظهارات با استقبال گرم
              حاضران مواجه شد.
            </p>

            <div className="grid grid-cols-2 gap-4 my-8">
              <div className="rounded-lg overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="اهدای جایزه به تیم اول"
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
                    alt="عکس دسته جمعی شرکت کنندگان"
                    width={400}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <h2 className="text-3xl font-bold mb-6 mt-12 text-right">پایان یک آغاز موفق</h2>
            <p className="leading-relaxed mb-4">
              اولین دوره KhuCPC با موفقیت به پایان رسید. این رویداد نه تنها یک مسابقه ساده بود، بلکه فرصتی برای یادگیری،
              تبادل تجربه و ایجاد روحیه کار تیمی بود. بسیاری از شرکت‌کنندگان اعلام کردند که این تجربه به آن‌ها کمک کرد تا
              نقاط ضعف خود را شناسایی کرده و برای بهبود مهارت‌هایشان برنامه‌ریزی کنند.
            </p>
            <p className="leading-relaxed mb-4">
              با پایان این مسابقه، انتظارات برای دوره دوم شکل گرفت. تیم برگزارکننده با جمع‌آوری نظرات و پیشنهادات
              شرکت‌کنندگان، شروع به برنامه‌ریزی برای دوره بعدی کرد تا تجربه‌ای بهتر و چالش‌برانگیزتر را ارائه دهد.
            </p>

            <div className="bg-primary/10 p-6 rounded-lg my-8 text-center">
              <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
              <p className="font-semibold text-lg mb-2">با تشکر از تمامی شرکت‌کنندگان</p>
              <p className="text-sm text-muted-foreground">امیدواریم در دوره‌های بعدی نیز شاهد حضور شما عزیزان باشیم</p>
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
              {Array.from({ length: 12 }).map((_, i) => (
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
