import Image from "next/image";
import { usePatientContext } from "@/context/PatientContext";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export const Avatar: React.FC = () => {
  const { data } = usePatientContext();
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = "Bearer " + localStorage.getItem("jwt");
    setAvatarUrl(`http://localhost:8080/api/user/avatar?token=${token}`);
  }, []);

  // 处理点击头像外部区域时关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    router.push("/patient/settings");
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    router.push("/");
    setIsDropdownOpen(false);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="flex gap-3 justify-end items-center relative"
      ref={dropdownRef}
    >
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
      <div className="relative">
        <Image
          src={avatarUrl || "/images/default-avatar.png"}
          alt="avatar"
          height={200}
          width={200}
          className="w-11 h-11 rounded-full border border-zinc-500 shadow-md cursor-pointer hover:opacity-90 transition-opacity"
          unoptimized
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/default-avatar.png";
            target.onerror = null;
          }}
        />

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg py-1 z-50 border border-zinc-200 dark:border-zinc-700">
            {localStorage.getItem("role") === "patient" && (
              <div
                className="px-4 py-2 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer flex items-center gap-2"
                onClick={handleProfileClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-teal-500 dark:text-teal-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                个人信息
              </div>
            )}
            <div className="border-t border-zinc-200 dark:border-zinc-700"></div>
            <div
              className="px-4 py-2 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer flex items-center gap-2"
              onClick={handleLogout}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              退出登录
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
