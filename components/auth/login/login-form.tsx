"use client"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { CardWrapper } from "../card-wrapper"
import * as z from "zod"
import { LoginValidator } from "@/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState, useTransition } from "react"
import { Input } from "@nextui-org/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { login } from "@/actions/login"
import { useSearchParams } from "next/navigation"

export const LoginForm = () => {

    //messages

    const [error, setError] = useState<string | undefined>("")
    const [sucess, setSucess] = useState<string | undefined>("")
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl")

    //usa usetransition que es un hook de next, para mejorar la experiencia de usuario y mantener la fluidez
    const [isPending, startTransition] = useTransition()

    //usa useForm para asegurarse que usa el tipado utilizado en el esquema y que siempre esten los valores validados
    const form = useForm<z.infer<typeof LoginValidator>>({
        resolver: zodResolver(LoginValidator),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    // usas zod para verificar que los valores dados enel formulario, cumplan las normas del esquema de validacion
    const onSubmit = (values: z.infer<typeof LoginValidator>) => {
        setError("")
        setSucess("")

        startTransition(() => {
            console.log("VERIFICANDO DATOS", values);

            login(values, callbackUrl)
                .then((data) => {
                    if (data?.error) {
                        form.reset()
                        setError(data?.error)
                    }
                    if (data?.sucess) {
                        console.log("HECHO")
                        form.reset()
                        setSucess(data?.sucess)
                    }

                })
                .catch(() => setError("Algo ha ido mal."))

        })
    }
    //devuelve el componente por pantalla (el conjunto de valores que forman el formulario)
    return (
        <CardWrapper
            headerLabel="Iniciar Sesion"
            backButtonLabel="¿Aún no tienes una cuenta?"
            backButtonHref="/auth/register"
        >
            <Form {...form}>
                <form
                    //funcion para llamar y validar al formulario
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            variant="underlined"
                                            label="Correo Eletrónico"
                                            {...field}
                                            type="email"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            variant="underlined"
                                            label="contraseña"
                                            {...field}
                                            type="password"
                                        />
                                    </FormControl>
                                    <Button
                                        size="sm"
                                        variant="link"
                                        asChild
                                        className="w-full text-white"
                                    >
                                        <Link href="/auth/reset">
                                            ¿Has olvidado tu contraseña?
                                        </Link>
                                    </Button>
                                </FormItem>
                            )}

                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                    >
                        Iniciar Sesión
                    </Button>
                </form>
            </Form>
        </CardWrapper>

    )

}