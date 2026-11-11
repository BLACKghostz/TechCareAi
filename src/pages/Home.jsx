import { useEffect, useState } from "react";
import {
  Bot,
  Monitor,
  Laptop,
  ShieldCheck,
  Wifi,
  Gauge,
  Settings,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquare,
  Search,
  Wrench,
  Zap,
  ChevronRight
} from "lucide-react";

import { Link } from "react-router-dom";

const services = [
  {
    icon: Monitor,
    title: "Windows Troubleshooting",
    description: "Resolve Windows errors, boot problems, updates and system issues."
  },
  {
    icon: ShieldCheck,
    title: "Virus & Malware Support",
    description: "Get guidance to identify threats and protect your computer."
  },
  {
    icon: Gauge,
    title: "Performance Optimization",
    description: "Investigate slow computers, high memory usage and performance issues."
  },
  {
    icon: Wifi,
    title: "Network & Internet",
    description: "Troubleshoot Wi-Fi, connectivity, DNS and network problems."
  },
  {
    icon: Laptop,
    title: "Hardware Diagnostics",
    description: "Understand possible hardware faults and upgrade requirements."
  },
  {
    icon: Settings,
    title: "Software & Maintenance",
    description: "Get help with applications, updates and regular maintenance."
  }
];

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Describe your problem",
    description: "Tell our AI assistant what is happening with your computer."
  },
  {
    number: "02",
    icon: Search,
    title: "AI investigates",
    description: "Our diagnostic workflow investigates possible causes."
  },
  {
    number: "03",
    icon: Wrench,
    title: "Get a solution",
    description: "Receive guided troubleshooting steps and safe recommendations."
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Verify the result",
    description: "Check whether the issue is resolved or needs expert assistance."
  }
];

const defaultDashboard = {
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

function Home() {
  const [dashboard, setDashboard] = useState(defaultDashboard);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((response) => response.json())
      .then((data) => {
        setDashboard(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="hero-label">
                <Sparkles size={15} />
                Intelligent Computer Support
              </div>

              <h1 className="hero-title">
                Your Computer.
                <br />
                <span>Our Intelligence.</span>
                <br />
                Problem Solved.
              </h1>

              <p className="hero-description">
                Meet your personal AI computer technician.
                Diagnose issues, discover solutions and get
                technical support anytime, anywhere.
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link to="/chat" className="btn btn-primary btn-lg rounded-pill px-4">
                  <Bot size={19} className="me-2" />
                  Start AI Diagnosis
                  <ArrowRight size={18} className="ms-2" />
                </Link>

                <a href="#services" className="btn btn-outline-secondary btn-lg rounded-pill px-4">
                  Explore Services
                </a>
              </div>

              <div className="hero-trust mt-4">
                <span><CheckCircle2 size={17} /> AI-powered support</span>
                <span><Clock size={17} /> Available 24/7</span>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="hero-visual">
                <div className="hero-glow"></div>

                <div className="ai-main-card">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <div className="ai-avatar">
                        <Bot size={27} />
                      </div>
                      <div>
                        <h6 className="mb-0">TechCare AI</h6>
                        <small className="text-success">
                          ● Support assistant online
                        </small>
                      </div>
                    </div>
                    <Sparkles className="text-primary" />
                  </div>

                  <div className="chat-message user-message mt-4">
                    My laptop has become very slow. Can you help?
                  </div>

                  <div className="chat-message bot-message mt-3">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <Bot size={18} className="text-primary" />
                      <strong>AI Assistant</strong>
                    </div>
                    I&apos;ll help investigate this issue. Let&apos;s start by
                    checking your system performance.
                  </div>

                  <div className="diagnostic-box mt-4">
                    <div className="d-flex justify-content-between mb-2">
                      <small className="fw-semibold">Diagnostic workflow</small>
                      <small className="text-primary">Example</small>
                    </div>
                    <div className="diagnostic-item">
                      <CheckCircle2 size={17} />
                      <span>Problem identified</span>
                    </div>
                    <div className="diagnostic-item">
                      <Search size={17} />
                      <span>Investigating possible causes</span>
                    </div>
                    <div className="diagnostic-item pending">
                      <Clock size={17} />
                      <span>Solution verification pending</span>
                    </div>
                  </div>

                  <div className="ai-input-preview mt-3">
                    <span>Describe your computer issue...</span>
                    <div className="send-icon">
                      <ArrowRight size={17} />
                    </div>
                  </div>
                </div>

                <div className="floating-badge floating-top">
                  <ShieldCheck size={20} />
                  <span>Smart Diagnosis</span>
                </div>

                <div className="floating-badge floating-bottom">
                  <Zap size={20} />
                  <span>24/7 AI Assistance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="service-card h-100">
                <h6>Products</h6>
                <h3>{loading ? "..." : dashboard.metrics.totalProducts}</h3>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="service-card h-100">
                <h6>Orders</h6>
                <h3>{loading ? "..." : dashboard.metrics.totalOrders}</h3>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="service-card h-100">
                <h6>Revenue</h6>
                <h3>{loading ? "..." : `$${Number(dashboard.metrics.revenue || 0).toLocaleString()}`}</h3>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="service-card h-100">
                <h6>Open Issues</h6>
                <h3>{loading ? "..." : dashboard.metrics.openIssues}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services-section section-padding" id="services">
        <div className="container">
          <div className="section-heading text-center">
            <span className="section-label">OUR SERVICES</span>
            <h2>One Platform. All Your Computer Solutions.</h2>
            <p>
              From everyday computer problems to complex technical issues,
              get intelligent support in one place.
            </p>
          </div>

          <div className="row g-4 mt-3">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <div className="col-md-6 col-lg-4" key={index}>
                  <div className="service-card h-100">
                    <div className="service-icon">
                      <Icon size={25} />
                    </div>

                    <h5>{service.title}</h5>
                    <p>{service.description}</p>

                    <Link to="/chat" className="service-link">
                      Get assistance <ChevronRight size={17} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="workflow-section section-padding" id="how-it-works">
        <div className="container">
          <div className="section-heading text-center">
            <span className="section-label">HOW IT WORKS</span>
            <h2>Technical Support, Made Intelligent.</h2>
            <p>
              A guided AI workflow that understands, investigates
              and helps resolve computer problems.
            </p>
          </div>

          <div className="row g-4 mt-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div className="col-md-6 col-lg-3" key={index}>
                  <div className="workflow-card h-100">
                    <span className="step-number">{step.number}</span>
                    <div className="workflow-icon">
                      <Icon size={26} />
                    </div>
                    <h5>{step.title}</h5>
                    <p>{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding" id="about">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-7">
              <div className="service-card h-100">
                <h4 className="mb-3">Inventory Snapshot</h4>
                {dashboard.products.length === 0 ? (
                  <p>No products available yet.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-borderless align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Category</th>
                          <th>Stock</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard.products.map((product) => (
                          <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>{product.stock_quantity}</td>
                            <td>${Number(product.price).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-5">
              <div className="service-card h-100">
                <h4 className="mb-3">Latest Orders</h4>
                {dashboard.orders.length === 0 ? (
                  <p>No orders available yet.</p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {dashboard.orders.map((order) => (
                      <div key={order.id} className="border rounded p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <strong>{order.order_number}</strong>
                          <span className="badge bg-primary-subtle text-primary">{order.status}</span>
                        </div>
                        <div className="mt-2 small text-muted">
                          {order.customer_name}
                        </div>
                        <div className="mt-1 fw-semibold">${Number(order.total_amount).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="cta-card mt-5">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <span className="cta-label">YOUR AI TECHNICIAN IS READY</span>
                <h2>Don&apos;t let computer problems slow you down.</h2>
                <p>
                  Start a diagnostic conversation and let our AI
                  guide you toward a solution.
                </p>
              </div>

              <div className="col-lg-4 text-lg-end">
                <Link to="/chat" className="btn btn-light btn-lg rounded-pill px-4">
                  Start Now <ArrowRight size={18} className="ms-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
