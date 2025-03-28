import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { RingLoader } from "react-spinners";

interface Author {
  name: string;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  author?: Author;
  readingTime?: number;
  publishedAt?: string;
}

export function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        navigate("/signin");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8787/api/v1/blog/${id}`, {
          headers: {
            Authorization: `${authToken}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch blog");
        const data = await response.json();
        setBlog(data.blog);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  if (loading) return (
    <div className="flex justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <RingLoader size={60} color="black" />
    </div>
  );

  if (error || !blog) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <h2 className="text-2xl font-bold">Blog Not Found</h2>
        <p className="text-gray-500">{error || "The blog you are looking for does not exist."}</p>
        <Link
          to="/"
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
        >
          Go Back Home
        </Link>
      </div>
    );
  }

  const authorName = blog.author?.name || "Unknown";
  const authorInitial = authorName.charAt(0).toUpperCase();
  const bgColor = "bg-blue-500"; 

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">{blog.title}</h1>

      <div className="flex items-center space-x-4 mb-8">
        <div className={`h-12 w-12 flex items-center justify-center rounded-full text-white ${bgColor} text-xl font-bold`}>
          {authorInitial}
        </div>
        <div>
          <div className="font-medium text-gray-900">{authorName}</div>
          <div className="text-sm text-gray-600">
            {format(blog.publishedAt ? new Date(blog.publishedAt) : new Date(), "MMM d, yyyy")} ·{" "}
            {blog.readingTime || 5} min read
          </div>
        </div>
      </div>

      <div className="prose prose-lg max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
    </article>
  );
}
