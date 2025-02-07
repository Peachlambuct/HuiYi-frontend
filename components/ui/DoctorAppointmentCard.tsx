import Image from "next/image";
import { AppointSheet } from "../form/AppointSheet";

interface DoctorAppointmentCardProps {
  id: string;
  name: string;
  type: string;
  title: string;
}

const DoctorAppointmentCard = ({
  id,
  name,
  type,
  title,
}: DoctorAppointmentCardProps) => {
  return (
    <div className="w-[90%] bg-zinc-100 dark:bg-zinc-800/80 rounded-xl shadow p-2 h-[70px] hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80 transition-colors">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <div>
            <Image
              src="/images/dr-remirez.png"
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
    </div>
  );
};

export default DoctorAppointmentCard;
