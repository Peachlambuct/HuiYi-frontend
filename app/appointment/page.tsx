"use client";

import AppointmentCard from "@/components/ui/AppointmentCard";
import { Button } from "@/components/ui/button";
import DoctorAppointmentCard from "@/components/ui/DoctorAppointmentCard";
import DoctorCombobox from "@/components/ui/DoctorTypeCombobox";
import { Input } from "@/components/ui/input";
import { get, post } from "@/net";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export interface Appointment {
  id: string;
  date: string;
  doctor_avatar: string;
  doctor_name: string;
  doctor_title: string;
  doctor_type: string;
  status: boolean;
  time_id: number;
}

export interface Doctor {
  id: string;
  name: string;
  job_type: string;
  job_title: string;
}
const AppointmentPage = () => {
  const [doctorList, setDoctorList] = useState<Doctor[]>([]);
  const [appointment, setAppointment] = useState<Appointment[]>([]);
  const [query, setQuery] = useState({
    doctor_name: "",
    doctor_type: "",
  });
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const getDoctor = async () => {
    try {
      const data = await get("/api/admin/doctor");
      setDoctorList(data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  };

  const getAppointment = async () => {
    try {
      const data = await get("/api/appointment/nonfinished");
      setAppointment(data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  const getDoctorByQuery = async () => {
    try {
      const data = await post(`/api/doctor/query`, query);
      setDoctorList(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch doctors by query:", error);
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      await get(`/api/appointment/delete?id=${id}`);
      await getAppointment(); // 确保在删除操作完成后调用 getAppointment
    } catch (error) {
      console.error("Failed to delete appointment:", error);
    }
  };

  useEffect(() => {
    getDoctor();
    getAppointment();

    // 检查URL参数是否包含doctorId
    const doctorId = searchParams.get("doctorId");
    if (doctorId) {
      setSelectedDoctorId(doctorId);
      // 可以滚动到该医生的卡片位置或高亮显示
    }
  }, [searchParams]);

  return (
    <div className="h-full flex items-center">
      <div className="h-[96%] w-full flex">
        <div className="w-1/4 bg-zinc-50 dark:bg-zinc-800/50 shadow-lg rounded-lg">
          <div className="h-20 flex flex-col items-center">
            <h1 className="text-2xl font-bold text-left w-[90%] mb-12 mt-4 text-teal-400">
              预约挂号
            </h1>
            <Input
              placeholder="搜索医生姓名..."
              className="bg-zinc-50 dark:bg-zinc-800/50 h-16 w-[90%] dark:text-zinc-100 dark:placeholder:text-zinc-400"
              value={query.doctor_name}
              onChange={(e) =>
                setQuery((prevQuery) => ({
                  ...prevQuery,
                  doctor_name: e.target.value,
                }))
              }
            />
            <div className="h-20 mt-3 m-10 flex w-[90%] justify-between">
              <DoctorCombobox query={query} setQuery={setQuery} />
              <Button
                className="bg-teal-400 w-20 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-600"
                onClick={getDoctorByQuery}
              >
                搜索
              </Button>
            </div>
          </div>
        </div>
        <div className="w-2/4 my-4 overflow-y-auto custom-scrollbar">
          <div className="flex items-center flex-col gap-3 mt-3">
            {doctorList.map((doctor) => (
              <DoctorAppointmentCard
                key={doctor.id}
                id={doctor.id}
                name={doctor.name}
                type={doctor.job_type}
                title={doctor.job_title}
                isSelected={doctor.id === selectedDoctorId}
              />
            ))}
          </div>
        </div>
        <div className="w-1/4 bg-gradient-to-r from-teal-500 to-green-300 dark:from-teal-600 dark:to-emerald-500 flex flex-col rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-left w-[90%] mb-2 mt-4 text-zinc-50 ml-4">
            我的预约
            <div className="mb-4 text-sm text-zinc-100 font-normal mt-2">
              以下是我已有的预约
            </div>
          </h1>

          <div className="flex-grow w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-y-auto custom-scrollbar p-4 flex flex-col gap-2">
            {appointment ? (
              appointment.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  id={appointment.id}
                  doctorName={appointment.doctor_name}
                  doctorImg={null}
                  date={appointment.date}
                  status={appointment.status}
                  type={appointment.doctor_type}
                  title={appointment.doctor_title}
                  deleteAppointment={deleteAppointment}
                />
              ))
            ) : (
              <div className="text-zinc-600 dark:text-zinc-300">
                当前还没有预约哦
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
