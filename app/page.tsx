import type { Metadata } from "next";
import Link from "next/link";
import { getProjectModelState, isDeprecatedModelFallback } from "./model-state";

export const metadata: Metadata = {
  title: "Basic settings · ASU AI",
  description: "Configure an ASU AI project and its language model.",
};

type HomeProps = { searchParams: Promise<{ state?: string }> };

const navItems = [
  ["▦", "Basic"], ["▱", "Edit view"], ["▤", "Knowledge"],
  ["♙", "Behaviors"], ["↗", "Share"], ["▥", "Analytics"], ["☑", "Evaluation"],
];

export default async function Home({ searchParams }: HomeProps) {
  const { state } = await searchParams;
  const project = getProjectModelState(state === "active" ? "active" : "fallback");
  const hasDeprecatedFallback = isDeprecatedModelFallback(project.model);

  return (
    <main className="builder-shell">
      <section className="announcement" aria-label="Product announcement">
        <span className="info-dot">i</span>
        <p>📣 <strong>New:</strong> We&apos;ve refreshed the dashboard and added a new FAQ Template. <a href="#updates">Learn More Here</a></p>
        <time>July 10, 2026</time><button aria-label="Dismiss announcement">×</button>
      </section>

      <header className="project-bar">
        <div className="breadcrumb"><span aria-hidden="true">←</span><a href="#dashboard">Dashboard</a><b>|</b><strong>FAQ Assistant 1784051755110</strong></div>
        <div className="spark-badge" aria-label="ASU AI">✦</div>
        <div className="publish-status"><span className="saved-check">✓</span><span>Changes saved - ready to publish</span><button>Publish</button></div>
      </header>

      <div className="builder-grid">
        <aside className="tool-nav" aria-label="Create AI navigation">
          <h2>Create AI</h2>
          <nav>{navItems.map(([icon, label], index) => <a className={index === 0 ? "active" : ""} href={`#${label.toLowerCase().replace(" ", "-")}`} key={label}><span>{icon}</span>{label}</a>)}</nav>
          <div className="profile">ASU</div>
        </aside>

        <section className="settings-pane" aria-labelledby="basic-heading">
          <div className="settings-content">
            <div className="settings-heading"><span className="basic-icon" aria-hidden="true"><i /><i /><i /><i /></span><div><h1 id="basic-heading">Basic settings</h1><p>Give your AI project a name, choose an AI model, and write custom instructions to shape how the AI responds and behaves.</p></div></div>

            <div className="form-field"><label htmlFor="project-name">Project name</label><div className="input-count"><input id="project-name" defaultValue="FAQ Assistant 1784051755110" /><span>27 / 60</span></div></div>
            <div className="form-field"><label htmlFor="project-subtitle">Project subtitle</label><p>Add a brief description to summarize your AI project.</p><div className="input-count"><input id="project-subtitle" defaultValue="Use this to create FAQ Assistants that can answer questions based on your content." /><span>80 / 240</span></div></div>
            <div className="form-field instructions-field"><label htmlFor="instructions">Custom instructions</label><p>Custom instructions (also called a system prompt) let you define your model&apos;s role, goals, and response style. Get help with the <a href="#guide">Custom Instructions AI Guide ↗</a></p><textarea id="instructions" defaultValue={"You are an AI assistant that answers questions using the documents and knowledge base provided for this project.\n\nYour primary goal is to provide accurate, helpful, and concise answers grounded in the available project content."} /></div>

            <div className="model-section">
              <label htmlFor="model">Choose a model</label>
              <p>A model has been automatically selected to provide the best balance of performance, quality, and cost. Explore other options with our <a href="#compare">Model Comparison Tool ↗</a></p>
              <div className="model-select-wrap">
                <select id="model" name="model" defaultValue={project.model.selected.id}>
                  {hasDeprecatedFallback && <option value="gpt-4-1-mini">GPT-4.1 Mini — Deprecated</option>}
                  <optgroup label="Recommended">
                    <option value="gpt-5-4-nano">GPT-5.4 Nano · OpenAI</option>
                    <option value="gpt-4-1-mini-active">GPT-4.1 Mini · OpenAI · 1M context</option>
                    <option value="gemma4-31b-it">Gemma4 31B IT · ASU AIR · 128k context</option>
                    <option value="gpt-5-5">GPT-5.5 · OpenAI · 1M context</option>
                  </optgroup>
                  <optgroup label="Advanced">
                    <option value="deep-thinking">Deep Thinking</option>
                  </optgroup>
                </select>
              </div>

              {hasDeprecatedFallback && project.model.fallback && <div className="fallback-notice" role="status" aria-live="polite"><span className="notice-icon">i</span><div><strong>Your selected model has been deprecated</strong><p>Your project still shows <b>{project.model.selected.label}</b>, but it is now running on <b>{project.model.active.label}</b>, an active fallback model. Your experience will continue without interruption.</p></div></div>}
            </div>

            <div className="tools-row"><div><strong>Enable external tools</strong><p>External tools enable agents to take action with various outputs, depending on the tool.</p></div><button className="toggle" aria-label="Enable external tools" aria-pressed="false"><span /></button></div>

            <div className="qa-switch"><span>Prototype state: <b>{hasDeprecatedFallback ? "deprecated fallback" : "active model"}</b></span><Link href={hasDeprecatedFallback ? "/?state=active" : "/?state=fallback"}>View {hasDeprecatedFallback ? "unaffected" : "fallback"} state →</Link></div>
          </div>
        </section>

        <section className="preview-pane" aria-labelledby="preview-heading">
          <h2 id="preview-heading">Preview and test your AI project here</h2>
          <div className="preview-card">
            <div className="preview-card-actions"><button aria-label="Toggle preview panel">◧</button><button aria-label="Expand preview">⛶</button></div>
            <div className="assistant-intro"><div className="asu-mark">ASU</div><h3>FAQ Assistant 1784051755110</h3><p>Use this to create FAQ Assistants that can answer questions based on your content. It can also be used to create a knowledge base for your team or organization.</p></div>
            <div className="chat-composer"><span>Ask anything...</span><div><span>⊕ Attach or Drop Files Here</span><button aria-label="Use microphone">♩</button><button className="voice" aria-label="Voice mode">▮▮▮</button><button className="send" aria-label="Send message">↑</button></div></div>
            <p className="terms">By using this AI project, you acknowledge and agree to these <a href="#terms">terms</a>. FAQ Assistant bot may display incorrect or false information.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
