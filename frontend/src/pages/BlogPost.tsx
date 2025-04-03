import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

interface BlogData {
  id: string;
  title: string;
  content: string;
  description: string;
  tag: string;
  imageUrl: string;
  published: boolean;
  author: {
    name: string;
    email: string;
  };
}

export default function BlogPost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const authToken = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8787/api/v1/blog/${id}`,
          {
            headers: authToken ? { Authorization: `${authToken}` } : {},
          }
        );

        if (response.data?.blog) {
          setBlog(response.data.blog);
        } else {
          setError("Blog data not found");
        }

        if (response.data?.isUser) {
          setIsAuthor(true);
        } else {
          setIsAuthor(false);
        }
      } catch (err) {
        toast.error("Failed to load blog data");
        console.error("Error fetching blog:", err);
        setError("Failed to load blog data");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">{error || "Blog Not Found"}</h1>
      </div>
    );
  }

  return (
    <div className="w-full bg-black text-white">
      <div className="absolute top-20 right-2 md:right-30 p-4">
        {isAuthor && (
          <button
            className="px-5 py-2 border border-gray-600 rounded-full hover:bg-gray-600 hover:text-white transition duration-300 ease-in-out cursor-pointer"
            onClick={() => navigate(`/blog/edit/${blog.id}`)}
          >
            Update
          </button>
        )}
      </div>
      <div className="min-h-screen bg-black text-white px-6 py-8 max-w-2xl mx-auto pt-10 md:pt-16">
        <h1 className="text-4xl font-bold">{blog.title}</h1>

        <div className="flex items-center space-x-4 mt-4">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              blog.author.name
            )}&background=random`}
            alt="Author"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold">{blog.author.name}</p>
            <p className="text-gray-400 text-sm">{blog.author.email}</p>
          </div>
        </div>

        <div className="mt-3">
          <span className="inline-block bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
            {blog.tag}
          </span>
        </div>

        {blog.imageUrl && (
          <img
            src={blog.imageUrl}
            alt="Blog"
            className="w-full my-6 rounded-lg"
          />
        )}

        <p className="text-gray-300 text-lg mb-6">{blog.description}</p>

        <div className="prose prose-invert max-w-none">
          {blog.content.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
