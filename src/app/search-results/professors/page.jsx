"use client"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/context/AuthContext";  // Import useAuth
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const supabase = createClient();

export default function ProfessorSearchResults() {
  const { user, setUser } = useAuth();  // Access user from AuthContext
  const [professors, setProfessors] = useState([]);
  const [universityName, setUniversityName] = useState("");
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProfessorsAndUniversity = async () => {
      setLoading(true);

      const universityId = searchParams.get("university");
      const professorName = searchParams.get("professor");

      if (universityId) {
        const { data: universityData, error: universityError } = await supabase
          .from("universities")
          .select("name")
          .eq("university_id", universityId)
          .single();

        if (universityError) {
          console.error("Error fetching university name:", universityError);
        } else {
          setUniversityName(universityData.name);
        }

        if (professorName) {
          const { data: professorData, error: professorError } = await supabase
            .from("professors")
            .select("*")
            .eq("university_id", universityId)
            .ilike("first_name", `%${professorName}%`);

          if (professorError) {
            console.error("Error fetching professors:", professorError);
          } else {
            setProfessors(professorData);
          }
        }
      }

      setLoading(false);
    };

    fetchProfessorsAndUniversity();
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
              {professors.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Professor Results</h2>
                  <ul>
                    {professors.map((professor) => (
                      <li key={professor.professor_id} className="mb-2 p-4 border rounded-lg bg-white">
                        <h3 className="text-black text-xl font-bold">{`${professor.last_name}, ${professor.first_name}`}</h3>
                        <p className="text-gray-600">University: {universityName}</p>
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
