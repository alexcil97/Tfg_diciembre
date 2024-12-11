"use server";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { signOut } from "next-auth/react";

export const deleteUser = async (id_user: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Usuario no autenticado." };
    }

    const dbUser = await getUserById(id_user);
    if (!dbUser) {
      return { error: "Usuario no registrado en la base de datos." };
    }
    
    await db.user.delete({
        where: {
            id: id_user,
        },
    });
    
    if (user.id === id_user) {
      await signOut({ callbackUrl: "/auth/login" });
    }
    
    return {
      success: "Usuario eliminado con éxito",
    };
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return { error: "Hubo un problema al eliminar el usuario." };
  }
};
