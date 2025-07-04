import { FC } from "react"
import { UserInfo } from "./_components/UserInfo";
import { AddLeadForm } from "./_components/AddLeadForm";
import { LeadsTalbe } from "./_components/LeadsTable";

const Home: FC = () => {
  return (
    <div className="min-w-[1600px] w-full h-lvh flex items-center">
      <div className="w-[700px] h-full border-r bordering-gray-100 flex items-center justify-center"><div className="flex flex-col items-start gap-4">
        <UserInfo />
        <AddLeadForm />
      </div></div>
      <div className="w-[calc(100%-700px)] h-full flex flex-col items-center justify-start">
        <div className="w-full h-4"></div>
        <LeadsTalbe />
      </div>
    </div>
  )
}

export default Home;