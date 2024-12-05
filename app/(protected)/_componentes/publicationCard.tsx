"use client"

import { Publication } from "@/app/types/models";
import { PublicationComponent } from "./publicationComponent";

export function PostPublication({ onNewPublication }: { onNewPublication: (newPublication: Publication) => void }) {

    return (
        <>
            <div className="w-full max-w-sm p-4 bg-gray-600 border border-white rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 justify-self-center">
                <PublicationComponent onNewPublication={onNewPublication}/>
            </div>
        </>
    );
}