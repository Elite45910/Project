'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './HomePage.module.css'; // <- ไฟล์ CSS ที่เราสร้างไว้

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  async function fetchRecipes() {
    const res = await fetch('https://finalback-sepia.vercel.app/recipes');
    const data = await res.json();
    setRecipes(data);
  }

  async function handleDelete(id) {
    const confirmDelete = confirm('คุณแน่ใจหรือไม่ว่าต้องการลบเมนูนี้?');
    if (!confirmDelete) return;

    const res = await fetch(`https://finalback-sepia.vercel.app/recipes/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setRecipes(recipes.filter((recipe) => recipe.id !== id));
    } else {
      alert('เกิดข้อผิดพลาดในการลบเมนู');
    }
  }

  return (

    <div className={styles['background-container']}>
      <main className={styles['page-container']}>
        <h1 className={styles['page-title']}>🍽️ รายการเมนู</h1>

        <Link href="/create" className={styles['add-button']}>
          ➕ เพิ่มเมนูใหม่
        </Link>

        <ul className={styles['recipe-list']}>
          {recipes.map((recipe) => (
            <li key={recipe._id || recipe.id} className={styles['recipe-card']}>
              <h3>{recipe.title}</h3>
              {recipe.image && (
                <img src={recipe.image} alt={recipe.title} />
              )}
              <p>  {recipe.description}</p>
              <div className={styles['recipe-actions']}>
                <Link href={`/recipes/${recipe.id}`}>🔍 ดูเพิ่มเติม</Link>
                <button onClick={() => handleDelete(recipe.id)}>🗑️ ลบ</button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>

  );
}
