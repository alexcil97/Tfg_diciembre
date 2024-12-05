"use client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CardWrapper } from "../card-wrapper";
import * as z from "zod";
import { RegisterValidator } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@/components/ui/button";
import { register } from "@/actions/register";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { HiMiniPhoto } from "react-icons/hi2";
import toast, { Toaster } from "react-hot-toast";

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter()
  const [resource, setResource] = useState("");

  const form = useForm<z.infer<typeof RegisterValidator>>({
    resolver: zodResolver(RegisterValidator),
    defaultValues: {
      email: "",
      nombre: "",
      apellido: "",
      edad: "",
      password: "",
      profile_picture: "",
    },
  });

  useEffect(() => {
    form.setValue('profile_picture', resource)

  }, [resource, form])

  const onSubmit = (values: z.infer<typeof RegisterValidator>) => {
    const formValues = {
      ...values,
      edad: values.edad ? new Date(values.edad) : undefined, // Convertir cadena a Date
    };
    console.log("Depurador");

    startTransition(() => {
      console.log("ENVIANDO DATOS", values);

      register(values).then((data) => {
        if (data?.error) {
          form.reset();
          //informar al usuario de error
        }
        if (data?.success) {
          form.reset();
          console.log("REGISTRO HECHO")
          toast.success('Registrado Correctamente , mira el correo!')
          router.replace("/auth/login");
          router.refresh()
        }
      });
    });
  };

  return (

    <CardWrapper
      headerLabel="Registrarse"
      backButtonLabel="¿Ya tienes una cuenta?"
      backButtonHref="/auth/login"
    >
      <Toaster
        position="top-center"
        reverseOrder={false}
      />


      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      isRequired
                      variant="underlined"
                      label="Correo Electrónico"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      isRequired
                      variant="underlined"
                      label="nombre"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apellido"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      isRequired
                      variant="underlined"
                      label="apellido"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="edad"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      isRequired
                      variant="underlined"
                      label="edad"
                      {...field}
                      type="date"
                      className="border rounded px-2 py-1 w-full"
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
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
                      isRequired
                      variant="underlined"
                      label="Contraseña"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profile_picture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
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
                      uploadPreset="next_cloudinary_app"
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
                            <HiMiniPhoto size={50} />
                            {resource && (
                              <div className="absolute inset-0 w-full h-full">
                                <img
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
                              disabled={isPending}
                            />
                          </FormControl>
                        </FormItem>
                      )}

                    </CldUploadWidget>
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full">
            Registrarse
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
