"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const supabase = createClient();

export default function ProfessorSearchResults() {
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
            .select(
              "professor_id, first_name, last_name, department, overall_rating, rating_count, would_take_again_percentage, difficulty_level, bookmark_count"
            )
            .eq("university_id", universityId)
            .or(`first_name.ilike.%${professorName}%,last_name.ilike.%${professorName}%`);

          if (professorError) {
            console.error("Error fetching professors:", professorError);
          } else {
            setProfessors(
              professorData.map((professor) => ({
                ...professor,
                full_name: `${professor.last_name}, ${professor.first_name}`,
              }))
            );
          }
        }
      }

      setLoading(false);
    };

    fetchProfessorsAndUniversity();
  }, [searchParams]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-blue-200">
        <div className="container mx-auto p-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {professors.length > 0 ? (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Professor Results</h2>
                  <ul className="space-y-4">
                    {professors.map((professor) => (
                      <li
                        key={professor.professor_id}
                        className="bg-white p-4 rounded-lg shadow-lg flex items-center"
                      >
                        <div className="flex-shrink-0 bg-green-200 rounded-lg p-4 text-center mr-4">
                          <div className="text-2xl font-bold text-black">
                            {professor.overall_rating ? professor.overall_rating.toFixed(1) : "N/A"} {/* Display the overall rating */}
                          </div>
                          <div className="text-sm text-gray-600">
                            {professor.rating_count} ratings {/* Display the number of ratings */}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-black text-xl font-bold">
                            {professor.full_name || "Professor Name"}
                          </h3>
                          <p className="text-gray-700">
                            {professor.department || "Department Name"} {/* Display department */}
                          </p>
                          <p className="text-gray-500">
                            {universityName || "University Name"} {/* Display university name */}
                          </p>
                          <div className="mt-2">
                            <span className="font-bold text-black">
                              {professor.would_take_again_percentage
                                ? `${professor.would_take_again_percentage}%`
                                : "N/A"} {/* Display the would take again percentage */}
                            </span>{" "}
                            <span className="text-gray-600">
                              would take again |{" "}
                            </span>
                            <span className="font-bold text-black">
                              {professor.difficulty_level || "N/A"} {/* Display the difficulty level */}
                            </span>{" "}
                            <span className="text-gray-600">level of difficulty</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-auto">
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 12h14M12 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>
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
