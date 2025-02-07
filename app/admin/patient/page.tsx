"use client";

import { columns } from "@/components/table/patientColumns";
import { DataTable } from "@/components/table/DataTable";

import React, { useEffect, useState } from "react";
import { get } from "@/net";
interface Item {
  id: number;
  name: string;
  height: number;
  weight: number;
  sex: string; // 修改性别属性为布尔值
  phone: string;
  address: string;
}
interface Data {
  data: Item[];
}

const Admin = () => {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const getData = async () => {
    try {
      const res = await get("/api/admin/patient");
      setData(res);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("无法获取数据");
    } finally {
      setLoading(false);
    }
  };

  const handleDataUpdate = async () => {};
  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="space-y-6 text-center">
          {/* 加载动画 */}
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="w-full h-full border-4 border-teal-200 dark:border-teal-900 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full rotate-45">
              <div className="w-full h-full border-4 border-transparent border-t-teal-500 dark:border-t-teal-400 rounded-full animate-spin"></div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <svg
                className="w-8 h-8 text-teal-500 dark:text-teal-400 animate-bounce"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </div>
          </div>

          {/* 加载文字 */}
          <div className="space-y-2">
            <div className="text-2xl font-semibold bg-gradient-to-r from-teal-500 to-blue-500 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent animate-pulse">
              加载中...
            </div>
            <div className="text-zinc-500 dark:text-zinc-400 animate-pulse">
              正在获取最新数据
            </div>
          </div>

          {/* 加载进度条 */}
          <div className="max-w-md mx-auto w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-500 to-blue-500 dark:from-teal-400 dark:to-blue-400 animate-loading-bar"></div>
          </div>
        </div>
      </div>
    );
  }
  if (error) return <div>错误: {error}</div>;

  return (
    <div className="flex w-full h-full">
      <DataTable
        columns={columns}
        data={data}
        location="/patient"
        onDataUpdate={getData}
        onDelete={handleDataUpdate}
      />
    </div>
  );
};

export default Admin;
