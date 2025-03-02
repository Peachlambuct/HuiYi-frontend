"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { get } from "@/net";
import { useParams } from "next/navigation";

// 简单的骨架屏组件
const Skeleton = ({ className }: { className: string }) => (
  <div
    className={`animate-pulse bg-gray-300 dark:bg-gray-700 ${className}`}
  ></div>
);

interface DoctorInfo {
  id: number;
  name: string;
  honor: string;
  job_title: string;
  job_type: string;
  phone: string;
  // 其他可能的字段
}

const DoctorInfoPage = () => {
  const params = useParams();
  const doctorId = params.id as string;
  const [doctorInfo, setDoctorInfo] = useState<DoctorInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        setLoading(true);
        const data = await get(
          `/api/doctor/getDoctorInfo?doctorId=${doctorId}`
        );
        setDoctorInfo(data);
      } catch (error) {
        console.error("获取医生信息失败:", error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctorInfo();
    }
  }, [doctorId]);

  if (loading) {
    return (
      <div className="flex h-full w-screen space-x-2">
        <div className="flex items-center justify-center relative h-1/1 w-1/3 mt-5 ml-5 mb-5">
          <Skeleton className="h-full w-full rounded-2xl" />
        </div>
        <div className="h-5/5 w-2/3 bg-zinc-200/60 dark:bg-zinc-800/60 m-5 rounded-xl">
          <div className="flex h-1/4 items-center relative">
            <Skeleton className="h-16 w-48 rounded-lg ml-4" />
            <Skeleton className="h-8 w-24 rounded-lg absolute right-2 top-2" />
            <div className="absolute right-5 bottom-2 space-y-2">
              <Skeleton className="h-8 w-32 rounded-lg" />
              <Skeleton className="h-6 w-24 rounded-lg" />
            </div>
          </div>
          <div className="h-3/4 mx-5 pt-4 border-t border-t-zinc-400">
            <Skeleton className="h-8 w-36 rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg mt-4" />
            <Skeleton className="h-8 w-36 rounded-lg mt-6" />
            <Skeleton className="h-24 w-full rounded-lg mt-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-screen space-x-2">
      <div className="flex items-center justify-center relative h-1/1 w-1/3 mt-5 ml-5 mb-5">
        <Image
          className="rounded-2xl -rotate-2"
          src="/images/zhongnanshan.jpg" // 这里可以替换为动态的医生头像
          alt={doctorInfo?.name || "医生"}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="h-5/5 w-2/3 bg-zinc-200/60 dark:bg-zinc-800/60 m-5 rounded-xl">
        <div className="flex h-1/4 items-center relative">
          <div className="">
            <h1 className="text-center text-5xl font-bold ml-4 text-zinc-800 dark:text-zinc-100">
              {doctorInfo?.name || "未知医生"}
            </h1>
          </div>
          <Link
            href={`/appointment?doctorId=${doctorId}`}
            className="text-teal-400 dark:text-teal-500 hover:text-teal-500 dark:hover:text-teal-400 absolute right-2 top-2 text-lg"
          >
            立即预约 →
          </Link>
          <div className="absolute right-5 bottom-2 text-zinc-600 dark:text-zinc-300 text-xl space-y-2 text-right">
            <div className="text-2xl">
              {doctorInfo?.job_title || "职称未知"}
            </div>
            <div>{doctorInfo?.job_type || "科室未知"}</div>
          </div>
        </div>
        <div className="h-3/4 mx-5 overflow-y-auto custom-scrollbar pt-4 border-t border-t-zinc-400">
          <div className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
            个人信息📄
          </div>
          <div className="mt-2 p-2 text-zinc-700 dark:text-zinc-300">
            {doctorInfo?.honor || "暂无个人信息"}
          </div>

          <div className="text-2xl font-semibold mt-6 text-zinc-800 dark:text-zinc-100">
            联系方式📱
          </div>
          <div className="mt-2 p-2 text-zinc-700 dark:text-zinc-300">
            <div>电话: {doctorInfo?.phone || "暂无联系方式"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorInfoPage;
