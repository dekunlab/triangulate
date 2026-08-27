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

function groupByTag(list: Study[]): Record<string, Study[]> {
  const groups: Record<string, Study[]> = {};
  list.forEach((s) => {
    s.tags.forEach((tag) => {
      if (!groups[tag]) groups[tag] = [];
      groups[tag].push(s);
    });
  });
  return groups;
}

function App() {
  const [results, setResults] = useState<Study[]>(studies);
  const [queryBox, setQueryBox] = useState("");
  const [comparison, setComparison] = useState<Study[]>([]);

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

    // @ts-expect-error - see above
    document.modelContext.registerTool({
      name: "compare_protocols",
      description:
        "Compare 2-4 studies from Triangulate's dataset side by side, by their study ids, across target region, method, population, and outcome measure.",
      inputSchema: {
        type: "object",
        properties: {
          study_ids: {
            type: "array",
            items: { type: "string" },
            description: "2 to 4 study ids to compare, typically from a prior search_studies result.",
          },
        },
        required: ["study_ids"],
      },
      execute: async (input: { study_ids: string[] }) => {
        const ids = input?.study_ids ?? [];
        const matched = studies.filter((s) => ids.includes(s.id));
        setComparison(matched);
        return {
          count: matched.length,
          comparison: matched.map((s) => ({
            id: s.id,
            title: s.title,
            targetRegion: s.targetRegion,
            optimizationMethod: s.optimizationMethod,
            population: s.population,
            outcomeMeasure: s.outcomeMeasure,
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

      {comparison.length > 1 && (
        <section className="comparison">
          <h2>Comparison</h2>
          <table>
            <thead>
              <tr>
                <th>Study</th>
                <th>Target</th>
                <th>Method</th>
                <th>Population</th>
                <th>Outcome measure</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((s) => (
                <tr key={s.id}>
                  <td>{s.title}</td>
                  <td>{s.targetRegion}</td>
                  <td>{s.optimizationMethod}</td>
                  <td>{s.population}</td>
                  <td>{s.outcomeMeasure}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="evidence-map">
        <h2>Evidence Map</h2>
        <p className="map-hint">Grouped by approach — updates with your last search or comparison.</p>
        <div className="map-grid">
          {Object.entries(groupByTag(results)).map(([tag, group]) => (
            <div key={tag} className="map-column">
              <h4>{tag} ({group.length})</h4>
              <ul>
                {group.map((s) => (
                  <li key={s.id}>{s.title}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;