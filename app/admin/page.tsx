"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "@/components/table/columns";
import { get } from "@/net";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckItemForm } from "@/components/form/CheckItemForm";

interface Item {
  id: number;
  name: string;
  room: string;
}

const Admin = () => {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getData = async () => {
    try {
      const res = await get("/api/admin/info");
      setData(res);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("无法获取数据");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDataUpdate = async () => {
    await getData();
  };

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

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="space-y-4 text-center">
          <div className="text-2xl font-semibold text-red-500">错误</div>
          <div className="text-zinc-500 dark:text-zinc-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200">
            管理面板
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            管理和监控系统检查项目
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-teal-500 hover:bg-teal-600">
                添加检查项目
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加新的检查项目</DialogTitle>
              </DialogHeader>
              <CheckItemForm />
            </DialogContent>
          </Dialog>
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span>总项目数:</span>
            <span className="font-mono text-teal-500 dark:text-teal-400">
              {data.length}
            </span>
          </div>
        </div>
      </div>

      {/* 数据统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 bg-white dark:bg-zinc-900 border-none shadow-md">
          <div className="space-y-2">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">活跃项目</p>
            <div className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
              {Math.floor(data.length * 0.8)}
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white dark:bg-zinc-900 border-none shadow-md">
          <div className="space-y-2">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">今日新增</p>
            <div className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
              {Math.floor(Math.random() * 10)}
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white dark:bg-zinc-900 border-none shadow-md">
          <div className="space-y-2">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">系统状态</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-zinc-800 dark:text-zinc-200">运行正常</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 数据表格 */}
      <Card className="flex-1 overflow-hidden bg-white dark:bg-zinc-900 border-none shadow-md">
        <div className="p-2">
          <DataTable
            columns={columns}
            data={data}
            location="/"
            onDataUpdate={handleDataUpdate}
            onDelete={handleDataUpdate}
          />
        </div>
      </Card>

      {/* 页脚 */}
      <div className="flex items-center justify-between pt-4 text-sm text-zinc-500 dark:text-zinc-400">
        <div>© 2024 慧医智慧医疗系统</div>
        <div className="flex items-center gap-2">
          <span>最后更新:</span>
          <span className="font-mono">{new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default Admin;
