"use client"

import DeletePublicationComponent from "./deletePublicationComponent";
import { DeletePublicationCardProps } from "../interfaces/interfaces";


export function DeletePublicationCard({ publication, onDelete }: DeletePublicationCardProps) {


    return (
        <>
            <div className="w-full max-w-sm p-4 bg-gray-600 border border-white rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 justify-self-center mt-5">
                <DeletePublicationComponent
                    key={publication.id}
                    message={publication.publication_message}
                    author={publication.user.nombre}
                    profile_picture={publication.user.profile_picture || "/images/erin-lindford.jpg"}
                    url_image={publication.url_image}
                    date={publication.publication_date}
                    onDelete={() => onDelete(publication.id)}
                />
            </div>
        </>
    );
}