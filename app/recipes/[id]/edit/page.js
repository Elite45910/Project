'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './RecipeEdit.module.css';

export default function RecipeEdit() {
  const { id } = useParams();
  const router = useRouter();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const recipeRes = await fetch(`https://finalback-sepia.vercel.app/recipes`);
        const recipeList = await recipeRes.json();
        const foundRecipe = recipeList.find(r => String(r.id) === id);
        setRecipe(foundRecipe);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    try {
      await fetch(`https://finalback-sepia.vercel.app/recipes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: recipe.title,
          description: recipe.description,
          image: recipe.image,
        }),
      });

      router.push(`/recipes/${id}`);
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
       {/* ชื่อเมนู rename */}
      <div className={styles.formGroup}>
        <label>ชื่อเมนู</label>
        <input className={styles.input}
          type="text"
          value={recipe.title}
          onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
        />
      </div>
      {/* คำอธิบาย redescription */}
      <div className={styles.formGroup}>
        <label>คำอธิบาย</label>
        <textarea className={styles.inputArea}
          value={recipe.description}
          onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
        />
      </div>
      {/* re รูปภาพ */}
      <div className={styles.formGroup}>
        <label>URL รูปภาพ</label>
        <input className={styles.input}
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
        {/* บันทึกการแก้ไข */}
      <button className={styles.saveBtn} onClick={handleSubmit}>
        💾 บันทึกการแก้ไข
      </button>
    </main>
  );
}
