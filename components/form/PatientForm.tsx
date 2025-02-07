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
import { Patient } from "../table/patientColumns";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "姓名至少需要2个字符",
  }),
  height: z.coerce.number(),
  weight: z.coerce.number(),
  sex: z.string(),
  phone: z.string().min(11, {
    message: "请输入正确的手机号",
  }),
  address: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface PatientFormProps {
  initialData?: Patient;
  isEdit?: boolean;
}

export function PatientForm({ initialData, isEdit = false }: PatientFormProps) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      height: initialData?.height ?? 0,
      weight: initialData?.weight ?? 0,
      sex: initialData?.sex ?? "",
      phone: initialData?.phone ?? "",
      address: initialData?.address ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isEdit && initialData) {
        await post("/api/admin/updatepatient", {
          ...values,
          id: initialData.id,
        });
      } else {
        await post("/api/admin/addpatient", values);
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
                <Input placeholder="请输入病人姓名" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>身高(cm)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="请输入身高" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>体重(kg)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="请输入体重" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>性别</FormLabel>
              <FormControl>
                <Input placeholder="请输入性别" {...field} />
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
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>地址</FormLabel>
              <FormControl>
                <Input placeholder="请输入地址" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {isEdit ? "保存修改" : "添加病人"}
        </Button>
      </form>
    </Form>
  );
}
