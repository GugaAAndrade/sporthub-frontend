interface DeveloperCardProps {
  name: string
  role: string
  linkedin: string
  github: string
  imagem: string
  instagram: string
}

export default function DeveloperCard({
  name,
  role,
  linkedin,
  github,
  instagram,
  imagem,
}: DeveloperCardProps) {
  return (
    <div className="flex w-40 flex-col gap-2 rounded-lg">
      <img
        className="w-40 h-56 object-cover max-h-52 rounded-lg  "
        src={imagem}
        alt="fotoDEv"
      />
      <div className="text-center w-40">
        <p className="text-xl">
          {' '}
          {name} - {role}
        </p>
        <div className="flex flex-col gap-1">
          <div className="w-full bg-blue-600 text-white rounded-md">
            <a className=" w-full rounded-xs" href={linkedin} target="_blank">
              Linkedin
            </a>
          </div>
          <div className="w-full bg-gray-900 text-white rounded-md">
            <a className="rounded-xs" href={github} target="_blank">
              Github
            </a>
          </div>
          <div className="w-full bg-orange-600 text-white rounded-md">
            <a className="rounded-xs" href={instagram} target="_blank">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
