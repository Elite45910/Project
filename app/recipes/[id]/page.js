'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './RecipeDetail.css';
 
export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  // Timer states
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
 
  // Fetch recipe data
  useEffect(() => {
    async function fetchData() {
      try {
        const recipeRes = await fetch(`https://finalback-sepia.vercel.app/recipes`);
        const recipeList = await recipeRes.json();
        const foundRecipe = recipeList.find((r) => String(r.id) === id);
        setRecipe(foundRecipe);
 
        const ingRes = await fetch(`https://finalback-sepia.vercel.app/recipes/${id}/ingredients`);
        const ingData = await ingRes.json();
        setIngredients(ingData);
 
        const stepRes = await fetch(`https://finalback-sepia.vercel.app/recipes/${id}/steps`);
        const stepData = await stepRes.json();
        setSteps(stepData);
      } catch (error) {
        console.error('Error fetching detail:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [id]);
 
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) 
      {
      interval = setInterval(() => 
        {
        setTimerSeconds((prev) => prev + 1);
        }, 1000);
      }
    return () => clearInterval(interval);
  }, [isTimerRunning]);
 

  const toggleTimer = () => 
  {
    setIsTimerRunning(!isTimerRunning);
  };
 
  const resetTimer = () => 
  {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };
 
  const formatTimer = (seconds) => 
  {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
 
  if (loading) return <p className="loading-text">⏳ กำลังโหลด...</p>;
 
  if (!recipe) return <p className="error-text">❌ ไม่พบเมนูที่คุณค้นหา</p>;
 
  return (
  <main className="recipe-detail">
      {/* กลับ */}
    <Link href="/" className="link-back">
        ← กลับ
    </Link>
      <h1 className="recipe-title">{recipe.title}</h1>
      {/* โหลดภาพ */}
      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      )}
      <h3 className="recipe-description">{recipe.description}</h3>
      {/* ส่วนผสม */}
      <h4 className="recipe-subheading">ส่วนผสม</h4>
          <ul className="ingredients-list">
            {ingredients.map((ing, index) => (
              <li key={index}>
                {ing.name} {ing.quantity}
              </li>
      ))}
      </ul>
      {/* ขั้นตอน */}
      <h4 className="recipe-subheading">ขั้นตอนการทำ</h4>
        <ul className="steps-list">
          {steps.map((st, ind) => (
            <li key={ind}>
              {st.step_number}. {st.instruction}
            </li>
        ))}
      </ul>
      {/* ปุ่มจับเวลา */}
      <div className="timer-section">
        <h4 className="recipe-subheading">จับเวลาทำอาหาร</h4>
        <p className="timer-display">{formatTimer(timerSeconds)}</p>
          <div className="timer-controls">
            <button onClick={toggleTimer} className="timer-button">
              {isTimerRunning ? 'หยุด' : 'เริ่ม'}
            </button>
            <button onClick={resetTimer} className="timer-button reset">
              รีเซ็ต
            </button>
          </div>
      </div>
      {/* ปุ่มเเก้ไข*/}
      <Link href={`/recipes/${id}/edit`} className="link-edit">
        ✏️ แก้ไขรูปกับชื่อ
      </Link>
  </main>
  );
}