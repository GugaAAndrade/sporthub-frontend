import { Shell } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FilterTagProps {
  sport: string
}

export default function FilterTag({ sport }: FilterTagProps) {
  const router = useRouter()
  const handleRedirect = (sportChoice: string) => {
    router.push(`/courts?sport=${sportChoice}`)
  }
  return (
    <button
      onClick={() => handleRedirect(sport)}
      className="flex items-center justify-center text-base p-1 text-primary hover:bg-primary hover:text-white transition duration-300 border-primary border-2 gap-1 rounded-xl"
    >
      <Shell className="size-5 "></Shell>
      {sport || 'Todos'}
    </button>
  )
}
