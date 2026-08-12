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
      }

      setMessage("Loaded");
    } catch (error) {
      console.error(error);
      setMessage("Failed to load");
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

      setMessage("Saved!");
    } catch (error) {
      console.error(error);
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
      "Enter tab name:",
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
    <main className="private-note-app">
      <header className="private-note-header">
        <div className="private-note-brand">
          WHOLEGACY
        </div>

        <div className="private-note-actions">
          <button
            type="button"
            onClick={saveNote}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={loadNotes}
          >
            Reload
          </button>

          <button
            type="button"
            onClick={() => {
              alert("Change password will be added next.");
            }}
          >
            Change password
          </button>

          <button
            type="button"
            onClick={() => {
              alert("Delete will be added next.");
            }}
          >
            Delete
          </button>
        </div>
      </header>

      <div className="private-note-info">
        <span>
          wholegacy.com/p/{slug}
        </span>

        <span>
          {message}
        </span>
      </div>

      <div className="private-note-tabs">
        <button
          type="button"
          className="private-note-add-tab"
          onClick={addTab}
          title="New tab"
        >
          +
        </button>

        {notes.map((note, index) => (
          <div
            key={note.id || `new-${index}`}
            className={
              index === activeTab
                ? "private-note-tab active"
                : "private-note-tab"
            }
          >
            <button
              type="button"
              className="private-note-tab-title"
              onClick={() => setActiveTab(index)}
              onDoubleClick={() => renameTab(index)}
              title="Double-click to rename"
            >
              {note.title}
            </button>

            {notes.length > 1 && (
              <button
                type="button"
                className="private-note-tab-close"
                onClick={() => removeTab(index)}
                title="Remove tab"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <section className="private-note-editor">
        <textarea
          value={activeNote?.content || ""}
          onChange={(e) => updateContent(e.target.value)}
          placeholder="your text goes here..."
          spellCheck={false}
        />
      </section>

      <footer className="private-note-footer">
        <span>
          WHOLEGACY Private Note
        </span>

        <span>
          {message}
        </span>
      </footer>
    </main>
  );
}
