"use client";

import Image from "next/image";
import { CardProps } from "../interfaces/interfaces";
import { HiX } from "react-icons/hi"; // Icono de la X

export default function DeletePublicationComponent({
  message,
  date,
  author,
  url_image,
  profile_picture,
  onDelete
}: CardProps & { onDelete: () => void }) {


  return (
    <div className="p-4 select-none">
      <div className="bg-white border rounded-md max-w-md relative">
        {/* Botón de eliminación con X */}
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 bg-gray-500 text-white rounded-full p-1 hover:bg-gray-700"
        >
          <HiX size={20} />
        </button>

        {/* Contenido de la publicación */}
        <div className="flex items-center px-4 py-3">
          <Image
            alt="imagen de perfil"
            width={40}
            height={40}
            className="object-scale-down h-10 rounded-full"
            src={profile_picture ? profile_picture : "/images/erin-lindford.jpg"}
          />
          <div className="ml-3">
            <span className="font-bold text-black">{author}</span>
          </div>
        </div>

        {/* Imagen de la publicación */}
        {url_image ? (
          <img
            src={url_image}
            alt="No hay imagen"
          />
        ) : (
          <div className="w-full bg-gray-200 flex items-center justify-center text-black">
          </div>
        )}
        {/* Detalles de la publicación */}
        <div className="text-sm mx-4 mt-2 mb-4">
          <span className="font-bold text-black">
            {JSON.stringify(date).slice(1, 11)}
          </span>
          <p className="text-black">{message}</p>
        </div>
      </div>
    </div>
  );
}
