import { useState, useEffect } from 'react';
import { categoryApi, CategoryDto, CreateCategoryDto, UpdateCategoryDto } from '@/core/api/masterApi';

const Categories = () => {
  console.log('=== CATEGORIES COMPONENT MOUNTED ===');
  
  return (
    <div style={{ padding: "20px" }}>
      <h1>Categories Page</h1>
      <p>Test if component loads</p>
    </div>
  );
};

export default Categories;
