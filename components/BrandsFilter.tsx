"use client";
import { Brand } from "@/app/generated/prisma";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

const BrandsFilter = ({ brandsList }: { brandsList: Brand[] }) => {
  const [brands, setBrands] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function handleFilter() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("brands");
    brands.forEach((title) => {
      params.append("brands", title);
    });
    router.replace(pathname + "?" + params.toString());
  }

  return (
    <div>
      {brandsList.map((brand) => (
        <div className="flex gap-2" key={brand.id}>
          <input
            type="checkbox"
            value={brand.title}
            checked={brands.includes(brand.title)}
            onChange={(e) =>
              setBrands(
                e.target.checked
                  ? [...brands, brand.title]
                  : brands.filter((b) => b !== brand.title)
              )
            }
          />
          <label>{brand.title}</label>
        </div>
      ))}
      <Button onClick={handleFilter}>Filter</Button>
    </div>
  );
};

export default BrandsFilter;
