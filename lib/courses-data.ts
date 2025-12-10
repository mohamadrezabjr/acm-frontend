export interface Course {
  id: string
  name: string
  description: string
  instructors: Array<{
    name: string
    position: string
    bio: string
  }>
  startDate: string
  registrationDeadline: string
  capacity: number
  registered: number
  schedule: string
  organizer: string
  location: string
  price: number
  image: string
  tags: string[]
}

export const coursesData: Course[] = [
  {
    id: "python-programming",
    name: "دوره جامع برنامه‌نویسی پایتون",
    description:
      "این دوره جامع شما را از مبانی پایه تا مباحث پیشرفته برنامه‌نویسی پایتون راهنمایی می‌کند. در این دوره با ساختارهای داده، الگوریتم‌ها، برنامه‌نویسی شی‌گرا و کار با کتابخانه‌های محبوب آشنا خواهید شد.",
    instructors: [
      {
        name: "دکتر محمد رضایی",
        position: "استادیار مهندسی کامپیوتر",
        bio: "متخصص پایتون با 8 سال تجربه تدریس و توسعه نرم‌افزار",
      },
    ],
    startDate: "1404-02-01",
    registrationDeadline: "1404-01-25",
    capacity: 30,
    registered: 18,
    schedule: "شنبه و دوشنبه، 17:00 - 19:00",
    organizer: "انجمن ACM دانشگاه",
    location: "آزمایشگاه کامپیوتر شماره 2",
    price: 1500000,
    image: "/programming-code-on-screen.png",
    tags: ["برنامه‌نویسی", "پایتون", "مبتدی"],
  },
  {
    id: "web-development",
    name: "دوره توسعه وب با React و Node.js",
    description:
      "یک دوره کامل برای یادگیری توسعه وب مدرن. در این دوره با React، Node.js، Express و MongoDB آشنا می‌شوید و یک پروژه کامل full-stack خواهید ساخت.",
    instructors: [
      {
        name: "مهندس سارا احمدی",
        position: "توسعه‌دهنده Senior Full-Stack",
        bio: "توسعه‌دهنده وب با 10 سال تجربه در شرکت‌های بزرگ فناوری",
      },
      {
        name: "مهندس امیر حسینی",
        position: "متخصص Front-End",
        bio: "طراح و توسعه‌دهنده رابط کاربری با تجربه در پروژه‌های بین‌المللی",
      },
    ],
    startDate: "1404-02-05",
    registrationDeadline: "1404-01-28",
    capacity: 25,
    registered: 22,
    schedule: "یکشنبه و چهارشنبه، 18:00 - 20:30",
    organizer: "انجمن ACM دانشگاه",
    location: "آزمایشگاه کامپیوتر شماره 1",
    price: 2000000,
    image: "/web-development-coding.jpg",
    tags: ["توسعه وب", "React", "Node.js", "پیشرفته"],
  },
  {
    id: "machine-learning-bootcamp",
    name: "بوت‌کمپ یادگیری ماشین",
    description:
      "یک دوره فشرده و عملی برای ورود به دنیای یادگیری ماشین. با الگوریتم‌های مختلف، کتابخانه‌های scikit-learn و TensorFlow و پروژه‌های واقعی کار خواهید کرد.",
    instructors: [
      {
        name: "دکتر فاطمه کریمی",
        position: "استادیار هوش مصنوعی",
        bio: "پژوهشگر و مدرس یادگیری ماشین با مقالات متعدد در کنفرانس‌های معتبر",
      },
    ],
    startDate: "1404-02-10",
    registrationDeadline: "1404-02-05",
    capacity: 20,
    registered: 15,
    schedule: "سه‌شنبه و پنج‌شنبه، 16:00 - 18:30",
    organizer: "انجمن ACM دانشگاه",
    location: "آزمایشگاه هوش مصنوعی",
    price: 2500000,
    image: "/ai-neural-network.png",
    tags: ["هوش مصنوعی", "یادگیری ماشین", "پیشرفته"],
  },
]

export function getCourseById(id: string): Course | undefined {
  return coursesData.find((course) => course.id === id)
}

export function getAllCourseIds(): string[] {
  return coursesData.map((course) => course.id)
}
