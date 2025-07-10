"use client"

import { exportCSV } from "@/app/_utils";
import { ArrowLeftRight, Download } from "lucide-react";
import { FC, ReactNode } from "react"

export const Shell: FC<{
    csv: string,
    isFetching: boolean,
    children: ReactNode
    onStyleChange: Function
}> = ({
    csv,
    isFetching,
    children,
    onStyleChange
}) => {
        const handleExportCSV = () => {
            exportCSV(csv);
        };

        return (
            <div className="w-[900px]">
                <div className="p-4 w-full"><div className="relative group w-full shadow shadow-gray-100/90 rounded-xs border-[1px] border-gray-100/90 p-4 hover:shadow-lg hover:shadow-gray-200/90 transition-all bg-gradient-to-tl from-white/90 to-gray-200/90 from-80%">
                    <div className={`absolute top-0 left-0 -translate-1/3 w-5 h-5 bg-gray-800/10 rotate-30 rounded-xs group-hover:rotate-90 transition-all`}>
                        <div className={`absolute left-1/2 top-1/2 -translate-1/2 w-5 h-5 rounded-xs border-[0px] border-gray-800/0 ${isFetching && "border-[1px] animate-ping border-gray-800/90"}`}></div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <h1 className="flex items-center gap-2 text-gray-800 text-lg font-medium">
                                Leads Management
                                <div
                                    className="rounded-sm p-1 hover:bg-gray-300 transition-all cursor-pointer"
                                    title="click here to change style"
                                    onClick={() => onStyleChange()}
                                >
                                    <ArrowLeftRight size={16} />
                                </div>
                            </h1>
                            <p className="text-gray-400 text-sm">Manage your outreach leads and generated messages</p>
                            <p className="text-gray-300 text-xs">Click switch button to change style</p>
                        </div>
                        <div
                            className="
                            px-4 border hover:border-gray-400 h-10 
                            flex items-center gap-2 
                            text-gray-800 cursor-pointer
                            transition-all
                            "
                            onClick={handleExportCSV}
                        >
                            <Download size={16} />
                            <span className="text-xs">Export CSV</span>
                        </div>
                    </div>
                    {children}
                </div></div>
            </div>
        )
    }