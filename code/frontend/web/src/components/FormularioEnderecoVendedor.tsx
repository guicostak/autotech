import React, { useState } from 'react';
import Botao from './Botao';
import ErrorMessage from './ErrorMessage';
import useEnderecoVendedor from '@/hooks/useEnderecoVendedor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPen, faTimes, faWarning } from '@fortawesome/free-solid-svg-icons';
import { estadosBrasileiros } from '@/data/Estados';
import LoadingDots from '@/utils/loading/LoadingDots';

export default function FormularioEndereco() {
  const { loading, error, handleSubmit, formData, errors, handleChange, handleEstadoChange, isEditing, toggleEditing,
    validateFieldBlur, perfilIncompleto, isEnderecoCompleto, handlePaste
   } = useEnderecoVendedor();

   return (
    <div className='w-2/3'>
      <div style={{display: !isEnderecoCompleto && !perfilIncompleto ? 'flex' : 'none'}} className='flex-row flex items-center font-light text-sm mb-4 w-full justify-end'>
        <FontAwesomeIcon style={{marginRight: '0.3rem'}} icon={faWarning} className='text-yellow-500'/>
        <span>Complete o seu endereço para anunciar</span>
      </div>  

        <form style={{ display: perfilIncompleto ? 'none' : '' }} onSubmit={handleSubmit} className="px-16 py-7 flex flex-col bg-white h-auto  rounded-lg shadow-lg relative">

          <button
            className="absolute top-4 right-4 cursor-pointer bg-transparent border p-2 text-mainColor text-sm focus:outline-none
            border-mainColor rounded-lg"
            onClick={toggleEditing}
            type='button'
          >
            {isEditing ? null : "Editar"}
            <FontAwesomeIcon style={{marginLeft: isEditing ? '0rem' : '0.5rem'}} icon={isEditing ? faTimes : faPen} />
          </button>

          <h1 className="text-3xl mb-6 text-left text-mainColor">
            <FontAwesomeIcon
              icon={faLocationDot} 
              className="text-mainColor mb-1 mr-4 text-xl" 
            />
            Endereço
          </h1>

          <div className='flex flex-row items-top justify-left gap-6 mb-4'>
            <div className="w-96">
              <label htmlFor="cep" className="text-md font-medium text-mainColor">CEP *</label>
              <input
                type="text"
                id="cep"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                onPaste={handlePaste}
                onBlur={validateFieldBlur}
                maxLength={9}
                autoComplete='none'
                disabled={!isEditing}
                placeholder='00000-000'
                className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
              />
              {errors.cep && <ErrorMessage message={errors.cep} />}
            </div>

            <div className="w-96">
              <label htmlFor="estado" className="text-md font-medium text-mainColor">Estado *</label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleEstadoChange}
                disabled={!isEditing}
                autoComplete='none'
                className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
              >
                {estadosBrasileiros.map((estado) => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
              {errors.estado && <ErrorMessage message={errors.estado} />}
            </div>

            <div className="w-full">
              <label htmlFor="cidade" className="text-md font-medium text-mainColor">Cidade *</label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                onBlur={validateFieldBlur}
                disabled={!isEditing}
                autoComplete='none'
                placeholder='Ex: Rio De Janeiro'
                maxLength={100} 
                className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
              />
              {errors.cidade && <ErrorMessage message={errors.cidade} />}
            </div>
          </div>

          <div className='flex flex-row items-top justify-left gap-6 mb-4'>
            <div className="w-full">
              <label htmlFor="rua" className="text-md font-medium text-mainColor">Rua/Avenida *</label>
              <input
                type="text"
                id="rua"
                name="rua"
                value={formData.rua}
                onChange={handleChange}
                onBlur={validateFieldBlur}
                disabled={!isEditing}
                autoComplete='none'
                placeholder='Ex: Av. Brasil'
                maxLength={100} 
                className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
              />
              {errors.rua && <ErrorMessage message={errors.rua} />}
            </div>
          </div>

          <div className='flex flex-row items-top justify-left gap-6 mb-4'>
            <div className="w-full">
              <label htmlFor="complemento" className="text-md font-medium text-mainColor">Complemento</label>
              <input
                type="text"
                id="complemento"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
                onBlur={validateFieldBlur}
                disabled={!isEditing}
                autoComplete='none'
                placeholder='Ex: Apto 201'
                maxLength={100} 
                className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
              />
            </div>

            <div className="w-96">
              <label htmlFor="numero" className="text-md font-medium text-mainColor">Número *</label>
              <input
                type="text"
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                onBlur={validateFieldBlur}
                disabled={!isEditing}
                autoComplete='none'
                placeholder='Ex: 4000'
                maxLength={10} 
                className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
              />
              {errors.numero && <ErrorMessage message={errors.numero} />}
            </div>
          </div>

          <div className='flex flex-row items-top justify-left gap-6 mb-2'>
            <div className="w-full">
              <label htmlFor="bairro" className="text-md font-medium text-mainColor">Bairro *</label>
              <input
                type="text"
                id="bairro"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                onBlur={validateFieldBlur}
                disabled={!isEditing}
                autoComplete='none'
                placeholder='Ex: Centro'
                maxLength={100} 
                className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
              />
              {errors.bairro && <ErrorMessage message={errors.bairro} />}
            </div>

            <div className='flex flex-col items-center'>
              <Botao
                type="submit"
                className={`w-96 h-10 py-2 px-4 ${isEditing ? 'bg-mainColor text-white' : 'bg-gray-400 text-gray-700'} font-semibold rounded-xl mt-6`}
                disabled={!isEditing}
              >
                Salvar alterações
              </Botao>
              <LoadingDots isLoading={loading} />
              {error && <ErrorMessage message={error} />}
              <p className="text-xs text-gray-500 mb-4 mt-2 text-right ">
                  Os campos com * são obrigatórios.
              </p>
            </div>
          </div>
        </form>
      </div>
  );
}
