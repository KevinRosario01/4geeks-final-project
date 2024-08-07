"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function SearchComponent() {
  const router = useRouter();
  const [schoolName, setSchoolName] = useState("");
  const [professorName, setProfessorName] = useState("");
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [universitySuggestions, setUniversitySuggestions] = useState([]);
  const [professorSuggestions, setProfessorSuggestions] = useState([]);

  const searchUniversities = async (name) => {
    const { data, error } = await supabase
      .from("universities")
      .select("university_id, name")
      .ilike("name", `%${name}%`);

    if (error) {
      console.error("Error searching universities:", error);
    } else {
      setUniversities(data);
      setUniversitySuggestions(data);
    }
  };

  const searchProfessors = async (universityId, name) => {
    const { data, error } = await supabase
      .from("professors")
      .select("professor_id, first_name")
      .eq("university_id", universityId)
      .ilike("first_name", `%${name}%`);

    if (error) {
      console.error("Error searching professors:", error);
    } else {
      setProfessorSuggestions(data);
    }
  };

  const handleSchoolNameChange = (e) => {
    const name = e.target.value;
    setSchoolName(name);
    if (name.length > 2) {
      searchUniversities(name);
    } else {
      setUniversitySuggestions([]);
    }
  };

  const handleProfessorNameChange = (e) => {
    const name = e.target.value;
    setProfessorName(name);
    if (name.length > 2 && selectedUniversity) {
      searchProfessors(selectedUniversity.university_id, name);
    } else {
      setProfessorSuggestions([]);
    }
  };

  const handleProfessorSearch = () => {
    if (selectedProfessor) {
      router.push(`/professor/${selectedProfessor.professor_id}`);
    }
  };

  return (
    <div className="flex justify-center relative">
      {!selectedUniversity ? (
        <>
          <input
            type="text"
            placeholder="Search for a university..."
            className="p-2 w-full md:w-1/2 lg:w-1/3 border border-gray-300 rounded-lg"
            value={schoolName}
            onChange={handleSchoolNameChange}
          />
          {universitySuggestions.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 mt-2 rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3 max-h-60 overflow-y-auto">
              {universitySuggestions.map((university) => (
                <li
                  key={university.university_id}
                  onClick={() => {
                    setSelectedUniversity(university);
                    setUniversitySuggestions([]);
                  }}
                  className="cursor-pointer hover:bg-gray-200 p-2"
                >
                  {university.name}
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search for a professor..."
            className="p-2 w-full md:w-1/2 lg:w-1/3 border border-gray-300 rounded-lg"
            value={professorName}
            onChange={handleProfessorNameChange}
          />
          {professorSuggestions.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 mt-2 rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3 max-h-60 overflow-y-auto">
              {professorSuggestions.map((professor) => (
                <li
                  key={professor.professor_id}
                  onClick={() => {
                    setProfessorName(professor.first_name);
                    setSelectedProfessor(professor);
                    setProfessorSuggestions([]);
                  }}
                  className="cursor-pointer hover:bg-gray-200 p-2"
                >
                  {professor.first_name}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      {selectedProfessor && (
        <button
          onClick={handleProfessorSearch}
          className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      )}
    </div>
  );
}
