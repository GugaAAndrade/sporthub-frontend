import { Shell } from 'lucide-react'

interface FilterTagProps {
  sport: string
  handleSetSport: (sport: string) => void
}

export default function FilterTag({ sport, handleSetSport }: FilterTagProps) {
  return (
    <button
      onClick={() => handleSetSport(sport)}
      className="flex items-center justify-center text-base p-1 text-primary hover:bg-primary hover:text-white transition duration-300 border-primary border-2 gap-1 rounded-xl"
    >
      <Shell className="size-5 "></Shell>
      {sport || 'Todos'}
    </button>
  )
}
