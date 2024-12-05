"use client";


import Image from "next/image";
import { CardProps } from "../interfaces/interfaces";

export default function CardPublication({
  message,
  date,
  author,
  url_image,
  profile_picture
}: CardProps) {

  return (
    <div className="p-4 select-none">
      <div className="bg-white border rounded-md max-w-md">
        <div className="flex items-center px-4 py-3">
          <Image alt="imagen de perfil" width={40} height={40} className="object-scale-down h-10 rounded-full" src={profile_picture ? profile_picture : "/images/erin-lindford.jpg"} />
          <div className="ml-3">
            <span className="font-bold text-black">{author}</span>
          </div>
        </div>
        {url_image ? (
          <img
            src={url_image}
            alt="No hay imagen"
          />
        ) : (
          <div className="w-full bg-gray-200 flex items-center justify-center text-black">
          </div>
        )}
        <div className="text-sm mx-4 mt-2 mb-4">
          <span className="font-bold text-black">
            {JSON.stringify(date).slice(1, 11)} {/* Ajusta los índices según tu necesidad */}
          </span>
          <p className="text-black">{message}</p>
        </div>
      </div>
    </div>
  )
}
