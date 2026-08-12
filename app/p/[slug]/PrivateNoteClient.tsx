"use client";

import { useState } from "react";

type Props = {
  slug: string;
};

type NoteTab = {
  id: number;
  title: string;
  content: string;
};

export default function PrivateNoteClient({ slug }: Props) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

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

  const [editingTabId, setEditingTabId] = useState<number | null>(
    null
  );

  const handleLogin = async () => {
    if (!password.trim()) {
      setMessage("Please enter your password.");
      return;
    }

    setLoading(true);
    setMessage("");

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
        setMessage(
          result.message || "Incorrect password."
        );
        return;
      }

      setUnlocked(true);
      setMessage("");
    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const activeNote =
    tabs.find((tab) => tab.id === activeTab) || tabs[0];

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
    setNextTabId((id) => id + 1);
    setSaved(false);
  };

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

  const handleSave = () => {
    /*
      Temporary UI action.

      Database save will be connected
      in the next step.
    */

    setSaved(true);
  };

  const handleReload = () => {
    /*
      Temporary UI action.

      Database reload will be connected
      in the next step.
    */

    setSaved(true);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Private Note?"
    );

    if (!confirmed) {
      return;
    }

    /*
      Temporary UI action.

      Database deletion will be connected
      in the next step.
    */

    alert(
      "Delete function will be connected to the database next."
    );
  };

  const handleChangePassword = () => {
    /*
      Temporary UI action.

      Change password dialog/API will be connected
      in the next step.
    */

    alert(
      "Change password function will be connected next."
    );
  };

  /*
   * PASSWORD SCREEN
   */

  if (!unlocked) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#f3f3f3] p-4 font-sans">
        <div className="w-full max-w-[420px] border border-[#c8c8c8] bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-[#d5d5d5] bg-[#eeeeee] px-5 py-4">
            <div className="text-[18px] font-semibold text-[#444]">
              WHOLEGACY
            </div>

            <div className="mt-1 text-xs text-[#777]">
              Private Note
            </div>
          </div>

          {/* Login */}
          <div className="p-6">
            <div className="mb-5 text-center">
              <div className="text-[16px] font-semibold text-[#444]">
                Private Note
              </div>

              <div className="mt-1 text-sm text-[#777]">
                /{slug}
              </div>
            </div>

            <label className="mb-2 block text-sm text-[#555]">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setMessage("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
              autoFocus
              autoComplete="current-password"
              placeholder="Enter password"
              disabled={loading}
              className="box-border w-full rounded border border-[#bdbdbd] bg-white px-3 py-2 text-sm text-[#333] outline-none focus:border-[#888] focus:ring-1 focus:ring-[#ddd]"
            />

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="mt-3 w-full rounded border border-[#aaa] bg-gradient-to-b from-[#fafafa] to-[#dedede] px-4 py-2 text-sm font-semibold text-[#333] shadow-sm hover:from-white hover:to-[#e8e8e8] active:from-[#ddd] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Unlocking..."
                : "Unlock"}
            </button>

            {message && (
              <div className="mt-4 border border-[#e0b4b4] bg-[#fff5f5] px-3 py-2 text-center text-xs text-[#a33]">
                {message}
              </div>
            )}

            <div className="mt-5 text-center text-[11px] text-[#999]">
              This Private Note is password protected.
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * PRIVATE NOTE WORKSPACE
   */

  return (
    <main className="flex h-screen w-full flex-col overflow-hidden bg-[#f4f4f4] font-sans text-[#444]">
      {/* =====================================================
          TOP MENU BAR
      ====================================================== */}

      <header className="flex min-h-[58px] flex-shrink-0 items-center border-b border-[#c9c9c9] bg-[#eeeeee] px-3 shadow-sm">
        {/* Logo */}

        <div className="flex min-w-[125px] items-center">
          <div className="text-[18px] font-semibold tracking-tight text-[#444]">
            WHOLEGACY
          </div>
        </div>

        {/* Toolbar */}

        <div className="ml-auto flex items-center gap-1 overflow-x-auto whitespace-nowrap">
          <button
            type="button"
            onClick={handleDelete}
            className="rounded border border-[#bcbcbc] bg-gradient-to-b from-white to-[#e4e4e4] px-3 py-1.5 text-xs font-medium text-[#444] shadow-sm hover:from-white hover:to-[#f1f1f1]"
          >
            Delete
          </button>

          <button
            type="button"
            onClick={handleChangePassword}
            className="rounded border border-[#bcbcbc] bg-gradient-to-b from-white to-[#e4e4e4] px-3 py-1.5 text-xs font-medium text-[#444] shadow-sm hover:from-white hover:to-[#f1f1f1]"
          >
            Change password
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="rounded border border-[#bcbcbc] bg-gradient-to-b from-white to-[#e4e4e4] px-3 py-1.5 text-xs font-medium text-[#444] shadow-sm hover:from-white hover:to-[#f1f1f1]"
          >
            Save
          </button>

          <button
            type="button"
            onClick={handleReload}
            className="rounded border border-[#bcbcbc] bg-gradient-to-b from-white to-[#e4e4e4] px-3 py-1.5 text-xs font-medium text-[#444] shadow-sm hover:from-white hover:to-[#f1f1f1]"
          >
            Reload
          </button>
        </div>
      </header>

      {/* =====================================================
          SITE / PATH BAR
      ====================================================== */}

      <div className="flex h-[30px] flex-shrink-0 items-center border-b border-[#d0d0d0] bg-[#fafafa] px-3">
        <span className="text-[11px] text-[#888]">
          wholegacy.com/p/{slug}
        </span>

        <span className="ml-auto text-[11px] text-[#999]">
          {saved ? "Saved" : "Unsaved changes"}
        </span>
      </div>

      {/* =====================================================
          TAB BAR
      ====================================================== */}

      <div className="flex min-h-[38px] flex-shrink-0 items-end overflow-x-auto border-b border-[#bdbdbd] bg-[#e7e7e7] px-2">
        {/* Add Tab */}

        <button
          type="button"
          onClick={addTab}
          title="New tab"
          className="mb-1 mr-1 flex h-[30px] min-w-[32px] items-center justify-center rounded-t border border-[#c0c0c0] bg-gradient-to-b from-[#fafafa] to-[#dedede] text-[18px] leading-none text-[#555] hover:bg-white"
        >
          +
        </button>

        {tabs.map((tab) => {
          const active =
            tab.id === activeTab;

          return (
            <div
              key={tab.id}
              className={`mb-0 flex h-[32px] min-w-[110px] max-w-[220px] items-center border-x border-t ${
                active
                  ? "border-[#bdbdbd] bg-white"
                  : "border-transparent bg-[#dedede]"
              }`}
            >
              {editingTabId === tab.id ? (
                <input
                  autoFocus
                  defaultValue={tab.title}
                  onBlur={(e) =>
                    renameTab(
                      tab.id,
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      renameTab(
                        tab.id,
                        e.currentTarget.value
                      );
                    }

                    if (e.key === "Escape") {
                      setEditingTabId(null);
                    }
                  }}
                  className="min-w-0 flex-1 bg-white px-2 text-xs text-[#444] outline-none"
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
                  className={`min-w-0 flex-1 truncate px-3 py-1.5 text-left text-xs ${
                    active
                      ? "font-semibold text-[#333]"
                      : "text-[#666]"
                  }`}
                  title="Double-click to rename"
                >
                  {tab.title}
                </button>
              )}

              {/* Close tab */}

              <button
                type="button"
                onClick={() =>
                  deleteTab(tab.id)
                }
                className="mr-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-xs text-[#888] hover:bg-[#ddd] hover:text-[#333]"
                title="Remove tab"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {/* =====================================================
          EDITOR
      ====================================================== */}

      <section className="min-h-0 flex-1 bg-white">
        <textarea
          value={activeNote.content}
          onChange={(e) =>
            handleContentChange(
              e.target.value
            )
          }
          placeholder="your text goes here..."
          spellCheck={false}
          className="block h-full w-full resize-none border-0 bg-white p-4 font-mono text-[14px] leading-6 text-[#333] outline-none"
        />
      </section>

      {/* =====================================================
          BOTTOM STATUS BAR
      ====================================================== */}

      <footer className="flex h-[26px] flex-shrink-0 items-center border-t border-[#d0d0d0] bg-[#eeeeee] px-3 text-[10px] text-[#888]">
        <span>
          WHOLEGACY Private Note
        </span>

        <span className="ml-auto">
          {saved
            ? "Saved"
            : "Unsaved changes"}
        </span>
      </footer>
    </main>
  );
}
