import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { UpcomingEvents } from "@/components/upcoming-events"
import { UpcomingCourses } from "@/components/upcoming-courses"
import { Team } from "@/components/team"
import { Contact } from "@/components/contact"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <UpcomingEvents />
        <UpcomingCourses />
        <Team />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
