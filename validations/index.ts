import * as z from "zod";

export const LoginValidator = z.object({
  // validacion del email, usando zod pedira un email valido(login).
  email: z.string().email({
    message: "Por favor, introduce un correo válido",
  }),

  //validacion de la password, pedira 5 o mas caracteres y de no ser asi mandara un error(login).
  password: z.string().min(5, {
    message: "la password debe tener mas de 5 caracteres o letras",
  }),

  code: z.optional(z.string()),
});

export const RegisterValidator = z.object({
  //validacion del correo electronico contra inyeccion de codigo(registro).
  email: z.string().email({
    message: "Por favor, introduce un correo válido",
  }),

  //validacion del nombre contra inyeccion de codigo e insercion de emojis(registro).
  nombre: z.string({
    message: "no puede contener emoticonos es un nombre personal.",
  }),

  //validacion del apellido contra inyeccion de codigo e insercion de emojis(registro).
  apellido: z.string({
    message: "no puede contener emoticonos es un apellido personal.",
  }),

  //validacion de la edad contra inyeccion de codigo e insercion de fechas falsas(registro).
  // edad: z.date()
  //     .min(new Date("1900-01-01"), { message: "demasiado grande, elige una edad valida" })
  //     .max(new Date(), { message: "demasiado joven" }),
  edad: z.string().min(1, {
    message: "¿Cuál es tu fecha de nacimiento?",
  }),

  profile_picture: z.string().optional(),

  //validacion de la password, contra inyeccion de codigo e insercion de menos valores de los recomendados para una password(registro).
  password: z.string().min(5, {
    message: "la password debe tener mas de 5 caracteres o letras",
  }),
});

export const changeUserValueValidation = z
  .object({
    //validacion del correo electronico contra inyeccion de codigo(registro).
    email: z
      .string({
        message: "Por favor, introduce un correo válido",
      })
      .optional(),
    

    // validacion de foto de perfil
    profile_picture: z.string().optional(),

    
    //validacion del nombre contra inyeccion de codigo e insercion de emojis(registro).
    nombre: z
      .string({
        message: "no es un nombre valido.",
      })
      .optional(),

    //validacion del apellido contra inyeccion de codigo e insercion de emojis(registro).
    apellido: z
      .string({
        message: "no es un apellido valido.",
      })
      .optional(),

    //validacion de la edad contra inyeccion de codigo e insercion de fechas falsas(registro).
    edad: z.string().optional(),
    // edad: z.date()
    //     .min(new Date("1900-01-01"), { message: "demasiado grande, elige una edad valida" })
    //     .max(new Date(), { message: "demasiado joven" }).optional(),

    //validacion de la password, contra inyeccion de codigo e insercion de menos valores de los recomendados para una password(registro).
    password: z.optional(
      z.string().min(5, {
        message: "la password debe tener mas de 5 caracteres o letras",
      })
    ),
    newPassword: z.optional(
      z.string().min(5, {
        message: "la password debe tener mas de 5 caracteres o letras",
      })
    ),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    { message: "Nueva contraseña requerida", path: ["newPassword"] }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    { message: "la contraseña antigua es requerida", path: ["password"] }
  );

export const NewPasswordValidator = z.object({
  password: z.string().min(5, {
    message: "la password debe tener mas de 5 caracteres o letras",
  }),
});

export const PublicationValidation = z.object({
  url_image: z
    .string()
    .optional(),
  publication_message: z.string({
    message: "Por favor, introduce un mensage válido",
  }),
  id_user: z.string().min(1, {
    message: "El ID del autor es obligatorio",
  }),
});
