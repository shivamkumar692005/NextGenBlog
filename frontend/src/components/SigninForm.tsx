import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";
import { signinInputSchema } from "@shivamkumar692005/type-of-blog";
import { z } from "zod";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import toast from "react-hot-toast";
import axiosClient from "../clint";

type SigninFormData = z.infer<typeof signinInputSchema>;

export function SigninForm({setIsLoggedIn}: {setIsLoggedIn: (isLoggedIn: boolean) => void}) {
  const [formData, setFormData] = useState<SigninFormData>({
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

    if (!formData.email || !formData.password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosClient.post(
        "/user/signin",
        formData
      );

      if (response.status === 200) {
        toast.success("welcome back Signed in successfully");
        setFormData({ email: "", password: "" });
        localStorage.setItem("token", response.data.token);
        setIsLoggedIn(true);
        // setTimeout(() => {
          navigate("/");
        // }, 1500); 
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data?.message || "Signin failed.");
        toast.error(error.response.data?.message || "Signin failed.");
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
        <h2 className="text-3xl font-bold">Sign in to your account</h2>
        <p className="text-gray-600 mt-2">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {/* <Toaster position="top-center" /> */}

        <form onSubmit={handleSubmit} className="mt-6">
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
                Signing in... <ClipLoader size={20} color="white" className="ml-2" />
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
