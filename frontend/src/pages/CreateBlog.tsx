import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { uploadToCloudinary } from "../utils/uploadToCloudnary";
import axiosClient from "../clint";

interface ErrorResponse {
  error?: string;
  message?: string;
}

export default function CreateBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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
    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      setLoading(true);
      const authToken = localStorage.getItem("token");

      if (!authToken) {
        toast.error("Please log in.");
        return;
      }

      let imageUrl = "";
      if (image) {
        try {
          toast.loading("Uploading image...");
          imageUrl = await uploadToCloudinary(image);
          toast.dismiss();
        } catch (uploadError) {
          toast.dismiss();
          toast.error("Failed to upload image");
          console.error("Image upload error:", uploadError);
          return;
        }
      }

      const response = await axiosClient.post(
        "/blog/add-blog",
        {
          title,
          content,
          description,
          tag,
          imageUrl: imageUrl || "default-image-url", 
        },
        {
          headers: {
            Authorization: `${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Blog created successfully!");
        navigate("/blog");
      } else {
        throw new Error(response.data.error || "Failed to create blog");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data as ErrorResponse;
        toast.error(
          errorData.error || errorData.message || "Error creating blog."
        );
      } else {
        toast.error("Error creating blog.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-black text-white rounded-lg shadow-md">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Create New Story</h1>
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
            {loading ? "Publishing..." : "Publish"}
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
            {image && (
              <div className="mt-4">
                <p className="text-gray-400">Image Preview:</p>
                <img
                  src={URL.createObjectURL(image)}
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
