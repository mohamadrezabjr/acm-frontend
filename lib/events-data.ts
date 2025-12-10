export interface Event {
  id: string
  name: string
  description: string
  startDate: string
  registrationDeadline: string
  time: string
  location: string
  capacity: number
  organizer: string
  price: number
  image: string
  registered: number
  tags: string[]
  speakers: Array<{
    name: string
    position: string
    description: string
  }>
}

export const eventsData: Event[] = [
  {
    id: "workshop-ai-ml",
    name: "کارگاه هوش مصنوعی و یادگیری ماشین",
    description:
      "در این کارگاه جامع، شما با مفاهیم اساسی هوش مصنوعی و یادگیری ماشین آشنا خواهید شد. از طریق پروژه‌های عملی و تمرین‌های کاربردی، یاد خواهید گرفت که چگونه مدل‌های یادگیری ماشین بسازید و آن‌ها را برای حل مسائل واقعی به کار ببرید.",
    startDate: "1403-12-15",
    registrationDeadline: "1403-12-10",
    time: "14:00 - 17:00",
    location: "ساختمان علوم کامپیوتر، اتاق 301",
    image: "/students-learning-ai-and-machine-learning.jpg",
    organizer: "انجمن ACM دانشگاه",
    capacity: 50,
    registered: 32,
    tags: ["هوش مصنوعی", "یادگیری ماشین", "کارگاه"],
    price: 250000,
    speakers: [
      {
        name: "دکتر رضا احمدی",
        position: "استادیار علوم کامپیوتر",
        description: "متخصص هوش مصنوعی با 10 سال تجربه تدریس و تحقیق در زمینه یادگیری ماشین و شبکه‌های عصبی",
      },
    ],
  },
  {
    id: "hackathon-spring-2024",
    name: "هاکاتون بهار 1404",
    description:
      "بزرگترین هاکاتون سال! در این رویداد هیجان‌انگیز 24 ساعته، تیم‌ها برای ساخت راه‌حل‌های نوآورانه برای مسائل واقعی رقابت می‌کنند. غذا، نوشیدنی و انرژی بی‌پایان فراهم می‌شود!",
    startDate: "1404-01-16",
    registrationDeadline: "1404-01-10",
    time: "09:00 - 09:00 (روز بعد)",
    location: "سالن مهندسی",
    image: "/hackathon-students-coding-together.jpg",
    organizer: "کمیته برنامه‌نویسی ACM",
    capacity: 120,
    registered: 85,
    tags: ["هاکاتون", "برنامه‌نویسی", "رقابت"],
    price: 0,
    speakers: [],
  },
  {
    id: "industry-talks-series",
    name: "سری سخنرانی‌های صنعت",
    description:
      "به سری سخنرانی‌های ویژه ما بپیوندید که در آن رهبران برجسته صنعت فناوری تجربیات، بینش‌ها و نوآوری‌های خود را به اشتراک می‌گذارند. فرصتی عالی برای شبکه‌سازی و یادگیری.",
    startDate: "1404-01-02",
    registrationDeadline: "1404-01-01",
    time: "18:00 - 20:00",
    location: "تالار دانشگاه",
    image: "/professional-speaker-presenting-to-students.jpg",
    organizer: "کمیته روابط صنعت ACM",
    capacity: 200,
    registered: 145,
    tags: ["سخنرانی", "صنعت", "شبکه‌سازی"],
    price: 0,
    speakers: [
      {
        name: "سارا کریمی",
        position: "مدیر فنی در شرکت تک",
        description: "رهبر تیم با 15 سال تجربه در توسعه نرم‌افزار و مدیریت پروژه‌های بزرگ",
      },
      {
        name: "علی محمدی",
        position: "بنیانگذار استارتاپ هوش مصنوعی",
        description: "کارآفرین و متخصص یادگیری عمیق با تجربه در استارتاپ‌های موفق",
      },
    ],
  },
]

export function getEventById(id: string): Event | undefined {
  return eventsData.find((event) => event.id === id)
}

export function getAllEventIds(): string[] {
  return eventsData.map((event) => event.id)
}
