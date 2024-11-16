"use client";
import { useAppSelector } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const router = useRouter();
    const { isLoggedIn } = useAppSelector((state) => state.user);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true); 
    }, []);

    useEffect(() => {
      if (isMounted && !isLoggedIn) {
        router.push('/'); 
      }
    }, [isMounted, isLoggedIn, router]);

    if (!isLoggedIn) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
