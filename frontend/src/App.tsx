import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast"; 
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { BlogPost } from "./pages/BlogPost";
import { Blog } from "./pages/Blog";
import { CreateBlog } from "./pages/CreateBlog";

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-center"/> 
        <Routes>
          <Route path="/" element={<Blog />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/blog/create" element={<CreateBlog />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
