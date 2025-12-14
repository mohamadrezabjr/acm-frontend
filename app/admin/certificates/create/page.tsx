import dynamic from "next/dynamic"

const CreateCertificateClient = dynamic(
  () => import("./CreateCertificateClient"),
  { ssr: false }
)

export default function Page() {
  return <CreateCertificateClient />
}
