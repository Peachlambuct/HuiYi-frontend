"use client";

interface AppointTimeCardProps {
  val: number;
  status: string;
  onSelect: (val: number | null) => void;
  isSelected: boolean;
}

const AppointTimeCard: React.FC<AppointTimeCardProps> = ({
  val,
  status,
  onSelect,
  isSelected,
}) => {
  const handleClick = () => {
    if (status !== "1") {
      onSelect(isSelected ? null : val);
    }
  };
  const timeSlot = convertToTimeSlot(val);
  return (
    <div
      className={`h-[40px] rounded-lg shadow flex items-center justify-between p-2 border dark:border-zinc-700 ${
        status === "1"
          ? "cursor-not-allowed bg-zinc-100 dark:bg-zinc-800"
          : "hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer bg-white dark:bg-zinc-800/90"
      } ${
        isSelected
          ? "bg-teal-200 dark:bg-teal-800 border-teal-400 dark:border-teal-600"
          : ""
      }`}
      onClick={handleClick}
    >
      <div
        className={`text-sm font-mono ${
          isSelected
            ? "text-teal-900 dark:text-teal-100 font-medium"
            : "text-zinc-800 dark:text-zinc-200"
        }`}
      >
        {timeSlot}
      </div>
      <div
        className={`h-2 w-2 rounded-full ${
          status === "1" ? "bg-red-500" : "bg-green-500"
        }`}
      ></div>
    </div>
  );
};

const convertToTimeSlot = (val: number): string => {
  const timeSlots = [
    "8:00 - 9:00",
    "9:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
  ];

  return timeSlots[val - 1] || "Invalid time slot";
};

export default AppointTimeCard;
