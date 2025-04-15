'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './RecipeCreate.css'; 

export default function RecipeCreate() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [steps, setSteps] = useState([{ instruction: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageLoading, setImageLoading] = useState(true);

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
    setSteps([...steps, { instruction: '' }]);
  };

  const handleDeleteIngredient = (index) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
    }
  };

  const handleDeleteStep = (index) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index);
      setSteps(newSteps);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const newRecipe = {
      title,
      description,
      image,
      ingredients,
      steps: steps.map((step, index) => ({
        step_number: index + 1,
        instruction: step.instruction,
      })),
    };

    try {
      const response = await fetch('https://finalback-sepia.vercel.app/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipe),
      });

      if (response.ok) {
        router.push('/');
      } else {
        setError('Failed to create recipe.');
      }
    } catch (err) {
      setError('An error occurred while creating the recipe.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (image) {
      setImageLoading(true);
      const img = new Image();
      img.src = image;

      img.onload = () => {
        setImageLoading(false);
      };

      img.onerror = () => {
        setImageLoading(false);
      };
    }
  }, [image]);

  return (
    <main className="recipe-form">
      <h1 className="form-title">🍴สร้างเมนูใหม่🍴</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>ชื่อเมนู</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="กรุณากรอกชื่อเมนู"
          />
        </div>

        <div className="form-group">
          <label>คำอธิบาย</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="กรุณากรอกคำอธิบาย"
          />
        </div>

        <div className="form-group">
          <label>ลิงค์ภาพ (URL)</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="กรุณากรอกลิงค์ภาพ"
          />
        </div>

        <div className="form-group">
          {imageLoading ? (
            <div className="placeholder-image"></div>
          ) : (
            <img src={image} alt="Recipe" className="recipe-image" />
          )}
        </div>

        <h3 className="section-title">ส่วนผสม</h3>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient-item">
            <input
              type="text"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              placeholder="ชื่อส่วนผสม"
              required
            />
            <input
              type="text"
              value={ingredient.quantity}
              onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
              placeholder="ปริมาณ"
              required
            />
            <button
              type="button"
              onClick={() => handleDeleteIngredient(index)}
              disabled={ingredients.length === 1}
              className="delete-btn"
            >
              ✖️ลบ
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddIngredient} className="add-btn">
        ➕เพิ่มส่วนผสม
        </button>
    
        <h3 className="section-title">ขั้นตอนการทำ</h3>
        {steps.map((step, index) => (
          <div key={index} className="step-item">
            <div className="step-input-container">
              <label>ลำดับขั้นตอน: {index + 1}</label>
              <input
                type="text"
                value={step.instruction}
                onChange={(e) => handleStepChange(index, 'instruction', e.target.value)}
                placeholder="คำแนะนำ"
                required
                className="step-input"
              />
              <button
                type="button"
                onClick={() => handleDeleteStep(index)}
                disabled={steps.length === 1}
                className="delete-btn"
              >
                ✖️ลบ
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={handleAddStep} className="add-btn">
        ➕เพิ่มขั้นตอน
        </button>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'กำลังบันทึก...' : '🥢สร้างเมนู'}
        </button>
        
        <button
          type="button"
          onClick={() => router.back()}
          className="back-btn"
        >
          🔙 ย้อนกลับ
        </button>
        
      </form>
    </main>
  );
}
