import { useEffect, useState } from "react";
import "./App.css";

// Backend API address
const API_URL = "http://localhost:8000";

function App() {

    // Page state
    const [products, setProducts] = useState([]);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        quantity: ""
    });

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    // Load products from the API
    const getProducts = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                `${API_URL}/products`
            );

            const data = await response.json();

            setProducts(data);

        } catch {

            setError("Unable to connect to server");

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        getProducts();

    }, []);


    // Handle form input changes
    const handleChange = (event) => {

        setForm({
            ...form,
            [event.target.name]: event.target.value
        });

    };


    // Add or update a product
    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        const product = {
            name: form.name,
            description: form.description,
            price: Number(form.price),
            quantity: Number(form.quantity)
        };


        const url = editingId
            ? `${API_URL}/products/${editingId}`
            : `${API_URL}/products`;


        const method = editingId
            ? "PUT"
            : "POST";


        try {

            const response = await fetch(
                url,
                {
                    method: method,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(product)
                }
            );


            if (!response.ok) {

                const data = await response.json();

                throw new Error(
                    data.detail || "Something went wrong"
                );
            }


            resetForm();

            getProducts();

        } catch (error) {

            setError(error.message);

        }

    };


    // Delete a product
    const deleteProduct = async (id) => {

        try {

            await fetch(
                `${API_URL}/products/${id}`,
                {
                    method: "DELETE"
                }
            );

            getProducts();

        } catch {

            setError("Delete failed");

        }

    };


    // Start editing a product
    const editProduct = (product) => {

        setEditingId(product.id);

        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity
        });

    };


    // Clear the form and editing state
    const resetForm = () => {

        setEditingId(null);

        setForm({
            name: "",
            description: "",
            price: "",
            quantity: ""
        });

    };


    // Render the application
    return (

        <div className="app">

            <header>

                <h1>Product Tracker</h1>

                <p>
                    Simple Product Inventory Management
                </p>

            </header>


            <main>


                {/* Product form section */}

                <section className="card">

                    <h2>
                        {editingId
                            ? "Edit Product"
                            : "Add Product"}
                    </h2>


                    {error && (

                        <div className="error">
                            {error}
                        </div>

                    )}


                    <form onSubmit={handleSubmit}>

                        <input
                            type="text"
                            name="name"
                            placeholder="Product name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />


                        <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={form.description}
                            onChange={handleChange}
                        />


                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            min="0"
                            value={form.price}
                            onChange={handleChange}
                            required
                        />


                        <input
                            type="number"
                            name="quantity"
                            placeholder="Quantity"
                            min="0"
                            value={form.quantity}
                            onChange={handleChange}
                            required
                        />


                        <div className="buttons">

                            <button className="primary">
                                {editingId
                                    ? "Update Product"
                                    : "Add Product"}
                            </button>


                            {editingId && (

                                <button
                                    type="button"
                                    className="secondary"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>

                            )}

                        </div>

                    </form>

                </section>


                {/* Product list section */}

                <section className="card">

                    <div className="section-header">

                        <h2>Products</h2>

                        <span>
                            {products.length} products
                        </span>

                    </div>


                    {loading ? (

                        <p>Loading...</p>

                    ) : products.length === 0 ? (

                        <div className="empty">
                            No products available
                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table>

                                <thead>

                                    <tr>

                                        <th>ID</th>

                                        <th>Product</th>

                                        <th>Description</th>

                                        <th>Price</th>

                                        <th>Stock</th>

                                        <th>Action</th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {products.map(
                                        (product) => (

                                            <tr
                                                key={
                                                    product.id
                                                }
                                            >

                                                <td>
                                                    #{product.id}
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            product.name
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {
                                                        product.description
                                                    }
                                                </td>

                                                <td>
                                                    ₹
                                                    {
                                                        product.price
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        product.quantity
                                                    }
                                                </td>

                                                <td>

                                                    <button
                                                        className="edit"
                                                        onClick={() =>
                                                            editProduct(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        className="delete"
                                                        onClick={() =>
                                                            deleteProduct(
                                                                product.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default App;