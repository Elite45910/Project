'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import './RecipeDetail.css'; // อย่าลืม import CSS ด้วย

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const recipeRes = await fetch(`https://finalback-sepia.vercel.app/recipes`);
        const recipeList = await recipeRes.json();
        const foundRecipe = recipeList.find(r => String(r.id) === id);
        setRecipe(foundRecipe);

        const ingRes = await fetch(`https://finalback-sepia.vercel.app/recipes/${id}/ingredients`);
        const ingData = await ingRes.json();
        setIngredients(ingData);

        const stepRes = await fetch(`https://finalback-sepia.vercel.app/recipes/${id}/steps`);
        const stepData = await stepRes.json();
        setSteps(stepData);
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) return <p className="loading-text">⏳ กำลังโหลด...</p>;

  if (!recipe) return <p className="error-text">❌ ไม่พบเมนูที่คุณค้นหา</p>;

  return (
    <main className="recipe-detail">
      <Link href="/" className="link-back">← กลับ</Link>

      <h1 className="recipe-title">{recipe.title}</h1>

      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="recipe-image"
        />
      )}

      <h3 className="recipe-description">{recipe.description}</h3>

      <h4 className="recipe-subheading">ส่วนผสม</h4>
      <ul className="ingredients-list">
        {ingredients.map((ing, index) => (
          <li key={index}>{ing.name} {ing.quantity}</li>
        ))}
      </ul>

      <h4 className="recipe-subheading">ขั้นตอนการทำ</h4>
      <ul className="steps-list">
        {steps.map((st, ind) => (
          <li key={ind}>
            {st.step_number}. {st.instruction}
          </li>
        ))}
      </ul>

      <Link href={`/recipes/${id}/edit`} className="link-edit">
        ✏️ แก้ไขรูปกับชื่อ
      </Link>
    </main>
  );
}
