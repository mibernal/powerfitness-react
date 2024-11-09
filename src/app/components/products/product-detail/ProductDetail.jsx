//src\app\components\products\product-detail\ProductDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from '../../services/product/ProductService'; // Adjust import based on your service structure
import CartService from '../../services/cart/CartService'; // Adjust import based on your service structure
import './ProductDetail.scss';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);  // Mueve este hook aquí

  const updateCurrentImageIndex = (index) => {
    setCurrentImageIndex(index);  // Solo actualiza el estado, no declares useState aquí
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await ProductService.getProducts();
        const foundProduct = products.find((prod) => prod.id === id);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          console.error('Product not found');
          navigate('/404'); // Redirect to a 404 page if product not found
        }
      } catch (error) {
        console.error('Error retrieving products:', error);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const formatPrice = (price) => {
    return price.toLocaleString('es-ES');
  };

  const addProduct = () => {
    if ((!selectedFlavor && product.flavors && product.flavors.length > 0) || 
        (!selectedSize && product.sizes && product.sizes.length > 0)) {
      setConfirmationMessage('');
      return;
    }

    const selectedProduct = { ...product, selectedSize, selectedFlavor };
    CartService.addProduct(selectedProduct);
    setConfirmationMessage(`Producto agregado al carrito: ${product.name}`);

    setSelectedSize('');
    setSelectedFlavor('');
  };

  return (
    <div className="container">
      {product && (
        <div className="row">
          <div className="col-md-6">
            <div className="card product">
              <div className="image-container">
                <div className="arrow left-arrow" onClick={() => updateCurrentImageIndex(currentImageIndex - 1)}>&lt;</div>
                <div className="images">
                  <img className="card-img-top product-image" src={product.imageUrl || ''} alt={product.name} />
                </div>
                <div className="arrow right-arrow" onClick={() => updateCurrentImageIndex(currentImageIndex + 1)}>&gt;</div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card product">
              <div className="card-body">
                <h5 className="card-title product-name">{product.name}</h5>
                {product.category && <p className="card-text product-category">Categoría: {product.category}</p>}
                {product.brand && <p className="card-text product-brand">Marca: {product.brand}</p>}
                {product.sizes && product.sizes.length > 0 && (
                  <p className="card-text product-size">
                    Tamaño:
                    <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                      <option value="">Seleccione un tamaño</option>
                      {product.sizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </p>
                )}
                {product.flavors && product.flavors.length > 0 && (
                  <p className="card-text product-flavor">
                    Sabor:
                    <select value={selectedFlavor} onChange={(e) => setSelectedFlavor(e.target.value)}>
                      <option value="">Seleccione un sabor</option>
                      {product.flavors.map((flavor) => (
                        <option key={flavor} value={flavor}>{flavor}</option>
                      ))}
                    </select>
                  </p>
                )}
                {product.stock !== undefined && product.stock !== 0 && (
                  <p className="card-text product-stock">Stock: {product.stock}</p>
                )}
                {product.description && <p className="card-text product-description">{product.description}</p>}
                {product.discount !== undefined && product.discount !== 0 && (
                  <p className="card-text product-discount">Descuento: {product.discount}</p>
                )}
                {product.price !== undefined && product.price !== 0 && (
                  <p className="card-text product-price">{formatPrice(product.price)}</p>
                )}
                <button className="btn btn-primary add-to-cart-button" onClick={addProduct}>Añadir al Carrito</button>
                {confirmationMessage && <p>{confirmationMessage}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
