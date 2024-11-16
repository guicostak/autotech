import React, { useState } from 'react';
import Botao from './Botao';
import ErrorMessage from './ErrorMessage';
import { faCameraRetro, faCircleCheck, faPen, faStore, faTimes, faTimesCircle, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useDadosJuridicos from '@/hooks/useDadosJuridicos';
import LoadingDots from '@/utils/loading/LoadingDots';
import Modal from './Modal';

export default function FormularioDadosJuridicosVendedor() {
  const {
    loading, error, handleSubmit, formData, errors, handleChange, selectedImage, handleRemoveImage, fileInputRef, handleImageChange,
    isEditing, toggleEditing, validateFieldBlur, perfilIncompleto, isModalLojaCriada, closeModalLojaCriada, msgError, initialImage
  } = useDadosJuridicos();

  return (
    <>
     <div style={{display: perfilIncompleto ? 'flex' : 'none'}} className='flex-row flex items-center font-light text-sm mb-4 w-2/3 justify-end'>
        <FontAwesomeIcon style={{marginRight: '0.3rem'}} icon={faWarning} className='text-yellow-500'/>
        <span>Complete os dados da sua empresa para anunciar com sua loja</span>
      </div>    

    <form onSubmit={handleSubmit} className="px-16 py-10 flex flex-col bg-white h-auto w-2/3 rounded-lg shadow-lg relative mb-20">
      
      <button
        className="absolute top-4 right-4 cursor-pointer bg-transparent border p-2 text-mainColor text-sm focus:outline-none
        border-mainColor rounded-lg"
        onClick={toggleEditing}
        type='button'
      >
        {isEditing ? null : "Editar"}
        <FontAwesomeIcon style={{marginLeft: isEditing ? '0rem' : '0.5rem'}} icon={isEditing ? faTimes : faPen} />
      </button>

      <div className='flex flex-row mb-2 items-top ml-5'>
        <div className='flex flex-col items-center justify-center items-top mr-6'>
          <div className="relative">
            <label htmlFor="file-input">
            {selectedImage ? (
                <img
                    src={typeof selectedImage === 'string' ? selectedImage : URL.createObjectURL(selectedImage)}
                    alt="Profile"
                    className="rounded-full w-[10rem] h-[8rem] object-cover"
                    style={{ cursor: 'pointer' }}
                />
            ) : (
                <FontAwesomeIcon
                    style={{ cursor: isEditing ? 'pointer' : '' }}
                    className="text-mainColor text-9xl"
                    icon={faStore}
                />
            )}
            </label>
            
            {!selectedImage && isEditing && (
              <FontAwesomeIcon
                className="absolute top-2 right-2 bg-white rounded-full p-1 text-mainColor"
                icon={faCameraRetro}
              />
            )}

            {selectedImage && isEditing && (
              <button
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-white text-red-600 rounded-full p-1"
              >
                <FontAwesomeIcon icon={faTimesCircle} className="text-xl" />
              </button>
            )}

            <input
              id="file-input"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageChange}
              disabled={!isEditing} 
              onBlur={validateFieldBlur}
            />
          </div>
      </div>

      <div className='flex flex-col w-full ml-10'>
        <h1 className="text-3xl mb-8 text-left text-mainColor">Dados da empresa</h1>
          <div className="mb-4 items-top">
            <label htmlFor="nomeFantasia" className="text-md font-medium text-mainColor">Nome fantasia*</label>
            <input
              type="text"
              id="nomeFantasia"
              name="nomeFantasia"
              value={formData.nomeFantasia}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder='Ex: Mercadão autopeças'
              maxLength={100}
              className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
              onBlur={validateFieldBlur}
            />
            {errors.nomeFantasia && <ErrorMessage message={errors.nomeFantasia} />}
          </div>
        </div>
      </div>

      <div className='flex flex-row justify-left gap-6 mb-4 items-top'>
        <div className="w-96 items-top">
          <label htmlFor="cnpj" className="text-md font-medium text-mainColor">CNPJ*</label>
          <input
            type="text"
            id="cnpj"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder='00.000.000/0000-00'
            className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
            onBlur={validateFieldBlur}
          />
           {errors.cnpj && <ErrorMessage message={errors.cnpj} />}
        </div>

        <div className="w-96 items-top"> 
          <label htmlFor="telefoneEmpresa" className="text-md font-medium text-mainColor">Telefone*</label>
          <input
            type="text"
            id="telefoneEmpresa"
            name="telefoneEmpresa"
            value={formData.telefoneEmpresa}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder='(11) 90000-0000'
            className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
            maxLength={15}
            onBlur={validateFieldBlur}
          />
          {errors.telefoneEmpresa && <ErrorMessage message={errors.telefoneEmpresa} />}
        </div>

        <div className="w-full items-top">
          <label htmlFor="emailEmpresa" className="text-md font-medium text-mainColor">Email</label>
          <input
            type="emailEmpresa"
            id="emailEmpresa"
            name="emailEmpresa"
            value={formData.emailEmpresa}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder='exemplo@gmail.com'
            maxLength={100} 
            className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
            onBlur={validateFieldBlur}
          />
          {errors.emailEmpresa && <ErrorMessage message={errors.emailEmpresa} />}
        </div>
      </div>

    <div className='flex flex-row items-center justify-left gap-6 mb-4'>
      <div className="w-full items-top">
        <label htmlFor="descricao" className="text-md font-medium text-mainColor">Descrição*</label>
        <textarea
          id="descricao" 
          name="descricao" 
          value={formData.descricao}
          onChange={handleChange}
          disabled={!isEditing}
          maxLength={255}
          placeholder='Adicione uma breve descrição da sua loja'
          className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2 h-20"
          onBlur={validateFieldBlur}
        />
        {errors.descricao && <ErrorMessage message={errors.descricao} />}
      </div>
      
      <div className='flex flex-col items-center'>
          <Botao
            type="submit"
            className={`w-56 h-10 py-2 px-4 ${isEditing ? 'bg-mainColor text-white' : 'bg-gray-400 text-gray-700'} font-semibold rounded-xl mt-6`}
            disabled={!isEditing}
          >
            Salvar alterações
          </Botao>
          <LoadingDots isLoading={loading} />
          {error && <ErrorMessage message={error} />}
          <p className="text-xs text-gray-500 text-right mt-2">
                  Os campos com * são obrigatórios.
            </p>
      </div>
    </div>
  </form>

  <Modal isOpen={isModalLojaCriada} onClose={closeModalLojaCriada}>
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg">
        <FontAwesomeIcon style={{fontSize: '4rem'}} className='text-mainColor mb-5' icon={faCircleCheck} />
        <h1 className="text-3xl font-bold text-mainColor mb-4">Cadastro Concluído!</h1>
        <p className="text-gray-600 mt-4 text-center">
            Parabéns! Sua loja foi criada com sucesso. <br/>
        </p>
        <div className='flex-row gap-5 flex'>
            <Botao 
                type="button" 
                onClick={closeModalLojaCriada} 
                className="mt-8 bg-mainColor text-white font-semibold px-6 py-3">
                Fechar
            </Botao>
        </div>
    </div>
  </Modal>
  </>
  );
}
