"use client";

import React from "react";
import Image from "next/image";
import banerImage from "../assets/img/baner.png";

const BannerHome = () => {
  return (
    <div className="flex justify-center py-10 mt-10">
      <div style={{ width: "100%", maxWidth: "1400px" }}>
        <Image src={banerImage} alt="Banner Promoção" width={1400} height={300}
         className="rounded-lg shadow-xl" 
          />
      </div>
    </div>
  );
};

export default BannerHome;