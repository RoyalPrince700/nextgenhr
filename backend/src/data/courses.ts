export interface CatalogCourse {
  slug: string;
  title: string;
  track: string;
  summary: string;
  duration: string;
  lessons: string[];
}

export const COURSE_CATALOG: CatalogCourse[] = [
  {
    slug: 'ai-for-hr',
    title: 'AI for HR & Modern Work',
    track: 'Curriculum · Applied practice',
    summary:
      'Use AI responsibly to improve research, drafting, talent processes, analysis and decision support while keeping human judgement in charge.',
    duration: '4 weeks',
    lessons: [
      'Responsible AI principles for HR',
      'Research and drafting workflows',
      'Talent process support',
      'Decision support without outsourcing judgement',
    ],
  },
  {
    slug: 'emotional-intelligence',
    title: 'Emotional Intelligence at Work',
    track: 'Curriculum · Human capability',
    summary:
      'Build self-awareness, empathy, emotional regulation and relationship management for difficult workplace situations.',
    duration: '5 weeks',
    lessons: [
      'Self-awareness and emotional patterns',
      'Regulating responses under pressure',
      'Empathy and social awareness',
      'Relationship management in difficult conversations',
    ],
  },
  {
    slug: 'leadership-development',
    title: 'Leadership Development',
    track: 'Curriculum · People leadership',
    summary:
      'Strengthen delegation, influence, accountability, coaching conversations, team motivation and performance leadership.',
    duration: '8 weeks',
    lessons: [
      'Transitioning from peer to manager',
      'Delegation, accountability and performance conversations',
      'Feedback, coaching and conflict management',
      'Adaptability and decision-making under pressure',
      'Building a high-trust team',
    ],
  },
  {
    slug: 'core-hr-capability',
    title: 'Core HR Capability',
    track: 'Curriculum · HR practice',
    summary:
      'Develop stronger practice across talent, performance, employee relations, rewards, organisational development and people strategy.',
    duration: '8 weeks',
    lessons: [
      'HR foundations and professional judgement',
      'Talent, performance and rewards practice',
      'Employee relations judgement',
      'Organisational development',
      'Career positioning and capability roadmap',
    ],
  },
  {
    slug: 'next-gen-soft-skills',
    title: 'Next Gen Soft Skills',
    track: 'Curriculum · Future of work',
    summary:
      'Build communication, critical thinking, creativity, adaptability, collaboration and resilience as durable capabilities for modern work.',
    duration: '6 weeks',
    lessons: [
      'Business communication and executive presence',
      'Analytical and critical thinking',
      'Creativity, adaptability and collaboration',
      'Resilience and sustainable performance',
    ],
  },
  {
    slug: 'strategic-hr-leadership',
    title: 'Strategic HR Leadership',
    track: 'Curriculum · Enterprise impact',
    summary:
      'Connect people decisions to business outcomes through metrics, commercial awareness, stakeholder influence and long-term capability.',
    duration: '10 weeks',
    lessons: [
      'From HR delivery to enterprise people strategy',
      'Executive communication and stakeholder influence',
      'People analytics and evidence-based decisions',
      'Leading culture, change and capability',
      'Strategic workforce thinking and AI-enabled HR',
    ],
  },
];

export function findCourse(slug: string): CatalogCourse | undefined {
  return COURSE_CATALOG.find((course) => course.slug === slug);
}
