import { PrismaClient } from "@prisma/client";

// Khai báo biến global để lưu trữ Prisma client
declare global {
  var prisma: PrismaClient | undefined;
}

// Tạo singleton Prisma client
const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Lưu client vào global object trong môi trường development
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// Middleware kiểm soát lỗi của Prisma và logging
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();

  if (process.env.NODE_ENV === "development") {
    console.log(
      `[Prisma Query] ${params.model}.${params.action} - ${after - before}ms`
    );
  }

  return result;
});

export default prisma;
