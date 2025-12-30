"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Users, Calendar, MapPin, Award, ImageIcon, Video, Download } from "lucide-react"

export default function KhuCPC1404Page() {
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
              سال 1404
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">مسابقات برنامه‌نویسی KhuCPC 1404</h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              دومین دوره مسابقات الگوریتمی برنامه‌نویسی دانشگاه خوارزمی
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>20 اردیبهشت 1404</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>سالن کنفرانس دانشگاه خوارزمی</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>62 تیم شرکت‌کننده</span>
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
                <div className="text-3xl font-bold mb-1">62</div>
                <div className="text-sm text-muted-foreground">تیم شرکت‌کننده</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Trophy className="h-10 w-10 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold mb-1">14</div>
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
                  دومین دوره مسابقات برنامه‌نویسی KhuCPC در تاریخ 20 اردیبهشت 1404 با حضور 62 تیم از دانشجویان دانشگاه
                  خوارزمی و دانشگاه‌های دیگر برگزار شد. این دوره با استقبال بیشتر و با افزایش سطح دشواری مسائل، رقابت
                  هیجان‌انگیزتری نسبت به دوره قبل داشت.
                </p>
                <p>
                  مسابقه شامل 14 مسئله الگوریتمی با سطوح مختلف دشواری بود. مسائل این دوره شامل الگوریتم‌های پیشرفته‌تر و
                  ساختارهای داده پیچیده‌تری بودند که چالش‌های بیشتری را برای شرکت‌کنندگان ایجاد کرد.
                </p>
                <p>
                  یکی از ویژگی‌های بارز این دوره، حضور تیم‌هایی از دانشگاه‌های دیگر بود که باعث افزایش سطح رقابت و تبادل
                  تجربیات بین دانشگاهی شد.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline - Similar structure to 1403 */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-right">گزارش تصویری مسابقه</h2>
            <div className="space-y-8" dir="rtl">
              {/* Similar timeline items as 1403 but with different content */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline">08:00 - 09:00</Badge>
                    <CardTitle className="text-right">ثبت نام و پذیرش تیم‌ها</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-right mb-4">
                    با توجه به افزایش تعداد شرکت‌کنندگان، فرآیند ثبت نام امسال سریع‌تر و سازمان‌یافته‌تر برگزار شد. تیم‌ها از
                    دانشگاه‌های مختلف حضور داشتند.
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

              {/* Add more timeline items similar to 1403 page */}
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
              {/* Winner cards - placeholder data */}
              <Card className="relative overflow-hidden border-2 border-yellow-500">
                <div className="absolute top-0 right-0 bg-yellow-500 text-white px-4 py-1 text-sm font-bold">
                  🥇 مقام اول
                </div>
                <CardHeader className="pt-12">
                  <CardTitle className="text-right text-2xl">تیم [نام تیم]</CardTitle>
                  <CardDescription className="text-right">[تعداد] مسئله حل شده</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-right">
                    <p className="font-semibold">اعضای تیم:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• [نام عضو اول]</li>
                      <li>• [نام عضو دوم]</li>
                      <li>• [نام عضو سوم]</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Second and third place cards */}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery - Same structure as 1403 */}
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
