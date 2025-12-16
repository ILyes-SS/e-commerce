"use client"; // Required to use hooks

import { useParams } from "next/navigation";
const NotFound = () => {
  const params = useParams();
  const { productSlug } = params;
  return <div>Product {productSlug} not found</div>;
};

export default NotFound;
