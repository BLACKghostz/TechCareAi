import { useEffect, useState } from "react";

const initialForm = {
  sku: "",
  name: "",
  category: "Accessories",
  price: "",
  stock_quantity: "",
  reorder_level: "10"
};

function Inventory() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  const loadProducts = () => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        stock_quantity: Number(form.stock_quantity),
        reorder_level: Number(form.reorder_level)
      })
    });

    setForm(initialForm);
    loadProducts();
  };

  const updateStock = async (productId, amount) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stock_quantity: Math.max(0, Number(product.stock_quantity) + amount)
      })
    });

    loadProducts();
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="section-label">INVENTORY</span>
          <h2 className="mb-0 mt-2">Stock Management</h2>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="service-card p-4">
            <h4 className="mb-3">Add Product</h4>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-12">
                <input
                  className="form-control"
                  value={form.sku}
                  onChange={(event) => setForm({ ...form, sku: event.target.value })}
                  placeholder="SKU"
                  required
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Product name"
                  required
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control"
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  placeholder="Category"
                />
              </div>
              <div className="col-6">
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                  placeholder="Price"
                />
              </div>
              <div className="col-6">
                <input
                  type="number"
                  className="form-control"
                  value={form.stock_quantity}
                  onChange={(event) => setForm({ ...form, stock_quantity: event.target.value })}
                  placeholder="Stock"
                />
              </div>
              <div className="col-12">
                <input
                  type="number"
                  className="form-control"
                  value={form.reorder_level}
                  onChange={(event) => setForm({ ...form, reorder_level: event.target.value })}
                  placeholder="Reorder level"
                />
              </div>
              <div className="col-12">
                <button className="btn btn-primary w-100" type="submit">Save Product</button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="service-card p-4">
            <h4 className="mb-3">Current Inventory</h4>
            {loading ? (
              <p>Loading inventory...</p>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Stock</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.sku}</td>
                        <td>{product.stock_quantity}</td>
                        <td>${Number(product.price).toFixed(2)}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-success" onClick={() => updateStock(product.id, 1)} type="button">+1</button>
                            <button className="btn btn-outline-danger" onClick={() => updateStock(product.id, -1)} type="button">-1</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
