import type { Metadata } from "next";
import Link from "next/link";
import {
  getProjectModelState,
  isDeprecatedModelFallback,
} from "./model-state";

export const metadata: Metadata = {
  title: "Model settings · ASU AI",
  description: "Configure the model used by your AI project.",
};

type HomeProps = {
  searchParams: Promise<{ state?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { state } = await searchParams;
  const project = getProjectModelState(state === "active" ? "active" : "fallback");
  const hasDeprecatedFallback = isDeprecatedModelFallback(project.model);

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand" aria-label="ASU AI home">
          <span className="brand-mark">ASU</span>
          <span>ASU AI</span>
        </div>

        <nav className="nav-list">
          <a href="#overview"><span className="nav-icon">⌂</span>Overview</a>
          <a href="#playground"><span className="nav-icon">✦</span>Playground</a>
          <a href="#data"><span className="nav-icon">◫</span>Knowledge</a>
          <a className="active" href="#settings" aria-current="page"><span className="nav-icon">⚙</span>Settings</a>
        </nav>

        <div className="workspace-card">
          <span className="avatar">ASU</span>
          <span><strong>ASU workspace</strong><small>AI Builder</small></span>
          <span aria-hidden="true">•••</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>Projects</span><b>/</b><strong>{project.name}</strong></div>
          <div className="top-actions">
            <span className="status-dot"><i /> All systems operational</span>
            <button className="icon-button" aria-label="Notifications">♢</button>
            <span className="header-avatar">ASU</span>
          </div>
        </header>

        <div className="content-wrap">
          <section className="page-heading">
            <div>
              <p className="eyebrow">PROJECT SETTINGS</p>
              <h1>Model configuration</h1>
              <p>Choose the model that powers responses for this project.</p>
            </div>
            <span className="project-id">ID&nbsp; {project.id}</span>
          </section>

          <section className="settings-card" aria-labelledby="model-heading">
            <div className="card-header">
              <span className="model-glyph" aria-hidden="true">✦</span>
              <div><h2 id="model-heading">Language model</h2><p>Used for every new conversation in this project.</p></div>
            </div>

            <div className="field-group">
              <label htmlFor="model">Selected model</label>
              <div className="select-wrap">
                <select id="model" name="model" defaultValue={project.model.selected.id}>
                  <option value={project.model.selected.id}>
                    {project.model.selected.label}{project.model.selected.status === "deprecated" ? " — Deprecated" : ""}
                  </option>
                  {project.model.selected.id !== "nimbus-4-1" && (
                    <option value="nimbus-4-1">Nimbus 4.1</option>
                  )}
                  <option value="swift-3">Swift 3</option>
                </select>
              </div>
              <p className="field-help">The model shown here reflects your project&apos;s saved selection.</p>
            </div>

            {hasDeprecatedFallback && project.model.fallback && (
              <div className="fallback-notice" role="status" aria-live="polite">
                <span className="notice-icon" aria-hidden="true">i</span>
                <div>
                  <strong>Your project is using a fallback model</strong>
                  <p>
                    {project.model.selected.label} has been deprecated. Your experience is continuing on <b>{project.model.active.label}</b>, an active fallback model. You don&apos;t need to take any action.
                  </p>
                </div>
              </div>
            )}

            <div className="model-meta">
              <div><span>ACTIVE MODEL</span><strong>{project.model.active.label}</strong></div>
              <div><span>CONTEXT WINDOW</span><strong>{project.model.active.contextWindow}</strong></div>
              <div><span>UPDATED</span><strong>{project.model.updatedAt}</strong></div>
            </div>

            <div className="card-footer">
              <span>Changes apply to new conversations only.</span>
              <div><button className="secondary-button">Cancel</button><button className="primary-button">Save changes</button></div>
            </div>
          </section>

          <section className="preview-panel" aria-label="Acceptance criteria preview">
            <div><span className="preview-kicker">QA PREVIEW</span><strong>Backend state: {hasDeprecatedFallback ? "deprecated fallback" : "active selection"}</strong></div>
            <Link href={hasDeprecatedFallback ? "/?state=active" : "/?state=fallback"}>
              View {hasDeprecatedFallback ? "unaffected" : "fallback"} state <span aria-hidden="true">→</span>
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
