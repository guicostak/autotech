import Image from 'next/image';
import logo from '../assets/img/logo.png';
import Link from 'next/link';

interface LogoProps {
  readonly width?: string;
}

export default function Logo({ width = "100%" }: LogoProps) { 
    return ( 
      <Link href="/">
        <Image style={{ width: width }} src={logo} alt="Logo" />
      </Link>
    )
}
