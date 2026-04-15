// O*NET-style Interest Profiler — 60 questions adapted for Pakistani school students
// 10 questions per RIASEC dimension (R/I/A/S/E/C)
// Rating scale: 1 = Strongly Dislike, 2 = Dislike, 3 = Unsure, 4 = Like, 5 = Strongly Like
//
// Cultural adaptations:
//  - All activities are culturally appropriate for Pakistan
//  - No references to alcohol, gambling, or religiously sensitive topics
//  - Activities are relevant to the Pakistani job market and school context

export interface OnetQuestion {
  id: number
  text: string
  dimension: 'R' | 'I' | 'A' | 'S' | 'E' | 'C'
}

export const ONET_LIKERT = {
  1: 'Strongly Dislike',
  2: 'Dislike',
  3: 'Unsure',
  4: 'Like',
  5: 'Strongly Like',
} as const

export const onetQuestions: OnetQuestion[] = [
  // ─── REALISTIC (R) — hands-on, practical, physical ───────────────────────────
  { id: 1,  dimension: 'R', text: 'Assemble or repair electronic devices and gadgets' },
  { id: 2,  dimension: 'R', text: 'Build or construct things using tools and materials' },
  { id: 3,  dimension: 'R', text: 'Operate and maintain machinery or equipment' },
  { id: 4,  dimension: 'R', text: 'Work on engineering or construction projects' },
  { id: 5,  dimension: 'R', text: 'Grow and manage plants or crops on a farm or garden' },
  { id: 6,  dimension: 'R', text: 'Fix or troubleshoot problems with computers or networks' },
  { id: 7,  dimension: 'R', text: 'Do physical outdoor work like land surveying or civil work' },
  { id: 8,  dimension: 'R', text: 'Read technical blueprints or engineering diagrams' },
  { id: 9,  dimension: 'R', text: 'Inspect buildings or infrastructure for safety issues' },
  { id: 10, dimension: 'R', text: 'Set up or install equipment, cables, or hardware' },

  // ─── INVESTIGATIVE (I) — analytical, research, scientific ────────────────────
  { id: 11, dimension: 'I', text: 'Conduct experiments to test a scientific hypothesis' },
  { id: 12, dimension: 'I', text: 'Research a complex topic and analyse the findings' },
  { id: 13, dimension: 'I', text: 'Study human biology, anatomy, or medicine' },
  { id: 14, dimension: 'I', text: 'Analyse data and look for patterns or insights' },
  { id: 15, dimension: 'I', text: 'Investigate why something went wrong and find the root cause' },
  { id: 16, dimension: 'I', text: 'Read academic books or scientific articles for fun' },
  { id: 17, dimension: 'I', text: 'Solve complex maths or logic problems' },
  { id: 18, dimension: 'I', text: 'Study how economies, markets, or societies work' },
  { id: 19, dimension: 'I', text: 'Develop or test new ideas through research' },
  { id: 20, dimension: 'I', text: 'Evaluate arguments and decide which is most logical' },

  // ─── ARTISTIC (A) — creative, expressive, original ───────────────────────────
  { id: 21, dimension: 'A', text: 'Design graphics, logos, or visual content' },
  { id: 22, dimension: 'A', text: 'Write stories, poems, scripts, or creative essays' },
  { id: 23, dimension: 'A', text: 'Create videos, short films, or animations' },
  { id: 24, dimension: 'A', text: 'Play a musical instrument or compose music' },
  { id: 25, dimension: 'A', text: 'Sketch, paint, or do other visual artwork' },
  { id: 26, dimension: 'A', text: 'Design the layout or look of a website or app' },
  { id: 27, dimension: 'A', text: 'Perform in a play, debate, or public presentation' },
  { id: 28, dimension: 'A', text: 'Develop creative concepts for advertising or branding' },
  { id: 29, dimension: 'A', text: 'Photograph people, places, or events creatively' },
  { id: 30, dimension: 'A', text: 'Style or design clothing, interiors, or spaces' },

  // ─── SOCIAL (S) — helping, teaching, connecting ──────────────────────────────
  { id: 31, dimension: 'S', text: 'Tutor or teach younger students a subject you know well' },
  { id: 32, dimension: 'S', text: 'Counsel or give advice to someone going through a hard time' },
  { id: 33, dimension: 'S', text: 'Organise community events or social activities' },
  { id: 34, dimension: 'S', text: 'Work with children or young people in an educational setting' },
  { id: 35, dimension: 'S', text: 'Volunteer for a community service or charity project' },
  { id: 36, dimension: 'S', text: 'Mediate between two people who are in conflict' },
  { id: 37, dimension: 'S', text: 'Train or coach others to improve a skill' },
  { id: 38, dimension: 'S', text: 'Help plan activities that bring people together' },
  { id: 39, dimension: 'S', text: 'Provide care or support to someone who is unwell or elderly' },
  { id: 40, dimension: 'S', text: 'Lead group discussions or facilitate team meetings' },

  // ─── ENTERPRISING (E) — leading, persuading, business ───────────────────────
  { id: 41, dimension: 'E', text: 'Start or manage a small business or side project' },
  { id: 42, dimension: 'E', text: 'Persuade others to support your idea or plan' },
  { id: 43, dimension: 'E', text: 'Lead a team and make decisions under pressure' },
  { id: 44, dimension: 'E', text: 'Negotiate a deal or reach an agreement with others' },
  { id: 45, dimension: 'E', text: 'Pitch a product or service to potential customers' },
  { id: 46, dimension: 'E', text: 'Campaign for a cause you believe in' },
  { id: 47, dimension: 'E', text: 'Organise and run an event from start to finish' },
  { id: 48, dimension: 'E', text: 'Compete in business, debate, or academic competitions' },
  { id: 49, dimension: 'E', text: 'Set ambitious goals and motivate others to achieve them' },
  { id: 50, dimension: 'E', text: 'Present your ideas confidently to a large audience' },

  // ─── CONVENTIONAL (C) — organised, structured, detail-oriented ───────────────
  { id: 51, dimension: 'C', text: 'Maintain accurate records and files for a project' },
  { id: 52, dimension: 'C', text: 'Prepare financial reports or budgets' },
  { id: 53, dimension: 'C', text: 'Follow clear procedures and guidelines step by step' },
  { id: 54, dimension: 'C', text: 'Enter and organise data in spreadsheets or databases' },
  { id: 55, dimension: 'C', text: 'Check documents for errors or inconsistencies' },
  { id: 56, dimension: 'C', text: 'Schedule and coordinate tasks across a team' },
  { id: 57, dimension: 'C', text: 'Manage inventory or track supplies and resources' },
  { id: 58, dimension: 'C', text: 'Process official paperwork and administrative tasks' },
  { id: 59, dimension: 'C', text: 'Create organised systems to keep things running smoothly' },
  { id: 60, dimension: 'C', text: 'Audit or review work for accuracy and compliance' },
]

// Scoring: sum responses per dimension (range 10–50), then convert to 0–100
export function scoreOnetResponses(responses: Record<number, number>): Record<string, number> {
  const sums: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }

  onetQuestions.forEach(q => {
    const val = responses[q.id] ?? 3 // default to neutral if unanswered
    sums[q.dimension] += val
  })

  // Convert 10–50 range → 0–100
  const scores: Record<string, number> = {}
  Object.entries(sums).forEach(([dim, sum]) => {
    scores[dim] = Math.round(((sum - 10) / 40) * 100)
  })

  return scores
}
