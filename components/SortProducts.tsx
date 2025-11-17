"use client";
import { ArrowUpDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

const SortProducts = () => {
  const [sort, setSort] = useState("asc");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const nextValue = sort == "asc" ? "desc" : "asc";
  function handleSort() {
    setSort(nextValue);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", String(nextValue));

    router.replace(pathname + "?" + params.toString());
  }
  return (
    <Button onClick={handleSort} variant={"ghost"} asChild>
      <div>
        <ArrowUpDown /> {sort} price
      </div>
    </Button>
  );
};

export default SortProducts;
