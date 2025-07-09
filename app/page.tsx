import { FC } from "react"
import { UserInfo } from "./_components/UserInfo";
import { AddLeadForm } from "./_components/AddLeadForm/AddLeadForm";
import { LeadsManagement } from "./_components/LeadsManagement.tsx";

const Home: FC = () => {
  return (
    <div className="min-w-[1600px] w-full h-lvh flex items-center">
      <div className="w-[700px] h-full p-8"><div className="flex flex-col items-start gap-4">
        <UserInfo />
        <AddLeadForm />
      </div></div>
      <div className="w-[calc(100%-700px)] h-full flex flex-col items-center justify-start overflow-auto">
        <div className="w-full h-4"></div>
        <LeadsManagement />
      </div>
    </div>
  )
}

export default Home;