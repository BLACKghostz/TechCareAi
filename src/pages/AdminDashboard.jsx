import { useEffect, useState } from "react";

const defaultData = {
  metrics: {
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    openIssues: 0
  },
  products: [],
  orders: [],
  issues: []
};

function AdminDashboard() {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((response) => response.json())
      .then((payload) => {
        setData(payload);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const cards = [
    { label: "Products", value: data.metrics.totalProducts },
    { label: "Orders", value: data.metrics.totalOrders },
    { label: "Revenue", value: `$${Number(data.metrics.revenue || 0).toLocaleString()}` },
    { label: "Open Issues", value: data.metrics.openIssues }
  ];

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="section-label">ADMIN DASHBOARD</span>
          <h2 className="mb-0 mt-2">Operations Overview</h2>
        </div>
      </div>

      {loading ? (
        <div className="service-card p-4">Loading dashboard data...</div>
      ) : (
        <>
          <div className="row g-4 mb-5">
            {cards.map((card) => (
              <div className="col-md-6 col-lg-3" key={card.label}>
                <div className="service-card h-100 p-4">
                  <div className="text-muted small text-uppercase">{card.label}</div>
                  <h3 className="mt-3 mb-0">{card.value}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4">
            <div className="col-lg-7">
              <div className="service-card h-100 p-4">
                <h4 className="mb-3">Inventory</h4>
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.products.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-muted">No products available.</td>
                        </tr>
                      ) : (
                        data.products.map((product) => (
                          <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>{product.stock_quantity}</td>
                            <td>${Number(product.price).toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="service-card h-100 p-4">
                <h4 className="mb-3">Support Queue</h4>
                <div className="d-flex flex-column gap-3">
                  {data.issues.length === 0 ? (
                    <p className="text-muted mb-0">No support tickets found.</p>
                  ) : (
                    data.issues.map((issue) => (
                      <div key={issue.id} className="border rounded-3 p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <strong>{issue.issue_title}</strong>
                          <span className="badge bg-primary-subtle text-primary">{issue.priority}</span>
                        </div>
                        <div className="small text-muted mt-2">{issue.customer_name}</div>
                        <div className="small mt-2 text-secondary">{issue.status}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="service-card mt-4 p-4">
            <h4 className="mb-3">Recent Orders</h4>
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
                  {data.orders.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-muted">No orders available.</td>
                    </tr>
                  ) : (
                    data.orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.order_number}</td>
                        <td>{order.customer_name}</td>
                        <td>{order.status}</td>
                        <td>${Number(order.total_amount).toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
