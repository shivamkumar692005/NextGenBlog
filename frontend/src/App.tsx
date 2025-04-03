import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Auth from "./components/Auth";
import Home from "./pages/Home";
import BlogList from "./components/BlogList";
import Right from "./components/Right";

const Signup = lazy(() => import("./pages/Signup"));
const Signin = lazy(() => import("./pages/Signin"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const CreateBlog = lazy(() => import("./pages/CreateBlog"));
const UpdateBlog = lazy(() => import("./pages/UpdateBlog"));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);


  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
        <Routes>
          <Route 
            path="/" 
            element={<Home left={<BlogList />} right={<Right />} />} 
          />
          <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signin" element={<Signin setIsLoggedIn={setIsLoggedIn} />} />
          
          {/* Protected Routes */}
          <Route element={<Auth />}>
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/blog/create" element={<CreateBlog />} />
            <Route path="/blog/edit/:id" element={<UpdateBlog />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;