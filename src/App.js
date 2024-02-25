import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState({
    id: '',
    Name: '',
    Price: '',
    img: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get("http://localhost:5000/product")
      .then(response => setProducts(response.data.product))
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleNewProductChange = (event) => {
    const { name, value } = event.target;
    setNewProduct(prevProduct => ({ ...prevProduct, [name]: value }));
  };

  const handleNewProductSubmit = (event) => {
    event.preventDefault();
  
    // Parse id to integer
    const newProductId = parseInt(newProduct.id);
  
    if (!isNaN(newProductId) && Number.isInteger(newProductId)) {
      const updatedProduct = { ...newProduct, id: newProductId };
  
      axios.post("http://localhost:5000/product", updatedProduct)
        .then(response => {
          console.log('Response from server:', response.data);
          setNewProduct({ id: '', Name: '', Price: '', img: '' });
          fetchData();
        })
        .catch(error => {
          console.error('Error adding new product:', error);
        });
    } else {
      console.error('Invalid ID. Please enter a valid integer for ID.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      console.log('Deleting product with ID:', productId);
      await axios.delete(`http://localhost:5000/product/${parseInt(productId)}`);
      console.log('Product deleted successfully');
      setProducts((prevProducts) => prevProducts.filter(p => p._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setNewProduct({
      id: product._id,
      Name: product.Name,
      Price: product.Price,
      img: product.img,
    });
  };

  const handleUpdateProduct = (event) => {
    event.preventDefault();

    axios.put(`http://localhost:5000/product/${newProduct.id}`, newProduct)
      .then(response => {
        console.log('Product updated successfully:', response.data);
        setNewProduct({ id: '', Name: '', Price: '', img: '' });
        fetchData();
      })
      .catch(error => {
        console.error('Error updating product:', error);
      });
  };

  const filteredProducts = products.filter(p =>
    p.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productList = filteredProducts.map(p => (
    <li key={p._id} className="product-item">
      <div key={`${p._id}-div`}>
        <img
          src={p.img}
          alt="Product"
          className="product-image"
          loading="lazy"
          style={{ maxWidth: '100%' }}
        />
      </div>
      <div className="product-details" key={`${p._id}-details`}>
        {!newProduct.id && <p className="product-id">{p.id}</p>}
        <p className="product-name">{p.Name}</p>
        <p className="product-price">{p.Price}</p>
        <button onClick={() => handleDeleteProduct(p._id)}>Delete Product</button>
        <button onClick={() => handleEditProduct(p)}>Edit Product</button>
      </div>
    </li>
  ));
  

  return (
    <div className="app-container">
      <h1 className="main-heading">IT STORE BY MART LEAMBUNG</h1>
      <div id="black_line"></div>

      <div className="search-bar">
        <label htmlFor="search">Search:</label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <form onSubmit={handleNewProductSubmit}>
        <label htmlFor="newProductId">ID:</label>
        <input
          type="text"
          id="newProductId"
          name="id"
          value={newProduct.id}
          onChange={handleNewProductChange}
          required
        />

        <label htmlFor="newProductName">Name:</label>
        <input
          type="text"
          id="newProductName"
          name="Name"
          value={newProduct.Name}
          onChange={handleNewProductChange}
          required
        />

        <label htmlFor="newProductPrice">Price:</label>
        <input
          type="text"
          id="newProductPrice"
          name="Price"
          value={newProduct.Price}
          onChange={handleNewProductChange}
          required
        />

        <label htmlFor="newProductImg">Image URL:</label>
        <input
          type="text"
          id="newProductImg"
          name="img"
          value={newProduct.img}
          onChange={handleNewProductChange}
          required
        />

        <button className="button" type="submit">Add Product</button>
      </form>

      <ul className="product-list">{productList}</ul>

      { /* Edit form */ }
      <form onSubmit={handleUpdateProduct}>
        <label htmlFor="editProductName">Name:</label>
        <input
          type="text"
          id="editProductName"
          name="Name"
          value={newProduct.Name}
          onChange={handleNewProductChange}
          required
        />

        <label htmlFor="editProductPrice">Price:</label>
        <input
          type="text"
          id="editProductPrice"
          name="Price"
          value={newProduct.Price}
          onChange={handleNewProductChange}
          required
        />

        <label htmlFor="editProductImg">Image URL:</label>
        <input
          type="text"
          id="editProductImg"
          name="img"
          value={newProduct.img}
          onChange={handleNewProductChange}
          required
        />

        <button className="button" type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default App;
