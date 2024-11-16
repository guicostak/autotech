"use client"
import { useEffect, useState } from "react";
import Image from 'next/image';
import mercadoPagoImg from '@/assets/img/mercadopago.jpeg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faHeart, faCreditCard, faCartShopping, faStore, faPhone, faEnvelope, faStar } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useVerAnuncioDetalhado } from "@/hooks/useVerAnuncioDetalhado";
import { formatData } from '@/utils/regex/dataRegex';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import LoadingDots from "@/utils/loading/LoadingDots";

interface AnuncioDoProdutoDetalhadoProps {
  idAnuncio: number;
  router: AppRouterInstance;
}

export default function AnuncioDoProdutoDetalhado({ idAnuncio, router }: AnuncioDoProdutoDetalhadoProps) {

  const {
    loading,
    getAnuncioByIdHook,
    anuncio,
  } = useVerAnuncioDetalhado(router);

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isFavorited, setIsFavorited] = useState(false);
  const toggleFavorite = () => setIsFavorited(!isFavorited);

  useEffect(() => {
    getAnuncioByIdHook(idAnuncio);
  }, [idAnuncio]);

  useEffect(() => {
    if (anuncio?.imagens?.length) {
      setSelectedImage(anuncio.imagens[0]);
    }
  }, [anuncio]);

  const images = anuncio?.imagens || [];

  if (loading) {
    return <div className="mt-20"> <LoadingDots isLoading={loading} /> </div>;
  } else {
    return (
      <div className="min-h-screen bg-mainBackground">

        {/* Main Content */}
        <div className="bg-white min-h-[2170px] w-[1100px] mx-auto p-6 shadow-lg mt-6 flex flex-col items-center rounded-lg">
          <div className="flex flex-col lg:flex-row gap-6 justify-center items-start">
            {/* Left Section: Product Gallery and Details */}
            <div className="w-full lg:w-[486px] flex flex-col space-y-6">
              {/* ProductGallery */}
              <div className="flex flex-col items-center">
                <div className="border rounded-lg w-[400px] h-[400px] overflow-hidden">
                  <img
                    src={selectedImage}
                    alt="Selected product"
                    className="w-full h-full object-cover" // Essa classe garante que a imagem preencha completamente
                  />
                </div>

                <div className="flex space-x-2 mt-4">
                  {images.length > 1 && (
                    <div className="flex space-x-2">
                      {images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className={`w-[90px] h-[90px] object-cover cursor-pointer rounded-md border ${selectedImage === img ? 'border-red-500' : 'border-gray-300'}`}
                          onClick={() => setSelectedImage(img)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>


              {/* ProductFeatures */}
              <div className="border-t border-b pb-4 mb-4">
                <h2 className="text-lg font-bold mb-2 mt-4 ">Características do produto</h2>
                <p className="mb-2"><strong className="text-[#2A2C2F]">Modelo:</strong> {anuncio?.modelo || 'N/A'}</p>
                <p className="mb-2"><strong className="text-[#2A2C2F]">Marca:</strong> {anuncio?.marca || 'N/A'}</p>
                <p className="mb-2"><strong className="text-[#2A2C2F]">Ano de fabricação:</strong> {anuncio?.ano_fabricacao || 'N/A'}</p>
                <p className="mb-2"><strong className="text-[#2A2C2F]">Categoria:</strong> {anuncio?.categoria || 'N/A'}</p>
              </div>

              {/* ProductDescription */}
              <div className="border-b pb-4 mb-4">
                <h2 className="text-lg font-bold mb-2 ">Descrição completa</h2>
                <p className="max-w-full break-words whitespace-normal">{anuncio?.descricao || 'Descrição não disponível.'}</p>
              </div>

              {/* ReviewSection */}
              <div className="mt-8">
                <h2 className="text-lg font-bold mb-4 text-[#2A2C2F]">Avaliações do anúncio</h2>
                <div className="flex items-center mb-4">
                  <span className="text-4xl font-bold text-[#2A2C2F]">4.8</span>
                  <div className="flex ml-4 text-red-500">
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} className="text-gray-300" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-full h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-full bg-gray-500 w-[80%] rounded-full"></div>
                    </div>
                    <span>5 <FontAwesomeIcon icon={faStar} /></span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-full bg-gray-500 w-[60%] rounded-full"></div>
                    </div>
                    <span>4 <FontAwesomeIcon icon={faStar} /></span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-full bg-gray-500 w-[40%] rounded-full"></div>
                    </div>
                    <span>3 <FontAwesomeIcon icon={faStar} /></span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-full bg-gray-500 w-[20%] rounded-full"></div>
                    </div>
                    <span>2 <FontAwesomeIcon icon={faStar} /></span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-full bg-gray-500 w-[10%] rounded-full"></div>
                    </div>
                    <span>1 <FontAwesomeIcon icon={faStar} /></span>
                  </div>
                </div>

                {/* Comentários */}
                <div className="mt-4 space-y-4">
                  <div className="border p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-[#2A2C2F]">João Ricardo Almeida</h3>
                      <p className="text-gray-500 text-right">15/03/2023</p>
                    </div>
                    <p className="text-[#2A2C2F]">Motor veio completo, foi só retirar um e colocar outro, serviu certinho na crv, agora vamos ver a questão da durabilidade.</p>
                  </div>
                  <div className="border p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-[#2A2C2F]">Antônio de Barros Vasconcelos</h3>
                      <p className="text-gray-500 text-right">06/02/2023</p>
                    </div>
                    <p className="text-[#2A2C2F]">Atendeu minha necessidade e resolveu todo problema a respeito!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section: Product Details and Seller Info */}
            <div className="w-full lg:w-[486px] flex flex-col space-y-6">
              {/* ProductDetails */}
              <div className="border p-14 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-9">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCalendar} className="mr-2 text-[#DE3450]" />
                    <span>{anuncio?.data_criacao ? formatData(anuncio.data_criacao) : 'N/A'}</span>
                  </div>
                  <button onClick={toggleFavorite}>
                    <FontAwesomeIcon icon={isFavorited ? faHeart : faHeartRegular} className="text-[#DE3450] text-xl" />
                  </button>
                </div>

                {/* Título com quebra de linha e largura máxima */}
                <h1 className="text-xl font-bold mb-4 text-[#2A2C2F] max-w-full break-words whitespace-normal">
                  {anuncio?.titulo || 'N/A'}
                </h1>

                <div className="text-2xl font-bold mb-4 text-[#2A2C2F] max-w-full break-words">R$ {anuncio?.preco || 'N/A'}</div>

                <div className="flex flex-col space-y-4">
                  <button className="bg-[#2A2C2F] text-white py-2 px-4 rounded flex items-center justify-center space-x-2">
                    <FontAwesomeIcon icon={faCreditCard} />
                    <span>Comprar Agora</span>
                  </button>
                  <button className="bg-[#2A2C2F] text-white py-2 px-4 rounded flex items-center justify-center space-x-2">
                    <FontAwesomeIcon icon={faCartShopping} />
                    <span>Adicionar ao carrinho</span>
                  </button>
                </div>
              </div>


              {/* SellerInfo */}
              <div className="border p-4 rounded-lg shadow-sm">
                {/* Nome da Loja */}
                <div className="flex items-center mb-4">
                  <FontAwesomeIcon icon={faStore} className="mr-2 text-[#2A2C2F]" />
                  <h2 className="font-bold text-lg">Raul Autopeças LTDA</h2>
                </div>

                {/* Informações de contato */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faPhone} className="mr-2 text-[#2A2C2F]" />
                    <span>Telefone: (31) 99505-4078</span>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-[#2A2C2F]" />
                    <span>Email: raulautopecas@gmail.com</span>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCreditCard} className="mr-2 text-[#2A2C2F]" />
                    <span>CNPJ: 12.345.678/0001-90</span>
                  </div>
                </div>

                {/* Avaliações */}
                <div className="mt-4">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faStar} className="mr-2 text-red-500" />
                    <span>Avaliações do anunciante</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-red-500 font-bold">4.7/5</span>
                    <div className="flex ml-2 text-red-500">
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} className="text-gray-300" />
                    </div>
                    <span className="ml-2 text-gray-500">44 avaliações</span>
                  </div>
                </div>
              </div>



              {/* PaymentMethods */}
              <div className="border p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-bold mb-4 text-[#2A2C2F]">Meios de pagamento</h2>
                <Image src={mercadoPagoImg} alt="Formas de pagamento" width={300} height={60} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } 
}