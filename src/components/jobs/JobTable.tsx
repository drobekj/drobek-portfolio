import Link from "next/link";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  finalScore: number;
  verdict: string;
  salary: number;
  status: string;
  source: string;
};

type Props = {
  jobs: Job[];
};

export default function JobTable({ jobs }: Props) {
  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="border-b border-gray-200 text-left">
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Score</th>
            <th className="px-4 py-3">Verdict</th>
            <th className="px-4 py-3">Salary</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Source</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => (
            <tr
              key={job.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="px-4 py-3 font-medium">
                <Link
                  href={`/admin/jobs/${job.id}`}
                  className="hover:underline"
                >
                  {job.title}
                </Link>
              </td>

              <td className="px-4 py-3">{job.company}</td>
              <td className="px-4 py-3">{job.location}</td>
              <td className="px-4 py-3 font-semibold">{job.finalScore}</td>
              <td className="px-4 py-3">{job.verdict}</td>
              <td className="px-4 py-3">
                {job.salary.toLocaleString("cs-CZ")} CZK
              </td>
              <td className="px-4 py-3">{job.status}</td>
              <td className="px-4 py-3 text-xs text-gray-500">
                {job.source}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}