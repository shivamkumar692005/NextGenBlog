import { Hono } from "hono";
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {  sign } from 'hono/jwt'
import bcrypt from 'bcryptjs';


export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string
    SECRET: string
  }
}>()


userRouter.post('/signup', async (c) => {
  const body = await c.req.json();
  const { email, password, name }:{email:string,password:string,name:string|undefined }= body;
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