"use server";

import { getUserById } from "@/data/user"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"

export const getPublicationByUser = async () => {
  const user = await currentUser()

  if (!user) {
    return { error: "Usuario no autenticado." }
  }

  const dbUser = await getUserById(user.id)

  if (!dbUser) {
    return { error: "Usuario no registrado en la base de datos." }
  }
  
  const publication = await db.publication.findMany({
    orderBy: {
      publication_date: "desc"
    },
    include: {
      user: true
    },
    where:{
      id_user:dbUser.id
    }
  })

  if (publication.length === 0) {
    return { message: "No se encontraron publicaciones." }
  }

  return publication
};
