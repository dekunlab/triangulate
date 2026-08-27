export interface Study {
  id: string;
  title: string;
  year: number | string;
  source: string;
  identifier: string;
  url: string;
  targetRegion: string;
  condition: string;
  population: string;
  studyDesign: string;
  optimizationMethod: string;
  outcomeMeasure: string;
  findings: string;
  tags: string[];
}