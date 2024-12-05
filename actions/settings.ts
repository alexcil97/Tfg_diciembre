"use server"

import { getUserByEmail, getUserById } from "@/data/user"
import { currentUser } from "@/lib/auth"
import { changeUserValueValidation } from "@/validations"
import { error } from "console"
import { z } from "zod"
import bcrypt from "bcryptjs";
import { db } from "@/lib/db"
import { unstable_update } from "@/auth"

export const settings = async (values: z.infer<typeof changeUserValueValidation>) => {

    const validatedValues = changeUserValueValidation.safeParse(values)
    if (!validatedValues.success) {
        return { error: "no valido" }
    }

    const user = await currentUser()
    if (!user) {
        return { error : "usuario no ha inicio sesión"}
    }

    const dbUser = await getUserById(user.id)

    if (!dbUser) {

        return { error : "Usuario no ha iniciado"}
    }

    if (user.isOAuth) {
        validatedValues.data.email = undefined
        validatedValues.data.password = undefined
        validatedValues.data.newPassword = undefined
        return
    }

    if (validatedValues.data.email === undefined) {

        return { info: "email is required" }

    }

    const existUser = await getUserByEmail(validatedValues.data.email)

    if (validatedValues.data.email) {
        if (existUser && existUser.id !== user.id) {
            return { error: "Este email ya esta asociado a una cuenta" }
        }

        //TODOO::
    }

    if (validatedValues.data.password &&
        validatedValues.data.newPassword &&
        dbUser.password
    ) {
        const matchCurrentPassword = await bcrypt.compare(validatedValues.data.password, dbUser.password)

        if (!matchCurrentPassword) {
            return { error: "La contraseña actual no es correcta" }
        }

        const hashedNewPassword = await bcrypt.hash(validatedValues.data.newPassword, 10)

        validatedValues.data.password = hashedNewPassword
        validatedValues.data.newPassword = undefined
    }

    await db.user.update({
        where: { id: dbUser.id },
        data: {
            ...validatedValues.data,
        }
    })

    unstable_update({
        user: {
            nombre:dbUser.nombre,
            apellido:dbUser.apellido,
            email: dbUser.email,
            id: dbUser.id,
            profile_picture: dbUser.profile_picture,
            role: dbUser.role,
            edad: dbUser.edad,
        }
    })

    return { success: "Configuracion cambiada!"}
}