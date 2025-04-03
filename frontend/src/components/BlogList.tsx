import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BlogCard } from "./BlogCard";
import axios from "axios";
import toast from "react-hot-toast";

interface Blog {
  id: string;
  title: string;
  description: string;
  tag: string;
  imageUrl: string;
  author: {
    name: string;
  };
  createdAt: string;
}

export default function BlogList() {
  const [activeTab, setActiveTab] = useState("For you");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = ["For you", "Coding", "Technology", "Programming"];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:8787/api/v1/blog/bulk");
        setBlogs(response.data.data || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const enhancedBlogs = blogs.map(blog => ({
    ...blog,
    views: Math.floor(Math.random() * 1000000).toLocaleString() + " views",
    comments: Math.floor(Math.random() * 1000),
    date: new Date(blog.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }),
    category: blog.tag || "For you"
  }));

  const filteredPosts =
    activeTab === "For you"
      ? enhancedBlogs
      : enhancedBlogs.filter((post) => post.category === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      <nav className="border-b border-gray-800 pb-4 mb-6 sticky top-17 bg-black z-10">
        <ul className="flex space-x-6 text-gray-400">
          {categories.map((category) => (
            <li
              key={category}
              className={`cursor-pointer ${
                activeTab === category
                  ? "text-white border-b-2 border-white pb-1"
                  : "hover:text-white"
              }`}
              onClick={() => setActiveTab(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </nav>

      <div className="max-w-4xl mx-auto space-y-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <BlogCard
              key={post.id}
              id={post.id}
              author={post.author.name}
              title={post.title}
              description={post.description}
              date={post.date}
              views={post.views}
              comments={post.comments}
              category={post.category}
              image={post.imageUrl || "https://via.placeholder.com/100"}
              onClick={() => navigate(`/blog/${post.id}`)}
            />
          ))
        ) : (
          <p className="text-gray-400 text-center">No posts available in this category.</p>
        )}
      </div>
    </div>
  );
}