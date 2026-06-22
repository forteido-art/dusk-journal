import React, { useState, useEffect } from "react";
import { Save, Trash2, BookOpen, Check, Archive, Calendar, Download, X } from "lucide-react";
import jsPDF from "jspdf";

const entryKey = () => Date.now().toString();
const formatDate = (key) => new Date(parseInt(key)).toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
});

export default function JournalApp() {
  const [entries, setEntries] = useState({});
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [notif, setNotif] = useState("");
  const [selectedKey, setSelectedKey] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('dusk-journal-v3');
    if (data) setEntries(JSON.parse(data));
  }, []);

  const showNotif = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(""), 3000);
  };

  const handleSave = () => {
    if (!text.trim()) {
      alert("Type something first!");
      return;
    }

    const key = entryKey();
    const newEntry = { text, title, savedAt: parseInt(key) };
    const newEntries = {...entries, [key]: newEntry };

    setEntries(newEntries);
    localStorage.setItem('dusk-journal-v3', JSON.stringify(newEntries));

    setText("");
    setTitle("");
    showNotif("Entry saved!");
  };

  const handleDelete = (key) => {
    if (!window.confirm("Delete this entry?")) return;
    const newEntries = {...entries };
    delete newEntries[key];
    setEntries(newEntries);
    localStorage.setItem('dusk-journal-v3', JSON.stringify(newEntries));
    if (selectedKey === key) setSelectedKey(null);
    showNotif("Deleted");
  };

  const exportPDF = (key, entry) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(45, 27, 46);
    doc.text(entry.title || "Untitled Entry", 20, 30);

    doc.setFontSize(12);
    doc.setTextColor(139, 90, 122);
    doc.text(formatDate(key), 20, 45);

    doc.setFontSize(11);
    doc.setTextColor(45, 27, 46);
    const lines = doc.splitTextToSize(entry.text, 170);
    doc.text(lines, 20, 60);

    doc.save(`journal-${key}.pdf`);
    showNotif("PDF downloaded!");
  };

  const archiveList = Object.keys(entries).sort((a, b) => parseInt(b) - parseInt(a));
  const selectedEntry = selectedKey? entries[selectedKey] : null;
  const todayString = new Date().toISOString().split('T')[0];

  return (
    <div style={{
      height: "100vh", width: "100vw",
      background: "linear-gradient(135deg, #FFC1E3 0%, #FF8FCF 100%)",
      fontFamily: "Inter, sans-serif", padding: "12px", display: "flex", gap: "12px"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;600&display=swap');
        * { box-sizing: border-box; }
        button { cursor: pointer; border: none; border-radius: 12px; padding: 10px 16px; font-weight: 600; transition: 0.2s; }
        button:hover { transform: translateY(-2px); }
     .archive-item:hover { background: #FFE0F3!important; }
        textarea::placeholder { color: #8B5A7A; opacity: 0.6; }
        input::placeholder { color: #8B5A7A; opacity: 0.6; }
        @media (max-width: 768px) {.layout { flex-direction: column; }.sidebar { width: 100%!important; height: 40vh; }.editor { height: 60vh; } }
      `}</style>

      {notif && (
        <div style={{
          position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)",
          background: "#2D1B2E", color: "#FFC1E3", padding: "12px 24px", borderRadius: "12px",
          display: "flex", alignItems: "center", gap: "8px", zIndex: 100
        }}>
          <Check size={18} /> {notif}
        </div>
      )}

      <div className="layout" style={{ display: "flex", width: "100%", gap: "12px" }}>
        <div className="sidebar" style={{
          width: "320px", background: "white", borderRadius: "20px", padding: "20px",
          display: "flex", flexDirection: "column", boxShadow: "0 10px 40px rgba(255,105,180,0.3)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Archive size={22} color="#D946A6" />
            <h2 style={{ margin: 0, color: "#2D1B2E", fontFamily: "'Playfair Display', serif" }}>Archives ({archiveList.length})</h2>
          </div>

          <div style={{ overflowY: "auto", flex: 1 }}>
            {archiveList.length === 0? (
              <p style={{ color: "#A67B9A", textAlign: "center", marginTop: "60px" }}>
                No entries yet<br />Save one to start
              </p>
            ) : archiveList.map(key => {
              const entry = entries[key];
              const isActive = selectedKey === key;
              return (
                <div
                  key={key}
                  className="archive-item"
                  onClick={() => setSelectedKey(key)}
                  style={{
                    padding: "12px",
                    background: isActive? "#FFE0F3" : "#FFF0F8",
                    borderRadius: "12px",
                    marginBottom: "10px",
                    border: isActive? "2px solid #FF69B4" : "1px solid #FFB3E6",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ fontWeight: 600, color: "#2D1B2E", marginBottom: "4px" }}>
                    {entry.title || "Untitled"}
                  </div>
                  <div style={{ fontSize: "12px", color: "#D946A6", display: "flex", alignItems: "center", gap: "4px", marginBottom: "6px" }}>
                    <Calendar size={12} /> {formatDate(key)}
                  </div>
                  <div style={{ fontSize: "13px", color: "#8B5A7A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {entry.text.slice(0, 40)}...
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="editor" style={{
          flex: 1, background: "white", borderRadius: "20px", padding: "24px",
          display: "flex", flexDirection: "column", boxShadow: "0 10px 40px rgba(255,105,180,0.3)"
        }}>
          {selectedEntry? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <BookOpen size={24} color="#D946A6" />
                <h1 style={{ margin: 0, color: "#2D1B2E", fontSize: "1.5rem", flex: 1, fontFamily: "'Playfair Display', serif" }}>View Entry</h1>
                <button onClick={() => setSelectedKey(null)} style={{ background: "#FFF0F8", color: "#D946A6", padding: "8px 12px" }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ fontSize: "14px", color: "#8B5A7A", marginBottom: "8px" }}>Date</div>
              <div style={{ fontSize: "18px", fontWeight: 600, color: "#2D1B2E", marginBottom: "16px" }}>
                {formatDate(selectedKey)}
              </div>

              <div style={{ fontSize: "14px", color: "#8B5A7A", marginBottom: "8px" }}>Title</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#2D1B2E", marginBottom: "16px", fontFamily: "'Playfair Display', serif" }}>
                {selectedEntry.title || "Untitled"}
              </div>

              <div style={{ fontSize: "14px", color: "#8B5A7A", marginBottom: "8px" }}>Content</div>
              <div style={{
                flex: 1,
                padding: "20px",
                background: "#FFF0F8",
                border: "2px solid #FFB3E6",
                borderRadius: "16px",
                fontSize: "15px",
                lineHeight: 1.8,
                color: "#000",
                overflowY: "auto",
                whiteSpace: "pre-wrap"
              }}>
                {selectedEntry.text}
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                <button onClick={() => exportPDF(selectedKey, selectedEntry)} style={{ background: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)", color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Download size={18} /> Export PDF
                </button>
                <button onClick={() => handleDelete(selectedKey)} style={{ background: "#FFB3B3", color: "#E74C3C", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Trash2 size={18} /> Delete
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <BookOpen size={24} color="#D946A6" />
                <h1 style={{ margin: 0, color: "#2D1B2E", fontSize: "1.5rem", fontFamily: "'Playfair Display', serif" }}>New Entry</h1>
                <span style={{ marginLeft: "auto", color: "#8B5A7A", fontSize: "14px" }}>{formatDate(entryKey())}</span>
              </div>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entry title..."
                style={{
                  padding: "12px 16px",
                  background: "#FFF0F8",
                  border: "2px solid #FFB3E6",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: 600,
                  marginBottom: "12px",
                  outline: "none",
                  color: "#000",
                  fontFamily: "'Playfair Display', serif"
                }}
              />

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write here..."
                style={{
                  flex: 1,
                  padding: "20px",
                  background: "#FFF0F8",
                  border: "2px solid #FFB3E6",
                  borderRadius: "16px",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  resize: "none",
                  outline: "none",
                  color: "#000"
                }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
                <span style={{ color: "#8B5A7A" }}>{text.trim().split(/\s+/).filter(Boolean).length} words</span>
                <button
                  onClick={handleSave}
                  disabled={!text.trim()}
                  style={{
                    background: text.trim()? "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)" : "#E0E0E0",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    opacity: text.trim()? 1 : 0.5
                  }}
                >
                  <Save size={18} /> Save & Clear
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
