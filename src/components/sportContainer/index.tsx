import Image from 'next/image'

interface SportContainerProps {
  sport: string
  imageUrl: string
}

export default function SportContainer({
  sport,
  imageUrl,
}: SportContainerProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className=" px-8 py-4 rounded-[10px] gap-8 text-black text-4xl flex flex-col items-center">
        <Image
          src={imageUrl}
          width={200}
          height={280}
          alt="Picture of the author"
        />
        {sport}
      </div>
    </div>
  )
}
