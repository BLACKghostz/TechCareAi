import { useEffect, useState } from "react";

const initialForm = {
  order_number: "",
  customer_name: "",
  status: "pending",
  total_amount: ""
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    fetch("/api/orders")
      .then((response) => response.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        total_amount: Number(form.total_amount)
      })
    });

    setForm(initialForm);
    loadOrders();
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="section-label">ORDERS</span>
          <h2 className="mb-0 mt-2">Order Management</h2>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="service-card p-4">
            <h4 className="mb-3">Create Order</h4>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-12">
                <input
                  className="form-control"
                  value={form.order_number}
                  onChange={(event) => setForm({ ...form, order_number: event.target.value })}
                  placeholder="Order number"
                  required
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control"
                  value={form.customer_name}
                  onChange={(event) => setForm({ ...form, customer_name: event.target.value })}
                  placeholder="Customer name"
                  required
                />
              </div>
              <div className="col-12">
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="col-12">
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={form.total_amount}
                  onChange={(event) => setForm({ ...form, total_amount: event.target.value })}
                  placeholder="Total amount"
                />
              </div>
              <div className="col-12">
                <button className="btn btn-primary w-100" type="submit">Create Order</button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="service-card p-4">
            <h4 className="mb-3">Recent Orders</h4>
            {loading ? (
              <p>Loading orders...</p>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.order_number}</td>
                        <td>{order.customer_name}</td>
                        <td>{order.status}</td>
                        <td>${Number(order.total_amount).toFixed(2)}</td>
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

export default Orders;
