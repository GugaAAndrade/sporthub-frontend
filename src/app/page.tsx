export default function Home() {
  return (
    <div className="bg-no-repeat bg-center h-screen bg-black flex justify-center py-44 pr-72 bg-pattern">
      <div className="flex flex-col gap-16">
        <div className=" flex flex-col  text-white text-7xl">
          <p>
            <span className="text-[#fbd701]">SIMPLIFIQUE</span> A SUA VIDA,
          </p>
          <p>
            <span className="text-[#fbd701]">OTIMIZE</span> SEU TEMPO E{' '}
          </p>
          <p>
            <span className="text-[#fbd701]">ELEVE</span> SEU JOGO
          </p>
        </div>
        <button className="bg-[#fbd701] text-xl  rounded-[14px]  w-56 h-16  ">
          {' '}
          BORA COMECAR
        </button>
      </div>
    </div>
  )
}
