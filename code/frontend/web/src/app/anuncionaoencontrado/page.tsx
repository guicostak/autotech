import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import pageNotFound from '@/assets/img/page_not_found.png';
import Botao from '@/components/Botao';

export default function AnuncioNaoEncontrado() {
  return (
    <body className="h-full flex-col flex items-center justify-center bg-gray-100">
      <Navbar />
      <div className="text-center bg-white rounded-lg items-center shadow-lg mt-16 py-10 px-20">
        <h1 className="text-3xl font-bold text-secondaryColor mb-4">Anúncio Não Encontrado</h1>
        <Image className='mx-auto' src={pageNotFound} width={300} alt="Página não encontrada" />
        <Botao className='bg-secondaryColor text-white p-4'>
          <Link href="/">
            Voltar para a página inicial
          </Link>
        </Botao>
      </div>
    </body>
  );
}
