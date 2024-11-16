import { useAnuncios } from '@/hooks/useAnuncios';
import CardAnuncio from './CardAnuncio';
import LoadingDots from '@/utils/loading/LoadingDots';
import { useEffect } from 'react';
import Botao from './Botao';
import { useRouter } from 'next/router';
import Link from 'next/link';


const CardsHome = () => {
  const { anuncios, getAnunciosRecentes, loading } = useAnuncios();

  useEffect(() => {
    getAnunciosRecentes(8);
  }, []); 

  return (
    <div className="container mx-auto p-5 text-center rounded-xl bg-white px-14 w-11/12 shadow-lg">
      <h1 className="text-2xl text-left text-mainColor">Anúncios recentes</h1>
      <div className="flex flex-col justify-center items-center">
        {loading ? (
          <div className='mb-10'>
            <LoadingDots isLoading={loading} />
          </div>
        ) : anuncios.length > 0 ? (
          <div className="flex flex-row items-center justify-center flex-wrap pt-12">
            {anuncios.map((anuncio) => (
              <CardAnuncio
                key={anuncio.id} 
                anuncio={anuncio}
              />
            ))}
          </div>
        ) : (
          <p className='font-extralight text-gray-400 mb-10'>Nenhum anúncio encontrado.</p>
        )}
      </div>
      <Botao onClick={() => {}} className='text-mainColor font-thin'>
        <Link href="anuncios?campoOrdenacao=dataCriacao&ordenacao=desc&tipoAnuncio=AMBOS&page=0&size=30" className='hover:border-b-2 border-secondaryColor text-secondaryColor'>
          Ver todos
        </Link>
      </Botao>
    </div>
  );
};

export default CardsHome;
