import { useEffect, useRef, useState } from "react";
import { studies } from "./data/studies";
import type { Study, LiveResult, ResearchPlan } from "./types";
import "./App.css";

type Filters = { query?: string; condition?: string; targetRegion?: string; method?: string; population?: string };
type Tab = "browse" | "compare" | "plan" | "live";
type Theme = "light" | "dark";

function filterStudies(list: Study[], filters: Filters): Study[] {
  const f = {
    query: (filters.query ?? "").toLowerCase().trim(),
    condition: (filters.condition ?? "").toLowerCase().trim(),
    targetRegion: (filters.targetRegion ?? "").toLowerCase().trim(),
    method: (filters.method ?? "").toLowerCase().trim(),
    population: (filters.population ?? "").toLowerCase().trim(),
  };
  return list.filter((s) => {
    if (f.condition && !s.condition.toLowerCase().includes(f.condition)) return false;
    if (f.targetRegion && !s.targetRegion.toLowerCase().includes(f.targetRegion)) return false;
    if (f.method && !s.optimizationMethod.toLowerCase().includes(f.method)) return false;
    if (f.population && !s.population.toLowerCase().includes(f.population)) return false;
    if (!f.query) return true;
    const haystack = [s.title, s.condition, s.targetRegion, s.optimizationMethod, ...s.tags].join(" ").toLowerCase();
    return haystack.includes(f.query);
  });
}

function groupByTag(list: Study[]): Record<string, Study[]> {
  const groups: Record<string, Study[]> = {};
  list.forEach((s) => s.tags.forEach((tag) => {
    if (!groups[tag]) groups[tag] = [];
    groups[tag].push(s);
  }));
  return groups;
}

function buildPlanFromStudies(question: string, selected: Study[], allStudies: Study[]): ResearchPlan {
  const methodMap = new Map<string, string[]>();
  selected.forEach((s) => {
    if (!s.optimizationMethod || s.optimizationMethod.startsWith("N/A") || s.optimizationMethod.startsWith("None")) return;
    if (!methodMap.has(s.optimizationMethod)) methodMap.set(s.optimizationMethod, []);
    methodMap.get(s.optimizationMethod)!.push(s.title);
  });
  const candidateMethods = Array.from(methodMap.entries()).map(([method, titles]) => ({
    method, rationale: `Supported by: ${titles.join("; ")}`,
  }));

  const populations = selected.map((s) => s.population).filter(Boolean);
  const proposedPopulation = populations.length ? populations.join(" | ") : "Not specified — no population data in selected studies.";
  const proposedOutcomeMeasures = Array.from(new Set(selected.map((s) => s.outcomeMeasure).filter((o) => o && !o.startsWith("N/A"))));

  const selectedTags = new Set(selected.flatMap((s) => s.tags));
  const allTags = Array.from(new Set(allStudies.flatMap((s) => s.tags)));

  const q = question.toLowerCase();
  const questionSpecificGaps = allTags
    .filter((t) => !selectedTags.has(t) && q.includes(t.replace(/-/g, " ")))
    .map((t) => `Your question mentions "${t.replace(/-/g, " ")}", but none of the selected studies cover it.`);
  const generalGaps = allTags
    .filter((t) => !selectedTags.has(t))
    .slice(0, 4)
    .map((t) => `No selected study addresses "${t}" — worth searching separately.`);

  return {
    id: `plan-${Date.now()}`,
    question,
    candidateMethods,
    proposedPopulation,
    proposedOutcomeMeasures,
    questionSpecificGaps,
    evidenceGaps: generalGaps.slice(0, 5),
    basedOnStudyIds: selected.map((s) => s.id),
  };
}

async function searchEuropePMC(query: string, pageSize = 8): Promise<LiveResult[]> {
  const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(query)}&format=json&pageSize=${pageSize}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Europe PMC request failed: ${res.status}`);
  const data = await res.json();
  const results = data?.resultList?.result ?? [];
  return results.map((r: any) => ({
    id: `live-${r.id}`,
    title: r.title ?? "Untitled",
    authors: r.authorString ?? "Unknown authors",
    journal: r.journalTitle ?? r.source ?? "Unknown source",
    year: String(r.pubYear ?? "n.d."),
    url: r.doi ? `https://doi.org/${r.doi}` : r.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/` : `https://europepmc.org/article/${r.source}/${r.id}`,
  }));
}

function TriangulateMark() {
  return (
    <svg className="mark" viewBox="0 0 40 40" aria-hidden="true">
      <circle className="mark-c mark-c1" cx="20" cy="10" r="7" />
      <circle className="mark-c mark-c2" cx="12" cy="26" r="7" />
      <circle className="mark-c mark-c3" cx="28" cy="26" r="7" />
    </svg>
  );
}

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <svg viewBox="0 0 24 24" className={`theme-icon sun${isDark ? "" : " visible"}`} aria-hidden="true">
        <circle cx="12" cy="12" r="4.5" />
        <line x1="12" y1="1.5" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22.5" />
        <line x1="1.5" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22.5" y2="12" />
        <line x1="4.4" y1="4.4" x2="6.1" y2="6.1" />
        <line x1="17.9" y1="17.9" x2="19.6" y2="19.6" />
        <line x1="4.4" y1="19.6" x2="6.1" y2="17.9" />
        <line x1="17.9" y1="6.1" x2="19.6" y2="4.4" />
      </svg>
      <svg viewBox="0 0 24 24" className={`theme-icon moon${isDark ? " visible" : ""}`} aria-hidden="true">
        <path d="M20 14.6A8.6 8.6 0 1 1 9.4 4a6.9 6.9 0 0 0 10.6 10.6Z" />
      </svg>
    </button>
  );
}

function generateBrief(plan: ResearchPlan, allStudies: Study[]): string {
  const cited = allStudies.filter((s) => plan.basedOnStudyIds.includes(s.id));
  const lines: string[] = [
    `# Research Brief: ${plan.question}`, "",
    "## Candidate Methods",
    ...plan.candidateMethods.map((m) => `- **${m.method}** — ${m.rationale}`), "",
    "## Proposed Population", plan.proposedPopulation, "",
    "## Proposed Outcome Measures",
    ...plan.proposedOutcomeMeasures.map((o) => `- ${o}`), "",
  ];
  if (plan.questionSpecificGaps.length) {
    lines.push("## About Your Question", ...plan.questionSpecificGaps.map((g) => `- ${g}`), "");
  }
  lines.push(
    "## Other Evidence Gaps", ...plan.evidenceGaps.map((g) => `- ${g}`), "",
    "## Cited Studies",
    ...cited.map((s) => `- ${s.title} (${s.year}), ${s.source}. ${s.url}`), "",
    `_Generated by Triangulate on ${new Date().toISOString().slice(0, 10)}_`
  );
  return lines.join("\n");
}

function BriefManuscript({
  plan,
  studies: allStudies,
  copied,
  generatedAt,
  onCopy,
  onDownload,
}: {
  plan: ResearchPlan;
  studies: Study[];
  copied: boolean;
  generatedAt: string | null;
  onCopy: () => void;
  onDownload: () => void;
}) {
  const cited = allStudies.filter((s) => plan.basedOnStudyIds.includes(s.id));
  const populationSpecified = !plan.proposedPopulation.startsWith("Not specified");

  return (
    <section className="brief-panel">
      <div className="brief-head">
        <p className="brief-kicker">Research brief</p>
        <h2>{plan.question || "Untitled question"}</h2>
      </div>

      <div className="brief-section">
        <h3>Candidate methods</h3>
        {plan.candidateMethods.length ? (
          <ul className="brief-methods">
            {plan.candidateMethods.map((m, i) => (
              <li key={i}>
                <span className="method-name">{m.method}</span>
                <span className="method-rationale">{m.rationale}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="brief-empty">No distinct methodology reported across the selected studies.</p>
        )}
      </div>

      <div className="brief-section">
        <h3>Proposed population</h3>
        <blockquote className={`brief-quote${populationSpecified ? "" : " muted"}`}>
          {plan.proposedPopulation}
        </blockquote>
      </div>

      <div className="brief-section">
        <h3>Proposed outcome measures</h3>
        {plan.proposedOutcomeMeasures.length ? (
          <ul className="brief-plain-list">
            {plan.proposedOutcomeMeasures.map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        ) : (
          <p className="brief-empty">No outcome measures reported across the selected studies.</p>
        )}
      </div>

      {plan.questionSpecificGaps.length > 0 && (
        <div className="brief-callout">
          <h3>About your question</h3>
          <ul>{plan.questionSpecificGaps.map((g, i) => <li key={i}>{g}</li>)}</ul>
        </div>
      )}

      <div className="brief-section">
        <h3>Other evidence gaps</h3>
        {plan.evidenceGaps.length ? (
          <ul className="brief-plain-list muted-list">
            {plan.evidenceGaps.map((g, i) => <li key={i}>{g}</li>)}
          </ul>
        ) : (
          <p className="brief-empty">No additional evidence gaps identified.</p>
        )}
      </div>

      <div className="brief-section">
        <h3>Cited studies ({cited.length})</h3>
        <ol className="brief-bibliography">
          {cited.map((s) => (
            <li key={s.id}>
              <span className="citation-text">
                {s.title} <span className="citation-meta">({s.year}), {s.source}.</span>
              </span>
              <a href={s.url} target="_blank" rel="noreferrer">Source ↗</a>
            </li>
          ))}
        </ol>
      </div>

      <div className="brief-footer">
        <span className="brief-date">{generatedAt ? `Generated ${generatedAt}` : ""}</span>
        <div className="brief-actions">
          <button onClick={onCopy}>{copied ? "Copied" : "Copy"}</button>
          <button onClick={onDownload}>Download .md</button>
        </div>
      </div>
    </section>
  );
}

function normalizePlan(p: any): ResearchPlan {
  return {
    id: p.id ?? `plan-${Date.now()}`,
    question: p.question ?? "",
    candidateMethods: p.candidateMethods ?? [],
    proposedPopulation: p.proposedPopulation ?? "",
    proposedOutcomeMeasures: p.proposedOutcomeMeasures ?? [],
    questionSpecificGaps: p.questionSpecificGaps ?? [],
    evidenceGaps: p.evidenceGaps ?? [],
    basedOnStudyIds: p.basedOnStudyIds ?? [],
    savedAt: p.savedAt,
  };
}

function downloadBrief(text: string) {
  const blob = new Blob([text], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "triangulate-research-brief.md";
  a.click();
  URL.revokeObjectURL(url);
}

function getInitialTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function App() {
  const [results, setResults] = useState<Study[]>(studies);
  const [queryBox, setQueryBox] = useState("");
  const [comparison, setComparison] = useState<Study[]>([]);
  const [liveResults, setLiveResults] = useState<LiveResult[]>([]);
  const [savedPlans, setSavedPlansState] = useState<ResearchPlan[]>([]);
  const savedPlansRef = useRef<ResearchPlan[]>([]);
  const setSavedPlans = (plans: ResearchPlan[]) => {
    savedPlansRef.current = plans;
    setSavedPlansState(plans);
  };
  const [currentBrief, setCurrentBrief] = useState<string | null>(null);
  const [briefSourcePlan, setBriefSourcePlan] = useState<ResearchPlan | null>(null);
  const [briefGeneratedAt, setBriefGeneratedAt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("browse");
  const [toast, setToast] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [manualQuestion, setManualQuestion] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [showMap, setShowMap] = useState(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const [currentPlan, setCurrentPlanState] = useState<ResearchPlan | null>(null);
  const currentPlanRef = useRef<ResearchPlan | null>(null);
  const setCurrentPlan = (plan: ResearchPlan | null) => {
    currentPlanRef.current = plan;
    setCurrentPlanState(plan);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3500);
  };

  // Shared logic — used by BOTH the WebMCP tools and the manual buttons below
  const runSearch = (input: Filters) => {
    const filtered = filterStudies(studies, input ?? {});
    setResults(filtered);
    setActiveTab("browse");
    showToast(`search_studies found ${filtered.length} studies`);
    return filtered;
  };

  const runCompare = (ids: string[]) => {
    const matched = studies.filter((s) => ids.includes(s.id));
    setComparison(matched);
    setActiveTab("compare");
    showToast(`compare_protocols compared ${matched.length} studies`);
    return matched;
  };

  const runBuildPlan = (question: string, ids: string[]) => {
    const selected = studies.filter((s) => ids.includes(s.id));
    const plan = buildPlanFromStudies(question, selected, studies);
    setCurrentPlan(plan);
    setActiveTab("plan");
    showToast(`build_research_plan drafted a plan from ${selected.length} studies`);
    return plan;
  };

  const runSave = () => {
    if (!currentPlanRef.current) {
      showToast("No plan open to save yet");
      return { saved: false };
    }
    const existing = JSON.parse(localStorage.getItem("triangulate_plans") ?? "[]").map(normalizePlan);
    const updated = [...existing, { ...currentPlanRef.current, savedAt: new Date().toISOString() }];
    localStorage.setItem("triangulate_plans", JSON.stringify(updated));
    setSavedPlans(updated);
    showToast(`save_to_workspace saved plan (${updated.length} total)`);
    return { saved: true, count: updated.length };
  };

  const runGenerateBrief = (plan: ResearchPlan | null) => {
    if (!plan) { showToast("No plan open to generate a brief from"); return null; }
    const brief = generateBrief(plan, studies);
    setCurrentBrief(brief);
    setBriefSourcePlan(plan);
    setBriefGeneratedAt(new Date().toISOString().slice(0, 10));
    showToast("generate_research_brief created a brief");
    return brief;
  };

  const runLiveSearch = async (query: string) => {
    try {
      const live = await searchEuropePMC(query);
      setLiveResults(live);
      setActiveTab("live");
      showToast(`search_literature found ${live.length} live results`);
      return live;
    } catch {
      showToast("search_literature failed — Europe PMC unreachable");
      return [];
    }
  };

  useEffect(() => {
    try { setSavedPlans(JSON.parse(localStorage.getItem("triangulate_plans") ?? "[]").map(normalizePlan)); } catch { setSavedPlans([]); }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("triangulate_theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const handleCopyBrief = () => {
    if (!currentBrief) return;
    navigator.clipboard.writeText(currentBrief);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  useEffect(() => {
    // @ts-expect-error
    if (!document.modelContext) { console.warn("WebMCP not available in this browser."); return; }

    const controller = new AbortController();
    const { signal } = controller;

    // @ts-expect-error
    document.modelContext.registerTool({
      name: "search_studies",
      description: "Search Triangulate's curated dataset of real DBS programming and optimization studies, by free-text query and/or condition, target region, method, or population.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Free-text search across title, condition, target region, method, and tags." },
          condition: { type: "string", description: "e.g. 'Parkinson's disease', 'Tourette syndrome'." },
          targetRegion: { type: "string", description: "e.g. 'STN', 'thalamus', 'directional leads'." },
          method: { type: "string", description: "e.g. 'Bayesian optimization', 'sweet spot', 'remote programming'." },
          population: { type: "string", description: "e.g. 'randomized', 'Bern', '24 patients'." },
        },
        required: [],
      },
      execute: async (input: Filters) => {
        const filtered = runSearch(input ?? {});
        return { count: filtered.length, studies: filtered.map((s) => ({ id: s.id, title: s.title, year: s.year, condition: s.condition, targetRegion: s.targetRegion, optimizationMethod: s.optimizationMethod, findings: s.findings, url: s.url })) };
      },
    }, { signal });

    // @ts-expect-error
    document.modelContext.registerTool({
      name: "compare_protocols",
      description: "Compare 2-4 studies from Triangulate's dataset side by side, by their study ids, across target region, method, population, and outcome measure.",
      inputSchema: { type: "object", properties: { study_ids: { type: "array", items: { type: "string" }, description: "2 to 4 study ids to compare." } }, required: ["study_ids"] },
      execute: async (input: { study_ids: string[] }) => {
        const matched = runCompare(input?.study_ids ?? []);
        return { count: matched.length, comparison: matched.map((s) => ({ id: s.id, title: s.title, targetRegion: s.targetRegion, optimizationMethod: s.optimizationMethod, population: s.population, outcomeMeasure: s.outcomeMeasure })) };
      },
    }, { signal });

    // @ts-expect-error
    document.modelContext.registerTool({
      name: "build_research_plan",
      description: "Assemble a structured, editable research plan draft from a research question and a set of study ids. Produces candidate methods with rationale, proposed population, proposed outcome measures, and named evidence gaps (including gaps specific to the question itself).",
      inputSchema: { type: "object", properties: { question: { type: "string", description: "The research question." }, study_ids: { type: "array", items: { type: "string" }, description: "Study ids to base the plan on." } }, required: ["question", "study_ids"] },
      execute: async (input: { question: string; study_ids: string[] }) => runBuildPlan(input.question, input.study_ids ?? []),
    }, { signal });

    // @ts-expect-error
    document.modelContext.registerTool({
      name: "save_to_workspace",
      description: "Save the current research plan so it persists and can be revisited or reloaded later.",
      inputSchema: { type: "object", properties: {}, required: [] },
      execute: async () => runSave(),
    }, { signal });

    // @ts-expect-error
    document.modelContext.registerTool({
      name: "generate_research_brief",
      description: "Generate a clean, exportable markdown research brief — with full citations — from the currently open plan, or a saved plan by id.",
      inputSchema: { type: "object", properties: { plan_id: { type: "string", description: "Optional saved plan id. Defaults to the currently open plan." } }, required: [] },
      execute: async (input: { plan_id?: string }) => {
        const target = input?.plan_id ? savedPlansRef.current.find((p) => p.id === input.plan_id) ?? null : currentPlanRef.current;
        const brief = runGenerateBrief(target);
        return brief ? { success: true, brief } : { success: false, message: "No plan found — build or open one first." };
      },
    }, { signal });

    // @ts-expect-error
    document.modelContext.registerTool({
      name: "search_literature",
      description: "Search the live, public Europe PMC biomedical literature database for studies beyond Triangulate's curated set. Results are unreviewed bibliographic info only.",
      inputSchema: { type: "object", properties: { query: { type: "string", description: "Free-text biomedical literature search query." } }, required: ["query"] },
      execute: async (input: { query: string }) => {
        const live = await runLiveSearch(input.query);
        return { count: live.length, results: live };
      },
    }, { signal });

    return () => controller.abort();
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedCount = selectedIds.size;
  const isCurrentPlanSaved = currentPlan ? savedPlans.some((p) => p.id === currentPlan.id) : true;

  return (
    <main className="app">
      <header>
        <TriangulateMark />
        <div className="header-text">
          <h1>Triangulate</h1>
          <p>An agent-native workbench for DBS programming research.</p>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}

      <nav className="tabs">
        <button className={activeTab === "browse" ? "active" : ""} onClick={() => setActiveTab("browse")}>Browse ({results.length})</button>
        <button className={activeTab === "compare" ? "active" : ""} onClick={() => setActiveTab("compare")}>Compare ({comparison.length})</button>
        <button className={activeTab === "plan" ? "active" : ""} onClick={() => setActiveTab("plan")}>Research Plan{currentPlan ? " ●" : ""}</button>
        <button className={activeTab === "live" ? "active" : ""} onClick={() => setActiveTab("live")}>Live Search ({liveResults.length})</button>
      </nav>

      {activeTab === "browse" && (
        <div className="tab-content">
          <section className="search-bar">
            <input type="text" placeholder="Try: parkinson, bayesian, remote programming, tourette..." value={queryBox}
              onChange={(e) => { setQueryBox(e.target.value); setResults(filterStudies(studies, { query: e.target.value })); }} />
          </section>
          <section className="results">
            <p className="count">{results.length} studies — check any to compare or build a plan</p>
            {results.map((s) => {
              const isOpen = expandedIds.has(s.id);
              return (
                <article key={s.id} className="study-card">
                  <input type="checkbox" checked={selectedIds.has(s.id)} onChange={() => toggleSelect(s.id)} aria-label={`Select ${s.title}`} />
                  <div className="card-body">
                    <h3 className="card-title" onClick={() => toggleExpand(s.id)}>{s.title}</h3>
                    <p className="meta">{s.condition} · {s.targetRegion} · {s.year}</p>
                    <div className={`details-wrap${isOpen ? " open" : ""}`}>
                      <div className="details-inner">
                        <p>{s.findings}</p>
                        <p><span className="field-label">Method </span>{s.optimizationMethod}</p>
                        <p><span className="field-label">Population </span>{s.population}</p>
                        <p><span className="field-label">Outcome </span>{s.outcomeMeasure}</p>
                        <a href={s.url} target="_blank" rel="noreferrer">Source ↗</a>
                      </div>
                    </div>
                    <button className="expand-btn" onClick={() => toggleExpand(s.id)} aria-expanded={isOpen}>
                      {isOpen ? "Hide details" : "Show details"}
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
          <section className="evidence-map">
            <button className="map-toggle" onClick={() => setShowMap((v) => !v)}>
              {showMap ? "Hide evidence map" : `Show evidence map (${Object.keys(groupByTag(results)).length} approaches)`}
            </button>
            {showMap && (
              <>
                <h2>Evidence Map</h2>
                <p className="map-hint">Grouped by approach — updates with your last search.</p>
                <div className="map-grid">
                  {Object.entries(groupByTag(results)).map(([tag, group]) => (
                    <div key={tag} className="map-column">
                      <h4>{tag} ({group.length})</h4>
                      <ul>{group.map((s) => <li key={s.id}>{s.title}</li>)}</ul>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {activeTab === "compare" && (
        <section className="comparison tab-content">
          <h2>Comparison</h2>
          {comparison.length < 2 ? (
            <div className="empty-hint"><p>Nothing to compare yet.</p><button onClick={() => setActiveTab("browse")}>Go select studies</button></div>
          ) : (
            <table>
              <thead><tr><th>Study</th><th>Target</th><th>Method</th><th>Population</th><th>Outcome</th></tr></thead>
              <tbody>{comparison.map((s) => (
                <tr key={s.id}>
                  <td data-label="Study">{s.title}</td>
                  <td data-label="Target">{s.targetRegion}</td>
                  <td data-label="Method">{s.optimizationMethod}</td>
                  <td data-label="Population">{s.population}</td>
                  <td data-label="Outcome">{s.outcomeMeasure}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </section>
      )}

      {activeTab === "plan" && (
        <div className="tab-content">
                    {currentPlan ? (
            <>
            <section className="plan-panel">
              <h2>Research Plan Draft</h2>
              <label>Question</label>
              <input value={currentPlan.question} onChange={(e) => setCurrentPlan({ ...currentPlan, question: e.target.value })} />
              <label>Candidate Methods</label>
              <ul>{currentPlan.candidateMethods.map((m, i) => <li key={i}><strong>{m.method}</strong> — {m.rationale}</li>)}</ul>
              <label>Proposed Population</label>
              <textarea value={currentPlan.proposedPopulation} onChange={(e) => setCurrentPlan({ ...currentPlan, proposedPopulation: e.target.value })} />
              <label>Proposed Outcome Measures</label>
              <ul>{currentPlan.proposedOutcomeMeasures.map((o, i) => <li key={i}>{o}</li>)}</ul>
              {(currentPlan.questionSpecificGaps?.length ?? 0) > 0 && (
                <div className="gap-callout">
                  <strong>About your question</strong>
                  <ul>{currentPlan.questionSpecificGaps.map((g, i) => <li key={i}>{g}</li>)}</ul>
                </div>
              )}
              <label>Other Evidence Gaps</label>
              <ul>{currentPlan.evidenceGaps.map((g, i) => <li key={i}>{g}</li>)}</ul>
              {!isCurrentPlanSaved && (
                <>
                  <p className="unsaved-note">Not saved yet — this will be lost on refresh.</p>
                  <button onClick={runSave} style={{ marginTop: "0.6rem" }}>Save this plan</button>
                </>
              )}
              <button onClick={() => runGenerateBrief(currentPlan)} style={{ marginTop: "0.6rem", marginLeft: "0.5rem" }}>
                Generate brief
              </button>
            </section>

                        {currentBrief && briefSourcePlan && (
              <BriefManuscript
                plan={briefSourcePlan}
                studies={studies}
                copied={copied}
                generatedAt={briefGeneratedAt}
                onCopy={handleCopyBrief}
                onDownload={() => downloadBrief(currentBrief)}
              />
            )}
            </>
          ) : (

            <div className="empty-hint"><p>No plan open yet.</p><button onClick={() => setActiveTab("browse")}>Go select studies</button></div>
          )}
          {savedPlans.length > 0 && (
            <section className="saved-plans">
              <h3>Saved Plans ({savedPlans.length})</h3>
              <ul>{savedPlans.map((p) => (
                <li key={p.id}><button onClick={() => setCurrentPlan(p)}>{p.question || "(untitled)"} — saved {p.savedAt?.slice(0, 10)}</button></li>
              ))}</ul>
            </section>
          )}
        </div>
      )}

      {activeTab === "live" && (
        <section className="live-results tab-content">
          <h2>Live Literature Search <span className="badge">Unreviewed</span></h2>
          <p className="map-hint">Fetched live from Europe PMC — not vetted or curated by Triangulate.</p>
          <div className="search-bar">
            <input type="text" placeholder="Search live literature..." value={queryBox} onChange={(e) => setQueryBox(e.target.value)} />
            <button onClick={() => queryBox.trim() && runLiveSearch(queryBox)}>Search live</button>
          </div>
          {liveResults.length === 0 ? (
            <p className="empty-hint">No live results yet — search above, or ask an AI assistant to search for you.</p>
          ) : liveResults.map((r) => (
            <article key={r.id} className="live-card">
              <h4>{r.title}</h4>
              <p className="meta">{r.authors} · {r.journal} · {r.year}</p>
              <a href={r.url} target="_blank" rel="noreferrer">View source ↗</a>
            </article>
          ))}
        </section>
      )}

      {selectedCount > 0 && activeTab === "browse" && (
        <div className="selection-bar">
          <span className="count">{selectedCount} selected</span>
          <input placeholder="Your research question…" value={manualQuestion} onChange={(e) => setManualQuestion(e.target.value)} />
          <button disabled={selectedCount < 2 || selectedCount > 4} onClick={() => runCompare(Array.from(selectedIds))}>Compare</button>
          <button disabled={!manualQuestion.trim()} onClick={() => runBuildPlan(manualQuestion, Array.from(selectedIds))}>Build plan</button>
          <button onClick={() => setSelectedIds(new Set())}>Clear</button>
        </div>
      )}
    </main>
  );
}

export default App;