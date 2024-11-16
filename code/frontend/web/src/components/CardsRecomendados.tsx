import { useAnuncios } from '@/hooks/useAnuncios';
import CardAnuncio from './CardAnuncio';
import LoadingDots from '@/utils/loading/LoadingDots';
import { useEffect } from 'react';

const CardsRecomendados = () => {
  const { anuncios, getAnunciosRecentes } = useAnuncios();

  useEffect(() => {
    getAnunciosRecentes(4);
  }, []); 

  return (
    <div className="container text-left px-12 pt-5  bg-white rounded-lg mb-10 shadow-lg">
      <h1 className="text-2xl mb-10 ">Veja também</h1>
      <div className="flex justify-center">
        {anuncios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-10">
            {anuncios.map((anuncio) => ( 
              <CardAnuncio
                key={anuncio.id} 
                anuncio={anuncio}
              />
            ))}
          </div>
        ) : (
          <LoadingDots isLoading={true} />
        )}
      </div>
    </div>
  );
};

export default CardsRecomendados;