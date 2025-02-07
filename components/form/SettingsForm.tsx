"use client";

import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { E164Number } from "libphonenumber-js/core";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PatientInfo } from "@/app/patient/settings/page";
import { useEffect } from "react";
import { post } from "@/net";

export const formSchema = z.object({
  name: z.string().min(2, {
    message: "用户名必须至少拥有2个字符.",
  }),
  height: z.preprocess(
    (val) => Number(val),
    z.number().min(0, {
      message: "身高必须大于0.",
    })
  ),
  weight: z.preprocess(
    (val) => Number(val),
    z.number().min(0, {
      message: "体重必须大于0.",
    })
  ),
  birthday: z.date().min(new Date(1900, 1, 1), {
    message: "生日必须大于1900年.",
  }),
  phone: z.string().min(5, {
    message: "电话号码必须至少拥有5个字符.",
  }),
  address: z.string().min(2, {
    message: "地址必须至少拥有2个字符.",
  }),
  sex: z.preprocess(
    (val) => (val === "1" ? true : val === "0" ? false : val),
    z.union([z.literal(true), z.literal(false), z.string()])
  ),
  allergens: z.string(),
  medical_history: z.string(),
});

export function SettingsForm({
  data,
  onSuccess,
}: {
  data: PatientInfo | null;
  onSuccess: () => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      height: 0,
      weight: 0,
      birthday: new Date(),
      sex: true,
      phone: "",
      address: "",
      allergens: "",
      medical_history: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        height: data.height,
        weight: data.weight,
        birthday: data.birthday ? new Date(data.birthday) : new Date(),
        sex: data.sex === "男" ? true : false,
        phone: data.phone,
        address: data.address,
        allergens: data.allergens,
        medical_history: data.medical_history,
      });
    }
  }, [data, form]);
  const { toast } = useToast();
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    post("/api/patient/update", data)
      .then(() => {
        toast({
          title: "更新成功",
          description: "个人信息已更新",
        });
        onSuccess(); // 调用回调函数
      })
      .catch((error) => {
        console.error("Error:", error);
        toast({
          title: "更新失败",
          description: "网络错误，请稍后重试",
          variant: "destructive",
        });
      })
      .finally(() => {
        form.reset();
      });
  };

  return (
    <div className="w-full px-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* 基础信息部分 */}
          <div className="space-y-6">
            <section className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
                个人基础信息
              </span>
              <span className="text-teal-500">👤</span>
            </section>

            {/* 姓名和电话 */}
            <div className="grid grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 dark:text-zinc-300">
                      真实姓名
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="真实姓名..."
                        {...field}
                        className="bg-white dark:bg-zinc-900"
                      />
                    </FormControl>
                    <FormDescription className="text-zinc-500 dark:text-zinc-400">
                      请在这里输入您的真实姓名
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 dark:text-zinc-300">
                      电话号码
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        onChange={field.onChange}
                        defaultCountry="CN"
                        placeholder="请输入电话号码"
                        international
                        withCountryCallingCode
                        value={field.value as E164Number | undefined}
                        className="text-zinc-500 h-10 rounded-md dark:text-zinc-200 dark:border-zinc-700 border border-zinc-200 font-mono bg-white dark:bg-zinc-900"
                      />
                    </FormControl>
                    <FormDescription className="text-zinc-500 dark:text-zinc-400">
                      请在这里输入您的电话号码
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 地址和性别 */}
            <div className="grid grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 dark:text-zinc-300">
                      地址
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="浙江省温州市..."
                        {...field}
                        className="bg-white dark:bg-zinc-900"
                      />
                    </FormControl>
                    <FormDescription className="text-zinc-500 dark:text-zinc-400">
                      请在这里输入您的地址
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-zinc-700 dark:text-zinc-300">
                      性别
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        className="flex px-3 gap-3"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0 border p-2 rounded-lg">
                          <FormControl>
                            <RadioGroupItem value="1" />
                          </FormControl>
                          <FormLabel className="font-normal text-zinc-700 dark:text-zinc-300">
                            男
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 border p-2 rounded-lg">
                          <FormControl>
                            <RadioGroupItem value="0" />
                          </FormControl>
                          <FormLabel className="font-normal text-zinc-700 dark:text-zinc-300">
                            女
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 border p-2 rounded-lg">
                          <FormControl>
                            <RadioGroupItem value="none" />
                          </FormControl>
                          <FormLabel className="font-normal text-zinc-700 dark:text-zinc-300">
                            其他
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 生日选择器 */}
            <div className="w-[45%]">
              <div className="flex items-center gap-2 rounded-md border border-zinc-200 dark:border-zinc-700 h-10 bg-white dark:bg-zinc-900 px-3">
                <Image
                  src="/icons/calendar.svg"
                  height={20}
                  width={20}
                  alt="calendar"
                  className="filter-black dark:filter-white"
                />
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date as Date)}
                      className="border-none text-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 font-mono w-full"
                      dateFormat="yyyy-MM-dd"
                      timeInputLabel="Time:"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* 医疗信息部分 */}
          <div className="space-y-6 pt-4">
            <section className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
                个人医疗信息
              </span>
              <span className="text-teal-500">🏥</span>
            </section>

            {/* 身高体重 */}
            <div className="grid grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700 dark:text-zinc-300">
                      身高（cm）
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="font-mono text-md bg-white dark:bg-zinc-900"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
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
                    <FormLabel className="text-zinc-700 dark:text-zinc-300">
                      体重（kg）
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="font-mono text-md bg-white dark:bg-zinc-900"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 过敏源和病史 */}
            <div className="grid grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="allergens"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="allergens"
                      className="text-zinc-700 dark:text-zinc-300"
                    >
                      过敏源
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        id="allergens"
                        placeholder="牛奶，花生..."
                        {...field}
                        className="bg-white dark:bg-zinc-900"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="medical_history"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="medical_history"
                      className="text-zinc-700 dark:text-zinc-300"
                    >
                      过往病史
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        id="medical_history"
                        placeholder="高血压..."
                        {...field}
                        className="bg-white dark:bg-zinc-900"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 transition-all duration-200 ease-in-out"
            >
              <span className="flex items-center gap-2">
                <span>保存信息</span>
                <span>📄</span>
              </span>
            </Button>
          </div>
        </form>
      </Form>

      {/* 页脚 */}
      <div className="flex justify-between items-center mt-10 pb-6">
        <div className="text-zinc-500 dark:text-zinc-400">
          ©2024 慧医智慧医疗系统
        </div>
      </div>
    </div>
  );
}
