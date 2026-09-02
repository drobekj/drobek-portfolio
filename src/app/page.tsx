import Link from "next/link";

const sections = [
  {
    href: "/applications",
    title: "Applications",
    description: "Interactive applications and software projects.",
  },
  {
    href: "/ml-ds",
    title: "ML/DS",
    description: "Machine learning and data science projects.",
  },
  {
    href: "/insurance",
    title: "Insurance",
    description: "Actuarial modeling and insurance systems.",
  },
  {
    href: "/research",
    title: "Research",
    description: "Publications and academic work.",
  },
  {
    href: "/vs",
    title: "University",
    description: "University-level mathematical materials and exercises.",
  },
  {
    href: "/ss",
    title: "High School",
    description: "High school mathematical materials and exercises.",
  },
];

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">
        Portfolio
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        Structured overview of projects and materials.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-2xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-lg font-semibold">
              {s.title}
            </div>

            <div className="mt-3 text-sm text-gray-500">
              {s.description}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}