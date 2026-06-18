import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"

import { TooltipProvider } from "@/components/ui/tooltip"
import { AppLayout } from "@/components/app-layout"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "DevRel OS",
  description: "Personal CRM for Developer Relations professionals",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body>
        <TooltipProvider>
          <AppLayout>{children}</AppLayout>
        </TooltipProvider>
        <Toaster richColors closeButton />
      </body>
    </html>
  )
}
