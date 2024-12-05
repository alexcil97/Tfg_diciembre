"use client"
import { useEffect, useState } from "react";
import { Publication } from "@/app/types/models";
import { getPublicationByUser } from "@/actions/getPublicationByUser";
import { DeletePublicationCard } from "../_componentes/deletePublicationCard";
import { PostPublication } from "../_componentes/publicationCard";
import { userCurrentUser } from "../hook/use-current-user";
import { deletePublication } from "@/actions/deletePublication";
import toast, { Toaster } from "react-hot-toast";

const PublicationPage = () => {

  const idUser = userCurrentUser()

  if (!idUser || !idUser.session) {
    return "No hay ni dios"
  }


  const [AllPublications, setAllPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublicationByUser()
      //@ts-ignore
      .then((publications) => setAllPublications(publications || []))
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [AllPublications])

  const handleNewPublication = (newPublication: Publication) => {
    setAllPublications((prevPublications) => [...prevPublications, newPublication])
  }
  const removePublicationHandler = async (publicationId: string) => {
    if (idUser.session && idUser.session.id) {
      deletePublication(publicationId, idUser.session.id)
        .then(() => {
          setAllPublications((prevPublications) => prevPublications.filter((publication) => publication.id !== publicationId))
          toast.success('Eliminada Correctamente!')

        })
        .catch((error) => {
          console.error("Error eliminandno publicaciones", error)
        })
    }
  }


  return (
    <>

      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      {/* Subir publicaciones */}
      <PostPublication onNewPublication={handleNewPublication} />
      <div className="flex items-center justify-center m-5">
        <h1 className="text-center">Publicaciones del usuario</h1>
      </div>
      {/* borrar publicaciones */}
      {loading ? (
        <p> Cargando Publicaciones...</p>
      ) : AllPublications.length > 0 ? (
        AllPublications.map((publication) => (
          <DeletePublicationCard key={publication.id} publication={publication} onDelete={removePublicationHandler} />
        ))
      ) : (
        <p> No hay publicaciones disponibles...</p>
      )
      }
    </>
  )
}

export default PublicationPage