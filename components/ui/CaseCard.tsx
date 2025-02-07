import Link from "next/link";

interface CaseCardProps {
  cid: string;
  name: string;
  date: string;
  doctor_say: string;
}

const CaseCard = ({ cid, name, date, doctor_say }: CaseCardProps) => {
  return (
    <div className="p-8">
      <div className="bg-slate-50 dark:bg-zinc-800/80 shadow-md rounded-xl p-4">
        <div className="flex justify-between items-end">
          <div className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
            {name ? name : "主治医师还未填写病历单"}
          </div>
          <div className="text-xl font-mono text-zinc-700 dark:text-zinc-300">
            {date}
          </div>
        </div>
        {name && (
          <div className="flex justify-between items-end">
            <div className="mt-4 space-x-4 max-w-[80%] ">
              <span className="text-lg text-zinc-800 dark:text-zinc-200">
                医嘱:
              </span>
              <div className="mt-2 line-clamp-3 text-justify underline underline-offset-4 indent-8 text-zinc-700 dark:text-zinc-300">
                {doctor_say}
              </div>
            </div>
            <Link
              className="text-teal-400 hover:text-teal-500 dark:text-teal-500 dark:hover:text-teal-400"
              href={`/cases/${cid}/info`}
            >
              查看详情
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseCard;
