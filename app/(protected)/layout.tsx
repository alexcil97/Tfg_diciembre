import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import Navbar from "./_componentes/navbar";
import { LogoutButton } from "../auth/logout/logout-button";
import SideBar from "./_componentes/sidebar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className='w-full flex-none md:w-64'>
            <SideBar />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto overflow-y-auto md:p-12 no-scrollbar">
          {children}
        </div>
      </div>
    </SessionProvider>
  );
};

export default ProtectedLayout;
