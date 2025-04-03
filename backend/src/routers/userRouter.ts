import { Hono } from "hono";
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
import bcrypt from 'bcryptjs';


export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string
    SECRET: string
  }
}>()


userRouter.post('/signup', async (c) => {
  const body = await c.req.json();
  const { email, password, name }: { email: string, password: string, name: string | undefined } = body;
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())



    const userExits = await prisma.user.findFirst({
      where: {
        email: email
      }
    })

    if (userExits) {
      return c.json({ message: "User Exists" }, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name
      }
    })

    const payload = {
      id: newUser.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
    }

    const token = await sign(payload, c.env.SECRET);

    return c.json({ messgae: "User Created", token }, 200);
  } catch (err) {
    console.error("Error Details:", err);
    return c.json({ error: "Error in creating User", err });
  }

})


userRouter.post('/signin', async (c) => {

  const body = await c.req.json();
  const { email, password } = body;
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())


    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if (!user) {
      return c.json({ message: "Invalid Credentials" }, 400)
    }

    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) {
      return c.json({ message: "Invalid Credentials" }, 400)
    }
    const payload = {
      id: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
    }

    const token = await sign(payload, c.env.SECRET);

    return c.json({ messgae: "user Sign", token }, 200);
  } catch (err) {
    console.error("Error Details:", err);
    return c.json({ error: "Error in Login User", err });
  }
})



userRouter.get('/me', async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const authHeader = c.req.header('Authorization');

    if (!authHeader) {
      return c.json({ error: "Unauthorized: No token provided" }, 401);
    }

    const token = authHeader;

    if (!token) {
      return c.json({ error: "Unauthorized: Invalid token format" }, 401);
    }

    let decoded: { id: string } | null = null;
    try {
      decoded = await verify(token, c.env.SECRET) as { id: string };
    } catch (err) {
      return c.json({ error: "Unauthorized: Invalid token" }, 401);
    }

    if (!decoded || !decoded.id) {
      return c.json({ error: "Unauthorized: Invalid user data" }, 401);
    }

    const userId = decoded.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true }, 
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ user }, 200);
  } catch (err) {
    console.error("Error fetching user details:", err);
    return c.json({ error: "Error in getting User", details: (err instanceof Error ? err.message : "Unknown error") }, 500);
  }
});
