import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// Utility: Simple slugify (replace with more robust if needed)
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET /api/article - List all articles
export const getAllArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    res.json(mappedPosts);
  } catch (err) {
    next(err);
  }
};

// GET /api/article/:id - Get article by ID
export const getArticleById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const article = await prisma.post.findUnique({
      where: { id },
    });
    if (!article) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    res.json(article);
  } catch (err) {
    next(err);
  }
};

// POST /api/article - Create an article
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

    if (!title || !content || !authorId) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Provide slug as required by Prisma
    const slug =
      clientSlug && typeof clientSlug === "string" && clientSlug.length > 0
        ? clientSlug
        : slugify(title);

    // Ensure slug is unique in DB
    const exists = await prisma.post.findUnique({ where: { slug } });
    if (exists) {
      res.status(400).json({ error: "Slug already exists" });
      return;
    }

    // Build prisma data object
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
    res.status(201).json(article);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
      return;
    }
    next(err);
  }
};

// PUT /api/article/:id - Update an article
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

    // Check if article exists
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Article not found" });
      return;
    }

    // Prevent slug collision (allow if it's the same article)
    let slug = clientSlug;
    if (typeof slug !== "string" || slug.length === 0) {
      slug = title ? slugify(title) : existing.slug;
    }
    if (slug && slug !== existing.slug) {
      const exists = await prisma.post.findUnique({ where: { slug } });
      if (exists && exists.id !== existing.id) {
        res.status(400).json({ error: "Slug already exists" });
        return;
      }
    }

    // Prepare update data
    const data: Prisma.PostUpdateInput = {
      ...(title && { title }),
      ...(content && { content }),
      ...(excerpt && { excerpt }),
      ...(coverImageUrl && { coverImageUrl }),
      ...(typeof slug === "string" && slug.length > 0 && { slug }),
      ...(published !== undefined
        ? {
            published: Boolean(published),
            publishedAt: published ? new Date() : null,
          }
        : {}),
      updatedAt: new Date(),
      ...(categoryIds && Array.isArray(categoryIds)
        ? {
            categories: {
              deleteMany: {},
              create: categoryIds.map((categoryId: string) => ({
                category: { connect: { id: categoryId } },
              })),
            },
          }
        : {}),
      ...(tagIds && Array.isArray(tagIds)
        ? {
            tags: {
              deleteMany: {},
              create: tagIds.map((tagId: string) => ({
                tag: { connect: { id: tagId } },
              })),
            },
          }
        : {}),
    };

    const article = await prisma.post.update({
      where: { id },
      data,
    });
    res.json(article);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
      return;
    }
    next(err);
  }
};

// DELETE /api/article/:id - Remove an article
export const deleteArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.post.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    // Handle "not found" error code from Prisma
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
      return;
    }
    next(err);
  }
};
