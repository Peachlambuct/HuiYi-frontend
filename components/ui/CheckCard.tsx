"use client";

import { get } from "@/net";
import { Button } from "./button";

interface CheckCardProps {
  id: string;
  name: string;
  room: string;
  status: string;
  date: string;
  update?: () => void;
}

const CheckCard = ({
  id,
  name,
  room,
  status,
  date,
  update,
}: CheckCardProps) => {
  const finish = async () => {
    await get(`/api/patient/finsh?id=${id}`);
    if (update) {
      update();
    }
  };
  return (
    <div className="bg-white dark:bg-zinc-800/90 h-[80px] rounded-xl shadow-xl flex justify-between items-start pt-3 px-8">
      <div className="">
        <div className="text-lg text-zinc-800 dark:text-zinc-100">{name}</div>
        <div className="text-zinc-700 dark:text-zinc-400">{room}</div>
      </div>
      <div className="text-right">
        <div className="flex gap-5 items-end">
          <div className="flex gap-2 items-center">
            <div
              className={`w-2 h-2 ${
                status === "已完成" ? "bg-green-400" : "bg-red-500"
              } rounded-full`}
            ></div>
            <div className="text-zinc-700 dark:text-zinc-300">
              {status === "已完成" ? "已完成" : "未完成"}
            </div>
          </div>
          <div className="font-mono text-zinc-600 dark:text-zinc-400">
            {date}
          </div>
        </div>
        <Button
          onClick={finish}
          className="text-teal-400 hover:text-teal-500 dark:text-teal-500 dark:hover:text-teal-400"
          variant="ghost"
        >
          完成👉
        </Button>
      </div>
    </div>
  );
};

export default CheckCard;
