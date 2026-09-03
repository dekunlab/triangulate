import type { Study } from "../types";

export const studies: Study[] = [
  {
    id: "burden-2022",
    title:
      "Lesser-Known Aspects of Deep Brain Stimulation for Parkinson's Disease: Programming Sessions, Hardware Surgeries, Residential Care Admissions, and Deaths",
    year: 2022,
    source: "Neuromodulation",
    identifier: "PMID 34114293 · DOI 10.1111/ner.13466",
    url: "https://pubmed.ncbi.nlm.nih.gov/34114293/",
    targetRegion: "STN / GPi",
    condition: "Parkinson's disease",
    population:
      "1,849 patients in an Australian population-based cohort, followed from DBS implantation using linked government data (2002–2016)",
    studyDesign:
      "Population-based observational cohort study using linked government data",
    optimizationMethod:
      "None — observational study characterizing the long-term burden of DBS treatment and programming",
    outcomeMeasure:
      "Annual programming visit frequency, repeat hardware surgery, residential care admission, and mortality",
    findings:
      "Mean annual programming rates were 6.9 visits in the first year and 2.8 visits in subsequent years. 51.4% of patients required repeat hardware surgery. The study supports development of technologies that could reduce therapy burden.",
    tags: ["burden-of-care", "standard-of-care", "parkinsons"],
  },

  {
    id: "algorithm-guided-2022",
    title:
      "Multiple Input Algorithm-Guided Deep Brain Stimulation Programming for Parkinson's Disease Patients",
    year: 2022,
    source: "npj Parkinson's Disease",
    identifier:
      "PMID 36309508 · DOI 10.1038/s41531-022-00396-7",
    url: "https://www.nature.com/articles/s41531-022-00396-7",
    targetRegion: "STN, directional DBS",
    condition: "Parkinson's disease",
    population: "10 patients / 20 hemispheres",
    studyDesign:
      "Randomized, crossover, double-blind feasibility comparison of algorithm-guided and standard-of-care programming",
    optimizationMethod:
      "Semi-automatic algorithm-guided programming using iterative weighted combinations of clinician-assessed and sensor-derived responses across multiple symptoms",
    outcomeMeasure:
      "Motor symptom improvement and characteristics of algorithm-guided versus standard-of-care settings",
    findings:
      "The algorithm iteratively combined responses from multiple Parkinson's disease symptoms to converge on stimulation settings. Algorithm-guided and standard-of-care settings produced similar acute clinical improvement, while the algorithm required substantially different parameter exploration.",
    tags: ["algorithm-guided", "directional-dbs", "parkinsons"],
  },

  {
    id: "remote-optimization-rct-2025",
    title:
      "Accelerated Symptom Improvement in Parkinson's Disease via Remote Internet-Based Optimization of Deep Brain Stimulation Therapy: A Randomized Controlled Multicenter Trial",
    year: 2025,
    source: "Communications Medicine",
    identifier:
      "PMID 39890864 · DOI 10.1038/s43856-025-00744-7",
    url: "https://www.nature.com/articles/s43856-025-00744-7",
    targetRegion: "DBS for Parkinson's disease",
    condition: "Parkinson's disease",
    population:
      "96 patients randomized in a multicenter randomized controlled trial",
    studyDesign:
      "Randomized controlled multicenter trial comparing in-clinic optimization with additional remote internet-based adjustment",
    optimizationMethod:
      "Remote internet-based adjustment (RIBA) of DBS stimulation parameters",
    outcomeMeasure:
      "Time to clinically meaningful symptom improvement after DBS implantation and initial programming",
    findings:
      "Patients with access to remote internet-based adjustment achieved reported clinical benefit earlier than patients receiving in-clinic optimization alone. The study reported a 15.1-day difference in time to improvement between the groups.",
    tags: ["remote-programming", "telehealth", "parkinsons", "rct"],
  },

  {
    id: "ai-dbs-protocol",
    title:
      "AI-DBS Study: Protocol for a Longitudinal Prospective Observational Cohort Study of Patients With Parkinson's Disease for the Development of Neuronal Fingerprints Using Artificial Intelligence",
    year: 2025,
    source: "BMJ Open",
    identifier:
      "PMID 40379316 · PMCID PMC12086899 · DOI 10.1136/bmjopen-2024-091563",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12086899/",
    targetRegion: "STN, sensing-enabled DBS",
    condition: "Parkinson's disease",
    population:
      "100 patients planned for longitudinal follow-up with bilateral STN DBS and sensing-enabled Percept PC systems",
    studyDesign:
      "Longitudinal prospective observational cohort study protocol",
    optimizationMethod:
      "Neural-signal-guided neuronal fingerprinting using local field potentials combined with wearable and clinical symptom measures",
    outcomeMeasure:
      "Relationship between LFP features and patient-specific motor symptom severity",
    findings:
      "The protocol describes a longitudinal dataset linking local field potentials with symptom severity to identify patient-specific neuronal fingerprints that could support future individualized and responsive DBS strategies.",
    tags: ["lfp-guided", "sensing", "adaptive-dbs", "parkinsons", "protocol"],
  },

  {
    id: "adroit-digital-dbs",
    title:
      "Real-World Multicenter Assessment of Sustained Clinical Outcomes After Digital Deep Brain Stimulation",
    year: 2026,
    source: "npj Digital Medicine",
    identifier:
      "PMID 41535352 · PMCID PMC12881580 · DOI 10.1038/s41746-025-02315-5",
    url: "https://www.nature.com/articles/s41746-025-02315-5",
    targetRegion: "Multiple DBS targets",
    condition: "Parkinson's disease",
    population:
      "Multicenter real-world cohort with long-term follow-up after digital DBS programming",
    studyDesign:
      "Multicenter observational cohort with an embedded randomized comparison of digital and in-clinic follow-up",
    optimizationMethod:
      "Digital / remote DBS programming and follow-up model",
    outcomeMeasure:
      "Clinical outcomes, quality of life, safety, and sustained effects during long-term routine care",
    findings:
      "The study evaluated sustained clinical outcomes after an initial digital DBS programming phase and reported that clinical outcomes, quality of life, and safety remained sustained during subsequent routine care follow-up.",
    tags: ["digital-clinic", "remote-programming", "parkinsons", "real-world"],
  },

  {
    id: "telehealth-covid",
    title:
      "The Power of Access in Parkinson's Disease Care: A Retrospective Review of Telehealth Uptake During the COVID-19 Pandemic",
    year: 2022,
    source: "Frontiers in Neurology",
    identifier:
      "PMID 35463145 · PMCID PMC9021746 · DOI 10.3389/fneur.2022.830196",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9021746/",
    targetRegion: "N/A — access and care-delivery study",
    condition: "Parkinson's disease / movement disorders",
    population:
      "1,097 new patients seen at the Inova Parkinson's and Movement Disorders Center during April–December 2020",
    studyDesign:
      "Retrospective clinic review comparing telehealth and in-person care during the COVID-19 pandemic",
    optimizationMethod:
      "N/A — study of access and telehealth uptake rather than an optimization algorithm",
    outcomeMeasure:
      "Telehealth uptake, travel burden, and DBS programming visit volume",
    findings:
      "During the first nine months of the pandemic, 85% of 1,097 new patient visits were conducted via telehealth. DBS programming visits fell from 254 to 191 compared with the same period in the prior year, a 24.8% decrease.",
    tags: ["access-burden", "telehealth", "context"],
  },

  {
    id: "adapt-pd-trial",
    title:
      "Adaptive DBS Algorithm for Personalized Therapy in Parkinson's Disease (ADAPT-PD)",
    year: 2020,
    source: "ClinicalTrials.gov",
    identifier: "NCT04547712",
    url: "https://clinicaltrials.gov/study/NCT04547712",
    status: "Completed",
    targetRegion: "STN, sensing-enabled / directional DBS",
    condition: "Parkinson's disease",
    population:
      "Multiphase clinical trial of patients with Parkinson's disease receiving sensing-enabled DBS",
    studyDesign:
      "Multiphase clinical trial including randomized crossover evaluation of adaptive versus conventional DBS modes",
    optimizationMethod:
      "Sensing-based adaptive DBS using neural signals to personalize stimulation",
    outcomeMeasure:
      "Clinical performance, acceptability, and effects of adaptive DBS compared with conventional stimulation",
    findings:
      "ADAPT-PD evaluated structured sensing-based adaptive DBS strategies against conventional DBS, providing clinical-trial evidence for neural-signal-driven personalization of stimulation therapy.",
    tags: ["adaptive-dbs", "sensing", "industry-trial", "parkinsons", "completed"],
  },

  {
    id: "tourette-thalamic-protocol",
    title:
      "Thalamic Deep Brain Stimulation for the Treatment of Refractory Tourette Syndrome",
    year: 2013,
    source: "ClinicalTrials.gov",
    identifier: "NCT01817517",
    url: "https://clinicaltrials.gov/study/NCT01817517",
    targetRegion: "Thalamus",
    condition: "Refractory Tourette syndrome",
    population:
      "Clinical trial population with refractory Tourette syndrome",
    studyDesign:
      "Clinical trial protocol",
    optimizationMethod:
      "N/A — cross-condition DBS programming reference",
    outcomeMeasure:
      "Clinical response to thalamic DBS",
    findings:
      "Included as a cross-condition reference showing that DBS programming and clinical adjustment are also relevant outside Parkinson's disease, particularly in movement-disorder indications involving thalamic stimulation.",
    tags: ["cross-condition", "tourette", "standard-of-care", "protocol-reference"],
  },

  {
    id: "stimfit-trial-2023",
    title:
      "Automated Deep Brain Stimulation Programming Based on Electrode Location: A Randomised, Crossover Trial Using a Data-Driven Algorithm",
    year: 2023,
    onlinePublicationYear: 2022,
    source: "The Lancet Digital Health",
    identifier:
      "PMID 36528541 · DOI 10.1016/S2589-7500(22)00214-X",
    url: "https://pubmed.ncbi.nlm.nih.gov/36528541/",
    targetRegion: "STN, directional octopolar leads",
    condition: "Parkinson's disease",
    population:
      "35 patients in a double-blind randomized crossover trial at Charité Berlin",
    studyDesign:
      "Randomized, double-blind, crossover, non-inferiority trial",
    optimizationMethod:
      "StimFit — image/electrode-location-guided data-driven algorithm for recommending DBS parameters",
    outcomeMeasure:
      "Motor symptom control using algorithm-recommended versus clinically selected stimulation parameters",
    findings:
      "The StimFit approach used patient-specific electrode location and neuroimaging information to recommend stimulation parameters. The randomized crossover trial assessed whether algorithm-selected settings could achieve motor outcomes comparable with standard clinical programming.",
    tags: ["image-guided", "algorithm-suggested", "berlin", "parkinsons", "rct"],
  },

  {
    id: "clover-dbs-2021",
    title:
      "CLOVER-DBS: Algorithm-Guided Deep Brain Stimulation-Programming Based on External Sensor Feedback Evaluated in a Prospective, Randomized, Crossover, Double-Blind, Two-Center Study",
    year: 2021,
    source: "Journal of Parkinson's Disease",
    identifier: "DOI 10.3233/JPD-202480",
    url: "https://doi.org/10.3233/JPD-202480",
    targetRegion:
      "STN, directional leads with multiple independent current sources",
    condition: "Parkinson's disease",
    population:
      "23 patients with clinically effective DBS across two German DBS centers",
    studyDesign:
      "Prospective, randomized, crossover, double-blind, two-center study",
    optimizationMethod:
      "Algorithm-guided DBS programming using external wearable-sensor feedback",
    outcomeMeasure:
      "Motor symptom control and characteristics of algorithm-derived versus standard-of-care settings",
    findings:
      "The study evaluated whether wearable-sensor feedback could guide DBS programming and produce clinically effective settings comparable with standard-of-care programming in patients with advanced directional DBS systems.",
    tags: ["sensor-guided", "algorithm-guided", "berlin", "parkinsons", "rct"],
  },

  {
    id: "sweet-spot-bern-2022",
    title:
      "Programming of Subthalamic Nucleus Deep Brain Stimulation for Parkinson's Disease With Sweet Spot-Guided Parameter Suggestions",
    year: 2022,
    source: "Frontiers in Human Neuroscience",
    identifier:
      "PMID 36393984 · PMCID PMC9663652 · DOI 10.3389/fnhum.2022.925283",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9663652/",
    targetRegion: "STN",
    condition: "Parkinson's disease",
    population:
      "24 patients with bilateral STN DBS at University Hospital Bern",
    studyDesign:
      "Retrospective comparison with clinical monopolar review",
    optimizationMethod:
      "Sweet-spot-guided parameter suggestions using patient-specific lead reconstruction and volume-of-tissue-activated modeling",
    outcomeMeasure:
      "Agreement between algorithm-suggested settings and clinically determined stimulation parameters",
    findings:
      "The approach combined patient-specific lead localization with a therapeutic sweet spot to suggest effective stimulation contacts and amplitudes, providing an image-guided alternative to fully manual parameter exploration.",
    tags: ["sweet-spot", "image-guided", "bern", "parkinsons"],
  },

  {
    id: "sweet-spot-commercial-2023",
    title:
      "Probabilistic Subthalamic Nucleus Stimulation Sweet Spot Integration Into a Commercial Deep Brain Stimulation Programming Software Can Predict Effective Stimulation Parameters",
    year: 2023,
    onlinePublicationYear: 2022,
    source: "Neuromodulation",
    identifier:
      "PMID 35088739 · DOI 10.1016/j.neurom.2021.10.026",
    url: "https://pubmed.ncbi.nlm.nih.gov/35088739/",
    targetRegion: "STN, segmented leads",
    condition: "Parkinson's disease",
    population:
      "14 patients with Parkinson's disease and bilateral STN DBS using segmented leads",
    studyDesign:
      "Predictive validation study",
    optimizationMethod:
      "Probabilistic STN sweet-spot model integrated into commercial DBS programming software",
    outcomeMeasure:
      "Prediction of clinically effective stimulation parameters",
    findings:
      "A previously validated probabilistic STN sweet spot was integrated into commercial programming software and evaluated for its ability to predict effective stimulation parameters in patients with segmented leads.",
    tags: ["sweet-spot", "commercial-software", "bern", "parkinsons", "predictive"],
  },

  {
    id: "twh-algorithms-2016",
    title:
      "Programming Deep Brain Stimulation for Parkinson's Disease: The Toronto Western Hospital Algorithms",
    year: 2016,
    source: "Brain Stimulation",
    identifier:
      "PMID 26968806 · DOI 10.1016/j.brs.2016.02.004",
    url: "https://pubmed.ncbi.nlm.nih.gov/26968806/",
    targetRegion: "STN / GPi",
    condition: "Parkinson's disease",
    population:
      "Toronto Western Hospital clinical programming framework for Parkinson's disease DBS",
    studyDesign:
      "Literature review combined with clinical-practice-derived programming protocols",
    optimizationMethod:
      "Manual structured DBS programming using standardized symptom-specific algorithms",
    outcomeMeasure:
      "N/A — methodology and programming-protocol reference",
    findings:
      "The paper reviewed the literature and integrated Toronto Western Hospital clinical practice to develop standardized algorithms for initial programming and management of speech disturbance, stimulation-induced dyskinesia, and gait impairment.",
    tags: ["standard-of-care", "toronto", "parkinsons", "protocol-reference"],
  },

  {
    id: "bayesian-tremor-closed-loop",
    title:
      "Automated Deep Brain Stimulation Programming With Safety Constraints for Tremor Suppression in Patients With Parkinson's Disease and Essential Tremor",
    year: 2022,
    source: "Journal of Neural Engineering",
    identifier:
      "PMID 35921806 · DOI 10.1088/1741-2552/ac86a2",
    url: "https://pubmed.ncbi.nlm.nih.gov/35921806/",
    targetRegion: "VIM / STN",
    condition: "Parkinson's disease and essential tremor",
    population:
      "15 patients: 9 with Parkinson's disease and 6 with essential tremor",
    studyDesign:
      "Patient-specific automated closed-loop DBS programming framework with safety constraints",
    optimizationMethod:
      "Bayesian optimization driven by real-time smartwatch tremor measurements",
    outcomeMeasure:
      "Automated tremor suppression and convergence of stimulation parameters while respecting safety constraints",
    findings:
      "The system used smartwatch tremor measurements to automatically guide Bayesian optimization of DBS settings. In 15 patients, the best automated settings produced tremor suppression statistically comparable with previously established clinical settings.",
    tags: ["bayesian-optimization", "closed-loop", "wearable-sensing", "tremor"],
  },
];