import { MockProblems } from "@/app/lib/placeholder-data";
import Link from "next/link";
import { ChevronRight, Code2 } from "lucide-react";
import clsx from 'clsx'
export default function ProblemsTable(){
  const problems = MockProblems;

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {problems?.map((problem) => (
              <div key={problem.id} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="text-sm font-medium">{problem.title}</p>
                    <p className="text-xs text-gray-500">{problem.category}</p>
                  </div>
                  <DifficultyBadge difficulty={problem.difficulty} />
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Problem</th>
                <th scope="col" className="px-3 py-5 font-medium">Category</th>
                <th scope="col" className="px-3 py-5 font-medium">Difficulty</th>
                <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {problems?.map((problem) => (
                <tr key={problem.id} className="w-full border-b py-3 text-sm last-of-type:border-none hover:bg-gray-50">
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Code2 className="w-5 h-5 text-gray-400" />
                      <p className="font-bold">{problem.title}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{problem.category}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <DifficultyBadge difficulty={problem.difficulty} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <Link 
                      href={`/dashboard/problems/${problem.id}`}
                      className="flex items-center gap-1 text-blue-600 font-medium hover:underline"
                    >
                      Solve <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  return (
    <span className={clsx(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      {
        'bg-green-100 text-green-800': difficulty === 'Easy',
        'bg-yellow-100 text-yellow-800': difficulty === 'Medium',
        'bg-red-100 text-red-800': difficulty === 'Hard',
        'bg-purple-100 text-purple-800': difficulty === 'Olympic',
      }
    )}>
      {difficulty}
    </span>
  );
}