import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";

export default function Login() {

    const [user, setUser] = useState(null);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const supabase = createClient();
    const [loginError, setLoginError] = useState("");
    
    
    const form = useForm({
      defaultValues: {
        email: "",
        password: "",
      },
    });
    
    useEffect(() => {
      const fetchUser = async () => {
        const { data } = await supabase.auth.getUser();
        setUser(data?.user);
      };
    
      fetchUser();
    }, [supabase]);
    
    const handleLogin = async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });
    
      if (error) {
        console.error("Error logging in:", error);
        setLoginError("Invalid login credentials"); // Set error message
      } else {
        setUser(data.user);
        setIsLoginOpen(false);
        setLoginError(""); // Clear error message on successful login
      }
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        {loginError && (
          <p className="text-red-500 font-extrabold mb-4 text-center">
            {loginError}
          </p> // Center the error message
        )}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            {...form.register("email")}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            {...form.register("password")}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => setIsLoginOpen(false)}
            className="text-gray-600 hover:text-gray-800"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  </div>
  );
};