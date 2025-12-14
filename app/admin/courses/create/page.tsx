// app/admin/courses/create/page.tsx

export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0

import CreateCourseClient from "./CreateCourseClient"

export default function Page() {
  return <CreateCourseClient />
}
