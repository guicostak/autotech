import { StaticImageData } from "next/image";

export default interface ICarroselImage {
    id: number;
    src: StaticImageData;
    alt: string;
}
