"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

const ShareCard = ({ link }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link || window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Copy failed", err)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>اشتراک‌گذاری</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">این دوره را با دوستان خود به اشتراک بگذارید</p>

        <Button
          variant="outline"
          onClick={handleCopy}
          className="
            w-full bg-transparent
            flex items-center justify-center gap-2
            transition-all duration-300 ease-out
            hover:scale-[1.02]
            active:scale-[0.98]
            min-h-[44px]
            px-4
          "
        >
          <span
            className={`
              transition-all duration-300 whitespace-nowrap
              ${copied ? "text-green-600" : ""}
            `}
          >
            {copied ? "لینک کپی شد" : "کپی لینک"}
          </span>

          <span
            className={`
              transition-all duration-300 flex-shrink-0
              ${copied ? "opacity-100 scale-100" : "opacity-100 scale-100"}
            `}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-black dark:text-white" />
            )}
          </span>
        </Button>
      </CardContent>
    </Card>
  )
}

export default ShareCard
