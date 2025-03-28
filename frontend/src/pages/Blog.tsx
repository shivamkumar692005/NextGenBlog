import { useEffect, useState } from "react";
import axios from "axios";
import { RingLoader } from "react-spinners";
import toast from "react-hot-toast";
import { BlogCard } from "../components/BlogCard";

type Blog = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  author?: { name: string };
};

export function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8787/api/v1/blog/bulk?page=${page}&limit=${postsPerPage}`
        );

        const data = response.data;

        setBlogs(data.data || []);
        setTotalPages(data.totalPages);

        if (data.data.length === 0) {
          toast("No blogs available!", { icon: "📭" });
        }
      } catch {
        setError("Failed to fetch blogs.");
        toast.error("Failed to fetch blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Latest Stories</h1>

      {loading && (
        <div className="flex justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <RingLoader size={60} color="black" />
        </div>
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>

      {page < totalPages && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
          >
            Load More Stories
          </button>
        </div>
      )}
    </div>
  );
}
