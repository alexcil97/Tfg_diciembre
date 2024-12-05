"use server";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PublicationValidation } from "@/validations";
import { z } from "zod";
import errorMap from "zod/locales/en.js";

export const deletePublication = async (id_publication:string,id_user:string
) => {

  const user = await currentUser();

  if (!user) {
    return { error: "Usuario no autenticado." };
  }

  const dbUser = await getUserById(id_user);

  if (!dbUser) {
    return { error: "Usuario no registrado en la base de datos." };
  }

  if (id_publication){

    

    const publicationExist = await db.publication.findFirst({
      where: {
        id_user: dbUser.id,
        id: id_publication,
      },
    });

    if (!publicationExist){
      return{error:"Publicacion no encontrada o no pertenece al usuario"}
    }
    await db.publication.delete({
      where:{
        id: id_publication,
      },
    })
    return{
      success:"publicacion eliminada con exito"
    }

  }else{
    return{
      success:"no exite la publicacion que quieres borrar"
    }
  }

};
