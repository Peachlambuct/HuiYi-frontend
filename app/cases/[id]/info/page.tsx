"use client";

import { ModeToggle } from "@/components/ui/modeToggle";
import Link from "next/link";
import CheckInfoCard from "@/components/ui/CheckInfoCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { get } from "@/net";

export interface CheckItem {
  name: string;
  room: string;
  img: string;
  status: string;
  time: string;
}

export interface CaseInfo {
  id: string;
  title: string;
  doctor_name: string;
  doctor_type: string;
  doctor_id: string;
  check_project: CheckItem[];
  content: string;
  sex: boolean;
  patient_name: string;
  patient_id: string;
  age: number;
  date: string;
  check_id: string;
}

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const CaseInfo = () => {
  const params = useParams();
  const { id } = params; // 获取动态路由参数
  const [caseInfo, setCaseInfo] = useState<CaseInfo | undefined>(undefined);

  const getInfo = async () => {
    const data = await get(`/api/cases/details?case_id=${id}`);
    setCaseInfo(data);
  };
  useEffect(() => {
    getInfo();
  }, []);
  return (
    <div className="h-screen w-screen bg-zinc-200 dark:bg-zinc-900 flex flex-col">
      <div className="flex justify-between items-center p-3">
        <div>
          <Link
            className="text-teal-400 hover:text-teal-500 dark:text-teal-500 dark:hover:text-teal-400 text-lg"
            href="/cases/list"
          >
            ◀ 返回病例列表
          </Link>
        </div>
        <div>
          <ModeToggle />
        </div>
      </div>
      <div className="flex flex-grow justify-center mt-4 overflow-y-auto custom-scrollbar">
        <div className="w-[76%] bg-zinc-100/80 dark:bg-zinc-800/50 shadow-md p-4 rounded-2xl flex flex-col overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-end mb-10">
            <div className="text-6xl font-semibold text-zinc-800 dark:text-zinc-100">
              {caseInfo?.title}
            </div>
            <div className="text-zinc-600 dark:text-zinc-400 text-2xl font-mono">
              2024-04-11
            </div>
          </div>

          <section className="px-12">
            <div className="text-4xl font-semibold text-zinc-800 dark:text-zinc-100">
              开具检查项
            </div>
            {caseInfo?.check_project.map((item) => (
              <CheckInfoCard
                key={item.name}
                name={item.name}
                date={item.time}
                room={item.room}
                status={item.status}
                doctor_name={caseInfo.doctor_name}
              />
            ))}
          </section>

          <section className="px-12 pt-7">
            <div className="text-4xl font-semibold text-zinc-800 dark:text-zinc-100 mt-3">
              医嘱
            </div>
            <div className="mt-4 text-zinc-700 dark:text-zinc-300">
              {caseInfo?.content}
            </div>
          </section>

          <section className="flex justify-end mt-6 text-xl">
            <span className="text-zinc-700 dark:text-zinc-300">主治医师：</span>
            <span className="text-zinc-800 dark:text-zinc-200">
              {caseInfo?.doctor_name}
            </span>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CaseInfo;
