"use client";

import { HiMiniPhoto } from "react-icons/hi2"
import { PublicationValidation } from "@/validations";
import { useForm } from "react-hook-form";
import { userCurrentUser } from "../hook/use-current-user";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { postPublication } from "@/actions/postPublication";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@nextui-org/input";
import { Button } from "@/components/ui/button";
import { CldUploadWidget } from 'next-cloudinary'
import { Publication } from "@/app/types/models";
import toast, { Toaster } from 'react-hot-toast';

export function PublicationComponent({ onNewPublication }: { onNewPublication: (newPublication: Publication) => void }) {
  const user = userCurrentUser();
  const [isPending, startTransition] = useTransition();
  const [resource, setResource] = useState("")

  const form = useForm<z.infer<typeof PublicationValidation>>({
    resolver: zodResolver(PublicationValidation),
    defaultValues: {
      url_image: "",
      publication_message: "",
      id_user: user.session?.id,
    },
  });

  const onSubmit = (values: z.infer<typeof PublicationValidation>) => {

    const updateUrl_Image = {
      ...values,
      url_image: resource,
    }

    startTransition(() => {
      postPublication(updateUrl_Image).then((data) => {
        if (data.error) {
          form.reset();
        }
        if (data.success) {
          form.reset();
          toast.success('Publicado Correctamente!')
          setResource("")
        }
      });
    });
  };

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="url_image"
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
                            name="url_image"
                            value={resource}
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
          <FormField
            control={form.control}
            name="publication_message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PUBLICACION</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="deja tu mensaje"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-5" type="submit">
            Publicar!
          </Button>
        </form>
      </Form>
    </>
  );
}
