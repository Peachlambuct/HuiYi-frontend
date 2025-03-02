"use client";

import HomeCalendar from "@/components/ui/HomeCalendar";
import { get, post } from "@/net";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Case } from "../cases/list/page";
import { Appointment, Doctor } from "../appointment/page";

const Home = () => {
  const [doctorList, setDoctorList] = useState<Doctor[]>([]);
  const Router = useRouter();
  const [caseList, setCaseList] = useState<Case[]>([]);
  const [appointment, setAppointment] = useState<Appointment[]>([]);
  const [latestAppointment, setLatestAppointment] = useState<
    Appointment | undefined
  >(undefined);
  const [doctoquery, setQuery] = useState({
    doctor_name: "",
    doctor_type: "",
  });

  /**
   * 将日期格式化为 "YYYY MM dd HH:mm:ss" 格式
   * @param date 要格式化的日期对象，默认为当前时间
   * @returns 格式化后的时间字符串
   */
  const formatDateTime = (date: Date = new Date()): string => {
    // 获取年、月、日、时、分、秒
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() 返回 0-11
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // 补零函数
    const padZero = (num: number): string => {
      return num < 10 ? `0${num}` : `${num}`;
    };

    // 格式化为 "YYYY MM dd HH:mm:ss"
    return `${year}-${padZero(month)}-${padZero(day)} ${padZero(
      hours
    )}:${padZero(minutes)}:${padZero(seconds)}`;
  };
  const [LatestCase, setLatestCase] = useState<Case>();
  const query: { from: Date | null; to: Date | null; title: string } = {
    from: null,
    to: null,
    title: "",
  };
  const [sum, setSum] = useState(0);

  const queryCase = async () => {
    const data = await post("/api/cases/query", query);
    setCaseList(data);
  };

  const getAppointment = async () => {
    const data = await get("/api/appointment/list");
    if (!data) {
      setAppointment([]);
    } else if (data.length > 3) {
      setAppointment(data.slice(0, 3));
    } else {
      setAppointment(data);
    }
  };

  const getLastestAppointment = async () => {
    const data = await get("/api/appointment/latest");
    setLatestAppointment(data);
  };

  const getDoctorByQuery = async () => {
    const data = await post(`/api/doctor/query`, query);
    setDoctorList(data.slice(0, 3));
  };

  const getLastestCase = async () => {
    const data = await get("/api/cases/latest");
    setLatestCase(data);
  };

  const getSum = async () => {
    const data = await get("/api/appointment/sum");
    setSum(data);
  };

  const goto = (path: string) => {
    Router.push(path);
  };

  useEffect(() => {
    queryCase();
    getAppointment();
    getLastestAppointment();
    getDoctorByQuery();
    getLastestCase();
    getSum();
  }, []);
  return (
    <div className="flex h-full justify-center bg-cover bg-center overflow-hidden">
      <div className="flex-1 flex h-full justify-center items-center">
        <div className="w-[90%] h-[96%] bg-zinc-200/50 dark:bg-zinc-700/40 p-4 rounded-lg shadow backdrop-blur-sm flex flex-col">
          <div className="text-2xl font-semibold text-teal-400 mb-4">
            我的病例单
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="h-full overflow-y-auto custom-scrollbar pr-2">
              <div className="flex flex-col gap-4">
                {caseList.length > 0 ? (
                  caseList.map((item, index) => (
                    <div
                      key={index}
                      className="bg-zinc-50 p-2 shadow-md rounded-md dark:bg-zinc-700/30"
                    >
                      <div className="flex justify-between items-end">
                        <span className="text-xl font-semibold dark:text-zinc-100">
                          {item.title ? item.title : "暂无病例信息"}
                        </span>
                        <span className="text-zinc-400 text-sm dark:text-zinc-500">
                          {formatDateTime(new Date(item.UpdatedAt))}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="text-lg dark:text-zinc-200">
                          {item.title ? item.title : "医生暂时未填写病例信息"}
                        </div>
                        <div className="text-zinc-400 dark:text-zinc-300 line-clamp-3">
                          {item.content
                            ? item.content
                            : "医生暂时未填写病例信息"}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="dark:text-zinc-300">
                    目前还没有病例信息哦~
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <a
          className="absolute bottom-8 right-12 h-10 text-teal-400 hover:text-teal-500 dark:text-teal-500 dark:hover:text-teal-600 cursor-pointer"
          onClick={() => Router.push(`/cases/list`)}
        >
          查看更多 →
        </a>
      </div>
      <div className="flex-1 h-full flex items-center">
        <div className="h-[96%] w-full bg-zinc-200/50 dark:bg-zinc-700/40 shadow rounded-lg p-4 flex flex-col backdrop-blur-sm">
          <div className="text-teal-400 text-2xl font-semibold">预约</div>
          <div className="flex-grow mt-4 flex justify-center overflow-hidden">
            <div className="w-[90%] h-full flex flex-col gap-4 overflow-y-auto custom-scrollbar">
              <div className="flex-shrink-0 flex flex-col bg-zinc-300/70 dark:bg-zinc-600/70 rounded-xl p-3 relative">
                <div className="text-zinc-800 dark:text-zinc-100 font-semibold text-xl">
                  我的预约
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="w-2/3 flex flex-col gap-2">
                    {appointment.length > 0 ? (
                      appointment.map((item, _) => (
                        <div className="bg-gradient-to-r from-green-300 to-green-100 dark:from-teal-600 dark:to-emerald-700 rounded-lg flex justify-between items-center px-4 py-2">
                          <div className="flex justify-center items-center gap-2">
                            <Image
                              src="/images/dr-remirez.png"
                              height={100}
                              width={100}
                              alt="doctor"
                              className="h-8 w-fit border border-zinc-700 rounded-full"
                            />
                            <div className="text-zinc-700 dark:text-zinc-100 font-semibold">
                              {item.doctor_name}
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <div className="text-zinc-600 dark:text-zinc-200 font-mono font-semibold max-w-[50%]">
                              {item.date}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="dark:text-zinc-300">暂无预约记录哦~</div>
                    )}
                  </div>
                  <div className="w-1/3 bg-gradient-to-b from-green-300 to-teal-500 dark:from-teal-600 dark:to-emerald-800 rounded-lg p-4">
                    <div className="text-2xl text-zinc-700/90 dark:text-zinc-100 font-semibold">
                      您已在本院预约
                    </div>
                    <div className="text-center text-zinc-200 mt-4">
                      <span className="text-4xl text-zinc-100/80 dark:text-zinc-100 mr-2 font-mono">
                        {sum}
                      </span>
                      次
                    </div>
                  </div>
                </div>
                <a
                  className="absolute top-4 right-3 text-teal-400 hover:text-teal-500 dark:text-teal-500 dark:hover:text-teal-400"
                  href="/appointment"
                >
                  查看更多 →
                </a>
              </div>
              <div className="flex-shrink-0 flex flex-col bg-zinc-300/70 dark:bg-zinc-600/70 rounded-xl p-3 relative">
                <div className="text-zinc-800 dark:text-zinc-100 font-semibold text-xl">
                  名医坐诊
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  {doctorList.map((item, _) => (
                    <div className="bg-zinc-100 dark:bg-zinc-700/50 rounded-lg flex items-center justify-between p-2">
                      <div className="flex gap-2 items-center ml-3">
                        <Image
                          src={"/images/dr-remirez.png"}
                          height={80}
                          width={80}
                          alt="avatar"
                          className="rounded-full h-10 w-10"
                        />
                        <div className="text-lg text-zinc-700 dark:text-zinc-200">
                          {item.name}
                        </div>
                      </div>
                      <div className="text-zinc-600 dark:text-zinc-300 mr-2">
                        <div className="">{item.job_type}</div>
                        <div className="text-sm text-right">
                          {item.job_title}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <a
                  className="absolute top-4 right-3 text-teal-400 hover:text-teal-500 dark:text-teal-500 dark:hover:text-teal-400"
                  href="/appointment"
                >
                  查看更多 →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/4 flex flex-col items-center gap-5">
        <div className="">
          <HomeCalendar />
        </div>
        <div className="flex h-grow h-full w-full justify-center">
          <div className="w-[86%] bg-zinc-200/50 dark:bg-zinc-800/40 m-4 p-3 rounded-xl flex flex-col gap-4">
            {latestAppointment ? (
              <div className="bg-slate-100 p-2 shadow-md rounded-md dark:bg-zinc-700/30">
                <div className="flex justify-between items-end ">
                  <span className="text-xl text-teal-400 font-semibold ">
                    近期预约
                  </span>
                  <span className="text-zinc-400 text-sm">
                    {latestAppointment.date}
                  </span>
                </div>
                <div className="flex items-center mt-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      className="rounded-full h-8 w-8 shadow-sm border-2 border-slate-200"
                      src="/images/dr-remirez.png"
                      width={20}
                      height={20}
                      alt="doctor"
                    />
                    <div className="text-zinc-600 font-semibold dark:text-zinc-300">
                      {latestAppointment.doctor_name}
                    </div>
                  </div>
                  <div className="dark:text-zinc-200 text-zinc-600">
                    {latestAppointment.doctor_type}
                  </div>
                </div>
              </div>
            ) : (
              <>欢迎您使用本医疗系统</>
            )}
            {LatestCase && (
              <div className="bg-slate-100 p-2 shadow-md rounded-md dark:bg-zinc-700/30">
                <div className="flex justify-between items-end ">
                  <span className="text-xl text-teal-400 font-semibold">
                    最新报告
                  </span>
                  <span className="text-zinc-400 text-sm">
                    {formatDateTime(new Date(LatestCase.UpdatedAt))}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-lg">{LatestCase.title}</div>
                  <div className="text-zinc-400 dark:text-zinc-300 line-clamp-1">
                    {LatestCase.content
                      ? LatestCase.content
                      : "医生暂时未填写病例信息"}
                  </div>
                </div>
              </div>
            )}

            {(LatestCase || latestAppointment) && (
              <Button
                onClick={() => goto("/appointment/list")}
                className="h-10 bg-teal-400 hover:bg-teal-500 dark:bg-teal-500 dark:text-zinc-200 dark:hover:bg-teal-600"
              >
                查看更多 →
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
