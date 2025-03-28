import { Link } from "react-router-dom";
import { format } from "date-fns";

interface Blog {
  id: string;
  title: string;
  content: string;
  author?: { name: string };
}

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  const authorName = blog.author?.name || "Unknown Author";
  const authorInitial = authorName.charAt(0).toUpperCase();
  const bgColor = "bg-green-500"; // You can change this to any color

  return (
    <Link
      to={`/blog/${blog.id}`}
      className="group block overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          {/* Circular Avatar with Initial */}
          <div
            className={`h-8 w-8 flex items-center justify-center rounded-full text-white ${bgColor} text-sm font-bold`}
          >
            {authorInitial}
          </div>

          <div className="text-sm text-gray-600">
            <span>{authorName}</span>
            <span className="mx-2">·</span>
            <span>{format(new Date(), "MMM d, yyyy")}</span>
            <span className="mx-2">·</span>
            <span>5 min read</span>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
          {blog.title}
        </h2>
        <p className="text-gray-600 line-clamp-3">
          {blog.content.slice(0, 100)}...
        </p>
      </div>
    </Link>
  );
}
