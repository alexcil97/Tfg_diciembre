"use client"
import CardPublication from "../_componentes/card";
import { useEffect, useState } from "react";
import { getPublication } from "@/actions/getPublication";
import { Publication } from "@/app/types/models";

const DashboardPage = () => {


  const [AllPublications, setAllPublications] = useState<Publication[]>([])

  useEffect(() => {
    getPublication()
      //@ts-ignore
      .then((publications) => setAllPublications(publications))
      .catch((error) => {
        console.error(error)
      })
  }, [])

  return (
    <>
      <div className="flex flex-col space-y-4 items-center">
        {AllPublications.length === 0 ? (
          <p>No hay publicaciones disponibles.</p>
        ) : (
          AllPublications.map((publication) => (
            <CardPublication
              author={publication.user.nombre}
              key={publication.id}
              message={publication.publication_message}
              date={publication.publication_date}
              url_image={publication.url_image}
              profile_picture={publication.user.profile_picture ? publication.user.profile_picture : "/images/erin-lindford.jpg"}
            />
          ))
        )}
      </div>
    </>
  )
}

export default DashboardPage;
