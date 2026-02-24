import Link from "next/link";

type Crumb = {
  href: string;
  label: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="mb-6 text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-2">
            {i > 0 && <span>/</span>}
            {i < items.length - 1 ? (
              <Link href={item.href} className="hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}