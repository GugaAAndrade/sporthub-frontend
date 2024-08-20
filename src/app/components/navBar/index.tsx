import Image from 'next/image' // Import the Image component from the appropriate library

export default function NavBar() {
  return (
    <div className="bg-black/20 text-white flex items-center fixed w-full h-20  ">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo_colorida.png" alt="logo" width={36} height={36} />{' '}
          <h1 className="text-2xl font-bold ">
            SPORTS
            <span className="text-[#fbd701]">HUB</span>
          </h1>
        </div>

        <div className="flex items-center gap-9">
          <a href="#">Home</a>
          <a href="#">Esportes</a>
          <a href="#">Estabelecimento</a>
        </div>

        <div className="flex items-center gap-7">
          <a className="text-[#fbd701]" href="">
            Criar Conta
          </a>

          <button className="px-4 py-2 bg-[#FBD701] text-black rounded-[14px] flex items-center">
            Entrar
          </button>
        </div>
      </div>
    </div>
  )
}
