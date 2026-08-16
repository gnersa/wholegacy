"use client";

import { useEffect, useState } from "react";

type Note = {
  id: string;
  title: string;
  content: string;
  tab_order: number;
};

type Props = {
  slug: string;
};

export default function PrivateNoteClient({ slug }: Props) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "",
      title: "Note 1",
      content: "",
      tab_order: 0,
    },
  ]);

  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("Ready");

  const loadNotes = async () => {
    try {
      setMessage("Loading...");

      const response = await fetch("/api/private-note/reload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load notes.");
      }

      if (data.notes && data.notes.length > 0) {
        setNotes(data.notes);
        setActiveTab(0);
      } else {
        setNotes([
          {
            id: "",
            title: "Note 1",
            content: "",
            tab_order: 0,
          },
        ]);
        setActiveTab(0);
      }

      setMessage("Saved");
    } catch (error) {
      console.error("LOAD NOTES ERROR:", error);
      setMessage("Unable to load");
    }
  };

  useEffect(() => {
    loadNotes();
  }, [slug]);

  const saveNote = async () => {
    const note = notes[activeTab];

    if (!note) return;

    try {
      setSaving(true);
      setMessage("Saving...");

      const response = await fetch("/api/private-note/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          noteId: note.id,
          title: note.title,
          content: note.content,
          tabOrder: activeTab,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save.");
      }

      if (data.note) {
        setNotes((current) =>
          current.map((item, index) =>
            index === activeTab
              ? {
                  ...item,
                  id: data.note.id,
                  title: data.note.title,
                  content: data.note.content,
                  tab_order: data.note.tab_order,
                }
              : item
          )
        );
      }

      setMessage("Saved");
    } catch (error) {
      console.error("SAVE NOTE ERROR:", error);
      setMessage("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const updateContent = (value: string) => {
    setNotes((current) =>
      current.map((note, index) =>
        index === activeTab
          ? {
              ...note,
              content: value,
            }
          : note
      )
    );

    setMessage("Unsaved changes");
  };

  const addTab = () => {
    const newNote: Note = {
      id: "",
      title: `Note ${notes.length + 1}`,
      content: "",
      tab_order: notes.length,
    };

    setNotes((current) => [...current, newNote]);
    setActiveTab(notes.length);
    setMessage("Unsaved changes");
  };

  const removeTab = (index: number) => {
    if (notes.length === 1) return;

    const newNotes = notes.filter((_, i) => i !== index);

    setNotes(
      newNotes.map((note, i) => ({
        ...note,
        tab_order: i,
      }))
    );

    if (activeTab >= newNotes.length) {
      setActiveTab(newNotes.length - 1);
    } else if (index < activeTab) {
      setActiveTab(activeTab - 1);
    }

    setMessage("Unsaved changes");
  };

  const renameTab = (index: number) => {
    const currentTitle = notes[index]?.title || "";

    const newTitle = window.prompt(
      "Rename note",
      currentTitle
    );

    if (newTitle === null) return;

    const cleanTitle = newTitle.trim();

    if (!cleanTitle) return;

    setNotes((current) =>
      current.map((note, i) =>
        i === index
          ? {
              ...note,
              title: cleanTitle,
            }
          : note
      )
    );

    setMessage("Unsaved changes");
  };

  const activeNote = notes[activeTab];

  return (
    <main className="wl-note-app">

      {/* TOP NAVIGATION */}

      <header className="wl-note-nav">

        <div className="wl-note-logo">
          <span className="wl-note-logo-mark">W</span>
          <span>WHOLEGACY</span>
        </div>

        <div className="wl-note-nav-right">

          <div className="wl-note-status">
            <span className="wl-status-dot" />
            Private workspace
          </div>

          <button
            type="button"
            className="wl-button wl-button-secondary"
            onClick={loadNotes}
          >
            ↻ Reload
          </button>

          <button
            type="button"
            className="wl-button wl-button-primary"
            onClick={saveNote}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>

        </div>

      </header>


      {/* WORKSPACE */}

      <section className="wl-note-workspace">

        {/* WORKSPACE HEADER */}

        <div className="wl-note-workspace-header">

          <div>
            <div className="wl-note-eyebrow">
              PRIVATE NOTE
            </div>

            <h1>
              Your private story
            </h1>

            <div className="wl-note-url">
              wholegacy.com/p/{slug}
            </div>
          </div>

          <div className="wl-note-header-actions">

            <button
              type="button"
              className="wl-note-text-button"
              onClick={() =>
                alert("Change password will be added next.")
              }
            >
              Change password
            </button>

            <button
              type="button"
              className="wl-note-danger-button"
              onClick={() =>
                alert("Delete will be added next.")
              }
            >
              Delete workspace
            </button>

          </div>

        </div>


        {/* EDITOR CARD */}

        <div className="wl-note-card">

          {/* TABS */}

          <div className="wl-note-tabs-bar">

            <div className="wl-note-tabs">

              {notes.map((note, index) => (

                <div
                  key={note.id || `new-${index}`}
                  className={
                    index === activeTab
                      ? "wl-note-tab active"
                      : "wl-note-tab"
                  }
                >

                  <button
                    type="button"
                    className="wl-note-tab-title"
                    onClick={() => setActiveTab(index)}
                    onDoubleClick={() => renameTab(index)}
                    title="Double-click to rename"
                  >
                    {note.title}
                  </button>

                  {notes.length > 1 && (
                    <button
                      type="button"
                      className="wl-note-tab-close"
                      onClick={() => removeTab(index)}
                      title="Remove note"
                    >
                      ×
                    </button>
                  )}

                </div>

              ))}

              <button
                type="button"
                className="wl-note-new-tab"
                onClick={addTab}
                title="New note"
              >
                +
              </button>

            </div>

          </div>


          {/* EDITOR */}

          <div className="wl-note-editor">

            <textarea
              value={activeNote?.content || ""}
              onChange={(e) =>
                updateContent(e.target.value)
              }
              placeholder="Start writing your story..."
              spellCheck={false}
            />

          </div>


          {/* EDITOR FOOTER */}

          <div className="wl-note-editor-footer">

            <span>
              {activeNote?.content?.length || 0} characters
            </span>

            <span className="wl-note-save-status">
              {message}
            </span>

          </div>

        </div>


        {/* BOTTOM INFO */}

        <div className="wl-note-bottom">

          <div>
            <strong>Your legacy, your control.</strong>
            <span>
              {" "}Everything you write here belongs to your private workspace.
            </span>
          </div>

          <div className="wl-note-secure">
            <span className="wl-status-dot" />
            Private
          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="wl-note-footer">

        <span>
          © WHOLEGACY
        </span>

        <span>
          Private Note
        </span>

      </footer>

    </main>
  );
}
