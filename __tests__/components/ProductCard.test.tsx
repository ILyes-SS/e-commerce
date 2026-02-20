import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
    const { fill, ...rest } = props;
    return React.createElement("img", rest);
  },
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
  }) => React.createElement("a", { href, ...rest }, children),
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  CircleArrowDown: () => React.createElement("span", null, "arrow-icon"),
}));

import ProductCard from "@/components/ProductCard";

function createMockProduct(overrides = {}) {
  return {
    id: "p-1",
    name: "Premium Headphones",
    slug: "premium-headphones",
    image: "/headphones.png",
    description: "Great headphones",
    weight: null,
    dimension: null,
    lowStock: 5,
    categoryId: "cat-1",
    brandId: "brand-1",
    variants: [
      {
        id: "v-1",
        price: 5000,
        compareAtPrice: 7000,
        color: null,
        size: null,
        unit: null,
        createdAt: new Date(),
        prodId: "p-1",
      },
    ],
    ...overrides,
  };
}

describe("ProductCard", () => {
  it("should render product name", () => {
    render(<ProductCard product={createMockProduct()} />);
    expect(screen.getByText("Premium Headphones")).toBeInTheDocument();
  });

  it("should render product price", () => {
    render(<ProductCard product={createMockProduct()} />);
    expect(screen.getByText("5000DA")).toBeInTheDocument();
  });

  it("should render compare-at price when available", () => {
    render(<ProductCard product={createMockProduct()} />);
    expect(screen.getByText("7000DA")).toBeInTheDocument();
  });

  it("should not render compare-at price when null", () => {
    const product = createMockProduct({
      variants: [
        {
          id: "v-1",
          price: 5000,
          compareAtPrice: null,
          color: null,
          size: null,
          unit: null,
          createdAt: new Date(),
          prodId: "p-1",
        },
      ],
    });
    render(<ProductCard product={product} />);
    expect(screen.queryByText("7000DA")).not.toBeInTheDocument();
  });

  it("should render product image with correct alt text", () => {
    render(<ProductCard product={createMockProduct()} />);
    const img = screen.getByAltText("Premium Headphones");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/headphones.png");
  });

  it("should link to the correct product page", () => {
    render(<ProductCard product={createMockProduct()} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/product/premium-headphones");
  });

  it("should use the first variant as the default variant", () => {
    const product = createMockProduct({
      variants: [
        { id: "v-1", price: 3000, compareAtPrice: null, prodId: "p-1", createdAt: new Date() },
        { id: "v-2", price: 4000, compareAtPrice: null, prodId: "p-1", createdAt: new Date() },
      ],
    });
    render(<ProductCard product={product} />);
    expect(screen.getByText("3000DA")).toBeInTheDocument();
  });
});
