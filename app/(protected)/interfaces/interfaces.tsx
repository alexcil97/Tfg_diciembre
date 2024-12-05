import { Publication } from "@/app/types/models";

export interface CardProps {
    message: string;
    author: string
    date?: string;
    url_image?: string;
    profile_picture?: string;
}

export interface DeletePublicationCardProps {
    publication: Publication
    onDelete: (publicationId: string) => void
}