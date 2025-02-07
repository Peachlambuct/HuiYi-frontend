"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { post } from "@/net";
import { useRouter } from "next/navigation";
import { Doctor } from "../table/doctorColumns";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "姓名至少需要2个字符",
  }),
  honor: z.string(),
  job_title: z.string(),
  job_type: z.string(),
  phone: z.string().min(11, {
    message: "请输入正确的手机号",
  }),
});

interface DoctorFormProps {
  initialData?: Doctor;
  isEdit?: boolean;
}

export function DoctorForm({ initialData, isEdit = false }: DoctorFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      honor: "",
      job_title: "",
      job_type: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isEdit && initialData) {
        await post("/api/admin/updatedoctor", {
          ...values,
          id: initialData.id,
        });
      } else {
        await post("/api/admin/adddoctor", values);
      }
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>姓名</FormLabel>
              <FormControl>
                <Input placeholder="请输入医生姓名" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="honor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>荣誉称号</FormLabel>
              <FormControl>
                <Input placeholder="请输入荣誉称号" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="job_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>职称</FormLabel>
              <FormControl>
                <Input placeholder="请输入职称" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="job_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>科室</FormLabel>
              <FormControl>
                <Input placeholder="请输入科室" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>手机号</FormLabel>
              <FormControl>
                <Input placeholder="请输入手机号" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {isEdit ? "保存修改" : "添加医生"}
        </Button>
      </form>
    </Form>
  );
}
