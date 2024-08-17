"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // for programmatic navigation if needed
import { createClient } from "@/utils/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const supabase = createClient();

export default function ProfessorPage({ params: { id } }) {
  const [professor, setProfessor] = useState(null);
  const [universityName, setUniversityName] = useState("");
  const [reviews, setReviews] = useState([]);
  const [courses, setCourses] = useState({}); // Store course data in an object keyed by course_id
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfessorData = async () => {
      if (!id) return;

      setLoading(true);

      // Fetch professor data
      const { data: professorData, error: professorError } = await supabase
        .from("professors")
        .select("*")
        .eq("professor_id", id)
        .single();

      if (professorError) {
        console.error("Error fetching professor data:", professorError);
      } else {
        setProfessor(professorData);

        // Fetch university name based on university_id
        const { data: universityData, error: universityError } = await supabase
          .from("universities")
          .select("name")
          .eq("university_id", professorData.university_id)
          .single();

        if (universityError) {
          console.error("Error fetching university name:", universityError);
        } else {
          setUniversityName(universityData.name);
        }

        // Fetch reviews related to the professor
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select("*")
          .eq("professor_id", id);

        if (reviewsError) {
          console.error("Error fetching reviews:", reviewsError);
        } else {
          setReviews(reviewsData);

          // Fetch related courses based on course_id in reviews
          const courseIds = reviewsData.map(review => review.course_id);
          const { data: coursesData, error: coursesError } = await supabase
            .from("courses") // Update the table name to 'courses'
            .select("*")
            .in("course_id", courseIds);

          if (coursesError) {
            console.error("Error fetching courses:", coursesError);
          } else {
            const coursesMap = {};
            coursesData.forEach(course => {
              coursesMap[course.course_id] = course;
            });
            setCourses(coursesMap);
          }
        }
      }

      setLoading(false);
    };
  

    fetchProfessorData();
  }, [id]);

  if (loading || !professor) {
    return <div>Loading...</div>;
  }

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-gray-100 p-6">
        <div className="container mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-black">
                {professor.first_name} {professor.last_name}
              </h1>
              <p className="text-gray-600">
                Professor in the {professor.department} department at{" "}
                {universityName} {/* Display university name */}
              </p>
              <p className="text-2xl font-bold text-green-600">
                {professor.overall_rating}/5
              </p>
              <p className="text-gray-600">{reviews.length} reviews</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-green-600">
                {professor.would_take_again_percentage}%
              </p>
              <p className="text-gray-600">Would take again</p>
              <p className="text-xl font-bold text-red-600">
                {professor.difficulty_level}
              </p>
              <p className="text-gray-600">Level of difficulty</p>
            </div>
          </div>

          <div className="flex">
            <div className="flex-grow">
              <h2 className="text-2xl font-bold mb-4 text-black">
                Rating Distribution
              </h2>
              {/* Placeholder for rating distribution chart */}
              <div className="bg-gray-200 p-4 rounded-lg h-24"></div>
            </div>
            <div className="flex-grow ml-6">
              <h2 className="text-2xl font-bold mb-4 text-black">
                Professor's Top Tags
              </h2>
              {/* Placeholder for tags */}
              <div className="flex flex-wrap">
                {["Caring", "Gives Good Feedback", "Respected"].map(
                  (tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg mr-2 mb-2"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Rate
            </button>
            <button className="px-4 py-2 border border-gray-600 text-gray-600 bg-white rounded-lg hover:bg-gray-200">
              Compare
            </button>
            <button className="px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200">
              I'm Professor {professor.last_name}
            </button>
          </div>

          <hr className="my-6" />

          <div>
            <h2 className="text-2xl font-bold mb-4 text-black">
              Student Reviews
            </h2>
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold text-black">17 Student Reviews</p>
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-black bg-white">
                <option className="text-black">All courses</option>
                {Object.values(courses).map(course => (
                  <option key={course.course_id} className="text-black">
                    {course.course_code}
                  </option>
                ))}
              </select>
            </div>

            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-lg shadow mb-4 flex"
                >
                  {/* Quality and Difficulty Ratings */}
                  <div className="flex-shrink-0 text-center mr-6">
                    <div className="bg-green-200 p-4 rounded-lg mb-2">
                      <p className="text-lg font-bold text-green-600">QUALITY</p>
                      <p className="text-2xl font-bold text-black">
                        {review.rating
                          ? review.rating.toFixed(1)
                          : "N/A"}
                      </p>
                    </div>
                    <div className="bg-red-200 p-4 rounded-lg">
                      <p className="text-lg font-bold text-red-600">DIFFICULTY</p>
                      <p className="text-2xl font-bold text-black">
                        {review.difficulty
                          ? review.difficulty.toFixed(1)
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Course and Review Details */}
                  <div className="flex-grow">
                    <p className="text-lg font-bold text-black">
                      {courses[review.course_id]?.course_code || "Unknown Course"}
                    </p>
                    <p className="text-sm text-black">
                      For Credit:{" "}
                      <span className="font-bold text-black">
                        {review.for_credit ? "Yes" : "No"}
                      </span>
                      {"  "}Attendance:{" "}
                      <span className="font-bold text-black">
                        {review.attendance ? "Mandatory" : "Not Mandatory"}
                      </span>
                      {"  "}Grade:{" "}
                      <span className="font-bold text-black">
                        {review.grade_received || "A"}
                      </span>{" "}
                      Textbook:{" "}
                      <span className="font-bold text-black">
                        {review.textbook_required ? "Yes" : "N/A"}
                      </span>
                    </p>
                    <p className="text-sm text-black">
                      {formatDate(review.created_at) || "Jul 23rd, 2024"} {/* Placeholder date */}
                    </p>
                    <p className="mt-2 text-black">
                      {review.text_review ||
                        "Professor Delgado is very chill. Attendance is taken at the beginning but the lectures were mostly reading off PowerPoints. Apart from that, it's 3 lengthy individual assignments that must be in MLA format and 3 lengthy & bulky group projects. But in the end, the midterm and final are open book."}
                    </p>
                    <div className="mt-2 flex flex-wrap space-x-2">
                      {["GROUP PROJECTS", "LOTS OF HOMEWORK", "GRADED BY FEW THINGS"].map(
                        (tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="bg-gray-200 text-gray-800 px-2 py-1 rounded-lg"
                          >
                            {tag}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Review Actions */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <p className="text-sm text-black">Helpful</p>
                      <button className="text-gray-600 hover:text-black">
                        <i className="fas fa-thumbs-up"></i>
                      </button>
                      <span className="text-sm text-black">0</span>
                      <button className="text-gray-600 hover:text-black">
                        <i className="fas fa-thumbs-down"></i>
                      </button>
                      <span className="text-sm text-black">0</span>
                    </div>
                    <button className="text-gray-600 hover:text-black mt-2">
                      <i className="fas fa-bookmark"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-black">No reviews available.</p>
            )}
          </div>

          {/* Placeholder for Similar Professors section */}
          <hr className="my-6" />
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold text-black mb-4">
              Check out Similar Professors in the Computer Science Department
            </h2>
            <div className="flex space-x-4">
              {["Carlos Guerrero", "Cesar Zapata", "Christopher Marte"].map(
                (prof, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow text-center"
                  >
                    <p className="text-lg font-bold text-black">{prof}</p>
                    <p className="text-blue-600 text-xl">5.0</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
