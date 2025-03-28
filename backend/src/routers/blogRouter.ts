import { Hono } from "hono"
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'


export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
        SECRET: string
    },
    Variables: {
        userId: string
    }
}>()



blogRouter.get('/bulk', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())

        const page = Number(c.req.query('page')) || 1;
        const limit = Number(c.req.query('limit')) || 10;
        const offset = (page - 1) * limit;


        const blogs = await prisma.blog.findMany({
            skip: offset,
            take: limit,
            include: {
                author: {
                    select: {
                        name: true,
                    },
                },
            },

        });


        const totalBlogs = await prisma.blog.count();
        const totalPages = Math.ceil(totalBlogs / limit);

        return c.json({
            data: blogs,
            currentPage: page,
            totalPages,
            totalItems: totalBlogs,
            itemsPerPage: limit,
        });
    } catch (err) {
        console.error("Error Details:", err);
        return c.json({ error: "Error in Fetching Blog", err });
    }
})

blogRouter.use('/*', async (c, next) => {
    try {
        const token = c.req.header('Authorization');

        if (!token) {
            throw new Error("Authorization token is missing");
        }

        const isValid = await verify(token, c.env.SECRET);
        if (isValid) {
            c.set("userId", isValid.id as string)
            await next();
            return;
        }

        await next();

    } catch (err) {
        console.error("Error Details:", err);
        return c.json({ error: "Unauthorized", err, status: 400 });
    }
})


blogRouter.post('/add-blog', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())

        const { title, content } = await c.req.json()

        if (title === "" || content === "" || !title || !content) {
            return c.json({ error: "Please fill all the fields" })
        }
        const userId = c.get('userId')
        const blog = await prisma.blog.create({
            data: {
                title: title,
                content: content,
                authorId: userId
            }
        })

        return c.json({
            msg: "Blog Published",
        }, 200)



    } catch (err) {
        console.error("Error Details:", err);
        return c.json({ error: "Error in posting Blog", err });
    }
})

blogRouter.put('/edit-blog', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())

        const userId = c.get("userId");

        const { title, content, blogId } = await c.req.json();

        if (!title || !content) {
            return c.json({ error: "Please fill all the fields" }, 400);
        }

        const existingBlog = await prisma.blog.findUnique({
            where: { id: blogId },
            select: { authorId: true }
        });

        if (!existingBlog) {
            return c.json({ error: "Blog not found" }, 404);
        }

        if (existingBlog.authorId !== userId) {
            return c.json({ error: "You are not authorized to edit this blog" }, 403);
        }
        await prisma.blog.update({
            where: { id: blogId },
            data: { title, content }
        });

        return c.json({ msg: "Blog updated successfully" }, 200);

    } catch (err) {
        console.error("Error Details:", err);
        return c.json({ error: "Error in updating Blog", err }, 500);
    }
});


blogRouter.get('/:id', async (c) => {
    const id = c.req.param('id')

    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())
        const blog = await prisma.blog.findFirst({
            where: {
                id: id
            },
            include: {
                author: {
                    select: {
                        name: true,
                        email: true
                    },
                },
            },
        })

        return c.json({
            blog
        }, 200)
    }
    catch (e) {
        c.status(404)
        return c.json({
            msg: "Internal Server Error"
        })
    }
})
