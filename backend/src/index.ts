import { Hono } from 'hono'
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import bcrypt from 'bcryptjs';


const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
    SECRET: string
  }
}>()



app.get('/', (c) => {
  return c.text('Hello Hono!')
})




app.post('/api/v1/user/signup', async (c) => {
  const body = await c.req.json();
  const { email, password } = body;
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
        password: hashedPassword
      }
    })

    return c.json({ messgae: "User Created"}, 200);
  } catch (err) {
    console.error("Error Details:", err);
    return c.json({ message: "Error in creating User", err });
  }
})





app.post('/api/v1/user/signin', async (c) => {

  const body = await c.req.json();
  const { email, password }= body;
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
      name: user.name,
      email: user.email,
      id: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
    }
    console.log("SECRET:", c.env.SECRET);

    const token = await sign(payload, c.env.SECRET);

    return c.json({messgae:"user Sign", token}, 200);
  } catch (err) {
    console.error("Error Details:", err);
    return c.json({ message: "Error in Login User", err });
  }
})



app.post('/api/v1/blog', (c) => {
  return c.json({ message: 'Blog created!' })
})

app.put('/api/v1/blog', (c) => {
  return c.json({ message: 'Blog updated!' })
})

app.get('/api/v1/blog/:id', (c) => {
  return c.json({ message: 'Blog fetched!' })
})

app.get('/api/v1/blog/bulk', (c) => {
  return c.json({ message: 'Blogs fetched!' })
})
export default app
