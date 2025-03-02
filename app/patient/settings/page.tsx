"use client";

import "react-phone-number-input/style.css";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useRef, useState } from "react";
import { get } from "@/net";
import { SettingsForm } from "@/components/form/SettingsForm";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

export interface PatientInfo {
  name: string;
  height: number;
  weight: number;
  birthday: string;
  sex: string;
  phone: string;
  address: string;
  allergens: string;
  medical_history: string;
  age: number;
}

// 将性别字符串转换为布尔值
const convertSexToBoolean = (sex: string): boolean => {
  return sex === "男" ? true : false;
};

const Settings = () => {
  const [data, setData] = useState<PatientInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const result = await get("/api/patient/info");
      // 在获取数据后可以使用 convertSexToBoolean 函数
      const sexBoolean = convertSexToBoolean(result.sex);
      result.sex = sexBoolean;
      setData(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const token = "Bearer " + localStorage.getItem("jwt");
    setAvatarUrl(`http://localhost:8080/api/user/avatar?token=${token}`);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      uploadAvatar(file);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadAvatar = async (file: File) => {
    const jwt = localStorage.getItem("jwt");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/api/user/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        console.log("上传成功:", result);
        toast({
          title: "头像更新成功",
          description: "你的新头像已经上传完成",
          variant: "default",
        });
      } else {
        console.error("上传失败:", result.msg);
        toast({
          title: "上传失败",
          description: "请检查文件格式或网络连接",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("上传失败:", error);
      toast({
        title: "上传失败",
        description: "请检查文件格式或网络连接",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  return (
    <div className="flex h-full gap-6 p-6 overflow-hidden">
      <div className="w-3/5 rounded-2xl bg-white dark:bg-zinc-900 shadow-lg overflow-hidden">
        <div className="flex flex-col h-full p-6">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              设置
              <span className="text-teal-500 dark:text-teal-400 ml-2">
                个人信息📄
              </span>
            </h1>
            <p className="text-muted-foreground dark:text-zinc-400">
              在这里管理您的个人信息设置
            </p>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
            <SettingsForm data={data} onSuccess={fetchData} />
          </div>
        </div>
      </div>

      <div className="w-2/5 min-w-[400px] max-w-[500px] rounded-2xl bg-white dark:bg-zinc-900 shadow-lg overflow-y-auto custom-scrollbar">
        <div className="p-6">
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={avatarUrl || "/images/default-avatar.png"}
                  alt="avatar"
                  className="w-24 h-24 rounded-full object-cover ring-2 ring-offset-2 ring-teal-500 dark:ring-teal-400"
                  style={{ aspectRatio: "1/1" }}
                />
              </div>
              <div className="flex justify-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  onClick={handleButtonClick}
                  className="bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 text-white transition-colors duration-200"
                  size="sm"
                >
                  更换头像
                </Button>
              </div>
            </div>

            <div className="w-full mt-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  🧑 个人信息
                </h2>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-lg ${
                      data?.sex === "男" ? "text-blue-500" : "text-pink-500"
                    }`}
                  >
                    {data?.sex === "男" ? "♂" : "♀"}
                  </span>
                  <span className="text-muted-foreground dark:text-zinc-400">
                    {data?.age} 岁
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-4 space-y-4">
                <h3 className="font-medium text-muted-foreground dark:text-zinc-400">
                  基础信息
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-zinc-800">
                    <Image
                      src="/icons/phone.svg"
                      width={20}
                      height={20}
                      alt="phone"
                    />
                    <span className="font-mono">{data?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-zinc-800">
                    <Image
                      src="/icons/address.svg"
                      width={20}
                      height={20}
                      alt="address"
                    />
                    <span>{data?.address}</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-zinc-800">
                    <Image
                      src="/icons/日历.png"
                      width={20}
                      height={20}
                      alt="birthday"
                    />
                    <span className="font-mono">
                      {data?.birthday
                        ? formatDate(new Date(data.birthday))
                        : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 p-4 space-y-4">
                <h3 className="font-medium text-muted-foreground dark:text-zinc-400">
                  医疗信息
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-zinc-800">
                    <Image
                      src="/icons/身高.svg"
                      width={20}
                      height={20}
                      alt="身高"
                    />
                    <span className="font-mono">{data?.height}cm</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-zinc-800">
                    <Image
                      src="/icons/体重.svg"
                      width={20}
                      height={20}
                      alt="体重"
                    />
                    <span className="font-mono">{data?.weight}kg</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="p-3 rounded-lg bg-white dark:bg-zinc-800 space-y-2">
                    <div className="text-sm text-muted-foreground dark:text-zinc-400">
                      过敏源 😣
                    </div>
                    <p className="line-clamp-2">
                      {data?.allergens || "暂无信息"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white dark:bg-zinc-800 space-y-2">
                    <div className="text-sm text-muted-foreground dark:text-zinc-400">
                      过往病史 📄
                    </div>
                    <p className="line-clamp-2">
                      {data?.medical_history || "暂无信息"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
