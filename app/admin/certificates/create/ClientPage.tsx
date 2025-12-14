"use client"

import dynamic from "next/dynamic"

const CreateCertificateClient = dynamic(
  () => import("./CreateCertificateClient"),
  { ssr: false }
)

export default function ClientPage() {
  return <CreateCertificateClient />
}
