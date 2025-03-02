"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { get } from "@/net";

interface PatientContextProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const PatientContext = createContext<PatientContextProps | undefined>(
  undefined
);

export const usePatientContext = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatientContext must be used within a PatientProvider");
  }
  return context;
};

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<any>(null);
  const isRequestingRef = useRef(false); // 防止重复请求的标记

  useEffect(() => {
    const fetchData = async () => {
      // 如果已经在请求中或已经有数据，则不再发起新请求
      if (isRequestingRef.current || data) {
        return;
      }

      isRequestingRef.current = true; // 标记请求开始
      const role = localStorage.getItem("role");

      if (role === "patient") {
        try {
          const result = await get("/api/patient/info");
          if (result) {
            // 确保已有role属性，如果没有则添加
            if (!result.role) {
              result.role = "patient";
            }
            setData(result);
          }
        } catch (error) {
          console.error("Error fetching patient info:", error);
        }
      } else if (role === "doctor") {
        try {
          const result = await get("/api/doctor/info");
          if (result) {
            // 为医生信息添加role属性
            result.role = "doctor";
            setData(result);
          }
        } catch (error) {
          console.error("Error fetching doctor info:", error);
        }
      }

      isRequestingRef.current = false; // 标记请求结束
    };

    fetchData();

    // 清理函数
    return () => {
      // 如果组件卸载，重置请求状态
      isRequestingRef.current = false;
    };
  }, []); // 保持依赖数组为空，确保只在挂载时执行一次

  return (
    <PatientContext.Provider value={{ data, setData }}>
      {children}
    </PatientContext.Provider>
  );
};
