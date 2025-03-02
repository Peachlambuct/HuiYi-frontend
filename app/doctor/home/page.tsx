"use client";
import { PatientInfo } from "@/app/patient/settings/page";
import AppointmentInfoCard from "@/components/ui/AppointmentInfoCard";
import HomeCalendar from "@/components/ui/HomeCalendar";
import TodoCaseCard from "@/components/ui/TodoCaseCard";
import { get } from "@/net";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TodayAppointment {
  patientName: string;
  age: number;
  date: string;
  appointId: number;
  patientId: number;
}

export interface TodoCase {
  id: number;
  patientName: string;
  age: number;
  updatedAt: string;
  sex: string;
}

const DocgtorHomePage = () => {
  const [data, setData] = useState<PatientInfo | null>(null);
  const [appointments, setAppointments] = useState<TodayAppointment[]>([]);
  const [todoCase, setTodoCase] = useState<TodoCase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getTodayAppointments = async () => {
    try {
      const result = await get("/api/doctor/todayappoint");
      setAppointments(result || []);
    } catch (error) {
      console.error("Error:", error);
      setAppointments([]);
    }
  };

  const getInfo = async (id: number) => {
    try {
      setLoading(true);
      const result = await get(`/api/patient/infobyid?pid=${id}`);
      setData(result);
    } catch (error) {
      console.error("Error:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const getTodoCases = async () => {
    try {
      const result = await get("/api/doctor/nonfinishcases");
      setTodoCase(result || []);
    } catch (error) {
      console.error("Error:", error);
      setTodoCase([]);
    }
  };
  const router = useRouter();
  useEffect(() => {
    setLoading(true);
    Promise.all([getTodayAppointments(), getTodoCases()]).finally(() => {
      setLoading(false);
    });
  }, []);
  return (
    <div className="h-full flex gap-3">
      <div className="w-1/3 bg-zinc-200/50 dark:bg-zinc-800/40 h-full mx-4 rounded-xl overflow-y-auto custom-scrollbar p-4">
        <div className="text-3xl font-semibold text-center text-teal-400 dark:text-teal-500">
          患者信息
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-[80%]">
            <div className="animate-pulse text-xl text-zinc-500 dark:text-zinc-400">
              加载中...
            </div>
          </div>
        ) : data ? (
          <div>
            <div className="flex justify-between items-end mt-10 p-2">
              <span className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">
                {data?.name}
              </span>
              <span className="space-x-3">
                <span
                  className={`text-lg font-semibold ${
                    data?.sex === "1" ? "text-blue-400" : "text-red-500"
                  }`}
                >
                  {data?.sex === "1" ? "♂" : "♀"}
                </span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {data?.age}岁
                </span>
              </span>
            </div>
            <div className="w-full h-[160px] mt-2 p-2 rounded-xl shadow-md bg-zinc-100/90 dark:bg-zinc-800/90 flex flex-col gap-4">
              <div className="text-zinc-600 dark:text-zinc-400 text-lg font-semibold">
                基础信息
              </div>
              <div className="flex h-[40px] gap-3">
                <div className="flex-1 bg-zinc-200 dark:bg-zinc-700/80 rounded-lg flex justify-center items-center gap-2">
                  <Image
                    src="/icons/phone.svg"
                    width={24}
                    height={24}
                    alt="phone"
                  />
                  <span className="text-zinc-700 dark:text-zinc-300 text-lg font-mono">
                    {data?.phone}
                  </span>
                </div>
                <div className="flex-1 bg-zinc-200 dark:bg-zinc-700/80 rounded-lg flex justify-center items-center gap-2">
                  <Image
                    src="/icons/address.svg"
                    width={24}
                    height={24}
                    alt="address"
                  />
                  <span className="text-zinc-700 dark:text-zinc-300 text-lg">
                    {data?.address}
                  </span>
                </div>
              </div>
              <div className="flex h-[40px] gap-3">
                <div className="flex-1 bg-zinc-100/90 dark:bg-zinc-800/90 rounded-lg"></div>
              </div>
            </div>

            <div className="w-full h-[300px] mt-5 p-2 rounded-xl shadow-md bg-zinc-100/90 dark:bg-zinc-800/90 flex flex-col gap-4">
              <div className="text-zinc-600 dark:text-zinc-400 text-lg font-semibold">
                医疗信息
              </div>
              <div className="flex h-[40px] gap-3">
                <div className="flex-1 bg-zinc-200 dark:bg-zinc-700/80 rounded-lg flex justify-center items-center gap-2">
                  <Image
                    src="/icons/身高.svg"
                    width={24}
                    height={24}
                    alt="身高"
                  />
                  <span className="text-zinc-700 dark:text-zinc-300 text-lg font-mono">
                    {data?.height}cm
                  </span>
                </div>
                <div className="flex-1 bg-zinc-200 dark:bg-zinc-700/80 rounded-lg flex justify-center items-center gap-2">
                  <Image
                    src="/icons/体重.svg"
                    width={24}
                    height={24}
                    alt="体重"
                  />
                  <span className="text-zinc-700 dark:text-zinc-300 text-lg font-mono">
                    {data?.weight}kg
                  </span>
                </div>
              </div>
              <div className="flex h-[40px] gap-3 flex-grow">
                <div className="flex-1 bg-zinc-200 dark:bg-zinc-700/80 rounded-lg p-2 gap-2 overflow-y-auto custom-scrollbar">
                  过敏源 😣:
                  <div className="text-zinc-700 dark:text-zinc-300 p-1 bg-cover">
                    {data?.allergens ? data?.allergens : "暂无消息"}
                  </div>
                </div>
                <div className="flex-1 bg-zinc-200 dark:bg-zinc-700/80 rounded-lg p-2 gap-2 overflow-y-auto custom-scrollbar">
                  过往病史 📄:
                  <div className="text-zinc-700 dark:text-zinc-300">
                    {data?.medical_history ? data?.medical_history : "暂无消息"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[80%] text-center">
            <Image
              src="/icons/选择.svg"
              width={120}
              height={120}
              alt="选择指示"
              className="mb-4 opacity-60"
            />
            <div className="text-lg text-zinc-600 dark:text-zinc-400">
              请选择右侧的预约信息来查看患者预留的信息
            </div>
          </div>
        )}
      </div>
      <div className="w-2/3 h-full flex flex-col gap-4">
        <div className="h-1/2 w-full flex">
          <div className="h-full w-2/3 bg-zinc-100 dark:bg-zinc-800/40 p-4 rounded-xl">
            <div className="text-xl font-semibold text-teal-400 dark:text-teal-500">
              今日预约患者信息
            </div>
            <div className="space-y-3 mt-2 overflow-y-auto custom-scrollbar h-[calc(100%-3rem)]">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse text-zinc-500 dark:text-zinc-400">
                    加载中...
                  </div>
                </div>
              ) : appointments && appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                  <AppointmentInfoCard
                    key={`appointment-${index}`}
                    name={appointment.patientName}
                    date={appointment.date}
                    age={appointment.age}
                    onClick={() => getInfo(appointment.patientId)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Image
                    src="/icons/日历.png"
                    width={80}
                    height={80}
                    alt="空日历"
                    className="mb-4 opacity-60"
                  />
                  <div className="text-zinc-500 dark:text-zinc-400">
                    当前无患者预约
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="h-full w-1/3 flex justify-center items-start p-4 bg-zinc-100 dark:bg-zinc-800/40 ml-4 rounded-xl overflow-hidden">
            <div className="w-full max-w-[280px]">
              <HomeCalendar />
            </div>
          </div>
        </div>
        <div className="h-1/2 w-full bg-zinc-100 dark:bg-zinc-800/40 rounded-xl">
          <div className="text-xl font-semibold text-teal-400 dark:text-teal-500 p-3">
            待完成病例
          </div>
          <div className="h-[calc(100%-3.5rem)] w-full grid grid-cols-2 gap-3 overflow-y-auto custom-scrollbar px-4">
            {loading ? (
              <div className="col-span-2 flex justify-center items-center">
                <div className="animate-pulse text-zinc-500 dark:text-zinc-400">
                  加载中...
                </div>
              </div>
            ) : todoCase && todoCase.length > 0 ? (
              todoCase.map((item, index) => (
                <TodoCaseCard
                  key={`todocase-${index}`}
                  name={item.patientName}
                  age={item.age}
                  sex={item.sex}
                  date={item.updatedAt}
                  onClick={() => {
                    router.push(`/doctor/${item.id}/cases`);
                  }}
                />
              ))
            ) : (
              <div className="col-span-2 flex flex-col items-center justify-center py-8 text-center">
                <Image
                  src="/icons/完成.svg"
                  width={80}
                  height={80}
                  alt="已完成"
                  className="mb-4 opacity-60"
                />
                <div className="text-zinc-500 dark:text-zinc-400">
                  已经没有待处理的病例了~
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocgtorHomePage;
