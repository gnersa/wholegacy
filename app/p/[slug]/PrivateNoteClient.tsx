"use client";

import React, { useState } from "react";

type Props = {
  slug: string;
};

type NoteTab = {
  id: number;
  title: string;
  content: string;
};

export default function PrivateNoteClient({ slug }: Props) {
  /* =========================
     LOGIN
  ========================= */

  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  /* =========================
     NOTES
  ========================= */

  const [tabs, setTabs] = useState<NoteTab[]>([
    {
      id: 1,
      title: "Note 1",
      content: "",
    },
  ]);

  const [activeTab, setActiveTab] = useState(1);
  const [nextTabId, setNextTabId] = useState(2);

  const [saved, setSaved] = useState(true);

  const [editingTabId, setEditingTabId] =
    useState<number | null>(null);

  /* =========================
     LOGIN
  ========================= */

  const handleLogin = async () => {
    if (!password.trim()) {
      setLoginMessage("Please enter your password.");
      return;
    }

    setLoading(true);
    setLoginMessage("");

    try {
      const response = await fetch(
        "/api/private-note/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setLoginMessage(
          result.message || "Incorrect password."
        );
        return;
      }

      setUnlocked(true);
      setLoginMessage("");
    } catch (error) {
      console.error(error);

      setLoginMessage(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     ACTIVE NOTE
  ========================= */

  const activeNote =
    tabs.find((tab) => tab.id === activeTab) ||
    tabs[0];

  /* =========================
     CONTENT
  ========================= */

  const handleContentChange = (
    value: string
  ) => {
    setTabs((currentTabs) =>
      currentTabs.map((tab) =>
        tab.id === activeTab
          ? {
              ...tab,
              content: value,
            }
          : tab
      )
    );

    setSaved(false);
  };

  /* =========================
     ADD TAB
  ========================= */

  const addTab = () => {
    const newTab: NoteTab = {
      id: nextTabId,
      title: `Note ${nextTabId}`,
      content: "",
    };

    setTabs((currentTabs) => [
      ...currentTabs,
      newTab,
    ]);

    setActiveTab(nextTabId);
    setNextTabId((current) => current + 1);
    setSaved(false);
  };

  /* =========================
     DELETE TAB
  ========================= */

  const deleteTab = (id: number) => {
    if (tabs.length === 1) {
      return;
    }

    const index = tabs.findIndex(
      (tab) => tab.id === id
    );

    const remainingTabs = tabs.filter(
      (tab) => tab.id !== id
    );

    setTabs(remainingTabs);

    if (activeTab === id) {
      const nextTab =
        remainingTabs[index] ||
        remainingTabs[remainingTabs.length - 1];

      setActiveTab(nextTab.id);
    }

    setSaved(false);
  };

  /* =========================
     RENAME TAB
  ========================= */

  const renameTab = (
    id: number,
    title: string
  ) => {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setEditingTabId(null);
      return;
    }

    setTabs((currentTabs) =>
      currentTabs.map((tab) =>
        tab.id === id
          ? {
              ...tab,
              title: cleanTitle,
            }
          : tab
      )
    );

    setEditingTabId(null);
    setSaved(false);
  };

  /* =========================
     SAVE
  ========================= */

  const handleSave = () => {
    /*
      DATABASE SAVE AKAN DISAMBUNGKAN
      PADA TAHAP BERIKUTNYA.
    */

    setSaved(true);
  };

  /* =========================
     RELOAD
  ========================= */

  const handleReload = () => {
    /*
      DATABASE RELOAD AKAN DISAMBUNGKAN
      PADA TAHAP BERIKUTNYA.
    */

    setSaved(true);
  };

  /* =========================
     DELETE WORKSPACE
  ========================= */

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this Private Note?"
    );

    if (!confirmed) {
      return;
    }

    /*
      DELETE DATABASE AKAN DISAMBUNGKAN
      PADA TAHAP BERIKUTNYA.
    */

    window.alert(
      "Delete function will be connected to the database next."
    );
  };

  /* =========================
     CHANGE PASSWORD
  ========================= */

  const handleChangePassword = () => {
    /*
      CHANGE PASSWORD AKAN DISAMBUNGKAN
      PADA TAHAP BERIKUTNYA.
    */

    window.alert(
      "Change password function will be connected next."
    );
  };

  /* =====================================================
     PASSWORD SCREEN
  ===================================================== */

  if (!unlocked) {
    return (
      <main className="private-login">
        <div className="private-login-box">

          <div className="private-login-header">
            <div className="private-logo">
              WHOLEGACY
            </div>

            <div className="private-login-subtitle">
              Private Note
            </div>
          </div>

          <div className="private-login-body">

            <div className="private-login-title">
              Private Note
            </div>

            <div className="private-login-path">
              /{slug}
            </div>

            <label
              htmlFor="private-password"
              className="private-login-label"
            >
              Password
            </label>

            <input
              id="private-password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setLoginMessage("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleLogin();
                }
              }}
              autoFocus
              autoComplete="current-password"
              placeholder="Enter password"
              disabled={loading}
              className="private-password-input"
            />

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="private-login-button"
            >
              {loading
                ? "Unlocking..."
                : "Unlock"}
            </button>

            {loginMessage && (
              <div className="private-login-error">
                {loginMessage}
              </div>
            )}

            <div className="private-login-note">
              This Private Note is password protected.
            </div>

          </div>
        </div>
      </main>
    );
  }

  /* =====================================================
     PRIVATE NOTE WORKSPACE
  ===================================================== */

  return (
    <main className="private-workspace">

      {/* =========================
          TOP MENU
      ========================= */}

      <header className="private-menubar">

        <div className="private-brand">
          WHOLEGACY
        </div>

        <div className="private-toolbar">

          <button
            type="button"
            onClick={handleDelete}
            className="private-button"
          >
            Delete
          </button>

          <button
            type="button"
            onClick={handleChangePassword}
            className="private-button"
          >
            Change password
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="private-button"
          >
            Save
          </button>

          <button
            type="button"
            onClick={handleReload}
            className="private-button"
          >
            Reload
          </button>

        </div>
      </header>

      {/* =========================
          PATH / STATUS
      ========================= */}

      <div className="private-pathbar">

        <span>
          wholegacy.com/p/{slug}
        </span>

        <span
          className={
            saved
              ? "private-status saved"
              : "private-status"
          }
        >
          {saved
            ? "Saved"
            : "Unsaved changes"}
        </span>

      </div>

      {/* =========================
          TABS
      ========================= */}

      <div className="private-tabs-wrapper">

        <button
          type="button"
          onClick={addTab}
          title="New tab"
          className="private-add-tab"
        >
          +
        </button>

        <div className="private-tabs">

          {tabs.map((tab) => {
            const isActive =
              tab.id === activeTab;

            return (
              <div
                key={tab.id}
                className={
                  isActive
                    ? "private-tab active"
                    : "private-tab"
                }
              >

                {editingTabId === tab.id ? (
                  <input
                    autoFocus
                    defaultValue={tab.title}
                    className="private-tab-input"
                    onBlur={(event) =>
                      renameTab(
                        tab.id,
                        event.target.value
                      )
                    }
                    onKeyDown={(event) => {

                      if (
                        event.key ===
                        "Enter"
                      ) {
                        renameTab(
                          tab.id,
                          event.currentTarget.value
                        );
                      }

                      if (
                        event.key ===
                        "Escape"
                      ) {
                        setEditingTabId(null);
                      }

                    }}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab(tab.id)
                    }
                    onDoubleClick={() =>
                      setEditingTabId(tab.id)
                    }
                    className="private-tab-title"
                    title="Double-click to rename"
                  >
                    {tab.title}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    deleteTab(tab.id)
                  }
                  className="private-tab-close"
                  title="Remove tab"
                >
                  ×
                </button>

              </div>
            );
          })}

        </div>
      </div>

      {/* =========================
          EDITOR
      ========================= */}

      <section className="private-editor">

        <textarea
          value={activeNote.content}
          onChange={(event) =>
            handleContentChange(
              event.target.value
            )
          }
          placeholder="your text goes here..."
          spellCheck={false}
          className="private-textarea"
        />

      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="private-footer">

        <span>
          WHOLEGACY Private Note
        </span>

        <span>
          {saved
            ? "Saved"
            : "Unsaved changes"}
        </span>

      </footer>

    </main>
  );
}
