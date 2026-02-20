import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

// Mock the server actions used internally by CartItemComponent
vi.mock("@/actions/cart", () => ({
  increaseItemQuantityDb: vi.fn().mockResolvedValue({ success: true }),
  decreaseItemQuantityDb: vi.fn().mockResolvedValue({ success: true }),
  removeCartItemDb: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
    const { fill, ...rest } = props;
    return React.createElement("img", rest);
  },
}));

import CartItemComponent from "@/components/CartItemComponent";
import { CartItem } from "@/types";

function createMockItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    id: "v-1",
    title: "Test Product",
    image: "/test.png",
    quantity: 2,
    price: 1500,
    size: "M",
    color: "#ff0000",
    stockQty: 10,
    prodVariantId: "pv-1",
    cartId: "cart-1",
    ...overrides,
  };
}

describe("CartItemComponent", () => {
  const mockIncrease = vi.fn();
  const mockDecrease = vi.fn();
  const mockRemove = vi.fn();

  const renderComponent = (item: CartItem = createMockItem()) =>
    render(
      <CartItemComponent
        item={item}
        increaseItemQuantity={mockIncrease}
        decreaseItemQuantity={mockDecrease}
        removeFromCart={mockRemove}
      />
    );

  it("should render the item title", () => {
    renderComponent();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("should render the computed price (price × quantity)", () => {
    renderComponent(createMockItem({ price: 1500, quantity: 2 }));
    expect(screen.getByText("3000 DA")).toBeInTheDocument();
  });

  it("should render the quantity", () => {
    renderComponent(createMockItem({ quantity: 3 }));
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("should render color swatch when color is set", () => {
    renderComponent(createMockItem({ color: "#ff0000" }));
    expect(screen.getByText("#ff0000")).toBeInTheDocument();
  });

  it("should not render color when color is null", () => {
    renderComponent(createMockItem({ color: null }));
    expect(screen.queryByText("#ff0000")).not.toBeInTheDocument();
  });

  it("should render size label when size is set", () => {
    renderComponent(createMockItem({ size: "XL" }));
    expect(screen.getByText("Size: XL")).toBeInTheDocument();
  });

  it("should not render size when size is null", () => {
    renderComponent(createMockItem({ size: null }));
    expect(screen.queryByText(/Size:/)).not.toBeInTheDocument();
  });

  it("should render product image", () => {
    renderComponent(createMockItem({ image: "/product.png", title: "My Prod" }));
    const img = screen.getByAltText("My Prod");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/product.png");
  });

  it("should call increaseItemQuantity on + click", async () => {
    const user = userEvent.setup();
    renderComponent();

    const plusBtn = screen.getByRole("button", { name: "+" });
    await user.click(plusBtn);

    expect(mockIncrease).toHaveBeenCalledWith("v-1");
  });

  it("should call decreaseItemQuantity on - click", async () => {
    const user = userEvent.setup();
    renderComponent(createMockItem({ quantity: 3 }));

    const minusBtn = screen.getByRole("button", { name: "-" });
    await user.click(minusBtn);

    expect(mockDecrease).toHaveBeenCalledWith("v-1");
  });

  it("should disable decrease button when quantity is 1", () => {
    renderComponent(createMockItem({ quantity: 1 }));

    const minusBtn = screen.getByRole("button", { name: "-" });
    expect(minusBtn).toBeDisabled();
  });

  it("should disable increase button when quantity equals stockQty", () => {
    renderComponent(createMockItem({ quantity: 10, stockQty: 10 }));

    const plusBtn = screen.getByRole("button", { name: "+" });
    expect(plusBtn).toBeDisabled();
  });

  it("should not disable increase button when quantity < stockQty", () => {
    renderComponent(createMockItem({ quantity: 5, stockQty: 10 }));

    const plusBtn = screen.getByRole("button", { name: "+" });
    expect(plusBtn).not.toBeDisabled();
  });
});
