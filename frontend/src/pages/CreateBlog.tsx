import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export function CreateBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (title.length > 100) {
      toast.error("Title must be less than 100 characters");
      return;
    }

    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    try {
      setLoading(true);
      const authToken = localStorage.getItem("token");

      if (!authToken) {
        toast.error("Authentication token is missing. Please log in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:8787/api/v1/blog/add-blog",
        { title, content },
        {
          headers: {
            Authorization: `${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data);

      if (response.status === 200) {
        toast.success("Blog created successfully!");
        navigate("/blog");
      } else {
        throw new Error(response.data.error || "Failed to create blog");
      }
    } catch (error: any) {
      console.error("Error creating blog:", error.response?.data || error);
      toast.error(error.response?.data?.error || "Error creating blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Create New Story</h1>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 flex items-center gap-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading && (
            <svg
              className="w-5 h-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          )}
          {loading ? "Publishing..." : "Publish"}
        </button>
      </div>

      <div className="space-y-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full text-4xl font-bold border-0 focus:ring-0 placeholder-gray-400"
          maxLength={100}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your story here..."
          className="w-full h-64 border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    </div>
  );
}
