import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { uploadToCloudinary } from "../utils/uploadToCloudnary";

interface ErrorResponse {
  error?: string;
  message?: string;
}

export default function UpdateBlog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const authToken = localStorage.getItem("token");
        if (!authToken) {
          toast.error("Authentication token is missing. Please log in.");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:8787/api/v1/blog/${id}`,
          {
            headers: {
              Authorization: `${authToken}`,
            },
          }
        );

        if (response.data) {
          const blogData = response.data.blog;
          setTitle(blogData.title);
          setDescription(blogData.description);
          setContent(blogData.content);
          setTag(blogData.tag);
          setCurrentImageUrl(blogData.imageUrl);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Failed to load blog data");
      } finally {
        setFetching(false);
      }
    };

    fetchBlogData();
  }, [id, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (title.length > 100) {
      toast.error("Title must be less than 100 characters");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (description.length > 200) {
      toast.error("Description must be less than 200 characters");
      return;
    }
    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }
    if (!tag.trim()) {
      toast.error("Tag is required");
      return;
    }
    if (tag.length > 10) {
      toast.error("Tag must be less than 10 characters");
      return;
    }

    try {
      setLoading(true);
      const authToken = localStorage.getItem("token");

      if (!authToken) {
        toast.error("Authentication token is missing. Please log in.");
        return;
      }

      let imageUrlToUse = currentImageUrl;
      
      if (image) {
        try {
          toast.loading("Uploading new image...");
          imageUrlToUse = await uploadToCloudinary(image);
          toast.dismiss();
        } catch (error) {
          toast.error("Failed to upload new image");
          console.error("Image upload error:", error);
          return;
        }
      }

      const response = await axios.put(
        "http://localhost:8787/api/v1/blog/edit-blog",
        {
          title,
          content,
          description,
          tag,
          imageUrl: imageUrlToUse,
          blogId: id,
        },
        {
          headers: {
            Authorization: `${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Blog updated successfully!");
        navigate(`/blog/${id}`);
      } else {
        throw new Error(response.data.error || "Failed to update blog");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data as ErrorResponse;
        toast.error(
          errorData.error || errorData.message || "Error updating blog."
        );
      } else {
        toast.error("Error updating blog.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    );
  }
  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-black text-white rounded-lg shadow-md">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Update Blog Post</h1>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 flex items-center gap-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 disabled:bg-gray-500 cursor-pointer transition duration-300 ease-in-out"
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
            {loading ? "Updating..." : "Update Post"}
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-400 mb-2">Featured Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-white file:bg-gray-800 file:border-0 file:py-2 file:px-4 file:rounded-full file:text-white file:cursor-pointer file:hover:bg-gray-700"
            />
            {(image || currentImageUrl) && (
              <div className="mt-4">
                <p className="text-gray-400">Image Preview:</p>
                <img
                  src={image ? URL.createObjectURL(image) : currentImageUrl}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg border border-gray-700"
                />
              </div>
            )}
          </div>

          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full text-4xl font-bold bg-gray-900 text-white border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
              maxLength={100}
            />
            <p className="text-gray-500 text-sm mt-1">
              {title.length}/100 characters
            </p>
          </div>

          <div>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Tag (e.g., technology, lifestyle)"
              className="w-full bg-gray-900 text-white border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
              maxLength={10}
            />
            <p className="text-gray-500 text-sm mt-1">
              {tag.length}/10 characters
            </p>
          </div>

          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of your blog"
              className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-gray-600"
              maxLength={200}
              rows={3}
            />
            <p className="text-gray-500 text-sm mt-1">
              {description.length}/200 characters
            </p>
          </div>

          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your story here..."
              className="w-full h-64 bg-gray-900 text-white border border-gray-700 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}