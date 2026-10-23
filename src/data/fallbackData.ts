import { Article, Author, Comment } from '../types';

export const fallbackAuthors: Author[] = [
  {
    id: 'author-1',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'Editor in Chief & Cultural Essayist',
    bio: 'Writing at the intersection of intentional living, architectural philosophy, and contemporary aesthetics.',
    followers: 14200,
    articlesCount: 42,
    twitter: '@elenarostova',
  },
  {
    id: 'author-2',
    name: 'Julian Hayes',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    role: 'Principal Product Designer & Futurist',
    bio: 'Exploring cognitive ergonomics, systemic software design, and humane artificial intelligence.',
    followers: 9800,
    articlesCount: 28,
    twitter: '@julianhayes',
  },
  {
    id: 'author-3',
    name: 'Aria Montgomery',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    role: 'Traveler & Environmental Anthropologist',
    bio: 'Documenting secluded mountain settlements, heritage crafts, and regenerative tourism worldwide.',
    followers: 12500,
    articlesCount: 35,
    twitter: '@ariamontgomery',
  },
  {
    id: 'author-4',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    role: 'Behavioral Economist & Author',
    bio: 'Investigating deep work habits, decision heuristics, and the psychology of effortless focus.',
    followers: 18300,
    articlesCount: 51,
    twitter: '@marcusvance',
  }
];

export const fallbackArticles: Article[] = [
  // --- FEATURED THIS WEEK (Exact match to reference UI) ---
  {
    id: 'feat-1',
    title: 'How AI is Changing Everyday Creativity',
    slug: 'how-ai-is-changing-everyday-creativity',
    description: 'Generative models are transitioning from novel parlor tricks to ambient cognitive partners, reshaping how writers, architects, and painters sculpt ideas.',
    category: 'Technology',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80',
    author: fallbackAuthors[1],
    publishedAt: 'Oct 18, 2026',
    readingTime: 6,
    likesCount: 1420,
    commentsCount: 38,
    isFeatured: true,
    tags: ['AI & Future', 'Technology', 'Design', 'Creativity'],
    content: `
# How AI is Changing Everyday Creativity

For centuries, creativity has been mythologized as a solitary spark—an enigmatic lightning bolt striking the tortured genius in a darkened studio. Yet when we strip away the romantic folklore, the creative act is fundamentally dialogic: an iterative conversation between intent and material, constraint and serendipity.

With the advent of ambient artificial intelligence, this conversation has acquired a new interlocutor. Rather than automating away human imagination, generative intelligence is acting as an intellectual catalyst, dissolving the friction between initial conception and executable form.

### The Death of the Blank Canvas

Ask any novelist or industrial designer what they dread most, and the answer is rarely the complexity of execution—it is the tyrannical inertia of the white page. Generative algorithms eliminate the blank page entirely. Within seconds, a designer can conjure twelve divergent permutations of a cantilevered timber chair or a writer can brainstorm forty thematic angles for an essay on architectural brutalism.

> "The true virtue of computational synthesis is not the generation of answers, but the acceleration of discovery."

When an idea can be prototyped at zero marginal cost, creative ambition ceases to be bounded by tedious mechanical labor. The creator transforms from a solitary bricklayer into an editor-curator, directing cognitive momentum.

### The Emergence of Ambient Collaboration

We are now witnessing the birth of "ambient collaboration." Unlike early generative tools that operated as transactional command prompts, modern systems weave quietly into our everyday thinking environments. They suggest cadence shifts in our prose, identify structural imbalances in user interfaces, and surface historical precedents that might have otherwise remained obscured in archival vaults.

The future of creative excellence will not belong to those who resist algorithmic augmentation, nor to those who surrender uncritically to automated homogeny. It will belong to the discerning minds who orchestrate synthetic intelligence with uncompromising taste, rigorous perspective, and deep human empathy.
    `
  },
  {
    id: 'feat-2',
    title: 'The Art of a Calmer Morning',
    slug: 'the-art-of-a-calmer-morning',
    description: 'In an era of relentless notification overload, intentional rituals of silence, natural illumination, and single-tasking restore mental sovereignty.',
    category: 'Lifestyle',
    coverImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80',
    author: fallbackAuthors[0],
    publishedAt: 'Oct 19, 2026',
    readingTime: 4,
    likesCount: 890,
    commentsCount: 24,
    isFeatured: true,
    tags: ['Lifestyle', 'Mindfulness', 'Productivity', 'Wellness'],
    content: `
# The Art of a Calmer Morning

The modern day rarely begins; more often, it erupts. An alarm screams in the darkness, followed immediately by the hypnotic, blue-lit glare of a smartphone screen: urgent headlines, unread notifications, algorithmic anxiety designed to hijack your attention before your feet have touched the floor.

Reclaiming mental sovereignty requires rediscovering the art of the intentional threshold. How we cross into consciousness dictates the emotional timbre of every subsequent hour.

### 1. Delay the Digital Deluge

The single highest-leverage boundary you can institute is the 45-minute digital quarantine. Keep your mobile device outside the bedchamber. Invest in an analog timepiece. Allow your subconscious mind to finish sorting the residue of dreams before exposing it to the demands of the global network.

### 2. The Geometry of Natural Light

Before reaching for caffeine, step toward an unobstructed window or step outside into ambient morning light for seven to ten minutes. Direct photons hitting retinal photoreceptors initiate cortisol synthesis, synchronize the suprachiasmatic nucleus, and reset circadian vitality far more cleanly than an espresso shot.

### 3. Single-Task Rituals

Whether it is the rhythmic pour of water over freshly ground beans or writing three observations in a notebook with fountain pen ink, cultivate one analog ritual performed in complete sensory presence. When the morning is anchored in quiet reverence, the noise of the external world loses its power to disrupt your core.
    `
  },
  {
    id: 'feat-3',
    title: 'Hidden Places You Must Visit in 2024',
    slug: 'hidden-places-you-must-visit-in-2024',
    description: 'Venturing beyond the well-worn tourist corridors into secluded alpine valleys, ancient cycladic villages, and untouched misty coastlines.',
    category: 'Travel',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
    author: fallbackAuthors[2],
    publishedAt: 'Oct 20, 2026',
    readingTime: 5,
    likesCount: 1650,
    commentsCount: 42,
    isFeatured: true,
    tags: ['Travel', 'Nature', 'Adventure', 'Lifestyle'],
    content: `
# Hidden Places You Must Visit in 2024

Travel in the twenty-first century has too often devolved into an exercise in algorithmic replication. Geotagged landmarks are besieged by travelers seeking photographic validation rather than genuine discovery. Yet across the globe, quiet sanctuaries persist—places where silence still reverberates and time slows to the cadence of the seasons.

### The High Valleys of Mestia, Georgia

Perched beneath the jagged glaciers of the Greater Caucasus, Svaneti remains one of Europe's most enigmatic alpine frontiers. Medieval stone defense towers (koshki) stand sentinel over valleys where ancient dialects and polyphonic hymns are still sung by evening hearths. The air smells of wild thyme and birch smoke.

### The Secluded Fjordlands of the Westfjords, Iceland

While southern Iceland's ring road swarms with tour coaches, the isolated claw of the Westfjords remains delightfully desolate. Here, sheet waterfalls spill directly into deserted fjords, Arctic foxes dart through black volcanic pebble beaches, and the midnight sun bathes the cliffs in amber serenity.

Travel is not about collecting flags or checking off bucket-list coordinates. It is about allowing an unfamiliar topography to disrupt your habitual perception of reality.
    `
  },

  // --- EDITOR'S PICKS (Exact match to reference UI) ---
  {
    id: 'pick-1',
    title: 'The Future of Remote Work is More Human Than You Think',
    slug: 'the-future-of-remote-work-is-more-human-than-you-think',
    description: 'Why the next generation of decentralized teams will prioritize synchronous retreats, emotional attunement, and asynchronous deep work over surveillance.',
    category: 'Business',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80',
    author: fallbackAuthors[3],
    publishedAt: 'Oct 17, 2026',
    readingTime: 5,
    likesCount: 780,
    commentsCount: 19,
    isEditorPick: true,
    editorPickRank: 1,
    tags: ['Business', 'Productivity', 'Culture'],
    content: `
# The Future of Remote Work is More Human Than You Think

When corporate executives panicked during the initial shift toward remote working, their instinct was surveillance: keystroke monitors, activity pings, and calendar saturation. Yet three years into this grand workplace experiment, the most forward-thinking distributed organizations have reached the opposite conclusion.

Remote work succeeds not when we replicate the physical office through digital panopticons, but when we liberate knowledge workers to operate with radical autonomy, accompanied by deeply intentional human retreats.
    `
  },
  {
    id: 'pick-2',
    title: 'Design Lessons from Nature',
    slug: 'design-lessons-from-nature',
    description: 'From biomimetic structural load paths to the organic color harmonies of autumnal foliage, nature offers the ultimate masterclass in systemic elegance.',
    category: 'Design',
    coverImage: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80',
    author: fallbackAuthors[1],
    publishedAt: 'Oct 16, 2026',
    readingTime: 4,
    likesCount: 1120,
    commentsCount: 31,
    isEditorPick: true,
    editorPickRank: 2,
    tags: ['Design', 'Nature', 'Architecture'],
    content: `
# Design Lessons from Nature

Nature is an evolutionary laboratory with 3.8 billion years of research and development. In the natural world, waste does not exist; every byproduct is a feedstock, every structural curve balances tensile resistance against material efficiency.

When human architects, interface designers, and typographers study botanical forms, we discover principles of proportion and balance that transcend fleeting stylistic fads.
    `
  },
  {
    id: 'pick-3',
    title: 'How to Build Better Habits with Less Effort',
    slug: 'how-to-build-better-habits-with-less-effort',
    description: 'Willpower is an unreliable biological battery. Sustainable habit architecture relies on environmental friction design and identity reframing.',
    category: 'Productivity',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=400&q=80',
    author: fallbackAuthors[3],
    publishedAt: 'Oct 15, 2026',
    readingTime: 6,
    likesCount: 2310,
    commentsCount: 54,
    isEditorPick: true,
    editorPickRank: 3,
    tags: ['Productivity', 'Psychology', 'Habits'],
    content: `
# How to Build Better Habits with Less Effort

Most self-help doctrine prescribes willpower as the ultimate antidote to procrastination. But cognitive neurobiology reveals that executive function is metabolically demanding. When you force yourself through brute motivation, you are fighting your own basal ganglia.

The masters of sustainable lifestyle design don't rely on Herculean discipline; they engineer their physical and social environments so that desired behaviors possess zero friction while destructive impulses become arduous.
    `
  },
  {
    id: 'pick-4',
    title: 'Small Travel Destinations with Big Stories',
    slug: 'small-travel-destinations-with-big-stories',
    description: 'Uncovering the forgotten narratives of coastal fishing hamlets, mountain monasteries, and secluded desert oases.',
    category: 'Travel',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    author: fallbackAuthors[2],
    publishedAt: 'Oct 14, 2026',
    readingTime: 5,
    likesCount: 940,
    commentsCount: 16,
    isEditorPick: true,
    editorPickRank: 4,
    tags: ['Travel', 'Culture', 'History'],
    content: `
# Small Travel Destinations with Big Stories

The most profound travel revelations rarely occur under monument floodlights. They happen in sleepy harbor cafes where an elderly boatbuilder explains the grain of olive wood, or in a rain-drenched Scottish glen where a ruined croft whispers of Highland clearances.

Small places hold memory with fierce intimacy. When you slow down and listen, every stone tells a story.
    `
  },

  // --- LATEST ARTICLES GRID (Exact match to reference UI) ---
  {
    id: 'latest-1',
    title: 'Building Products People Actually Love',
    slug: 'building-products-people-actually-love',
    description: 'Beyond growth metrics and customer acquisition loops lies the timeless craft of empathetic product intuition and obsessive customer delight.',
    category: 'Business',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    author: fallbackAuthors[1],
    publishedAt: 'Oct 21, 2026',
    readingTime: 5,
    likesCount: 620,
    commentsCount: 18,
    tags: ['Business', 'Product', 'Design'],
    content: `
# Building Products People Actually Love

The tech industry is inundated with dashboards, vanity metrics, and conversion funnel optimizations. Yet the products that endure in the human psyche—the physical notebook that feels perfect in hand, the clean typography of an elegant text editor—are born from taste, respect, and deep restraint.

When you solve a customer's genuine emotional frustration rather than maximizing their on-screen session time, you create lasting brand reverence.
    `
  },
  {
    id: 'latest-2',
    title: 'A Minimalist Guide to Deep Work',
    slug: 'a-minimalist-guide-to-deep-work',
    description: 'How to structure four hours of uncompromising creative flow by silencing micro-interruptions and designing an analog sanctum.',
    category: 'Productivity',
    coverImage: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
    author: fallbackAuthors[3],
    publishedAt: 'Oct 22, 2026',
    readingTime: 6,
    likesCount: 1490,
    commentsCount: 37,
    tags: ['Productivity', 'Focus', 'Habits'],
    content: `
# A Minimalist Guide to Deep Work

Multitasking is a cognitive illusion. When you toggle between writing an analytical brief and checking Slack, your brain experiences attentional residue: a mental drag that reduces analytical processing capacity by up to 40%.

True creative breakthrough demands uninterrupted depth. Four hours of laser focus will consistently out-produce twelve hours of distracted pseudo-labor.
    `
  },
  {
    id: 'latest-3',
    title: 'Slow Living in a Fast World',
    slug: 'slow-living-in-a-fast-world',
    description: 'An architectural and philosophical exploration of intentional pacing, seasonal eating, and creating spaces that encourage stillness.',
    category: 'Lifestyle',
    coverImage: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80',
    author: fallbackAuthors[0],
    publishedAt: 'Oct 22, 2026',
    readingTime: 4,
    likesCount: 880,
    commentsCount: 22,
    tags: ['Lifestyle', 'Mindfulness', 'Architecture'],
    content: `
# Slow Living in a Fast World

In our hyper-connected epoch, speed is treated as an unqualified virtue. We pride ourselves on instant messaging, same-day delivery, and lightning-fast turnaround times. But the things that give human existence meaning—friendship, literature, culinary craft, contemplation—cannot be accelerated without being diminished.

Slow living is not about doing everything at a snail's pace; it is about doing things at the right pace, with intentional presence and reverence.
    `
  },
  {
    id: 'latest-4',
    title: 'The Next Chapter of Artificial Intelligence',
    slug: 'the-next-chapter-of-artificial-intelligence',
    description: 'Looking beyond conversational bots toward multimodal spatial reasoning, autonomous edge agents, and ethical alignment frameworks.',
    category: 'Technology',
    coverImage: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80',
    author: fallbackAuthors[1],
    publishedAt: 'Oct 23, 2026',
    readingTime: 5,
    likesCount: 2100,
    commentsCount: 68,
    tags: ['Technology', 'AI & Future', 'Science'],
    content: `
# The Next Chapter of Artificial Intelligence

The initial wave of conversational AI fascinated the public with synthetic fluency. But fluency is not intelligence. The frontier of research is now pivoting toward embodied cognition, neurosymbolic reasoning, and autonomous multi-agent consensus protocols.

As these systems transition from advisory text boxes into autonomous actors in the real world, the questions before us are no longer purely computational—they are civic, ethical, and deeply philosophical.
    `
  }
];

export const fallbackComments: Record<string, Comment[]> = {
  'feat-1': [
    {
      id: 'c-1',
      articleId: 'feat-1',
      user: {
        id: 'u-1',
        name: 'Sophia Sterling',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      },
      body: 'This resonated deeply. As a UI designer, I used to fear automated design systems. Now, I use AI to rapidly test 30 variations of spacing and typography in minutes, then apply human craft to the best one.',
      likes: 24,
      createdAt: '2 hours ago'
    },
    {
      id: 'c-2',
      articleId: 'feat-1',
      user: {
        id: 'u-2',
        name: 'David Chen',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      },
      body: 'The phrase "the creator transforms from a bricklayer into an editor-curator" is the clearest articulation of this paradigm shift I have read all year.',
      likes: 18,
      createdAt: '4 hours ago'
    }
  ],
  'feat-2': [
    {
      id: 'c-3',
      articleId: 'feat-2',
      user: {
        id: 'u-3',
        name: 'Clara Oswald',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      },
      body: 'Started the 45-minute morning digital quarantine two weeks ago. My baseline anxiety dropped noticeably. Highly recommend an analog alarm clock!',
      likes: 31,
      createdAt: 'Yesterday'
    }
  ]
};
