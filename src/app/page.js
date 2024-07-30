import { Signout } from "@/components/Signout";
import { createClient } from "../utils/supabase/server";

export default async function Home() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  //let { data: branches, error } = await supabase.from("branches").select("*");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome</h1>
        <p className="text-lg text-gray-800">
          Hello, <span className="font-semibold text-gray-900">{data?.user?.email}</span>
          <Signout user={data.user} />
        </p>
      </div>
    </div>
  );
}


/*export default async function Home() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  let { data: branches, error } = await supabase.from("bracnhes").select("*");

  return (
    <div className="container mx-auto text-xl">
      Hello - {data?.user.email}
      <ul>
        {branches?.map((branch) => (
          <li>{branch.name}</li>
        ))}
      </ul>
    </div>
  );
}*/