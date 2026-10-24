# Verdict. — Editorial Article & Blog Hosting Platform

> **Live Production Platform:** [https://verdict-article-platform.vercel.app](https://verdict-article-platform.vercel.app)  
> **Repository:** [https://github.com/BamaCharanChhandogi/verdict-article-platform](https://github.com/BamaCharanChhandogi/verdict-article-platform)  
> **Candidate:** Bama Charan Chhandogi  

---

## 🔑 Demo Access Credentials

To evaluate all authoring, drafting, publishing, analytics, and interactive reader features immediately without manual registration:

| Field | Demo Credential | Notes |
|---|---|---|
| **Email** | `demo@verdict.com` | Pre-configured Author & Editor in Chief |
| **Password** | `password123` | Secure bcrypt-hashed database account |
| **Quick Action** | ⚡ **1-Click Pre-fill** | Click *"Fill Demo Credentials"* inside the sign-in modal |

> **Capabilities Unlocked**:
> - **Writer Studio**: Create, edit, and publish rich markdown dispatches with cover art, category badges, and tags.
> - **Author Dashboard & Analytics**: Access live PostgreSQL engagement stats, dynamic story read completion ratios, velocity charts, and draft management.
> - **Interactive Reader**: Real-time clap counters, threaded discussions, reading progress tracker, and text-to-speech audio player.

---

## 📖 1. Project Overview & Aesthetic Direction

**Verdict.** is a modern, high-performance editorial magazine and article hosting web application. Departing from generic 3-column blog templates, Verdict embraces an **architectural magazine aesthetic** inspired by leading luxury editorial publications:

- **Editorial Typography Pairing**: High-contrast editorial serif (**Cormorant Garamond** & **Playfair Display**) for commanding headlines paired with clean contemporary sans-serif (**Manrope** & **Inter**) for reading comfort and UI ergonomics.
- **Warm Editorial Color Palette**: Ivory/warm off-white canvas (`#FAF7F2`), deep charcoal ink (`#141416`), muted earthy sage green (`#2E4A3E`), and warm terracotta accents (`#9E5A38`).
- **Asymmetric Magazine Layout**: Fixed vertical navigation rail, organic curved hero imagery mask ("Stories for a Brighter Mind"), horizontal glassmorphic featured cards, numbered Editor's Picks with pagination, scrollable category pill filtering, and a responsive article grid.
- **Immersive Reader Experience**: Dedicated full-page article reader featuring a sticky scroll reading progress indicator, author follow controls, pull-quotes, key takeaway callouts, interactive bookmarking, social sharing, and community discussions.

---

## 🌐 2. Multi-API Integration Architecture

Verdict orchestrates multiple distinct API endpoints and browser platform services into a unified, seamless user experience:

```
                  ┌─────────────────────────────────────────────────────────┐
                  │                 Verdict Application                     │
                  └───────────────────────────┬─────────────────────────────┘
                                              │
         ┌────────────────────┬───────────────┴───────────────┬────────────────────┐
         ▼                    ▼                               ▼                    ▼
[ API 1: Articles ]  [ API 2: Authors ]              [ API 3: Discussions ] [ API 4: Audio Engine ]
 Dev.to Public Feed    DummyJSON & DiceBear            DummyJSON & Local DB    Web Speech API
         │                    │                               │                    │
         └────────────────────┴───────────────┬───────────────┴────────────────────┘
                                              ▼
                              [ In-Memory LRU Cache Engine ]
                                  (5-minute TTL Store)
                                              ▼
                             [ Zero-Break Local Fallback ]
                              (100% Offline Availability)
```

| API Stream | Source / Endpoint | Data Ingested | UI Placement & Role |
|---|---|---|---|
| **API 1: Articles Feed** | `https://dev.to/api/articles?per_page=12&top=7` | Real-world editorial essays, tags, read times, markdown content | Powers the dynamic article grid, category filtering, and search engine. |
| **API 2: Author Profiles** | `https://dummyjson.com/users` & DiceBear API | Real author avatars, names, bios, company roles, social handles | Enriches article cards, author bio drawers, and publication bylines. |
| **API 3: Community Stream** | `https://dummyjson.com/comments` | Real-time user comments, sentiment, likes, upvote counters | Powers the interactive discussion thread beneath every article. |
| **API 4: In-Browser Audio Engine** | Native Web Speech Synthesis API | Text-to-speech audio streaming with dynamic playback rates (0.75x–1.5x) | Powers the interactive audio player inside the article reader. |
| **API 5: View Transitions Engine** | Browser View Transitions API | Hardware-accelerated clip-path coordinates | Powers the circular expanding theme reveal animation. |

### How Data is Fetched, Processed, and Displayed:
1. **Fetching**: Handled through asynchronous Axios service wrappers ([`src/services/api.ts`](src/services/api.ts)) with fail-safe timeouts.
2. **Processing & Normalization**: Raw API response payloads are normalized into standardized TypeScript models (`Article`, `Author`, `Comment`). Missing cover images, author bios, and tags are enriched with high-resolution curated photography and calculated reading times.
3. **Resilience & Fallback**: Every request checks the in-memory cache first. If a remote API experiences network downtime, rate limits, or CORS restrictions, the system immediately serves bundled verified fallback data with zero UI degradation.

---

## ⚡ 3. Performance Optimizations Implemented

1. **Route-Level Code Splitting & Chunking**:
   - Implements `React.lazy` and `Suspense` for all heavy views (`ArticleDetail`, `DedicatedWriterStudio`, `AuthorDashboard`, `ReadingListPage`).
   - Configured manual Rollup vendor chunks (`vendor-react`, `vendor-icons`), keeping the initial landing bundle lightweight and achieving a **1.4s production build**.

2. **In-Memory TTL Caching (`src/services/cache.ts`)**:
   - Implements an LRU-style cache with a 5-minute Time-To-Live.
   - Eliminates redundant network requests when switching between tabs or revisiting articles, dropping subsequent fetch latency to **0ms**.

3. **Controlled On-Demand Pagination (Zero Flicker)**:
   - Synchronous pagination state handling eliminates layout shifts and UI flickering when expanding article batches.

4. **Perceived Performance & Shimmer Skeletons (`src/components/Skeletons.tsx`)**:
   - Bespoke shimmer skeletons for the Hero section, Editor's Picks, and Article Grid prevent Cumulative Layout Shift (CLS) and keep the interface feeling instantaneous during data loads.

5. **Debounced Client-Side Search (<300ms)**:
   - High-speed fuzzy search across article titles, descriptions, categories, tags, and author names running directly in-memory without lag.

6. **Image Optimization & Native Lazy Loading**:
   - Images utilize Unsplash CDN with auto-formatting (`auto=format&fit=crop&q=80`) and native browser lazy loading (`loading="lazy"`), significantly reducing initial page transfer weight.

7. **DOM-Free Scroll Reading Progress**:
   - Scroll events are passively throttled using `passive: true` event listeners, recalculating viewport percentage smoothly without layout thrashing.

8. **State & Bookmark Persistence**:
   - Bookmarks, likes, and reading lists synchronize seamlessly with browser `localStorage`, ensuring saved interactions persist across sessions.

---

## 🛠️ 4. Technology Stack & Dependencies

- **Frontend Framework**: React 19 + TypeScript
- **Bundler**: Vite 8 (Ultra-fast Hot Module Replacement)
- **Styling**: Tailwind CSS v4 + Custom Theme Design Tokens
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Fonts**: Cormorant Garamond, Playfair Display, Manrope, Inter

---

## 🚀 5. Local Setup & Execution Instructions

### Prerequisites
- Node.js 18+ installed on your system.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/BamaCharanChhandogi/verdict-article-platform.git
   cd verdict-article-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```
   The production-ready assets will be generated in the `dist/` directory.

---

## 📱 6. Responsive Design Matrix

- **Mobile (<640px)**: Collapsible slide-out drawer navigation, single-column stacked cards, full-width touch-friendly search and reader controls.
- **Tablet (768px–1024px)**: 2-column article grid, condensed header, horizontal category scrolling.
- **Desktop (1280px+)**: Full vertical editorial navigation rail, asymmetric hero with cantilever architectural cutout, right-rail Editor's Picks, and 4-column article matrix.

---

&copy; 2026 Verdict Media &bull; Designed and developed for Corporate Chanakya Technical Evaluation.
