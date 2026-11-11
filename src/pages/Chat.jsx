import { useEffect, useRef, useState } from "react";
import { Bot, SendHorizonal, Sparkles, CheckCircle2, Clock, RotateCcw } from "lucide-react";

const starterMessages = [
  {
    sender: "bot",
    text: "Hi! I can help diagnose slow computers, network issues, malware, hardware concerns, and software problems. Tell me what is happening."
  }
];

const quickPrompts = [
  "My computer is running very slowly",
  "Wi‑Fi keeps disconnecting",
  "I think my PC has a virus",
  "Windows update keeps failing",
  "My printer will not connect"
];

function Chat() {
  const [messages, setMessages] = useState(() => {
    try {
      const savedMessages = JSON.parse(localStorage.getItem("techcare-chat-history") || "[]");
      return Array.isArray(savedMessages) && savedMessages.length > 0
        ? savedMessages.slice(-30)
        : starterMessages;
    } catch {
      return starterMessages;
    }
  });
  const [input, setInput] = useState("");
  const [issues, setIssues] = useState([]);
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("techcare-chat-history", JSON.stringify(messages.slice(-30)));
  }, [messages]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => {
    fetch("/api/issues")
      .then((response) => response.json())
      .then((data) => setIssues(Array.isArray(data) ? data : []))
      .catch(() => setIssues([]));
  }, []);

  useEffect(() => {
    const query = input.trim();
    if (!query) {
      setSuggestion(null);
      return undefined;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/chat/suggestions?q=${encodeURIComponent(query)}`, {
          signal: controller.signal
        });
        if (response.ok) setSuggestion(await response.json());
      } catch (error) {
        if (error.name !== "AbortError") setSuggestion(null);
      }
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [input]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedMessage = input.trim();
    if (!trimmedMessage || loading) return;

    const userMessage = { sender: "user", text: trimmedMessage };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: trimmedMessage,
          customer_name: "Guest User",
          history: messages.slice(-8).map((message) => ({
            role: message.sender === "user" ? "user" : "assistant",
            content: message.text
          }))
        })
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to process message.");

      setMessages((current) => [
        ...current,
        { sender: "bot", text: payload.response || "I’m ready to help troubleshoot this issue." }
      ]);

      fetch("/api/issues")
        .then((refreshIssues) => refreshIssues.json())
        .then((issueList) => setIssues(Array.isArray(issueList) ? issueList : []))
        .catch(() => {});
    } catch (error) {
      setMessages((current) => [
        ...current,
        { sender: "bot", text: "I hit a connection issue while checking your request. Please try again in a moment." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const useQuickPrompt = (prompt) => {
    setInput(prompt);
  };

  const clearConversation = () => {
    setMessages(starterMessages);
    localStorage.removeItem("techcare-chat-history");
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="service-card h-100 p-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="ai-avatar">
                <Bot size={28} />
              </div>
              <div>
                <h3 className="mb-0">TechCare AI Support</h3>
                <small className="text-success">● Assistant online</small>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary ms-auto"
                onClick={clearConversation}
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-3">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="btn btn-sm btn-outline-primary rounded-pill"
                  onClick={() => useQuickPrompt(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {suggestion && (
              <div className="border rounded-3 p-3 mb-3" aria-live="polite">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-primary" />
                  <strong>{suggestion.issueTitle}</strong>
                  <span className={`badge ${suggestion.priority === "high" ? "bg-danger-subtle text-danger" : "bg-secondary-subtle text-secondary"}`}>
                    {suggestion.priority} priority
                  </span>
                </div>
                <div className="small text-muted mb-2">A little more detail can help narrow this down:</div>
                <div className="d-flex flex-wrap gap-2">
                  {suggestion.prompts?.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      className="btn btn-sm btn-light"
                      onClick={() => setInput(`${input.trim()} ${prompt}`)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="d-flex flex-column gap-3" style={{ minHeight: 420, maxHeight: 520, overflowY: "auto" }}>
              {messages.map((message, index) => (
                <div
                  key={`${message.sender}-${index}`}
                  className={message.sender === "user" ? "text-end" : "text-start"}
                  style={{ opacity: 1, animation: "fadeIn 0.2s ease" }}
                >
                  <div
                    className={
                      message.sender === "user"
                        ? "d-inline-block px-3 py-2 rounded-pill bg-primary text-white"
                        : "d-inline-block px-3 py-2 rounded-4 bg-light text-dark"
                    }
                    style={{ maxWidth: "80%", whiteSpace: "pre-line", lineHeight: 1.5 }}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="text-start">
                  <div className="d-inline-block px-3 py-2 rounded-4 bg-light text-dark">
                    <span className="me-2"><Sparkles size={16} className="text-primary" /></span>
                    Diagnosing your issue<span style={{ letterSpacing: "0.2em" }}>...</span>
                  </div>
                </div>
              )}

              <div ref={endOfMessagesRef} />
            </div>

            <form onSubmit={handleSubmit} className="mt-4 d-flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSubmit(event);
                  }
                }}
                className="form-control form-control-lg rounded-pill"
                placeholder="Describe your computer issue..."
                aria-label="Describe your issue"
              />
              <button className="btn btn-primary btn-lg rounded-pill" type="submit" disabled={loading}>
                <SendHorizonal size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="service-card h-100 p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <CheckCircle2 className="text-success" />
              <h4 className="mb-0">Support Cases</h4>
            </div>

            <div className="d-flex flex-column gap-3">
              {issues.length === 0 ? (
                <p className="text-muted mb-0">No active support cases yet.</p>
              ) : (
                issues.slice(0, 5).map((issue) => (
                  <div key={issue.id} className="border rounded-3 p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <strong>{issue.issue_title}</strong>
                      <span className="badge bg-primary-subtle text-primary">{issue.priority}</span>
                    </div>
                    <div className="small text-muted mt-2">
                      {issue.customer_name}
                    </div>
                    <div className="d-flex align-items-center gap-2 text-muted small mt-2">
                      <Clock size={14} />
                      {issue.status}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
