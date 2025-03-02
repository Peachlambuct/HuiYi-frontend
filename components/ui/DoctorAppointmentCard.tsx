import Image from "next/image";
import { AppointSheet } from "../form/AppointSheet";
import Link from "next/link";
import { Button } from "./button";

interface DoctorAppointmentCardProps {
  id: string;
  name: string;
  type: string;
  title: string;
  isSelected?: boolean;
  doctorImg?: string;
}

const DoctorAppointmentCard = ({
  id,
  name,
  type,
  title,
  isSelected = false,
  doctorImg,
}: DoctorAppointmentCardProps) => {
  return (
    <div
      className={`w-[90%] ${
        isSelected
          ? "bg-blue-100 dark:bg-blue-900/30 border-2 border-teal-400 dark:border-teal-500"
          : "bg-zinc-100 dark:bg-zinc-800/80"
      } rounded-xl shadow p-2 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80 transition-colors flex flex-col`}
    >
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <div>
            <Image
              src={
                doctorImg
                  ? `http://localhost:8080/api/file?img=${doctorImg}`
                  : `/images/dr-remirez.png`
              }
              width={100}
              height={100}
              alt="doctor"
              className="w-9 h-9 rounded-2xl"
            />
          </div>
          <div className="text-zinc-800 dark:text-zinc-100">{name}</div>
        </div>
        <div className="relative">
          <div className="text-right text-zinc-600 dark:text-zinc-400 flex gap-2 items-end">
            <div className="">{type}</div>
            <div className="text-sm">{title}</div>
          </div>
          <div className="absolute right-0">
            <AppointSheet id={id} name={name} />
          </div>
        </div>
      </div>

      <div className="flex justify-start mt-2">
        <Link href={`/doctor/${id}/info`}>
          <Button
            variant="ghost"
            className="text-teal-500 hover:text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:text-teal-300 dark:hover:bg-teal-900/20 text-xs h-7 px-2"
          >
            查看详情
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DoctorAppointmentCard;
