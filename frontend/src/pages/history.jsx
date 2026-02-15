import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext"; // ✅ adjust path if needed

export default function History() {
  const navigate = useNavigate();
  const { getHistoryOfUser } = useContext(AuthContext);

  const [history, setHistory] = useState([]);

  useEffect(() => {
    let alive = true;

    const loadHistory = async () => {
      try {
        const data = await getHistoryOfUser();
        if (!alive) return;
        setHistory(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        setHistory([]);
      }
    };

    loadHistory();
    return () => {
      alive = false;
    };
  }, [getHistoryOfUser]);

  return (
    <div className="homeContainer">
      <nav className="homeNav">
        <div className="navHeader">
          <div className="navLogo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h2>AirMeet</h2>
        </div>

        <div className="navlist">
          <button className="nav-icon-btn" onClick={() => navigate("/home")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, marginBottom: 8 }}>
          Meeting History
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>
          Your past meetings and sessions.
        </p>

        {history.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 60,
              background: "var(--bg-card)",
              borderRadius: 16,
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--bg-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <p style={{ color: "var(--text-muted)" }}>No meeting history yet</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 4 }}>
              Your meetings will appear here after you join or create one.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {history.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  background: "var(--bg-card)",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{item.meeting_code}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>
                    {item.date ? new Date(item.date).toLocaleString() : ""}
                  </div>
                </div>

                <button
                  className="join-link-btn"
                  style={{ padding: "8px 20px" }}
                  onClick={() => navigate(`/meet/${item.meeting_code}`)}
                >
                  Rejoin
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
