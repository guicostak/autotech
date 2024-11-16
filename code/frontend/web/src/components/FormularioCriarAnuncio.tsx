"use client";
import Botao from "@/components/Botao";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faStore,
  faTimesCircle,
  faCameraRetro,
  faCircleXmark,
  faCircleCheck,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import useCriarAnuncio from "@/hooks/useCriarAnuncio";
import ErrorMessage from "./ErrorMessage";
import LoadingDots from "@/utils/loading/LoadingDots";
import Modal from "./Modal";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Select from "react-select";

interface FormularioCriarAnuncioProps {
  router: AppRouterInstance;
}

export default function FormularioCriarAnuncio({
  router,
}: FormularioCriarAnuncioProps) {
  const {
    formData,
    handleChange,
    validateFieldBlur,
    errors,
    handleSubmit,
    selectedImages,
    handleRemoveImage,
    handleImageChange,
    userData,
    storeData,
    pessoaJuridica,
    loading,
    handleAnuncianteChange,
    modalSucessoVisible,
    modalFalhaVisible,
    closeModalSucesso,
    closeModalFalha,
    fileInputRefs,
    anuncioUnico,
    error,
    idAnuncioCriado,
    handleCheckboxChange,
    optionsCategorias,
    optionsMarcas,
    setFormData,
  } = useCriarAnuncio();

  if (
    (userData.telefone && userData.dataNascimento && userData.endereco) ||
    (storeData.id && storeData.endereco)
  ) {
    return (
      <>
        <div className="bg-mainBackground pb-20 h-full w-full flex flex-col items-center">
          {storeData.id && (
            <div className="max-w-4xl mx-auto mt-24">
              <div className="py-8 px-14">
                <h2 className="text-2xl font-semibold text-mainColor text-center mb-5">
                  Quem está anunciando?
                </h2>
                <div className="flex flex-row justify-center space-x-10 w-full items-center">
                  <div
                    onClick={() => handleAnuncianteChange(false)}
                    className={`shadow-xl p-4 rounded-xl flex items-top space-x-4 w-96 relative px-4 cursor-pointer 
                    ${
                      !pessoaJuridica
                        ? "scale-105 bg-mainColor text-white"
                        : "bg-white text-gray-700"
                    }
                    transition-transform duration-300`}
                  >
                    <FontAwesomeIcon icon={faUser} className="text-md pt-1" />
                    <div className="flex-1">
                      <p className="mb-3">(Você) {userData.nome}</p>
                      <p className="text-sm mb-1">
                        <strong>Endereço:</strong> {userData.endereco}
                      </p>
                      <p className="text-sm mb-1">
                        <strong>CPF:</strong> {userData.cpf}
                      </p>
                    </div>
                  </div>
                  <div
                    onClick={() => handleAnuncianteChange(true)}
                    className={`shadow-xl p-4 rounded-md flex items-top space-x-4 w-96 relative px-4 cursor-pointer 
                    ${
                      pessoaJuridica
                        ? "scale-105 bg-mainColor text-white"
                        : "bg-white text-gray-700"
                    }
                    transition-transform duration-300`}
                  >
                    <FontAwesomeIcon icon={faStore} className="text-md pt-1" />
                    <div className="flex-1">
                      <p className="mb-3">
                        (Sua loja) {storeData.nomeFantasia}
                      </p>
                      <p className="text-sm mb-1">
                        <strong>Endereço:</strong> {storeData.endereco}
                      </p>
                      <p className="text-sm mb-1">
                        <strong>CNPJ:</strong> {storeData.cnpj}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center py-6 mt-5">
            <h2 className="text-3xl font-semibold text-mainColor">
              Compartilhe algumas informações sobre o seu produto
            </h2>
            <p className="text-md text-gray-500 mb-3 mt-3">
              Capriche nas fotos e na descrição
            </p>
          </div>

          <div className="w-3/4 bg-white shadow-xl rounded-xl p-10">
            <form onSubmit={handleSubmit} className="px-5 py-2 ">
              <div className="grid grid-cols-2 gap-8">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-mainColor mb-2">
                    Fotos*
                  </label>
                  <div className="flex flex-col">
                    <div className="h-80 w-full cursor-pointer border border-dashed border-gray-300 rounded-md flex justify-center items-center mb-4 relative">
                      {selectedImages[0] ? (
                        <div className="relative w-full h-full">
                          <img
                            src={URL.createObjectURL(selectedImages[0])}
                            alt="Foto Principal"
                            className="h-full w-full object-cover rounded-md cursor-pointer"
                            onClick={() => handleRemoveImage(0)}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(0)}
                            className="absolute top-2 right-2 bg-white text-red-600 rounded-full pt-1 px-1"
                          >
                            <FontAwesomeIcon
                              icon={faTimesCircle}
                              className="text-xl"
                            />
                          </button>
                        </div>
                      ) : (
                        <label className="text-gray-400 cursor-pointer w-full h-full flex justify-center items-center">
                          <FontAwesomeIcon
                            icon={faCameraRetro}
                            className="text-lg text-mainColor"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageChange(0, e)}
                            ref={(el) => {
                              fileInputRefs.current[0] = el;
                            }}
                          />
                          <span className="absolute inset-0 cursor-pointer" />
                        </label>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map((index) => (
                        <div
                          key={index}
                          className="h-40 cursor-pointer border border-dashed border-gray-300 rounded-md flex justify-center items-center"
                        >
                          {selectedImages[index] ? (
                            <div className="relative w-full h-full">
                              <img
                                src={URL.createObjectURL(selectedImages[index])}
                                alt={`Imagem ${index + 1}`}
                                className="h-full w-full object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-2 right-2 bg-white text-red-600 rounded-full pt-1 px-1"
                              >
                                <FontAwesomeIcon
                                  icon={faTimesCircle}
                                  className="text-xl"
                                />
                              </button>
                            </div>
                          ) : (
                            <label className="text-gray-400 cursor-pointer w-full h-full flex justify-center items-center">
                              <FontAwesomeIcon
                                icon={faCameraRetro}
                                className="text-lg text-mainColor"
                              />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageChange(index, e)}
                                ref={(el) => {
                                  fileInputRefs.current[index] = el;
                                }}
                              />
                              
                            </label>
                          )}
                        </div>
                      ))}
                    </div>
                    {errors.imagens && (
                      <ErrorMessage message={errors.imagens} />
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-1">
                    <label
                      htmlFor="titulo"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Título*
                    </label>
                    <input
                      type="text"
                      placeholder="Título do Produto"
                      className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
                      value={formData.titulo}
                      maxLength={40}
                      onChange={handleChange}
                      name="titulo"
                      onBlur={validateFieldBlur}
                    />
                  </div>
                  {errors.titulo && <ErrorMessage message={errors.titulo} />}

                  <div className="mb-1 mt-5">
                    <label
                      htmlFor="modelo"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Modelo*
                    </label>
                    <input
                      type="text"
                      placeholder="Modelo do Produto"
                      className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
                      value={formData.modelo}
                      maxLength={40}
                      onChange={handleChange}
                      name="modelo"
                      onBlur={validateFieldBlur}
                    />
                  </div>
                  {errors.modelo && <ErrorMessage message={errors.modelo} />}

                  <div className="mb-1 mt-5">
                    <label
                      htmlFor="descricao"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Descrição*
                    </label>
                    <textarea
                      placeholder="Descrição do Produto"
                      className="mt-1 block w-full h-32 p-1 border border-gray-300 rounded-md resize-none pl-2 pr-2"
                      maxLength={255}
                      value={formData.descricao}
                      onChange={handleChange}
                      name="descricao"
                      onBlur={validateFieldBlur}
                    />
                    <div className="flex flex-row justify-between">
                      {errors.descricao && (
                        <ErrorMessage message={errors.descricao} />
                      )}
                      <span className="text-gray-500 ml-auto text-sm">
                        {formData.descricao.length} de 255
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col w-full">
                    <div className="mb-1 mt-5 flex flex-col w-full">
                      <label
                        htmlFor="marca"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Marca
                      </label>
                      <Select
                        options={optionsMarcas}
                        value={
                          optionsMarcas.find(
                            (option) => option.value === formData.marca
                          ) || null
                        }
                        onChange={(selectedOption) => {
                          if (selectedOption) {
                            setFormData((prevData) => ({
                              ...prevData,
                              marca: selectedOption.value,
                            }));
                          }
                        }}
                        onBlur={validateFieldBlur}
                        placeholder="Selecione a marca"
                        styles={{
                          menu: (provided) => ({
                            ...provided,

                            overflowY: "auto",
                          }),
                        }}
                      />
                    </div>

                    <div className="mb-1 mt-5 flex flex-col w-full">
                      <label
                        htmlFor="categoria"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Categoria*
                      </label>
                      <Select
                        options={optionsCategorias}
                        value={
                          optionsCategorias.find(
                            (option) => option.value === formData.categoria
                          ) || null
                        }
                        onChange={(selectedOption) => {
                          if (selectedOption) {
                            setFormData((prevData) => ({
                              ...prevData,
                              categoria: selectedOption.value,
                            }));
                          }
                        }}
                        onBlur={validateFieldBlur}
                        placeholder="Selecione a categoria"
                        styles={{
                          menu: (provided) => ({
                            ...provided,

                            overflowY: "auto",
                          }),
                        }}
                      />
                      {errors.categoria && (
                        <ErrorMessage message={errors.categoria} />
                      )}
                    </div>

                    <div className="flex flex-row w-full space-x-4">
                      <div className="mb-1 mt-5 flex flex-col w-full">
                        <label
                          htmlFor="preco"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Preço*
                        </label>
                        <input
                          type="text"
                          placeholder="Preço do Produto"
                          className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
                          value={formData.preco}
                          onChange={handleChange}
                          name="preco"
                          onBlur={validateFieldBlur}
                        />
                        {errors.preco && (
                          <ErrorMessage message={errors.preco} />
                        )}
                      </div>

                      <div className="mb-1 mt-5 flex flex-col w-full">
                        <label
                          htmlFor="ano_fabricacao"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Ano de Fabricação*
                        </label>
                        <input
                          type="text"
                          placeholder="Ano de Fabricação"
                          className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
                          value={formData.ano_fabricacao}
                          onChange={handleChange}
                          name="ano_fabricacao"
                          onBlur={validateFieldBlur}
                        />

                        {errors.ano_fabricacao && (
                          <ErrorMessage message={errors.ano_fabricacao} />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-row mt-5 mb-6 justify-between">
                      <div className="flex-col flex items-left">
                        <label
                          htmlFor="ano_fabricacao"
                          className="block text-sm font-medium text-gray-700 mb-1 mr-4"
                        >
                          Produto único ?
                        </label>
                        <div
                          className={`w-10 h-6 rounded-full ${
                            anuncioUnico ? "bg-secondaryColor" : "bg-gray-300"
                          } cursor-pointer`}
                          onClick={handleCheckboxChange}
                        >
                          <div
                            className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${
                              anuncioUnico ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </div>
                      </div>

                      {!anuncioUnico && (
                        <div className="flex-col flex items-left w-60">
                          <label
                            htmlFor="quantidadeProduto"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Quantidade de produtos*
                          </label>
                          <input
                            type="number"
                            placeholder="Quantidade de produtos"
                            min={1}
                            className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
                            value={formData.quantidadeProduto}
                            onChange={handleChange}
                            name="quantidadeProduto"
                            onBlur={validateFieldBlur}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-5 justify-center w-full">
                      <LoadingDots isLoading={loading} />
                      <Botao
                        type="submit"
                        className="bg-mainColor text-sm text-white w-full h-10 rounded-md"
                      >
                        Adicionar Anúncio
                      </Botao>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <Modal isOpen={modalSucessoVisible} onClose={closeModalSucesso}>
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg">
            <FontAwesomeIcon
              style={{ fontSize: "4rem" }}
              className="text-mainColor mb-5"
              icon={faCircleCheck}
            />
            <h1 className="text-3xl font-bold text-mainColor mb-4">
              Anúncio Concluído!
            </h1>
            <p className="text-gray-600 mt-4 text-center">
              Parabéns! Seu anúncio foi criado com sucesso. <br />
            </p>
            <div className="flex-row gap-5 flex">
              <Botao
                type="button"
                onClick={() => router.push(`/anuncio/${idAnuncioCriado}`)}
                className="mt-8 border border-mainColor text-mainColor font-semibold px-6 py-3"
              >
                Ver anúncio
              </Botao>
              <Botao
                type="button"
                onClick={closeModalSucesso}
                className="mt-8 bg-mainColor rounded-xl text-white font-semibold px-6 py-3"
              >
                Anunciar novamente
              </Botao>
            </div>
          </div>
        </Modal>

        <Modal isOpen={modalFalhaVisible} onClose={closeModalFalha}>
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg">
            <FontAwesomeIcon
              style={{ fontSize: "4rem" }}
              className="text-errorColor mb-5"
              icon={faCircleXmark}
            />
            <h1 className="text-3xl font-bold text-errorColor mb-4">
              Erro ao anunciar!
            </h1>
            <p className="text-gray-500 mt-4 text-center">{error}</p>
            <Botao
              type="button"
              onClick={closeModalFalha}
              className="mt-8 bg-errorColor text-white font-semibold px-6 py-3"
            >
              Fechar
            </Botao>
          </div>
        </Modal>
      </>
    );
  } else if (
    (!userData.telefone && !userData.dataNascimento && !userData.endereco) ||
    (!storeData.id && !storeData.endereco)
  ) {
    return (
      <div className=" w-full flex flex-col items-center">
        <div className="flex-row h-full pt-12 flex items-center font-light text-md mb-4 w-full justify-center">
          <FontAwesomeIcon
            style={{ marginRight: "0.3rem" }}
            icon={faWarning}
            className="text-yellow-500"
          />
          <span>
            Por favor, complete os dados do perfil para conseguir anunciar em
            nossa plataforma.
          </span>
        </div>
        <Botao
          onClick={() => router.push("/perfil")}
          className="bg-mainColor text-white py-3 px-6 text-xs"
        >
          Completar perfil
        </Botao>
      </div>
    );
  }
}
