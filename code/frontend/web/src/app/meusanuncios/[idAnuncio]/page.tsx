"use client";

import { useParams } from 'next/navigation'; 
import { useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/components/Navbar';
import { useMeuAnuncio } from '@/hooks/useVerAnuncioDetalhado';
import { ToastContainer, toast } from 'react-toastify';
import withAuth from '@/common/auth/Hok/withAuth';

function MeuAnuncio() {
    const { idAnuncio } = useParams<{ idAnuncio: string | string[] }>(); 

    const { getAnuncioByIdHook, setAnuncio, anuncio, setLoading } = useMeuAnuncio();

    useEffect(() => {
        const fetchAnuncio = async () => {
            if (idAnuncio) {
                try {
                    const anuncioData = await getAnuncioByIdHook(Number(idAnuncio)); 
                    setAnuncio(anuncioData);
                } catch (error) {
                    console.error("Erro ao buscar o anúncio:", error);
                    toast.error("Erro ao buscar o anúncio.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchAnuncio();
    }, [idAnuncio, getAnuncioByIdHook]);

    if (!anuncio) {
        return <div>Anúncio não encontrado.</div>;
    }

    return (
        <div className="bg-mainBackground h-screen flex flex-col">
            <ToastContainer   
                position="top-center" 
                autoClose={2000} 
                hideProgressBar 
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover 
            />
            <Navbar isOnAuthPage={false} /> 
  
        </div>
    );
}

export default withAuth(MeuAnuncio)