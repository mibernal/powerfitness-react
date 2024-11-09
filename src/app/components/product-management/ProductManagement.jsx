//src\app\components\product-management\ProductManagement.jsx:
import React, { useState } from 'react';
import './ProductManagement.scss';
import CsvWriterService from '../../services/csv-writer.service'; // Adjust the import based on your service's structure
import ProductService from '../services/product/ProductService'; // Adjust import path based on your structure
//import { Product } from '../../models/product.model'; // Adjust import path based on your structure

const ProductManagement = () => {
  const [ setFile] = useState(null);

  const handleFileInput = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const exportToCSV = async () => {
    try {
      const products = await ProductService.getProducts(); // Ensure this function returns a promise
      CsvWriterService.generateCSV(products);
    } catch (error) {
      console.error('Error exporting products to CSV:', error);
    }
  };

  return (
    <div className="product-management-container">
      <h1 className="product-management-title">Product Management</h1>
      <input
        className="product-management-input"
        type="file"
        onChange={handleFileInput}
      />
      <p>
        <button className="product-management-button" onClick={exportToCSV}>
          Exportar CSV
        </button>
      </p>
    </div>
  );
};

export default ProductManagement;
