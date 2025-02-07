import Image from "next/image";
import { usePatientContext } from "@/context/PatientContext";
import { useState, useEffect } from "react";

export const Avatar: React.FC = () => {
  const { data } = usePatientContext();
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    const token = "Bearer " + localStorage.getItem("jwt");
    setAvatarUrl(`http://localhost:8080/api/user/avatar?token=${token}`);
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex gap-3 justify-end items-center">
      <div className="text-right space-y-0.5">
        <div className="flex justify-center items-center gap-2">
          <div className="text-zinc-700 font-mono font-semibold dark:text-zinc-300">
            {data.name}
          </div>
          <div
            className={`"text-sm ${
              data.role === "admin"
                ? "bg-zinc-800 dark:bg-zinc-700"
                : "bg-teal-500 dark:bg-teal-600"
            } text-white px-1.5 rounded-full font-mono"`}
          >
            {data.role ? data.role : "user"}
          </div>
        </div>
        <div className="text-zinc-500 text-sm font-mono text-md">
          {data.phone}
        </div>
      </div>
      <Image
        src={avatarUrl || "/images/default-avatar.png"}
        alt="avatar"
        height={200}
        width={200}
        className="w-11 h-11 rounded-full border border-zinc-500 shadow-md"
        unoptimized
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/images/default-avatar.png";
          target.onerror = null;
        }}
      />
    </div>
  );
};
