import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const VideoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);
const HistoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

export default function HomeComponent() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);

  const { addToUserHistory } = useContext(AuthContext);

  const generateMeetingCode = () => {
    return (
      Math.random().toString(36).substring(2, 5) +
      "-" +
      Math.random().toString(36).substring(2, 6) +
      "-" +
      Math.random().toString(36).substring(2, 5)
    );
  };

  const handleJoinVideoCall = async () => {
    const code = meetingCode.trim();
    if (!code) return;

    try {
      await addToUserHistory(code);
    } catch (e) {
      // ignore
    }

    // IMPORTANT: App.js route is "/:url" (not /meet/:id)
    navigate(`/meet/${code}`);
  };

  const handleStartNewMeeting = () => {
    const code = generateMeetingCode();
    setGeneratedCode(code);
    setMeetingTitle("");
    setCopied(false);
    setShowNewMeetingModal(true);
  };

  const handleCreateAndJoin = async () => {
    if (meetingTitle.trim()) {
      localStorage.setItem(`meeting_title_${generatedCode}`, meetingTitle.trim());
    }

    try {
      await addToUserHistory(generatedCode);
    } catch (e) {
      // ignore
    }

    // IMPORTANT: App.js route is "/:url"
    navigate(`/meet/${generatedCode}`);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // ignore
    }
  };

  const handleCopyLink = async () => {
    try {
      const meetingLink = `${window.location.origin}/meet/${generatedCode}`;
      await navigator.clipboard.writeText(meetingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // ignore
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("airmeet_current_user");
    navigate("/auth");
  };

  return (
    <div className="homeContainer">
      <nav className="homeNav">
        <div className="navHeader">
          <div className="navLogo"><VideoIcon /></div>
          <h2>AirMeet</h2>
        </div>

        <div className="navlist">
          <button className="nav-icon-btn" onClick={() => navigate("/history")}>
            <HistoryIcon /> <span>History</span>
          </button>
          <button className="nav-btn-secondary" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="homeMain">
        <div className="homeHero">
          <div className="hero-badge">
            <div className="hero-badge-dot"></div>
            <span>Meeting Dashboard Active</span>
          </div>

          <h1>
            Premium video meetings.<br />
            <span className="gradient-text">Now free for everyone.</span>
          </h1>

          <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
            Secure, crystal clear video conferencing designed for seamless collaboration.
            Start a new meeting or join one using a code.
          </p>

          <div className="homeActions">
            <button className="btn-primary" onClick={handleStartNewMeeting}>
              <PlusIcon /> New Meeting
            </button>

            <div className="joinInputGroup">
              <div className="inputWrapper">
                <VideoIcon />
                <input
                  type="text"
                  placeholder="Enter a code"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleJoinVideoCall()}
                />
              </div>
              <button className="join-link-btn" onClick={handleJoinVideoCall} disabled={!meetingCode.trim()}>
                Join
              </button>
            </div>
          </div>

          <div className="homeDivider"></div>
          <p className="homeFooterText">Your privacy is our priority. No data is stored without encryption.</p>
        </div>

        <div className="homeImageSection">
          <div className="imageCardWrapper">
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--primary-bg)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                  <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Start or join a meeting</p>
            </div>
          </div>
        </div>
      </main>

      {showNewMeetingModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowNewMeetingModal(false);
          }}
        >
          <div className="modal-card">
            <h2>Create New Meeting</h2>
            <p>Set a meeting title and share the code with participants.</p>

            <label>Meeting Title (optional)</label>
            <input
              type="text"
              placeholder="e.g., Team Standup, Design Review"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
            />

            <label>Meeting Code</label>
            <div className="invite-copy-box">
              <input type="text" value={generatedCode} readOnly />
              <button className="invite-copy-btn" onClick={handleCopyCode}>
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>

            <label>Meeting Link</label>
            <div className="invite-copy-box">
              <input type="text" value={`${window.location.origin}/meet/${generatedCode}`} readOnly />
              <button className="invite-copy-btn" onClick={handleCopyLink}>
                <CopyIcon /> {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>

            <div className="modal-actions">
              <button className="modal-btn-cancel" onClick={() => setShowNewMeetingModal(false)}>
                Cancel
              </button>
              <button className="modal-btn-primary" onClick={handleCreateAndJoin}>
                Start Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

