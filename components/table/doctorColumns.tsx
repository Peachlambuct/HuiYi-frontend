"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { get } from "http";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DoctorForm } from "../form/DoctorForm";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Doctor = {
  id: number;
  name: string;
  honor: string;
  job_title: string;
  job_type: string;
  phone: string;
};

const handleEdit = (item: Doctor) => {
  // 处理修改逻辑，例如打开一个编辑对话框
  console.log("Editing item:", item);
};

const handleDelete = async (id: number) => {
  await get(`/api/admin/deldoctor?id=${id}`);
};

export const columns: ColumnDef<Doctor>[] = [
  {
    accessorKey: "id",
    header: () => (
      <div className="flex justify-center items-center text-left w-full text-xl font-bold">
        ID
      </div>
    ),
    cell: ({ cell }) => (
      <div className="flex justify-center items-center  w-full text-xl ">
        {cell.getValue() as React.ReactNode}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="flex justify-center items-center w-full ">
          <Button
            className="text-xl font-bold"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            医生姓名
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ cell }) => (
      <div className="flex justify-center items-center text-xl w-full ">
        {cell.getValue() as React.ReactNode}
      </div>
    ),
  },
  {
    accessorKey: "job_type",
    header: () => (
      <div className="flex justify-center items-center text-left w-full text-xl font-bold ">
        科室
      </div>
    ),
    cell: ({ cell }) => (
      <div className="flex justify-center items-center text-xl w-full ">
        {cell.getValue() as React.ReactNode}
      </div>
    ),
  },
  {
    accessorKey: "job_title",
    header: () => (
      <div className="flex justify-center items-center text-left w-full text-xl font-bold ">
        职称
      </div>
    ),
    cell: ({ cell }) => (
      <div className="flex justify-center items-center text-xl w-full ">
        {cell.getValue() as React.ReactNode}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => (
      <div className="flex justify-center items-center text-left w-full text-xl font-bold ">
        选项
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center items-center space-x-3 w-full text-xl ">
        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-blue-500 text-white rounded-xl h-10 w-16">
              编辑
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>编辑医生信息</DialogTitle>
            </DialogHeader>
            <DoctorForm initialData={row.original} isEdit={true} />
          </DialogContent>
        </Dialog>
        <button
          className="bg-red-500 text-white rounded-xl h-10 w-16"
          onClick={() => handleDelete(row.original.id)}
        >
          删除
        </button>
      </div>
    ),
  },
];
