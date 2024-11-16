import ReduxProvider from "@/common/redux/ReduxProvider"; 
import 'tailwindcss/tailwind.css';
import '@fortawesome/fontawesome-svg-core/styles.css';  
import { config } from '@fortawesome/fontawesome-svg-core';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

config.autoAddCss = false;

import { Poppins } from 'next/font/google';
import AuthProvider from "@/common/auth/AuthProvider";

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={poppins.className}>
      <head>
        <title>Autotech - Marketplace de Peças</title>
        <meta name="description" content="Autotech - Marketplace de peças automotivas. Conecte-se com vendedores e encontre as peças de que você precisa." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <meta name="robots" content="index, follow" />
      </head>
      <body className="font-sans">
        <ReduxProvider>
          <AuthProvider>
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
            {children}
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
