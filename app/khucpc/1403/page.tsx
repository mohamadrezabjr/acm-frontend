"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Users, Calendar, MapPin, Award, ImageIcon, Video, Download } from "lucide-react"

export default function KhuCPC1403Page() {
  const [selectedMedia, setSelectedMedia] = useState<"photos" | "videos">("photos")

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/khucpc">
              <Button variant="ghost" size="sm">
                → بازگشت به صفحه اصلی
              </Button>
            </Link>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 text-lg px-6 py-2" variant="secondary">
              سال 1403
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">مسابقات برنامه‌نویسی KhuCPC 1403</h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              اولین دوره مسابقات الگوریتمی برنامه‌نویسی دانشگاه خوارزمی
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>15 اردیبهشت 1403</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>سالن کنفرانس دانشگاه خوارزمی</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>45 تیم شرکت‌کننده</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="h-10 w-10 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold mb-1">45</div>
                <div className="text-sm text-muted-foreground">تیم شرکت‌کننده</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Trophy className="h-10 w-10 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold mb-1">12</div>
                <div className="text-sm text-muted-foreground">مسئله</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="h-10 w-10 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold mb-1">5</div>
                <div className="text-sm text-muted-foreground">ساعت مسابقه</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Award className="h-10 w-10 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold mb-1">3</div>
                <div className="text-sm text-muted-foreground">تیم برنده</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-right">درباره مسابقه</h2>
            <Card>
              <CardContent className="pt-6 prose prose-lg max-w-none text-right" dir="rtl">
                <p>
                  اولین دوره مسابقات برنامه‌نویسی KhuCPC در تاریخ 15 اردیبهشت 1403 با حضور 45 تیم از دانشجویان دانشگاه
                  خوارزمی برگزار شد. این مسابقه با هدف ارتقای سطح مهارت‌های الگوریتمی و برنامه‌نویسی دانشجویان و ایجاد
                  فضایی رقابتی و علمی برگزار گردید.
                </p>
                <p>
                  مسابقه شامل 12 مسئله الگوریتمی با سطوح مختلف دشواری بود که تیم‌ها باید در مدت 5 ساعت به حل آن‌ها
                  می‌پرداختند. مسائل طراحی شده توسط اساتید و دانشجویان برتر رشته علوم کامپیوتر بودند و طیف گسترده‌ای از
                  موضوعات الگوریتمی را پوشش می‌دادند.
                </p>
                <p>
                  جو رقابتی و در عین حال دوستانه این مسابقه، یکی از ویژگی‌های برجسته آن بود. دانشجویان علاوه بر رقابت،
                  فرصتی برای یادگیری و تبادل تجربیات پیدا کردند.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-right">گزارش تصویری مسابقه</h2>
            <div className="space-y-8" dir="rtl">
              {/* Timeline Item 1 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">08:00 - 09:00</Badge>
                    <CardTitle className="text-right">ثبت نام و پذیرش تیم‌ها</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-right mb-4">
                    تیم‌ها در سالن کنفرانس حضور یافته و پس از تکمیل فرآیند ثبت نام، به ایستگاه‌های خود هدایت شدند. فضای پر
                    انرژی و هیجان قبل از شروع مسابقه در سالن حاکم بود.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Item 2 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">09:00 - 09:30</Badge>
                    <CardTitle className="text-right">مراسم افتتاحیه</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-right mb-4">
                    مراسم افتتاحیه با سخنرانی رئیس انجمن علمی ACM و معرفی قوانین مسابقه آغاز شد. همچنین اساتید برجسته
                    رشته کامپیوتر حضور داشتند و با ارائه سخنرانی‌های انگیزشی، دانشجویان را به تلاش بیشتر تشویق کردند.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <Video className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Item 3 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">09:30 - 14:30</Badge>
                    <CardTitle className="text-right">شروع مسابقه</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-right mb-4">
                    مسابقه به طور رسمی آغاز شد. تیم‌ها با دریافت 12 مسئله الگوریتمی، شروع به تحلیل و حل مسائل کردند. جو
                    رقابتی شدیدی در سالن حاکم بود و هر تیم تلاش می‌کرد تا بیشترین تعداد مسائل را در کمترین زمان حل کند.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Item 4 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">14:30 - 15:00</Badge>
                    <CardTitle className="text-right">پایان مسابقه و اعلام نتایج</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-right mb-4">
                    پس از پایان 5 ساعت مسابقه، نتایج نهایی محاسبه و اعلام شد. تیم‌های برتر مشخص شدند و آماده دریافت جوایز
                    شدند.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Item 5 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">15:00 - 16:00</Badge>
                    <CardTitle className="text-right">مراسم اختتامیه و اهدای جوایز</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-right mb-4">
                    مراسم اختتامیه با حضور مسئولین دانشگاه و اساتید برگزار شد. جوایز نفرات برتر اهدا گردید و از تمامی
                    شرکت‌کنندگان تقدیر شد. همچنین گواهی شرکت در مسابقه به تمامی تیم‌ها اعطا شد.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <Video className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Winners */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-right">تیم‌های برتر</h2>
            <div className="grid md:grid-cols-3 gap-6" dir="rtl">
              {/* First Place */}
              <Card className="relative overflow-hidden border-2 border-yellow-500">
                <div className="absolute top-0 right-0 bg-yellow-500 text-white px-4 py-1 text-sm font-bold">
                  🥇 مقام اول
                </div>
                <CardHeader className="pt-12">
                  <CardTitle className="text-right text-2xl">تیم الگوریتم</CardTitle>
                  <CardDescription className="text-right">12 مسئله حل شده</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-right">
                    <p className="font-semibold">اعضای تیم:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• علی احمدی</li>
                      <li>• محمد رضایی</li>
                      <li>• سارا محمدی</li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm text-muted-foreground text-right">زمان کل: 1250 دقیقه</div>
                  </div>
                </CardContent>
              </Card>

              {/* Second Place */}
              <Card className="relative overflow-hidden border-2 border-gray-400">
                <div className="absolute top-0 right-0 bg-gray-400 text-white px-4 py-1 text-sm font-bold">
                  🥈 مقام دوم
                </div>
                <CardHeader className="pt-12">
                  <CardTitle className="text-right text-2xl">تیم کدنویسان</CardTitle>
                  <CardDescription className="text-right">11 مسئله حل شده</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-right">
                    <p className="font-semibold">اعضای تیم:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• رضا کریمی</li>
                      <li>• فاطمه حسینی</li>
                      <li>• امیر نوری</li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm text-muted-foreground text-right">زمان کل: 1320 دقیقه</div>
                  </div>
                </CardContent>
              </Card>

              {/* Third Place */}
              <Card className="relative overflow-hidden border-2 border-orange-600">
                <div className="absolute top-0 right-0 bg-orange-600 text-white px-4 py-1 text-sm font-bold">
                  🥉 مقام سوم
                </div>
                <CardHeader className="pt-12">
                  <CardTitle className="text-right text-2xl">تیم برنامه‌نویسان</CardTitle>
                  <CardDescription className="text-right">10 مسئله حل شده</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-right">
                    <p className="font-semibold">اعضای تیم:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• مهدی جعفری</li>
                      <li>• زهرا اکبری</li>
                      <li>• حسین موسوی</li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm text-muted-foreground text-right">زمان کل: 1405 دقیقه</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-right">گالری تصاویر و ویدیوها</h2>

            <Tabs value={selectedMedia} onValueChange={(v) => setSelectedMedia(v as "photos" | "videos")} dir="rtl">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="photos">تصاویر</TabsTrigger>
                <TabsTrigger value="videos">ویدیوها</TabsTrigger>
              </TabsList>

              <TabsContent value="photos">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-muted rounded-lg flex items-center justify-center hover:bg-muted/70 transition-colors cursor-pointer"
                    >
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="videos">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-video bg-muted rounded-lg flex items-center justify-center hover:bg-muted/70 transition-colors cursor-pointer"
                    >
                      <Video className="h-16 w-16 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-right">فایل‌های قابل دانلود</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right flex items-center justify-between">
                    <span>مسائل مسابقه</span>
                    <Download className="h-5 w-5" />
                  </CardTitle>
                  <CardDescription className="text-right">فایل PDF شامل تمامی مسائل مسابقه</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">دانلود فایل</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-right flex items-center justify-between">
                    <span>نتایج نهایی</span>
                    <Download className="h-5 w-5" />
                  </CardTitle>
                  <CardDescription className="text-right">جدول کامل نتایج تمامی تیم‌ها</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">دانلود فایل</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
