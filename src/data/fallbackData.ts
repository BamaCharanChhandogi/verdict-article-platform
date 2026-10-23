import { Article, Author, Comment } from '../types';

export const fallbackAuthors: Author[] = [
  {
    id: 'user-demo-1',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    role: 'Editor in Chief',
    bio: 'Writing at the intersection of intentional living, architectural philosophy, and contemporary editorial aesthetics.',
    followers: 14200,
    articlesCount: 42,
    twitter: '@elenarostova',
  },
  {
    id: 'user-marcus',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    role: 'Principal Systems Architect',
    bio: 'Investigating distributed resilience, zero-trust cloud infrastructure, and the physics of low-latency computation.',
    followers: 18300,
    articlesCount: 51,
    twitter: '@marcusvance',
  },
  {
    id: 'user-maya',
    name: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    role: 'Design Systems Lead',
    bio: 'Exploring classical typography, organic grid geometry, spatial computing, and tactile user interfaces.',
    followers: 12500,
    articlesCount: 35,
    twitter: '@mayalin',
  },
  {
    id: 'user-thorne',
    name: 'Dr. Aris Thorne',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    role: 'Cognitive Neuroscientist',
    bio: 'Researching biological attention spans, deep creative focus, and the neural implications of algorithmic feedback.',
    followers: 9800,
    articlesCount: 28,
    twitter: '@aristhorne',
  },
  {
    id: 'user-sarah',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    role: 'Global Economic Strategist',
    bio: 'Analyzing sovereign digital infrastructure, creator monetization dynamics, and macro-technological trends.',
    followers: 11200,
    articlesCount: 22,
    twitter: '@sarahjenkins',
  },
  {
    id: 'user-david',
    name: 'David K.',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    role: 'Humane Computing Fellow',
    bio: 'Advocating for digital minimalism, quiet software, and ethical design constraints in everyday devices.',
    followers: 16400,
    articlesCount: 19,
    twitter: '@davidk',
  }
];

export const fallbackArticles: Article[] = [
  // --- FEATURED THIS WEEK ---
  {
    id: 'feat-1',
    title: 'How AI is Changing Everyday Creativity',
    slug: 'how-ai-is-changing-everyday-creativity',
    description: 'Generative models are transitioning from novel parlor tricks to ambient cognitive partners, reshaping how writers, architects, and painters sculpt ideas.',
    category: 'Technology',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80',
    author: fallbackAuthors[0], // Elena Rostova
    publishedAt: 'Oct 18, 2026',
    readingTime: 6,
    likesCount: 1420,
    commentsCount: 38,
    isFeatured: true,
    tags: ['AI & Future', 'Technology', 'Design', 'Creativity'],
    content: `# The Dawn of Ambient Intelligence

Generative intelligence is acting as an intellectual catalyst, dissolving the friction between initial conception and executable form. Rather than replacing the artisan, machine cognition amplifies human discernment by generating combinatorial variations at instantaneous scale.

> "The ultimate elegance in software and design is not how much you can add, but the disciplined restraint of knowing what to leave untouched."

When an idea can be prototyped at zero marginal cost, creative ambition ceases to be bounded by tedious mechanical labor. The creator transforms from a solitary bricklayer into an editor-curator, directing cognitive momentum.`
  },
  {
    id: 'feat-2',
    title: 'The Art of a Calmer Morning',
    slug: 'the-art-of-a-calmer-morning',
    description: 'In an era of relentless notification overload, intentional rituals of silence, natural illumination, and single-tasking restore mental sovereignty.',
    category: 'Lifestyle',
    coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85',
    author: fallbackAuthors[5], // David K.
    publishedAt: 'Oct 19, 2026',
    readingTime: 4,
    likesCount: 1240,
    commentsCount: 58,
    isFeatured: true,
    tags: ['Lifestyle', 'Mindfulness', 'Productivity', 'Wellness'],
    content: `# The Art of a Calmer Morning

The modern day rarely begins; more often, it erupts. An alarm screams in the darkness, followed immediately by the hypnotic, blue-lit glare of a smartphone screen: urgent headlines, unread notifications, algorithmic anxiety designed to hijack your attention before your feet have touched the floor.

Reclaiming mental sovereignty requires rediscovering the art of the intentional threshold. How we cross into consciousness dictates the emotional timbre of every subsequent hour.

### 1. Delay the Digital Deluge
Keep your mobile device outside the bedchamber. Invest in an analog timepiece. Allow your subconscious mind to finish sorting the residue of dreams before exposing it to the demands of the global network.

### 2. The Geometry of Natural Light
Before reaching for caffeine, step toward an unobstructed window or step outside into ambient morning light for seven to ten minutes.

### 3. Pacing Over Panic
Understand that urgent demands are rarely important, and important endeavors require deliberate cognitive breathing room.`
  },
  {
    id: 'feat-3',
    title: 'Hidden Places You Must Visit: Secluded Topographies',
    slug: 'hidden-places-you-must-visit-secluded-topographies',
    description: 'Venturing beyond the well-worn tourist corridors into secluded alpine valleys, ancient cycladic villages, and untouched misty coastlines.',
    category: 'Travel',
    coverImage: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85',
    author: fallbackAuthors[2], // Maya Lin
    publishedAt: 'Oct 20, 2026',
    readingTime: 6,
    likesCount: 730,
    commentsCount: 29,
    isFeatured: true,
    tags: ['Travel', 'Adventure', 'Nature', 'Quietude'],
    content: `# Beyond the Well-Worn Corridors

True exploration begins where cellular towers lose their reach. When we deliberately abandon curated bucket-lists, we recover the lost capacity for astonishment.

> "Traveling to understand is entirely different from traveling to consume."

High in the eastern valleys of Bhutan, prayer flags flutter against crisp Himalayan winds, reminding visitors of an older, quieter relationship between humanity and the cosmos.`
  },

  // --- EDITOR'S PICKS ---
  {
    id: 'pick-1',
    title: 'The Future of Remote Work is More Human Than You Think',
    slug: 'the-future-of-remote-work-is-more-human',
    description: 'Physical detachment from corporate offices forces organizations to measure outcome over physical presence, ushering in an era of authentic trust.',
    category: 'Business',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85',
    author: fallbackAuthors[4], // Sarah Jenkins
    publishedAt: 'Oct 15, 2026',
    readingTime: 4,
    likesCount: 610,
    commentsCount: 31,
    isEditorPick: true,
    editorPickRank: 1,
    tags: ['Business', 'Remote Work', 'Culture', 'Leadership'],
    content: `# Dismantling the Panopticon

When corporate leaders first confronted remote work, their initial instinct was replicating the physical office through digital panopticons—keystroke monitors, always-on webcams, and synthetic presence dots.

### Outcome as the Only Compass
True distributed autonomy replaces surveillance with rigorous clarity of intent. When deliverables speak for themselves, artificial facetime collapses into irrelevance.`
  },
  {
    id: 'pick-2',
    title: 'Design Lessons from Nature: Organic Geometry in Modern Interfaces',
    slug: 'design-lessons-from-nature',
    description: 'How biomimicry and natural structural systems inspire resilient digital architectures and deeply intuitive interface paradigms.',
    category: 'Design',
    coverImage: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=85',
    author: fallbackAuthors[2], // Maya Lin
    publishedAt: 'Oct 16, 2026',
    readingTime: 5,
    likesCount: 980,
    commentsCount: 47,
    isEditorPick: true,
    editorPickRank: 2,
    tags: ['Design', 'Biomimicry', 'UI/UX', 'Aesthetics'],
    content: `# Biomimetic Architecture in Digital Space

Millions of years of evolutionary pressure have perfected load-bearing structures, vascular distribution systems, and harmonic color spectra. When digital designers look to organic botany, interfaces cease feeling synthetic.`
  },
  {
    id: 'pick-3',
    title: 'The Neuroscience of Uninterrupted Cognition',
    slug: 'the-psychology-of-deep-work',
    description: 'Neurobiological research reveals the immense cognitive toll of context-switching and the profound rewards of unbroken mental flow.',
    category: 'Productivity',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=85',
    author: fallbackAuthors[3], // Dr. Aris Thorne
    publishedAt: 'Oct 17, 2026',
    readingTime: 6,
    likesCount: 840,
    commentsCount: 36,
    isEditorPick: true,
    editorPickRank: 3,
    tags: ['Productivity', 'Neuroscience', 'Focus', 'Habits'],
    content: `# Attention Residue & Cognitive Fragmentation

Every time an engineer or writer glances at an incoming notification, attention does not smoothly pivot back to the primary challenge. Rather, a psychological phantom known as 'attention residue' lingers.`
  },
  {
    id: 'pick-4',
    title: 'The Architecture of Resilient Software Systems',
    slug: 'the-architecture-of-sustainable-systems',
    description: 'How veteran software architects build systems that outlive hype cycles by prioritizing disciplined modularity over fashionable complexity.',
    category: 'Technology',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85',
    author: fallbackAuthors[1], // Marcus Vance
    publishedAt: 'Oct 18, 2026',
    readingTime: 7,
    likesCount: 1120,
    commentsCount: 64,
    isEditorPick: true,
    editorPickRank: 4,
    tags: ['Technology', 'Architecture', 'Distributed Systems'],
    content: `# Timeless Software Principles

Fashions in frameworks cycle every eighteen months, yet the bedrock fundamentals of distributed computing—idempotency, bounded contexts, and graceful degradation—remain immutable.`
  },

  // --- LATEST COMMUNITY ESSAYS ---
  {
    id: 'latest-1',
    title: 'Slow Living in a Fast World: Pacing as Resistance',
    slug: 'slow-living-in-a-fast-world',
    description: 'Why slowness is the most radical counter-cultural gesture of our century.',
    category: 'Lifestyle',
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
    author: fallbackAuthors[5], // David K.
    publishedAt: 'Oct 19, 2026',
    readingTime: 4,
    likesCount: 880,
    commentsCount: 41,
    tags: ['Lifestyle', 'Mindfulness', 'Slow Living'],
    content: `# Slowness as a Deliberate Stance

When every app accelerates stimulation, intentional slowness becomes an act of psychological resistance. Natural materials—unlacquered brass, oiled walnut, textured linen—age with graceful patina, reminding inhabitants that beauty requires the patient accumulation of time.`
  },
  {
    id: 'latest-2',
    title: 'The Sovereign Creator: Escaping Algorithmic Feudalism',
    slug: 'the-sovereign-creator-escaping-algorithms',
    description: 'How independent thinkers establish direct reader relationships using open protocols and private imprints.',
    category: 'Business',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
    author: fallbackAuthors[4], // Sarah Jenkins
    publishedAt: 'Oct 20, 2026',
    readingTime: 5,
    likesCount: 670,
    commentsCount: 22,
    tags: ['Business', 'Economics', 'Creator Economy'],
    content: `# Beyond Algorithmic Feudalism

To build an audience solely on proprietary social platforms is to build a cathedral on rented land. Sovereign creators own their email lists, host on canonical domains, and speak directly to their readers without intermediary algorithmic gatekeepers.`
  }
];

export const fallbackComments: Record<string, Comment[]> = {};
