"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CardWrapper } from "../card-wrapper";
import React from "react";
import { newVerifaction } from "@/actions/new-verifaction";

export const NewVerifaction = () => {
  const [error, setError] = useState<string | undefined>();

  const [sucess, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (sucess || error) return;

    if (!token) {
      setError("No hay Token");
      return;
    }

    newVerifaction(token)
      .then((data) => {
        setSuccess(data.sucess);
        setError(data.error);
      })
      .catch(() => {
        setError("Algo ha ido mal wey");
      });
  }, [token, sucess, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Verificado, dale a volver al login para iniciar sesión"
      backButtonLabel="vuelve al login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justiffy-center">
        {!sucess && !error && <h1>Cargando...</h1>}
      </div>
    </CardWrapper>
  );
};
