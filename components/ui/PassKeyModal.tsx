"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export default function PassKeyModal() {
  const router = useRouter();
  const [passkey, setPasskey] = useState("");
  const [Open, setOpen] = useState(true);
  const [error, setError] = useState("");
  const path = usePathname();
  const closeModel = () => {
    setOpen(false);
    router.push("/");
  };
  const jwt = typeof window !== "undefined" && localStorage.getItem("jwt");

  useEffect(() => {
    const accessKey = jwt && "123456";

    if (path) {
      if (accessKey === "123456") {
        setOpen(false);
        router.push("/admin");
      } else {
        setOpen(true);
      }
    }
  }, [jwt]);
  const validatePasskey = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "admin",
        key: passkey,
      }),
    });
    const data = await res.json();
    console.log(res);
    if (data.code === 200) {
      const jwt = data.data.token; // get jwt token
      localStorage.setItem("jwt", jwt);
      setOpen(false);
    } else {
      setError("Error: Invalid passkey");
    }
  };

  return (
    <div>
      <AlertDialog open={Open} onOpenChange={setOpen}>
        <AlertDialogContent className="">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex justify-between text-2xl">
              管理员权限验证
              <Image
                src="/icons/close.svg"
                width={20}
                height={20}
                alt="close"
                onClick={() => closeModel()}
                className="cursor-pointer filter-black"
              />
            </AlertDialogTitle>
            <AlertDialogDescription>
              请先验证管理员密钥才能继续操作
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <InputOTP maxLength={6} value={passkey} onChange={setPasskey}>
              <InputOTPGroup className="w-full flex justify-around">
                <InputOTPSlot
                  index={0}
                  className="h-14 w-12 border rounded-xl border-zinc-300"
                />
                <InputOTPSlot
                  index={1}
                  className="h-14 w-12 border rounded-xl border-zinc-300"
                />
                <InputOTPSlot
                  index={2}
                  className="h-14 w-12 border rounded-xl border-zinc-300"
                />
                <InputOTPSlot
                  index={3}
                  className="h-14 w-12 border rounded-xl border-zinc-300"
                />
                <InputOTPSlot
                  index={4}
                  className="h-14 w-12 border rounded-xl border-zinc-300"
                />
                <InputOTPSlot
                  index={5}
                  className="h-14 w-12 border rounded-xl border-zinc-300"
                />
              </InputOTPGroup>
            </InputOTP>

            {error && (
              <p className="text-sm text-red-400 font-mono mt-4 flex justify-center">
                {error}
              </p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={(e) => validatePasskey(e)}
              className="w-full "
            >
              验证动态密钥
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
