import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider } from "@/lib/theme-context"

import { Vazirmatn, Geist as V0_Font_Geist, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _geist = V0_Font_Geist({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

const vazirmatn = Vazirmatn({ subsets: ["arabic"] })

export const metadata: Metadata = {
  title: "ACM Scientific Association - Kharazmi University  ",
  description:
    "به انجمن ACM دانشگاه ما بپیوندید تا با علاقه‌مندان به علوم کامپیوتر ارتباط برقرار کنید، در کارگاه‌ها شرکت کنید و حرفه خود را در فناوری پیش ببرید.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16" },
      { url: "/favicon-32x32.png", sizes: "32x32" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-touch-icon.png",
  },
  other: {
    "apple-mobile-web-app-title": "ACM",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="ACM" />
      </head>
      <body className={`${vazirmatn.className} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
