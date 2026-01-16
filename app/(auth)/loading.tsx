import { Loader } from "lucide-react"

const loading = () => {
  return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <Loader className="animate-spin size-24 text-green-500" />
      </div>
  )
}
export default loading
