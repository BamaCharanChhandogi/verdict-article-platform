import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';

export async function seedComprehensiveData() {
  const client = await pool.connect();
  try {
    console.log('Seeding real PostgreSQL platform dataset...');

    const defaultPassword = await bcrypt.hash('password123', 10);

    // 1. Seed Real Authors in verdict_users
    const authors = [
      {
        id: 'user-demo-1',
        email: 'demo@verdict.com',
        name: 'Elena Rostova',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        role: 'Editor in Chief',
        bio: 'Writing at the intersection of intentional living, architectural philosophy, and contemporary editorial aesthetics.'
      },
      {
        id: 'user-marcus',
        email: 'marcus.vance@verdict.com',
        name: 'Marcus Vance',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        role: 'Principal Systems Architect',
        bio: 'Investigating distributed resilience, zero-trust cloud infrastructure, and the physics of low-latency computation.'
      },
      {
        id: 'user-maya',
        email: 'maya.lin@verdict.com',
        name: 'Maya Lin',
        avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
        role: 'Design Systems Lead',
        bio: 'Exploring classical typography, organic grid geometry, spatial computing, and tactile user interfaces.'
      },
      {
        id: 'user-thorne',
        email: 'aris.thorne@verdict.com',
        name: 'Dr. Aris Thorne',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        role: 'Cognitive Neuroscientist',
        bio: 'Researching biological attention spans, deep creative focus, and the neural implications of algorithmic feedback.'
      },
      {
        id: 'user-sarah',
        email: 'sarah.jenkins@verdict.com',
        name: 'Sarah Jenkins',
        avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        role: 'Global Economic Strategist',
        bio: 'Analyzing sovereign digital infrastructure, creator monetization dynamics, and macro-technological trends.'
      },
      {
        id: 'user-david',
        email: 'david.k@verdict.com',
        name: 'David K.',
        avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
        role: 'Humane Computing Fellow',
        bio: 'Advocating for digital minimalism, quiet software, and ethical design constraints in everyday devices.'
      }
    ];

    for (const a of authors) {
      await client.query(`
        INSERT INTO verdict_users (id, email, password_hash, name, avatar_url, role, bio)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          avatar_url = EXCLUDED.avatar_url,
          role = EXCLUDED.role,
          bio = EXCLUDED.bio;
      `, [a.id, a.email, defaultPassword, a.name, a.avatar_url, a.role, a.bio]);
    }

    // 2. Clear old test articles and seed rich comprehensive articles
    await client.query('DELETE FROM verdict_articles;');

    const articles = [
      // FEATURED CAROUSEL ARTICLES (3)
      {
        id: 'feat-1',
        slug: 'how-ai-is-changing-everyday-creativity',
        title: 'How AI is Changing Everyday Creativity',
        subtitle: 'From novel parlor tricks to ambient cognitive co-pilots',
        description: 'Generative models are transitioning from novel parlor tricks to ambient cognitive partners, reshaping how writers, architects, and painters sculpt ideas.',
        content: `# The Dawn of Ambient Intelligence

Generative intelligence is acting as an intellectual catalyst, dissolving the friction between initial conception and executable form. Rather than replacing the artisan, machine cognition amplifies human discernment by generating combinatorial variations at instantaneous scale.

> "The ultimate elegance in software and design is not how much you can add, but the disciplined restraint of knowing what to leave untouched."

### 1. The Death of the Blank Canvas
The most crippling psychological barrier in any creative endeavor has historically been the tyranny of the empty page. Generative models dismantle this paralysis not by providing final masterpieces, but by serving as a tireless sparring partner that offers five unexpected structural angles before breakfast.

### 2. Craft as Curation
When synthesis becomes computationally free, value shifts decisively toward taste. The writer's primary labor transitions from mechanical transcription to high-leverage editing—choosing what resonates, pruning the derivative, and injecting authentic vulnerability into synthetic drafts.

### 3. The Future of Creative Synthesis
In this emergent era, the most prolific creators are neither pure traditionalists nor blind technophiles. They are symbiotic thinkers who treat neural models as an extension of their biological imagination while guarding their distinct human soul.`,
        cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
        category: 'AI & Future',
        author_id: 'user-demo-1',
        reading_time: 5,
        likes_count: 890,
        comments_count: 42,
        is_featured: true,
        is_editor_pick: false,
        status: 'published',
        tags: ['AI & Future', 'Creativity', 'Philosophy', 'Craft']
      },
      {
        id: 'feat-2',
        slug: 'the-art-of-a-calmer-morning',
        title: 'The Art of a Calmer Morning',
        subtitle: 'Intentional rituals of silence and single-tasking in a noisy age',
        description: 'In an era of relentless notification overload, intentional rituals of silence, natural illumination, and single-tasking restore mental sovereignty.',
        content: `# Reclaiming the First Sixty Minutes

How you inhabit the dawn dictates how you navigate the day. When the first biological action of your waking consciousness is absorbing the anxieties, algorithms, and alerts of third parties, you begin your day in a posture of psychological defense.

> "To protect your morning is to protect your mind's capacity for sovereign original thought."

### The Sacred Triangle of Dawn
1. **Zero Optical Stimulus**: Leave your mobile device quarantined outside the sleeping sanctum until daylight has properly greeted your eyes.
2. **Tactile Grounding**: Engage in an analog tactile ritual—grinding single-origin coffee beans, handwriting three lines in a notebook, or watching dawn settle across the skyline.
3. **Pacing Over Panic**: Understand that urgent demands are rarely important, and important endeavors require deliberate cognitive breathing room.`,
        cover_image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85',
        category: 'Lifestyle',
        author_id: 'user-david',
        reading_time: 4,
        likes_count: 1240,
        comments_count: 58,
        is_featured: true,
        is_editor_pick: false,
        status: 'published',
        tags: ['Lifestyle', 'Mindfulness', 'Productivity', 'Solitude']
      },
      {
        id: 'feat-3',
        slug: 'hidden-places-you-must-visit-in-2026',
        title: 'Quiet Sanctuaries: Hidden Places You Must Visit in 2026',
        subtitle: 'Retreating to the edge of the world where silence still reigns',
        description: 'From mist-veiled fjords in Norway to high-altitude monasteries in Bhutan, explore breathtaking destinations where tranquility reigns supreme.',
        content: `# Beyond the Tourist Matrix

Mass tourism has transformed the planet's wonders into algorithmic checklists. Yet nestled beyond the cruise ship terminals and selfie vantage points remain remote valleys and untouched shorelines where solitude is not a luxury, but the natural baseline.

### 1. The High Fjord Valleys of Sunnmøre
Tucked behind towering granite cliffs where ancient glaciers carved emerald fjords, life moves to the tempo of falling water and cedar smoke.

> "Traveling to understand is entirely different from traveling to consume."

### 2. The Cloud Monasteries of Bumthang
High in the eastern valleys of Bhutan, prayer flags flutter against crisp Himalayan winds, reminding visitors of an older, quieter relationship between humanity and the cosmos.`,
        cover_image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85',
        category: 'Travel',
        author_id: 'user-demo-1',
        reading_time: 6,
        likes_count: 730,
        comments_count: 29,
        is_featured: true,
        is_editor_pick: false,
        status: 'published',
        tags: ['Travel', 'Adventure', 'Nature', 'Quietude']
      },

      // EDITOR'S PICKS (4)
      {
        id: 'pick-1',
        slug: 'the-future-of-remote-work-is-more-human',
        title: 'The Future of Remote Work is More Human Than You Think',
        subtitle: 'Moving past surveillance tools into trust-based distributed autonomy',
        description: 'Physical detachment from corporate offices forces organizations to measure outcome over physical presence, ushering in an era of authentic trust.',
        content: `# Dismantling the Panopticon

When corporate leaders first confronted remote work, their initial instinct was replicating the physical office through digital panopticons—keystroke monitors, always-on webcams, and synthetic presence dots.

### Outcome as the Only Compass
True distributed autonomy replaces surveillance with rigorous clarity of intent. When deliverables speak for themselves, artificial facetime collapses into irrelevance.

> "Trust is not given because people are in sight; trust is earned when expectations are pristine and promises are kept."`,
        cover_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85',
        category: 'Business',
        author_id: 'user-sarah',
        reading_time: 4,
        likes_count: 610,
        comments_count: 31,
        is_featured: false,
        is_editor_pick: true,
        editor_pick_rank: 1,
        status: 'published',
        tags: ['Business', 'Remote Work', 'Culture', 'Leadership']
      },
      {
        id: 'pick-2',
        slug: 'design-lessons-from-nature',
        title: 'Design Lessons from Nature: Organic Geometry in Modern Interfaces',
        subtitle: 'Why the Fibonacci sequence and tactile materials feel right on glass',
        description: 'How biomimicry and natural structural systems inspire resilient digital architectures and deeply intuitive interface paradigms.',
        content: `# Biomimetic Architecture in Digital Space

Millions of years of evolutionary pressure have perfected load-bearing structures, vascular distribution systems, and harmonic color spectra. When digital designers look to organic botany, interfaces cease feeling synthetic.

### The Physics of Natural Motion
- **Inertial Deceleration**: Objects in nature do not halt abruptly; they dissipate energy along bezier arcs.
- **Hierarchical Density**: In a leaf or coral reef, primary conduits sustain subordinate capillaries without visual chaos.`,
        cover_image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=85',
        category: 'Design',
        author_id: 'user-maya',
        reading_time: 5,
        likes_count: 980,
        comments_count: 47,
        is_featured: false,
        is_editor_pick: true,
        editor_pick_rank: 2,
        status: 'published',
        tags: ['Design', 'Biomimicry', 'UI/UX', 'Aesthetics']
      },
      {
        id: 'pick-3',
        slug: 'the-psychology-of-deep-work',
        title: 'The Neuroscience of Uninterrupted Cognition',
        subtitle: 'Why a 3-minute interruption costs 23 minutes of biological focus',
        description: 'Neurobiological research reveals the immense cognitive toll of context-switching and the profound rewards of unbroken mental flow.',
        content: `# Attention Residue & Cognitive Fragmentation

Every time an engineer or writer glances at an incoming notification, attention does not smoothly pivot back to the primary challenge. Rather, a psychological phantom known as 'attention residue' lingers, starving working memory of executive bandwidth.

> "Deep focus is not an intellectual luxury; it is the ultimate differentiator in an economy dominated by superficial distraction."`,
        cover_image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=85',
        category: 'Productivity',
        author_id: 'user-thorne',
        reading_time: 6,
        likes_count: 840,
        comments_count: 36,
        is_featured: false,
        is_editor_pick: true,
        editor_pick_rank: 3,
        status: 'published',
        tags: ['Productivity', 'Neuroscience', 'Focus', 'Habits']
      },
      {
        id: 'pick-4',
        slug: 'the-architecture-of-sustainable-systems',
        title: 'The Architecture of Resilient Software Systems',
        subtitle: 'Engineering fault tolerance, graceful degradation, and timeless clarity',
        description: 'How veteran software architects build systems that outlive hype cycles by prioritizing disciplined modularity over fashionable complexity.',
        content: `# Timeless Software Principles

Fashions in frameworks cycle every eighteen months, yet the bedrock fundamentals of distributed computing—idempotency, bounded contexts, and graceful degradation—remain immutable.

### Building for the Long Arc
1. **Minimize Dependencies**: Every external library is an uninvited guest to your production incident review.
2. **Design for Failure**: Assume networks fail, disks corrupt, and third-party APIs timeout.`,
        cover_image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85',
        category: 'Technology',
        author_id: 'user-marcus',
        reading_time: 5,
        likes_count: 760,
        comments_count: 22,
        is_featured: false,
        is_editor_pick: true,
        editor_pick_rank: 4,
        status: 'published',
        tags: ['Technology', 'Architecture', 'Systems', 'Engineering']
      },

      // LATEST EDITORIAL ARTICLES
      {
        id: 'latest-1',
        slug: 'slow-living-in-a-fast-world',
        title: 'Slow Living in a Fast World: Pacing as Resistance',
        subtitle: 'Choosing intentional slowness over hurried conformity',
        description: 'An architectural and philosophical exploration of intentional pacing, seasonal eating, and creating spaces that encourage stillness.',
        content: `# The Radical Courage to Decelerate

When velocity becomes the default metric of human worth, deliberately slowing down is nothing short of cultural defiance.

### Spaces That Banish Rush
Natural materials—unlacquered brass, oiled walnut, textured linen—age with graceful patina, reminding inhabitants that beauty requires the patient accumulation of time.`,
        cover_image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
        category: 'Lifestyle',
        author_id: 'user-david',
        reading_time: 4,
        likes_count: 880,
        comments_count: 41,
        is_featured: false,
        is_editor_pick: false,
        status: 'published',
        tags: ['Lifestyle', 'Philosophy', 'Interior', 'Slow Living']
      },
      {
        id: 'latest-2',
        slug: 'the-renaissance-of-editorial-typography',
        title: 'The Renaissance of Editorial Typography on the Modern Web',
        subtitle: 'Why high-contrast serifs and generous leading have returned',
        description: 'A study into how Cormorant Garamond, Canela, and Caslon are reclaiming digital screens from sterile tech-sans homogeny.',
        content: `# Typography as Emotional Resonance

For a decade, the web surrendered its visual soul to sterile geometric neo-grotesques. Every startup, publication, and SaaS landing page looked virtually identical.

### The Return of the Serif
A new wave of digital design has embraced high-contrast serif letterforms, recognizing that letter shapes convey intellectual authority and emotional gravitas before a single word is parsed.`,
        cover_image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=85',
        category: 'Design',
        author_id: 'user-maya',
        reading_time: 5,
        likes_count: 940,
        comments_count: 53,
        is_featured: false,
        is_editor_pick: false,
        status: 'published',
        tags: ['Design', 'Typography', 'Web', 'Culture']
      },
      {
        id: 'latest-3',
        slug: 'building-the-sovereign-creator-economy',
        title: 'Building the Sovereign Creator Economy',
        subtitle: 'Direct subscriber relationships vs algorithmic dependency',
        description: 'How independent essayists and journalists are decoupling from ad-supported social fiefdoms to build direct subscriber equity.',
        content: `# Escaping the Algorithmic Treadmill

When an author's livelihood depends on algorithmic recommendation engines, their work inevitably bends toward sensationalism, outrage, and volume.

### Direct Subscriber Sovereignty
By adopting direct-to-reader publishing platforms, writers trade ephemeral viral clicks for sustained intellectual relationships with thousands of paying patrons.`,
        cover_image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85',
        category: 'Business',
        author_id: 'user-sarah',
        reading_time: 6,
        likes_count: 720,
        comments_count: 38,
        is_featured: false,
        is_editor_pick: false,
        status: 'published',
        tags: ['Business', 'Media', 'Journalism', 'Subscriptions']
      },
      {
        id: 'latest-4',
        slug: 'the-cellular-machinery-of-longevity',
        title: 'The Cellular Biology of Longevity & Vitality',
        subtitle: 'Autophagy, mitochondrial resilience, and biological optimization',
        description: 'Cutting-edge metabolic research into how fasting, thermal stress, and circadian alignment repair cellular machinery.',
        content: `# Activating Cellular Housekeeping

Modern clinical science increasingly views aging not as an inevitable decline, but as the progressive breakdown of cellular waste-disposal and repair pathways.

### The Power of Autophagy
When the body is deprived of incoming nutrients for sixteen to twenty-four hours, cells activate autophagy—literally 'self-eating'—scavenging damaged proteins and defective mitochondria to fuel clean regeneration.`,
        cover_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85',
        category: 'Health',
        author_id: 'user-thorne',
        reading_time: 5,
        likes_count: 850,
        comments_count: 44,
        is_featured: false,
        is_editor_pick: false,
        status: 'published',
        tags: ['Health', 'Biology', 'Longevity', 'Science']
      },

      // REAL DRAFTS FOR THE AUTHOR STUDIO
      {
        id: 'draft-1',
        slug: 'draft-the-architecture-of-intentional-craft',
        title: 'The Architecture of Intentional Craft',
        subtitle: 'Deep contemplation over mechanical output',
        description: 'Exploring the intersection of deep typography, minimal interfaces, and human cognition.',
        content: `# The Architecture of Intentional Craft\n\nModern digital craftsmanship requires balancing architectural velocity with long-term systemic stability.\n\n> "True craftsmanship is not how much you can add, but the disciplined grace of knowing what to leave untouched."\n\nWhen our systems prioritize depth over velocity, the work we produce leaves an indelible mark.`,
        cover_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
        category: 'Design',
        author_id: 'user-demo-1',
        reading_time: 3,
        likes_count: 0,
        comments_count: 0,
        is_featured: false,
        is_editor_pick: false,
        status: 'draft',
        tags: ['Design', 'Architecture', 'Craft']
      },
      {
        id: 'draft-2',
        slug: 'draft-quantum-foundations-in-software',
        title: 'Quantum Computing & The Cryptographic Transition',
        subtitle: 'Preparing modern architectures for post-quantum security',
        description: 'A technical primer on lattice-based cryptography and migration timelines for distributed ledgers.',
        content: `# Quantum Foundations in Modern Software\n\nDraft in progress by Marcus Vance...`,
        cover_image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=85',
        category: 'Technology',
        author_id: 'user-marcus',
        reading_time: 4,
        likes_count: 0,
        comments_count: 0,
        is_featured: false,
        is_editor_pick: false,
        status: 'draft',
        tags: ['Technology', 'Quantum', 'Security']
      }
    ];

    for (const art of articles) {
      await client.query(`
        INSERT INTO verdict_articles (
          id, slug, title, subtitle, description, content, cover_image, category,
          author_id, reading_time, status, likes_count, comments_count,
          is_featured, is_editor_pick, editor_pick_rank, tags
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
        ) ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug,
          title = EXCLUDED.title,
          subtitle = EXCLUDED.subtitle,
          description = EXCLUDED.description,
          content = EXCLUDED.content,
          cover_image = EXCLUDED.cover_image,
          category = EXCLUDED.category,
          author_id = EXCLUDED.author_id,
          reading_time = EXCLUDED.reading_time,
          status = EXCLUDED.status,
          likes_count = EXCLUDED.likes_count,
          comments_count = EXCLUDED.comments_count,
          is_featured = EXCLUDED.is_featured,
          is_editor_pick = EXCLUDED.is_editor_pick,
          editor_pick_rank = EXCLUDED.editor_pick_rank,
          tags = EXCLUDED.tags;
      `, [
        art.id, art.slug, art.title, art.subtitle, art.description, art.content,
        art.cover_image, art.category, art.author_id, art.reading_time, art.status,
        art.likes_count, art.comments_count, art.is_featured, art.is_editor_pick,
        art.editor_pick_rank || null, art.tags
      ]);
    }

    console.log(`Successfully seeded ${authors.length} real authors and ${articles.length} rich editorial articles in PostgreSQL.`);
  } finally {
    client.release();
  }
}

seedComprehensiveData().then(() => process.exit(0)).catch(e => {
  console.error('Seed error:', e);
  process.exit(1);
});
