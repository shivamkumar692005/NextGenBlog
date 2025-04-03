import { Hono } from 'hono'
import { userRouter } from './routers/userRouter'
import { blogRouter } from './routers/blogRouter'
import { cors } from 'hono/cors'



const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
    SECRET: string
  }
}>()




app.use(cors({
  origin: ['http://localhost:5173', 'https://nextgen-blog.netlify.app'],
  credentials: true
}));


app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter);


export default app
