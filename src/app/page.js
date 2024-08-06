"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import LoginForm from "@/components/LoginForm";
import SignUpForm from "@/components/SignUpForm";

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('first_name')
          .eq('email', data.user.email)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError.message);
        } else {
          setUser({ ...data.user, first_name: profileData.first_name });
        }
      }
    };

    fetchUser();
  }, [supabase]);

  const handleLogin = async (email, password) => {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error("Error logging in:", signInError.message);
      return signInError.message;
    } else {
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('first_name')
        .eq('email', email)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError.message);
        return profileError.message;
      } else {
        setUser({ ...signInData.user, first_name: profileData.first_name });
        return null;
      }
    }
  };

  const handleSignUp = async (firstName, lastName, schoolName, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          school_name: schoolName,
        },
      },
    });

    if (error) {
      console.error("Error signing up:", error.message);
      return error.message; // Return the error message
    } else {
      // Fetch the user's profile information immediately after sign-up
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('first_name')
        .eq('email', email)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError.message);
      } else {
        setUser({ ...data.user, first_name: profileData.first_name });
      }

      return null;
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    } else {
      setUser(null);
    }
  };

  const handleModalClose = () => {
    setIsLoginOpen(false);
    setIsSignUpOpen(false);
  };

  const switchToSignUp = () => {
    setIsLoginOpen(false);
    setIsSignUpOpen(true);
  };

  const switchToLogin = () => {
    setIsSignUpOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-900 text-white">
        <div className="container mx-auto flex items-center justify-between p-4">
          <a href="#" className="text-2xl font-bold">
            RateMyProfessor
          </a>
          <div className="flex space-x-4">
            {user ? (
              <>
                <span>Welcome, {user.first_name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Login
                </button>
                <button
                  onClick={() => setIsSignUpOpen(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="bg-blue-200 py-12">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Rate and Review Your Professors
            </h1>
            <p className="text-xl mb-8">
              Find and review your professors to help others make informed
              decisions.
            </p>
            <div className="flex justify-center">
              <input
                type="text"
                placeholder="Search for a professor..."
                className="p-2 w-full md:w-1/2 lg:w-1/3 border border-gray-300 rounded-lg"
              />
              <button className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Search
              </button>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Featured Professors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">
                  Professor John Doe
                </h3>
                <p className="text-gray-700">Department of Mathematics</p>
                <p className="mt-4 text-gray-600">
                  "Professor Doe is an excellent teacher who makes complex
                  topics easy to understand."
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">
                  Professor Jane Smith
                </h3>
                <p className="text-gray-700">Department of History</p>
                <p className="mt-4 text-gray-600">
                  "Professor Smith has a passion for history that makes every
                  class engaging."
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">
                  Professor Alice Johnson
                </h3>
                <p className="text-gray-700">Department of Chemistry</p>
                <p className="mt-4 text-gray-600">
                  "Professor Johnson's lectures are thorough and
                  well-organized."
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 RateMyProfessor Clone. All rights reserved.</p>
        </div>
      </footer>

      {isLoginOpen && (
        <LoginForm
          onLogin={handleLogin}
          onClose={handleModalClose}
          onSwitchToSignUp={switchToSignUp}
        />
      )}

      {isSignUpOpen && (
        <SignUpForm
          onSignUp={handleSignUp}
          onClose={handleModalClose}
          onSwitchToLogin={switchToLogin}
        />
      )}
    </div>
  );
}
