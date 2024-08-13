"use client"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/context/AuthContext";  // Import useAuth
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const supabase = createClient();

export default function SchoolSearchResults() {
  const { user, setUser } = useAuth();  // Access user from AuthContext
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);

      const schoolName = searchParams.get("school");

      if (schoolName) {
        const { data, error } = await supabase
          .from("universities")
          .select("*")
          .ilike("name", `%${schoolName}%`);
        if (error) {
          console.error("Error fetching schools:", error);
        } else {
          setSchools(data);
        }
      }

      setLoading(false);
    };

    fetchSchools();
  }, [searchParams]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    } else {
      setUser(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        user={user}  // Pass the user state to the Header
        handleLogout={handleLogout}  // Pass the logout function to the Header
        openLoginModal={() => console.log("Open Login Modal")}
        openSignUpModal={() => console.log("Open SignUp Modal")}
      />

      <main className="flex-grow bg-blue-200">
        <div className="container mx-auto p-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {schools.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold mb-4">School Results</h2>
                  <ul>
                    {schools.map((school) => (
                      <li key={school.university_id} className="mb-2 p-4 border rounded-lg bg-white">
                        <h3 className="text-black text-xl font-bold">{school.name}</h3>
                        <p className="text-gray-600">{school.location}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No results found.</p>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
