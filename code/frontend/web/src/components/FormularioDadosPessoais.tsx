import Botao from './Botao';
import ErrorMessage from './ErrorMessage';
import { faCameraRetro, faCircleUser, faPen, faTimes, faTimesCircle, faUser, faUserCircle, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useDadosPessoais from '@/hooks/useDadosPessoais';
import LoadingDots from '@/utils/loading/LoadingDots';

export default function FormularioDadosPessoais() {
  const {
    loading, error, handleSubmit, formData, errors, handleChange, toggleEditing, isEditing, validateFieldBlur, selectedImage,
    handleImageChange, handleRemoveImage, fileInputRef, perfilIncompleto, msgError
  } = useDadosPessoais();

  return (
    <>
      <div style={{display: perfilIncompleto.dataNascimento || perfilIncompleto.telefone ? 'flex' : 'none'}} className='flex-row flex items-center font-light text-sm mb-4 w-2/3 justify-end'>
        <FontAwesomeIcon style={{marginRight: '0.3rem'}} icon={faWarning} className='text-yellow-500'/>
        <span>Complete o seu perfil para anunciar</span>
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
  
        <div className='flex flex-row mb-2 ml-5'>

          <div className='flex flex-col items-center justify-center'>
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
                    icon={faUserCircle}
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
              />
            </div>
          </div>

          <div className='flex flex-col w-full ml-20'>
            <h1 className="text-3xl mb-8 text-left text-mainColor">Dados pessoais</h1>

            <div className="mb-4 items-top">
              <label htmlFor="nome" className="text-md font-medium text-mainColor">Nome completo*</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                onBlur={validateFieldBlur}
                placeholder='Ex: João Gomes'
                disabled={!isEditing}
                maxLength={100} 
                className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
              />
              {errors.nome && <ErrorMessage message={errors.nome} />}
            </div>
          </div>
        </div>

        <div className='flex flex-row justify-left gap-6 mb-4 items-top'>
          <div className="w-96 items-top">
            <label htmlFor="cpf" className="text-md font-medium text-mainColor">CPF*</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              disabled={!isEditing}
              onBlur={validateFieldBlur}
              placeholder='000.000.000-00'
              maxLength={14}
              className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
            />
            {errors.cpf && <ErrorMessage message={errors.cpf} />}
          </div>

          <div className="w-full items-top ">
            <FontAwesomeIcon style={{marginRight: '0.3rem', display: perfilIncompleto.telefone ? '' : 'none'}} icon={faWarning} className='text-yellow-500 text-xs'/>
            <label htmlFor="telefone" className="text-md font-medium text-mainColor">Telefone*</label>
            <input
              type="text"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              disabled={!isEditing}
              onBlur={validateFieldBlur}
              placeholder='(11) 90000-0000'
              maxLength={15}
              className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
            />
            {errors.telefone && <ErrorMessage message={errors.telefone} />}
          </div>

          <div className="w-full items-top">
            <FontAwesomeIcon style={{marginRight: '0.3rem', display: perfilIncompleto.dataNascimento ? '' : 'none'}} icon={faWarning} className='text-yellow-500 text-xs'/>
            <label htmlFor="dataNascimento" className="text-md font-medium text-mainColor">Data de Nascimento*</label>
            <input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              disabled={!isEditing}
              onBlur={validateFieldBlur}
              className="mt-1 block w-full p-1 border border-gray-300 rounded-md pl-2 pr-2"
            />
            {errors.dataNascimento && <ErrorMessage message={errors.dataNascimento} />}
          </div>
        </div>

        <div className='flex flex-row items-top justify-left gap-6 mb-4'>
          <div className="w-full items-top">
            <label htmlFor="email" className="text-md font-medium text-mainColor">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={true}
              onBlur={validateFieldBlur}
              placeholder='exemplo@gmail.com'
              maxLength={100} 
              className="mt-1 block w-full p-1 border-gray-500 rounded-md pl-2 pr-2 bg-gray-200 text-gray-500 cursor-not-allowed"
            />
            {errors.email && <ErrorMessage message={errors.email} />}
          </div>


      
          <div className='flex flex-col items-center'>

              <Botao
                type="submit"
                className={`w-64 h-10 py-2 px-4 ${isEditing ? 'bg-mainColor text-white' : 'bg-gray-400 text-gray-700'} font-semibold rounded-xl mt-6`}
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
    </>
  );
}
