# Triangulate

> Where researchers and their AI agents triangulate real DBS research evidence together.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)
![WebMCP](https://img.shields.io/badge/Built%20with-WebMCP-2B4C5C.svg)

Triangulate is a research workbench for deep brain stimulation (DBS) programming — the process of tuning an implanted stimulator's settings after surgery. It has no standard method, and a researcher, or their AI agent, can search a curated set of 14 verified studies, compare optimization approaches side by side, draft a structured plan from a question, and export a cited brief. A separate tool reaches live into Europe PMC for anything the curated set doesn't cover. Built for [The WebMCP Challenge](https://webmcp.devpost.com).

## The problem, in numbers

- Patients average **6.9 programming visits in year one**, dropping to **2.8/year** after — for a device implanted for a decade or more.
- Over half need a repeat hardware surgery.
- *(Source: a 1,849-patient Australian cohort, [full citation below](#curated-evidence-base).)*

The methods trying to fix this — image-guided algorithms out of Charité Berlin, sweet-spot mapping from Bern's ARTORG Center, sensor-guided approaches, the foundational Toronto Western protocol — are real, published, and scattered across a dozen-plus papers nobody has unified into one tool.

## What it does

- **Search** the curated dataset by free text, condition, target region, method, or population.
- **Compare** 2–4 studies side by side.
- **Build a plan** from a question and a set of studies: candidate methods with rationale, proposed population, proposed outcome measures, and evidence gaps — including gaps specific to the exact wording of the question.
- **Save** a plan so it survives a reload.
- **Generate a brief** — copyable, downloadable, fully cited markdown.
- **Search live literature** beyond the curated set, via Europe PMC, labeled unreviewed and never silently merged with vetted results.

Every one of these runs through a human clicking the interface, or an agent calling the matching tool — same underlying function either way.

## Verified run

A real `build_research_plan` call, question `"does this work for tremor patients"`, against three selected studies:

```json
{
  "question": "does this work for tremor patients",
  "candidateMethods": [
    { "method": "StimFit — image-guided algorithm...", "rationale": "Supported by: Automated DBS Programming Based on Electrode Location..." },
    { "method": "Sweet-spot-guided algorithm using Lead-DBS reconstruction...", "rationale": "Supported by: Programming of STN DBS With Sweet Spot-Guided..." },
    { "method": "Bayesian optimization — real-time smartwatch tremor measurement...", "rationale": "Supported by: Automated DBS Programming With Safety Constraints..." }
  ],
  "questionSpecificGaps": [
    "Your question mentions \"tremor\", but none of the selected studies cover it."
  ]
}
```

The word "tremor" in the question is checked against the real tag vocabulary of the dataset at call time — this isn't a canned response, it's why a *different* question against the *same* three studies produces a different gap list.

## Architecture

```mermaid
flowchart TB
    subgraph Browser["Browser (WebMCP-enabled)"]
        UI["Triangulate UI (React)"]
        MCP["document.modelContext<br/>Tool Registry"]
    end

    Human["Researcher"] -->|clicks / types| UI
    Agent["AI Agent<br/>(e.g. ChatGPT in-app browser)"] -->|calls tools| MCP

    MCP -->|search_studies| Curated[("Curated dataset<br/>14 verified studies")]
    MCP -->|search_literature| PMC[("Europe PMC API<br/>live, unreviewed")]
    MCP --> Shared["Shared logic:<br/>runCompare / runBuildPlan /<br/>runSave / runGenerateBrief"]
    Shared --> State["React state + localStorage"]

    UI <--> MCP
    State --> UI
```

The manual UI buttons and the WebMCP tools call the same functions. Comparing a study by clicking a checkbox and comparing it by asking an agent run through identical code — not two implementations of the same feature.

## The six tools

| Tool | Does |
|---|---|
| `search_studies` | Structured + free-text search: condition, target region, method, population |
| `compare_protocols` | Side-by-side table for 2–4 studies |
| `build_research_plan` | Candidate methods with rationale, proposed population/outcomes, evidence gaps — question-specific ones first |
| `save_to_workspace` | Persists a plan to `localStorage` |
| `generate_research_brief` | Plan → cited, exportable markdown |
| `search_literature` | Live Europe PMC search beyond the curated set, labeled unreviewed |

## Run it locally

```bash
git clone https://github.com/dekunlab/triangulate.git
cd triangulate
npm install
npm run dev
```

In Chrome 146+: enable `chrome://flags/#enable-webmcp-testing`, relaunch, open the dev URL. Optional for manual tool testing: install [WebMCP Inspector](https://chromewebstore.google.com/detail/webmcp-inspector/edfjnadfiapmddgplgnphlflgafmcino).

No backend. The dataset ships with the app; Europe PMC's API takes direct browser requests.

## Curated evidence base

1. *Lesser-Known Aspects of Deep Brain Stimulation for Parkinson's Disease* (2021). Parkinsonism & Related Disorders. https://pubmed.ncbi.nlm.nih.gov/34114293/
2. *Multiple Input Algorithm-Guided Deep Brain Stimulation Programming for Parkinson's Disease Patients* (2022). npj Parkinson's Disease. https://www.nature.com/articles/s41531-022-00396-7
3. *Accelerated Symptom Improvement in Parkinson's Disease via Remote Internet-Based Optimization of Deep Brain Stimulation Therapy* (2025). Communications Medicine. https://www.nature.com/articles/s43856-025-00744-7
4. *AI-DBS Study: Protocol for a Longitudinal Cohort Study Developing Neuronal Fingerprints Using AI* (ongoing). PMC. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12086899/
5. *Real-World Multicenter Assessment of Sustained Clinical Outcomes After Digital Deep Brain Stimulation* (2025). npj Digital Medicine. https://www.nature.com/articles/s41746-025-02315-5
6. *The Power of Access in Parkinson's Disease Care: Telehealth Uptake During the COVID-19 Pandemic* (2021). PMC. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9021746/
7. *ADAPT-PD: Adaptive DBS Algorithm for Personalized Therapy in Parkinson's Disease* (ongoing). ClinicalTrials.gov, NCT04547712.
8. *Thalamic Deep Brain Stimulation for the Treatment of Refractory Tourette Syndrome* (ongoing). ClinicalTrials.gov, NCT01817517.
9. *Automated Deep Brain Stimulation Programming Based on Electrode Location: A Randomised, Crossover Trial Using a Data-Driven Algorithm* (2022). The Lancet Digital Health. https://pubmed.ncbi.nlm.nih.gov/36528541/
10. *CLOVER-DBS: Algorithm-Guided Deep Brain Stimulation-Programming Based on External Sensor Feedback* (2021). Journal of Parkinson's Disease. https://doi.org/10.3233/jpd-202480
11. *Programming of Subthalamic Nucleus Deep Brain Stimulation for Parkinson's Disease With Sweet Spot-Guided Parameter Suggestions* (2022). Frontiers in Human Neuroscience. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9663652/
12. *Probabilistic Subthalamic Nucleus Stimulation Sweet Spot Integration Into a Commercial DBS Programming Software* (2022). Neuromodulation. https://pubmed.ncbi.nlm.nih.gov/35088739/
13. *Programming Deep Brain Stimulation for Parkinson's Disease: The Toronto Western Hospital Algorithms* (2016). Brain Stimulation. https://pubmed.ncbi.nlm.nih.gov/34819915/
14. *Automated Deep Brain Stimulation Programming With Safety Constraints for Tremor Suppression in Parkinson's Disease and Essential Tremor* (2023).

## Limitations, stated plainly

- Live results are bibliographic metadata only — title, authors, journal, year, link. No auto-generated findings for papers nobody has vetted, and no cross-comparison with the curated tier — that would mean claiming structure for evidence nobody read.
- 14 curated studies, not exhaustive. A real starting point, not a coverage claim.
- No accounts. Saved plans live in browser `localStorage`, per device.

## What's next

- Promote a live result into the curated tier with one click, after a human reads it.
- Accounts, so a workspace follows a researcher across devices.
- Grow the curated base past 14 as the literature grows.

## License

MIT — see [LICENSE](./LICENSE).