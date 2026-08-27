import { useEffect, useState } from "react";
import { studies } from "./data/studies";
import type { Study } from "./types";
import "./App.css";

type Filters = {
  query?: string;
  condition?: string;
  targetRegion?: string;
  method?: string;
  population?: string;
};

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
    const haystack = [s.title, s.condition, s.targetRegion, s.optimizationMethod, ...s.tags]
      .join(" ")
      .toLowerCase();
    return haystack.includes(f.query);
  });
}

function App() {
  const [results, setResults] = useState<Study[]>(studies);
  const [queryBox, setQueryBox] = useState("");

  useEffect(() => {
    // @ts-expect-error - modelContext isn't in the standard DOM lib types yet
    if (!document.modelContext) {
      console.warn("WebMCP (document.modelContext) not available in this browser.");
      return;
    }

    // @ts-expect-error - see above
    document.modelContext.registerTool({
      name: "search_studies",
      description:
        "Search Triangulate's curated dataset of real deep brain stimulation (DBS) programming and optimization studies, by free-text query and/or condition.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Free-text search across title, condition, target region, method, and tags.",
          },
          condition: {
            type: "string",
            description: "e.g. 'Parkinson's disease', 'Tourette syndrome'.",
          },
          targetRegion: {
            type: "string",
            description: "e.g. 'STN', 'thalamus', 'directional leads'.",
          },
          method: {
            type: "string",
            description: "e.g. 'Bayesian optimization', 'sweet spot', 'remote programming'.",
          },
          population: {
            type: "string",
            description: "e.g. 'randomized', 'Bern', '24 patients'.",
          },
        },
        required: [],
      },
      execute: async (input: Filters) => {
        const filtered = filterStudies(studies, input ?? {});
        setResults(filtered);
        return {
          count: filtered.length,
          studies: filtered.map((s) => ({
            id: s.id,
            title: s.title,
            year: s.year,
            condition: s.condition,
            targetRegion: s.targetRegion,
            optimizationMethod: s.optimizationMethod,
            findings: s.findings,
            url: s.url,
          })),
        };
      },
    });
  }, []);

  return (
    <main className="app">
      <header>
        <h1>Triangulate</h1>
        <p>An agent-native workbench for DBS programming research.</p>
      </header>

      <section className="search-bar">
        <input
          type="text"
          placeholder="Try: parkinson, bayesian, remote programming, tourette..."
          value={queryBox}
          onChange={(e) => {
            setQueryBox(e.target.value);
            setResults(filterStudies(studies, { query: e.target.value }));
          }}
        />
      </section>

      <section className="results">
        <p>{results.length} studies</p>
        {results.map((s) => (
          <article key={s.id} className="study-card">
            <h3>{s.title}</h3>
            <p className="meta">
              {s.condition} · {s.targetRegion} · {s.year}
            </p>
            <p>{s.findings}</p>
            <p className="method">
              <strong>Method:</strong> {s.optimizationMethod}
            </p>
            <p>
              <strong>Population:</strong> {s.population}
            </p>
            <p>
              <strong>Outcome measure:</strong> {s.outcomeMeasure}
            </p>
            <a href={s.url} target="_blank" rel="noreferrer">
              Source ↗
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;