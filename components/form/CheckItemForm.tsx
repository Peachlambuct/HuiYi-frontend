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
import { Item } from "../table/columns";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "检查项目名称至少需要2个字符",
  }),
  room: z.string().min(2, {
    message: "科室名称至少需要2个字符",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CheckItemFormProps {
  initialData?: Item;
  isEdit?: boolean;
}

export function CheckItemForm({
  initialData,
  isEdit = false,
}: CheckItemFormProps) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      room: initialData?.room ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isEdit && initialData) {
        await post("/api/admin/update", { ...values, id: initialData.id });
      } else {
        await post("/api/admin/add", values);
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
              <FormLabel>检查项目名称</FormLabel>
              <FormControl>
                <Input placeholder="请输入检查项目名称" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="room"
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
        <Button type="submit" className="w-full">
          {isEdit ? "保存修改" : "添加检查项目"}
        </Button>
      </form>
    </Form>
  );
}
