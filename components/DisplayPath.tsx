"use client";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function DisplayPath() {
  const path = usePathname();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {path.split("/").map((item, index) => (
          <>
            <BreadcrumbItem key={item}>
              <BreadcrumbLink
                href={path
                  .split("/")
                  .slice(0, index + 1)
                  .join("/")}
              >
                {item.replaceAll("%20", " ")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < path.split("/").length - 1 && (
              <BreadcrumbSeparator key={item + "separator"} />
            )}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default DisplayPath;
