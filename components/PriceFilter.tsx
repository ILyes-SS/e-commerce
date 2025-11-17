"use client";
import { useState } from "react";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PriceFilter = () => {
  const [value, setValue] = useState([0, 10000]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  function handleFilter() {
    const min = value[0] < value[1] ? value[0] : value[1];
    const max = value[0] > value[1] ? value[0] : value[1];
    const params = new URLSearchParams(searchParams.toString());
    params.set("min", String(min));
    params.set("max", String(max));

    router.replace(pathname + "?" + params.toString());
  }

  return (
    <div className="w-[60%] space-y-3">
      <Slider value={value} onValueChange={setValue} max={10000} step={1} />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>
          {value[0]}DA-{value[1]}DA
        </span>
      </div>
      <Button onClick={handleFilter}>Filter</Button>
    </div>
  );
};

export default PriceFilter;
