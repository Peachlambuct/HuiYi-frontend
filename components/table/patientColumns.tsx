"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { get } from "@/net";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { PatientForm } from "../form/PatientForm";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Patient = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sex: string; // 修改性别属性为布尔值
  phone: string;
  address: string;
};

const handleDelete = async (id: number) => {
  await get(`/api/admin/delpatient?id=${id}`);
  console.log("Deleting item with ID:", id);
};

export const columns: ColumnDef<Patient>[] = [
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
            姓名
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
    accessorKey: "height",
    header: () => (
      <div className="flex justify-center items-center text-left w-full text-xl font-bold ">
        身高
      </div>
    ),
    cell: ({ cell }) => (
      <div className="flex justify-center items-center text-xl w-full ">
        {cell.getValue() as React.ReactNode}
      </div>
    ),
  },
  {
    accessorKey: "weight",
    header: () => (
      <div className="flex justify-center items-center text-left w-full text-xl font-bold ">
        体重
      </div>
    ),
    cell: ({ cell }) => (
      <div className="flex justify-center items-center text-xl w-full ">
        {cell.getValue() as React.ReactNode}
      </div>
    ),
  },
  {
    accessorKey: "sex",
    header: () => (
      <div className="flex justify-center items-center text-left w-full text-xl font-bold ">
        性别
      </div>
    ),
    cell: ({ cell }) => (
      <div className="flex justify-center items-center text-xl w-full ">
        {cell.getValue() as React.ReactNode}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: () => (
      <div className="flex justify-center items-center text-left w-full text-xl font-bold ">
        手机号
      </div>
    ),
    cell: ({ cell }) => (
      <div className="flex justify-center items-center text-xl w-full ">
        {cell.getValue() as React.ReactNode}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: () => (
      <div className="flex justify-center items-center text-left w-full text-xl font-bold ">
        地址
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
              <DialogTitle>编辑病人信息</DialogTitle>
            </DialogHeader>
            <PatientForm initialData={row.original} isEdit={true} />
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
