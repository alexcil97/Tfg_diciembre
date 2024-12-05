"use client"
import { useEffect, useState } from "react"
import { ProfileCard } from "../_componentes/profileCard"
import { User } from "@/app/types/models"
import { getProfileById } from "@/actions/getProfileById"
import { userCurrentUser } from "../hook/use-current-user"
import { useSession } from "next-auth/react"
import { SettingsPanel } from "../_componentes/settings-panel"



const ProfilePage = () => {
    const [profile, setProfile] = useState<User>()
    const user = userCurrentUser()
    const session = useSession()

    useEffect(() => {
        if (session.data !== null) {
            getProfileById(session.data.user.id).then((usuario) => {
                //@ts-ignore
                setProfile(usuario)


            })
        }
    }, [])
    return (
        <>
            <ProfileCard
                nombre={profile?.nombre ? profile?.nombre : "Nombre no encontrado"}
                apellido={profile?.apellido ? profile.apellido : "apellido no encontrado"}
                email={profile?.email ? profile.email : "email no encontrado"}
                profile_picture={profile?.profile_picture ? profile.profile_picture : "/images/erin-lindford.jpg"} />
            <SettingsPanel />
        </>
    )
}

export default ProfilePage