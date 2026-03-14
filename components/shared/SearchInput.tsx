import { Input } from "@/components/ui/input";

export function SearchInput({ placeholder = "Search..." }: { placeholder?: string }) {
  return <Input placeholder={placeholder} />;
}
