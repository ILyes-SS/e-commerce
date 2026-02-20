import { vi } from "vitest";

// Deep mock of all Prisma model methods
const createModelMock = () => ({
  findMany: vi.fn(),
  findUnique: vi.fn(),
  findFirst: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  updateMany: vi.fn(),
  updateManyAndReturn: vi.fn(),
  upsert: vi.fn(),
  delete: vi.fn(),
  deleteMany: vi.fn(),
  count: vi.fn(),
  aggregate: vi.fn(),
});

const prismaMock = {
  cart: createModelMock(),
  cartItem: createModelMock(),
  product: createModelMock(),
  productVariant: createModelMock(),
  productImage: createModelMock(),
  stock: createModelMock(),
  category: createModelMock(),
  brand: createModelMock(),
  order: createModelMock(),
  orderProd: createModelMock(),
  wilaya: createModelMock(),
  carouselSlide: createModelMock(),
  trending: createModelMock(),
  user: createModelMock(),
  wishlist: createModelMock(),
  $transaction: vi.fn((fn: (tx: typeof prismaMock) => Promise<unknown>) =>
    fn(prismaMock)
  ),
};

vi.mock("@/lib/prisma", () => ({
  default: prismaMock,
}));

export default prismaMock;
