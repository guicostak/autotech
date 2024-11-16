'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import { confirmEmail } from '@/services/userService';
import LoadingDots from '@/utils/loading/LoadingDots';
import Questions from '@/assets/img/Questions-cuate.svg'
import Image from 'next/image';
import Confirmed from '@/assets/img/Confirmed-bro.svg';
import Botao from '@/components/Botao';

export default function ConfirmaEmail() {
    const { token } = useParams<{ token: string | string[] }>(); 
    const [confirmationStatus, setConfirmationStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const tokenString = Array.isArray(token) ? token[0] : token;
    const hasExecuted = useRef(false);

    const router = useRouter();

    const handleClose = () => {
        router.push('/entrar'); 
    };

    useEffect(() => {
        if (hasExecuted.current) return; 
        hasExecuted.current = true; 

        const handleEmailConfirmation = async () => {
            if (!tokenString) return; 
            console.log(tokenString);
            try {
                setLoading(true);
                const response = await confirmEmail(tokenString);
                setConfirmationStatus(response);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        handleEmailConfirmation();
    }, [tokenString]); 

    return (
        <div className='bg-mainBackground flex flex-col justify-center items-center h-screen min-h-screen'>
            {loading && <LoadingDots isLoading={loading} />}
            {error &&
            <div className='flex flex-col justify-center items-center h-screen'> 
                <h1 className='font-extrabold text-errorColor text-5xl mb-6'>
                    Oops!
                </h1>
                <p className='text-gray-500 text-md font-bold justify-center'>{error}</p>
                <Image 
                        src={Questions} 
                        alt="Imagem de Perguntas" 
                        width={400}
                        height={400}
                        className='mt-6'
                    />
                <Botao 
                    type="button" 
                    onClick={handleClose} 
                    className="bg-errorColor text-white font-semibold px-6 py-3 mt-5">
                    Ir para o Login
                </Botao>
            </div>
            }
            {confirmationStatus && 
            <div className='flex flex-col justify-center items-center h-screen'> 
                <h1 className='font-extrabold text-mainColor text-5xl mb-6'>
                    Boaa!
                </h1>
                <p className='text-gray-500 text-md font-bold justify-center'>{confirmationStatus}</p>
                <Image 
                        src={Confirmed} 
                        alt="Imagem de Perguntas" 
                        width={400}
                        height={400}
                        className='mt-6'
                    />
                <Botao 
                    type="button" 
                    onClick={handleClose} 
                    className="bg-mainColor text-white font-semibold px-6 py-3">
                    Ir para o Login
                </Botao>
            </div>
            }
        </div>
    );
}

