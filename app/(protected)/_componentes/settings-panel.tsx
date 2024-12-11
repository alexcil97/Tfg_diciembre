import { changeUserValueValidation } from "@/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { userCurrentUser } from "../hook/use-current-user"
import { useEffect, useState, useTransition } from "react"
import { settings } from "@/actions/settings"
import { useSession } from "next-auth/react"
import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormField,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CldUploadWidget } from "next-cloudinary"
import { HiMiniPhoto } from "react-icons/hi2"
import { deleteUser } from "@/actions/deleteUser"
import { useRouter } from "next/navigation"

export const SettingsPanel = () => {

    const [resource, setResource] = useState("")
    const user = userCurrentUser()
    const [isPending, startTransition] = useTransition()
    const { data: session, status, update } = useSession()
    const router = useRouter()

    const form = useForm<z.infer<typeof changeUserValueValidation>>({
        resolver: zodResolver(changeUserValueValidation),
        defaultValues: {
            nombre: user.session?.nombre || undefined,
            email: user.session?.email || undefined,
            apellido: user.session?.apellido || undefined,
            edad: user.session?.edad || undefined,
            profile_picture: undefined,
            password: undefined,
            newPassword: undefined,
        }
    })
    useEffect(() => {
        form.setValue("profile_picture", resource)
    }, [resource, form])

    const onSubmit = (values: z.infer<typeof changeUserValueValidation>, event?: React.BaseSyntheticEvent<object, any, any>) => {
        const buttonType = (event?.nativeEvent as SubmitEvent).submitter?.getAttribute('name')

        if (buttonType === 'save') {
            console.log('boton salvar')
            const updateUrl_profile_picture = {
                ...values,
                profile_picture: resource,
            }
            startTransition(() => {
                settings(values).then((data) => {
                    console.log("Validando: " + values.nombre)
                    console.log("Obteniendo: " + data?.success)
                    if (data?.success) {
                        update()
                    }
                    if (data?.error) {
                        console.log("este es el error" + data.error)
                    }
                })
            })
            update()
        } else if (buttonType === 'delete') {
            console.log("Eliminando Usuario")
            if (session?.user.id) {
                deleteUser(session?.user.id)
                    .then(() => {
                        console.log("Usuario eliminado: ")
                        router.push("/")
                    })
                    .catch((err) => {
                        console.error("Error al eliminar", err);
                        
                    })
            }
        }
    }

    return (
        <>
            <div className="my-3">
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit((values, event) => onSubmit(values, event))}>
                        <h2 className="mb-3 font-semibold text-4xl">Cuenta de usuario</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="nombre"
                                render={({ field }) => (
                                    <FormItem className="text-xs w-auto">
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="dark:border-slate-800 max-w-max"
                                                {...field}
                                                placeholder="Nombre"
                                                disabled={isPending}
                                                type="text"

                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="apellido"
                                render={({ field }) => (
                                    <FormItem className="text-xs w-auto">
                                        <FormLabel>Apellido</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="dark:border-slate-800 max-w-max"
                                                {...field}
                                                placeholder="Apellido"
                                                disabled={isPending}
                                                type="text"

                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="text-xs w-auto">
                                        <FormLabel>Contraseña</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="dark:border-slate-800 max-w-max"
                                                {...field}
                                                placeholder="Password"
                                                disabled={isPending}
                                                type="password"

                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem className="text-xs w-auto">
                                        <FormLabel>nueva contraseña</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="dark:border-slate-800 max-w-max"
                                                {...field}
                                                placeholder="newPassword"
                                                disabled={isPending}
                                                type="password"

                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="text-xs w-auto">
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="dark:border-slate-800 max-w-max"
                                                {...field}
                                                placeholder="Email"
                                                disabled={isPending}
                                                type="text"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="profile_picture"
                                render={({ field }) => (
                                    <FormItem className="text-xs w-auto">
                                        <FormLabel>Foto de perfil</FormLabel>
                                        <CldUploadWidget
                                            options={{
                                                sources: ['local', 'url'],
                                                maxImageFileSize: 2500000,
                                                maxFiles: 1,
                                                clientAllowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
                                                minImageWidth: 250,
                                                minImageHeight: 333,
                                                maxImageHeight: 3000,
                                                maxImageWidth: 2000,
                                                thumbnailTransformation: [{ width: 250, height: 333, crop: 'fill' }],
                                            }}
                                            signatureEndpoint="/api/cloudinary"
                                            onSuccess={(result, { widget }) => {
                                                console.log("Resultado de Cloudinary:", result)
                                                //@ts-ignore
                                                setResource(result?.info.secure_url)
                                                widget.close()

                                            }}>
                                            {({ open }) => (
                                                <FormItem>
                                                    <div
                                                        className="relative cursor-pointer w-[100px] h-[150px] flex flex-col justify-center items-center mx-auto"
                                                        onClick={() => open()}
                                                    >
                                                        <HiMiniPhoto size={80} />
                                                        {resource && (
                                                            <div className="absolute inset-0 w-full h-full">
                                                                <img
                                                                    style={{ objectFit: 'contain' }}
                                                                    src={resource}
                                                                    alt="PostFoto"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            type="hidden"
                                                            name="profile_picture"
                                                            value={resource}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}

                                        </CldUploadWidget>

                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-between ">
                            <button
                                type="submit"
                                name="save"
                                className={`px-4 py-2 text-white bg-gray-600 rounded ${isPending ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                disabled={isPending}
                            >
                                {isPending ? "Guardando..." : "Guardar cambios"}
                            </button>
                            <button
                                name="delete"
                                className={`px-4 py-2 text-white bg-gray-600 rounded ${isPending ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                disabled={isPending}
                            >
                                {isPending ? "Eliminando..." : "Eliminar usuario"}
                            </button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    )
}