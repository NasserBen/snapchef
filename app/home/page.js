import Post from "@/components/post";
import staticImg from "@/assets/pizza.png";

async function getHomePageRecipes() {
  const res = await fetch("http://localhost:3000/api/homeRecipes", {
    next: { revalidate: 500 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default async function Home() {
  const data = await getHomePageRecipes(); // gets all the recipe posts in the DB

  return (
    <div className="m-10 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      {data.documents.map((post) => (
        <Post key={post._id} post={post} staticImg={staticImg} />
      ))}
    </div>
  );
}
