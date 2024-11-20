import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductService } from '../../services/product/ProductService';
import { useCartService } from '../../services/cart/CartService';  // Corregir importación
import './ProductDetail.scss';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { addProduct } = useCartService(); // Usamos el hook para acceder a la función de agregar productos al carrito

  const updateCurrentImageIndex = (index) => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const productService = new ProductService();
      try {
        const fetchedProduct = await productService.getProductById(id);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          console.error('Product not found');
          navigate('/404');
        }
      } catch (error) {
        console.error('Error retrieving product:', error);
        navigate('/404');
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const formatPrice = (price) => {
    return new ProductService().formatPrice(price); // Usamos el método formatPrice del servicio
  };

  const handleAddProduct = () => {
    if ((!selectedFlavor && product.flavors && product.flavors.length > 0) || 
        (!selectedSize && product.sizes && product.sizes.length > 0)) {
      setConfirmationMessage('');
      return;
    }

    const selectedProduct = { ...product, selectedSize, selectedFlavor };
    addProduct(selectedProduct);  // Llamamos al método del hook para agregar al carrito
    setConfirmationMessage(`Producto agregado al carrito: ${product.name}`);
    setSelectedSize('');
    setSelectedFlavor('');
  };

  return (
    <div className="container">
      {product ? (
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
                <p className="card-text product-price">Precio: {formatPrice(product.price)}</p>
                <button className="btn btn-primary" onClick={handleAddProduct}>Agregar al carrito</button>
                {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Cargando producto...</p>
      )}
    </div>
  );
};

export default ProductDetail;
