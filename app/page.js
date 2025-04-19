'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarked, setBookmarked] = useState([]);
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);

  useEffect(() => {
    fetchRecipes();
    const stored = JSON.parse(localStorage.getItem('bookmarkedRecipes')) || [];
    setBookmarked(stored);
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
      const updatedBookmarks = bookmarked.filter((bid) => bid !== id);
      setBookmarked(updatedBookmarks);
      localStorage.setItem('bookmarkedRecipes', JSON.stringify(updatedBookmarks));
    } else {
      alert('เกิดข้อผิดพลาดในการลบเมนู');
    }
  }

  function toggleBookmark(id) {
    let updated;
    if (bookmarked.includes(id)) {
      updated = bookmarked.filter((bid) => bid !== id);
    } else {
      updated = [...bookmarked, id];
    }
    setBookmarked(updated);
    localStorage.setItem('bookmarkedRecipes', JSON.stringify(updated));
  }

  function toggleShowBookmarks() {
    setShowOnlyBookmarks(!showOnlyBookmarks);
  }

  const filteredRecipes = recipes
    .filter((recipe) => {
      const matchSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchBookmark = !showOnlyBookmarks || bookmarked.includes(recipe.id);
      return matchSearch && matchBookmark;
    })
    .sort((a, b) => {
      const aBookmarked = bookmarked.includes(a.id);
      const bBookmarked = bookmarked.includes(b.id);
      if (aBookmarked === bBookmarked) return 0;
      return aBookmarked ? -1 : 1;
    });

  return (
    <div className={styles['background-container']}>
      <main className={styles['page-container']}>
        <h1 className={styles['page-title']}>🍽️ รายการเมนู</h1>

        {/* ช่องค้นหา */}
        <input
          type="text"
          placeholder="🔍 ค้นหาเมนู..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles['search-input']}
        />

        {/* ปุ่ม toggle แสดงเฉพาะ bookmark */}
        <button onClick={toggleShowBookmarks} className={styles['toggle-button']}>
          {showOnlyBookmarks ? '📋 แสดงทั้งหมด' : '⭐ เฉพาะเมนูที่ Bookmark'}
        </button>

        {/* ปุ่มเพิ่มเมนู */}
        <Link href="/create" className={styles['add-button']}>
          ➕ เพิ่มเมนูใหม่
        </Link>

        <ul className={styles['recipe-list']}>
          {filteredRecipes.map((recipe) => (
            <li key={recipe._id || recipe.id} className={styles['recipe-card']}>
              <h3>{recipe.title}</h3>
              {recipe.image && <img src={recipe.image} alt={recipe.title} />}
              <p>{recipe.description}</p>
              <div className={styles['recipe-actions']}>
                <Link href={`/recipes/${recipe.id}`}>🔍 ดูเพิ่มเติม</Link>
                <button onClick={() => handleDelete(recipe.id)}>🗑️ ลบ</button>
                <button onClick={() => toggleBookmark(recipe.id)}>
                  {bookmarked.includes(recipe.id) ? '⭐' : '☆'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
