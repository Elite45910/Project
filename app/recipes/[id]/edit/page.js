'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './RecipeEdit.module.css';


export default function RecipeEdit() {
  const { id } = useParams();
  const router = useRouter();


  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [steps, setSteps] = useState([{ step_number: 1, instruction: '' }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    async function fetchData() {
      try {

        const recipeRes = await fetch(`https://finalback-sepia.vercel.app/recipes`);
        const recipeList = await recipeRes.json();
        const foundRecipe = recipeList.find(r => String(r.id) === id);
        if (!foundRecipe) throw new Error('Recipe not found');

        const ingRes = await fetch(`https://finalback-sepia.vercel.app/recipes/${id}/ingredients`);
        const ingData = await ingRes.json();
        const formattedIngredients = ingData.length > 0
          ? ingData.map(ing => ({ name: ing.name, quantity: ing.quantity }))
          : [{ name: '', quantity: '' }];

        const stepRes = await fetch(`https://finalback-sepia.vercel.app/recipes/${id}/steps`);
        const stepData = await stepRes.json();
        const formattedSteps = stepData.length > 0
          ? stepData.map(step => ({ step_number: step.step_number, instruction: step.instruction }))
          : [{ step_number: 1, instruction: '' }];

        setRecipe(foundRecipe);
        setIngredients(formattedIngredients);
        setSteps(formattedSteps);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleStepChange = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  const handleAddStep = () => {
    const newStepNumber = steps.length + 1;
    setSteps([...steps, { step_number: newStepNumber, instruction: '' }]);
  };

  const handleDeleteIngredient = (index) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
    }
  };

  const handleDeleteStep = (index) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index).map((step, idx) => ({
        ...step,
        step_number: idx + 1,
      }));
      setSteps(newSteps);
    }
  };

  const handleSubmit = async () => {
    try {

      await fetch(`https://finalback-sepia.vercel.app/recipes/${id}`, {
        method: 'DELETE',
      });

      const newRecipe = {
        title: recipe.title,
        description: recipe.description,
        image: recipe.image,
        ingredients,
        steps: steps.map((step, index) => ({
          step_number: index + 1,
          instruction: step.instruction,
        })),
      };

      const response = await fetch('https://finalback-sepia.vercel.app/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipe),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/recipes/${result.recipe_id}`);
      } else {
        throw new Error('Failed to create new recipe');
      }
    } catch (err) {
      console.error("Error updating recipe:", err);
      setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  if (loading) return <p className={styles.message}>⏳ กำลังโหลด...</p>;
  if (error) return <p className={styles.message}>❌ {error}</p>;
  if (!recipe) return <p className={styles.message}>❌ ไม่พบเมนูที่คุณค้นหา</p>;

  return (
    <main className={styles.recipeEdit}>
      <Link className={styles.backLink} href={`/recipes/${id}`}>← กลับ</Link>
      <h1 className={styles.editTitle}>🛠 แก้ไขเมนู</h1>

      {/* ชื่อเมนู */}
      <div className={styles.formGroup}>
        <label>ชื่อเมนู</label>
        <input
          className={styles.input}
          type="text"
          value={recipe.title}
          onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
        />
      </div>

      {/* คำอธิบาย */}
      <div className={styles.formGroup}>
        <label>คำอธิบาย</label>
        <textarea
          className={styles.inputArea}
          value={recipe.description}
          onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
        />
      </div>

      {/* URL รูปภาพ */}
      <div className={styles.formGroup}>
        <label>URL รูปภาพ</label>
        <input
          className={styles.input}
          type="text"
          value={recipe.image}
          onChange={(e) => setRecipe({ ...recipe, image: e.target.value })}
          placeholder="https://..."
        />
        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            className={styles.imagePreview}
          />
        )}
      </div>

      {/* ส่วนผสม */}
      <h3 className={styles.sectionTitle}>ส่วนผสม</h3>
      {ingredients.map((ingredient, index) => (
        <div key={index} className={styles.ingredientItem}>
          <input
            type="text"
            value={ingredient.name}
            onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
            placeholder="ชื่อส่วนผสม"
            required
            className={styles.input}
          />
        {/* ปริมาณ */}
          <input
            type="text"
            value={ingredient.quantity}
            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
            placeholder="ปริมาณ"
            required
            className={styles.input}
          />
            {/* ปุ่มลบ */}
          <button
            type="button"
            onClick={() => handleDeleteIngredient(index)}
            disabled={ingredients.length === 1}
            className={styles.deleteBtn}
          >
            ✖️ ลบ
          </button>
        </div>
      ))}
      {/* ปุ่มเพิ่ม */}
      <button type="button" onClick={handleAddIngredient} className={styles.addBtn}>
        ➕ เพิ่มส่วนผสม
      </button>
      {/* ขั้นตอนการทำ */}
      <h3 className={styles.sectionTitle}>ขั้นตอนการทำ</h3>
      {steps.map((step, index) => (
        <div key={index} className={styles.stepItem}>
          <div className={styles.stepInputContainer}>
            <label>ลำดับขั้นตอน: {step.step_number}</label>
            <input
              type="text"
              value={step.instruction}
              onChange={(e) => handleStepChange(index, 'instruction', e.target.value)}
              placeholder="คำแนะนำ"
              required
              className={styles.input}
            />
              {/* ปุ่มลบ */}
            <button
              type="button"
              onClick={() => handleDeleteStep(index)}
              disabled={steps.length === 1}
              className={styles.deleteBtn}
            >
              ✖️ ลบ
            </button>
          </div>
        </div>
      ))}
      {/* ปุ่มเพิ่ม */}
      <button type="button" onClick={handleAddStep} className={styles.addBtn}>
        ➕ เพิ่มขั้นตอน
      </button>
      {/* บันทึกการแก้ไข */}
      <button className={styles.saveBtn} onClick={handleSubmit}>
        💾 บันทึกการแก้ไข
      </button>
    </main>
  );
}