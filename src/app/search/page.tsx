import { SearchClient } from "./searchClient";

export default function SearchPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Vyhledávání</h1>
      <p className="mt-2 text-sm text-gray-500">
        Hledej podle názvu, tagů, roku nebo typu (SŠ i VŠ).
      </p>

      <div className="mt-6">
        <SearchClient />
      </div>
    </div>
  );
}