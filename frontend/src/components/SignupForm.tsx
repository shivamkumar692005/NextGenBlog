import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";
import { signupInputSchema } from "@shivamkumar692005/type-of-blog";
import { z } from "zod";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import toast from "react-hot-toast";

type SignupFormData = z.infer<typeof signupInputSchema>;

export function SignupForm() {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8787/api/v1/user/signup",
        formData
      );

      if (response.status === 200) {
        toast.success("Account created successfully");
        setFormData({ name: "", email: "", password: "" });
        localStorage.setItem("token", response.data.token);
        // setTimeout(() => {
          navigate("/");
        // }, 1500); 
      }
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data?.message || "Signup failed.");
        toast.error(error.response.data?.message || "Signup failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center px-10">
      <div className="max-w-md w-full">
        <h2 className="text-3xl font-bold">Create an account</h2>
        <p className="text-gray-600 mt-2">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {/* <Toaster position="top-center" /> */}
        <form onSubmit={handleSubmit} className="mt-6">
          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your username"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="shivam@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-200 cursor-pointer flex items-center justify-center"
          >
            {loading ? (
              <>
                Signing Up...{" "}
                <ClipLoader size={20} color="white" className="ml-2" />
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
