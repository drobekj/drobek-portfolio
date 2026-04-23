import Link from "next/link";

type PrimaryTopicCardProps = {
  href: string;
  title: string;
  description?: string;
  label?: string;
};

export function PrimaryTopicCard({
  href,
  title,
  description,
  label,
}: PrimaryTopicCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border-2 border-gray-300 bg-gray-50 p-6 shadow-sm transition hover:shadow-md"
    >
      {/* 🔥 TITLE FIRST */}
      <div className="text-lg font-semibold leading-snug">
        {title}
      </div>

      {/* 🔹 SUBTITLE (label) */}
      {label ? (
        <div className="mt-1 text-sm text-gray-600">
          {label}
        </div>
      ) : null}

      {/* 🔹 DESCRIPTION */}
      {description ? (
        <div className="mt-3 text-sm text-gray-500 leading-relaxed">
          {description}
        </div>
      ) : null}
    </Link>
  );
}