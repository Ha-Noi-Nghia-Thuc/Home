import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import {
  handlePrismaError,
  sendError,
  sendSuccess,
} from "../lib/response.util";

// Schema xác thực cho việc tạo bài viết
export const createArticleSchema = z.object({
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
  content: z.string().min(10, "Nội dung phải có ít nhất 10 ký tự"),
  excerpt: z.string().optional(),
  coverImageUrl: z.string().url("URL ảnh bìa không hợp lệ").optional(),
  authorId: z.string().min(1, "ID tác giả là bắt buộc"),
  published: z.boolean().optional().default(false),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  slug: z.string().optional(),
});

// Schema xác thực cho việc cập nhật bài viết
export const updateArticleSchema = z.object({
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự").optional(),
  content: z.string().min(10, "Nội dung phải có ít nhất 10 ký tự").optional(),
  excerpt: z.string().optional(),
  coverImageUrl: z.string().url("URL ảnh bìa không hợp lệ").optional(),
  published: z.boolean().optional(),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  slug: z.string().optional(),
});

// Hàm tạo slug từ tiêu đề bài viết
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Lấy tất cả bài viết
export const getAllArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        categories: { include: { category: true } },
        author: true,
      },
      orderBy: { publishedAt: "desc" },
    });

    const mappedPosts = posts.map((post) => ({
      ...post,
      category: post.categories[0]?.category.name ?? "",
      author: post.author
        ? {
            name: post.author.name,
            avatarUrl: post.author.avatarUrl,
          }
        : undefined,
    }));

    sendSuccess(res, { data: mappedPosts });
  } catch (err: any) {
    sendError(
      res,
      {
        message: "Lỗi khi lấy danh sách bài viết",
        meta: { error: err.message },
      },
      500
    );
  }
};

// Lấy bài viết theo ID
export const getArticleById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const article = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!article) {
      sendError(res, { message: "Không tìm thấy bài viết" }, 404);
      return;
    }

    sendSuccess(res, { data: article });
  } catch (err: any) {
    sendError(
      res,
      {
        message: "Lỗi khi lấy thông tin bài viết",
        meta: { error: err.message },
      },
      500
    );
  }
};

// Tạo bài viết mới
export const createArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      content,
      excerpt,
      coverImageUrl,
      authorId,
      published,
      categoryIds,
      tagIds,
      slug: clientSlug,
    } = req.body;

    // Tạo slug từ tiêu đề nếu không cung cấp
    const slug =
      clientSlug && typeof clientSlug === "string" && clientSlug.length > 0
        ? clientSlug
        : slugify(title);

    // Kiểm tra slug có trùng không
    const exists = await prisma.post.findUnique({ where: { slug } });
    if (exists) {
      sendError(res, { message: "Slug đã tồn tại" }, 400);
      return;
    }

    // Chuẩn bị dữ liệu cho Prisma
    const data: Prisma.PostCreateInput = {
      title,
      content,
      slug,
      ...(excerpt && { excerpt }),
      ...(coverImageUrl && { coverImageUrl }),
      author: { connect: { id: authorId } },
      published: Boolean(published),
      publishedAt: published ? new Date() : null,
      ...(categoryIds && Array.isArray(categoryIds)
        ? {
            categories: {
              create: categoryIds.map((categoryId: string) => ({
                category: { connect: { id: categoryId } },
              })),
            },
          }
        : {}),
      ...(tagIds && Array.isArray(tagIds)
        ? {
            tags: {
              create: tagIds.map((tagId: string) => ({
                tag: { connect: { id: tagId } },
              })),
            },
          }
        : {}),
    };

    const article = await prisma.post.create({ data });
    sendSuccess(
      res,
      { message: "Tạo bài viết thành công", data: article },
      201
    );
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        sendError(
          res,
          { message: "Tác giả hoặc danh mục/tag không tồn tại" },
          400
        );
        return;
      }
    }
    handlePrismaError(res, err);
  }
};

// Cập nhật bài viết
export const updateArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const {
      title,
      content,
      excerpt,
      coverImageUrl,
      published,
      categoryIds,
      tagIds,
      slug: clientSlug,
    } = req.body;

    // Kiểm tra bài viết tồn tại
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, { message: "Không tìm thấy bài viết" }, 404);
      return;
    }

    // Xử lý slug
    let slug = existing.slug;
    if (typeof clientSlug === "string" && clientSlug.length > 0) {
      slug = clientSlug;
    } else if (title && title !== existing.title) {
      slug = slugify(title);
    }

    // Kiểm tra slug trùng
    if (slug !== existing.slug) {
      const exists = await prisma.post.findUnique({ where: { slug } });
      if (exists && exists.id !== id) {
        sendError(res, { message: "Slug đã tồn tại" }, 400);
        return;
      }
    }

    // Chuẩn bị dữ liệu cập nhật
    const data: Prisma.PostUpdateInput = {
      ...(title && { title }),
      ...(content && { content }),
      ...(excerpt !== undefined && { excerpt }),
      ...(coverImageUrl !== undefined && { coverImageUrl }),
      ...(slug && { slug }),
      ...(published !== undefined && {
        published: Boolean(published),
        publishedAt: published ? new Date() : null,
      }),
    };

    // Xử lý danh mục nếu được cung cấp
    if (categoryIds && Array.isArray(categoryIds)) {
      // Xóa tất cả liên kết hiện tại
      await prisma.postCategory.deleteMany({
        where: { postId: id },
      });

      // Tạo liên kết mới
      if (categoryIds.length > 0) {
        await Promise.all(
          categoryIds.map((categoryId) =>
            prisma.postCategory.create({
              data: {
                post: { connect: { id } },
                category: { connect: { id: categoryId } },
              },
            })
          )
        );
      }
    }

    // Xử lý tags nếu được cung cấp
    if (tagIds && Array.isArray(tagIds)) {
      // Xóa tất cả liên kết hiện tại
      await prisma.postTag.deleteMany({
        where: { postId: id },
      });

      // Tạo liên kết mới
      if (tagIds.length > 0) {
        await Promise.all(
          tagIds.map((tagId) =>
            prisma.postTag.create({
              data: {
                post: { connect: { id } },
                tag: { connect: { id: tagId } },
              },
            })
          )
        );
      }
    }

    // Cập nhật bài viết
    const article = await prisma.post.update({
      where: { id },
      data,
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    });

    sendSuccess(res, {
      message: "Cập nhật bài viết thành công",
      data: article,
    });
  } catch (err: any) {
    handlePrismaError(res, err);
  }
};

// Xóa bài viết
export const deleteArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;

    // Kiểm tra bài viết tồn tại
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, { message: "Không tìm thấy bài viết" }, 404);
      return;
    }

    // Xóa bài viết (Prisma sẽ tự động xóa các liên kết postCategory, postTag)
    await prisma.post.delete({ where: { id } });

    sendSuccess(res, { message: "Đã xóa bài viết thành công" });
  } catch (err: any) {
    handlePrismaError(res, err);
  }
};
