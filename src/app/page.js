// Update with Zod for form validation
// add school page
// add professor page
// add professor raiting page

"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";
import LoginForm from "@/components/LoginForm";
import SignUpForm from "@/components/SignUpForm";

const supabase = createClient();
const SearchForm = dynamic(() => import("@/components/SearchForm"), { ssr: false });

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authData?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('first_name, role')
          .eq('email', authData.user.email)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError.message);
        } else {
          setUser({ ...authData.user, first_name: profileData.first_name, role: profileData.role });
        }
      }
    };

    fetchUser();

    // Listen for auth state changes and update user state
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchUser();
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error logging in:", error);
      return error;
    } else {
      setUser(data.user);
      return error;
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
      console.error("Error signing up:", error);
      return error;
    } else {
      setUser(data.user);
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
                {user.role === 'admin' && (
                  <a href="/admin" className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                    Admin Menu
                  </a>
                )}
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
            <h1 className="text-4xl font-bold mb-4">Rate and Review Your Professors</h1>
            <p className="text-xl mb-8">
              Find and review your professors to help others make informed decisions.
            </p>
            <SearchForm />
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Featured Professors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">Professor John Doe</h3>
                <p className="text-gray-700">Department of Mathematics</p>
                <p className="mt-4 text-gray-600">
                  "Professor Doe is an excellent teacher who makes complex topics easy to understand."
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">Professor Jane Smith</h3>
                <p className="text-gray-700">Department of History</p>
                <p className="mt-4 text-gray-600">
                  "Professor Smith has a passion for history that makes every class engaging."
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-2">Professor Alice Johnson</h3>
                <p className="text-gray-700">Department of Chemistry</p>
                <p className="mt-4 text-gray-600">
                  "Professor Johnson's lectures are thorough and well-organized."
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
        <LoginForm onLogin={handleLogin} onClose={handleModalClose} />
      )}

      {isSignUpOpen && (
        <SignUpForm onSignUp={handleSignUp} onClose={handleModalClose} />
      )}
    </div>
  );
}
