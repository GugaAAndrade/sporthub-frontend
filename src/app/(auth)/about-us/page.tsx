import DeveloperCard from '@/components/developerCard'

export default function EstabelecimentosPage() {
  return (
    <div className="flex min-h-[calc(100vh-11rem)] py-16 justify-center w-full">
      <div className="max-w-5xl flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <p className="text-[30px]"> Sobre</p>
          <p className="text-justify">
            solucao perfeita para quem busca praticidade e rapidez ao agendar
            quadras esportivas. Nossa plataforma conecta voce diretamente aos
            centros esportivos mais proximos, proporcionando uma experiencia
            simples e sem complicacoes. Esqueca as reservas manuais demoradas,
            com o SportHub, voce pode agendar quadras de forma rapida e segura,
            com poucos cliques.
          </p>
        </div>

        <div className="flex flex-col  gap-2">
          <p className="text-[30px]">Desenvolvedores</p>
          <div className="flex justify-center gap-10">
            <DeveloperCard
              imagem="/gustavo_pic.jpeg"
              github="https://github.com/GugaAAndrade"
              instagram="https://www.instagram.com/guga_andrade__/"
              linkedin="https://www.linkedin.com/in/guga-andrade/"
              name="Gustavo"
              role="Frontend"
            />
            <DeveloperCard
              imagem="/george_pic.jpeg"
              github="https://github.com/George-b1t"
              instagram="https://www.instagram.com/george_scj"
              linkedin="https://www.linkedin.com/in/george-soares-cj/"
              name="George"
              role="Design"
            />
            <DeveloperCard
              imagem="/mayke_pic.jpeg"
              github="https://github.com/MaykeESA"
              instagram="https://www.instagram.com/maykeesa/"
              linkedin="https://www.linkedin.com/in/maykeesa/"
              name="Mayke"
              role="Backend"
            />
            <DeveloperCard
              imagem="/yuri_pic.jpeg"
              github="https://github.com/YuriGarciaRibeiro"
              instagram="https://www.instagram.com/yurirgarcia/"
              linkedin="https://www.linkedin.com/in/yurigarciaribeiro/"
              name="Yuri"
              role="Backend"
            />
            <DeveloperCard
              imagem="/joma_pic.jpeg"
              github="https://github.com/jmcanario1"
              instagram="https://www.instagram.com/jm_canario/"
              linkedin="https://www.linkedin.com/in/joaomarcelocanario/"
              name="Joao"
              role="Backend"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
