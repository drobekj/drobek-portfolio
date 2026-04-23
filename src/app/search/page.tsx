import { SearchClient } from "./searchClient";

export default function SearchPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Search</h1>

      <p className="mt-2 text-sm text-gray-500">
        Search by title, tags, year, or type across all sections.
      </p>

      <div className="mt-8">
        <SearchClient />
      </div>
    </div>
  );
}