import IngredientList from "@/components/ingredientList";
import AttributeList from "@/components/attributeList";
import StepList from "@/components/stepList";
import NotFoundPage from "@/app/not-found";
import Link from "next/link";
import { FaRegHeart } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { fetchRecipe } from "@/constants";

export default async function RecipePage({ params }) {
  const { recipeId } = params;
  const data = await fetchRecipe(recipeId);

  if (!data) {
    return <NotFoundPage />;
  }

  return (
    <div className="max-w-3xl mx-auto my-16">
      <Link
        href={`/profile/${data.recipe.user_name}`}
        className="flex items-center hover:underline hover:cursor-pointer hover:opacity-70"
      >
        <FaUserCircle className="mr-2 text-xl text-custom-main-dark" />
        <p className="text-xl ">{data.recipe.user_name}</p>
      </Link>
      <img
        src={data.recipe.recipe_image}
        alt={data.recipe_name}
        className="mb-3"
        style={{
          objectFit: "cover",
          borderRadius: "30px",
          border: "3px solid #000",
        }}
      />
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-4">{data.recipe.recipe_name}</h1>
        <div className="flex-row items-center justify-center">
          <FaRegHeart className="text-custom-main-dark text-2xl hover:cursor-pointer" />
          <p className="text-lg text-center">{data.recipe.recipe_likes}</p>
        </div>
      </div>

      <AttributeList
        attributes={data.recipe.recipe_attributes}
        time={data.recipe.recipe_time}
        cals={data.recipe.recipe_cals}
      />
      <div className="flex justify-between">
        <div>
          <p className="my-4">{data.recipe.recipe_description}</p>
          <StepList steps={data.recipe.recipe_steps} />
        </div>
        <IngredientList ingredients={data.recipe.recipe_ingredients} />
      </div>
    </div>
  );
}
