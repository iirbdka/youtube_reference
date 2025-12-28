# RefTube 🎬

> YouTube Reference Search Service for Creators & Planners

A powerful tool to discover and analyze high-performing YouTube videos with performance insights. Find viral content, track efficiency scores, and build your reference collection.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)

## Features

### 🔍 Advanced Search & Filtering
- Filter by **duration** (Short/Medium/Long)
- Sort by **relevance, date, views, rating**
- Filter by **upload date** (hour/day/week/month/year)
- License filter (Any/Creative Commons)

### 📊 Performance Analytics
- **Efficiency Score**: Views / Subscribers × 100%
- **Insight Badge**: Automatically highlights videos with 300%+ efficiency
- View count & subscriber count comparison

### 🌍 Multi-Language Search
- 🇰🇷 Korean
- 🇺🇸 English  
- 🇯🇵 Japanese

### 🏷️ Tag Insights
- Extract popular tags from search results
- Click-to-search tag cloud

### 📚 Personal Collection
- Save videos to your collection
- Add custom notes/memos
- Local storage (no login required)

### ⚡ Performance Optimized
- Session storage caching
- Batch API requests
- Minimal quota usage

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Shadcn/UI |
| State | React Context |
| API | YouTube Data API v3 |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 18+
- YouTube Data API v3 key

### Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable **YouTube Data API v3**
4. Create credentials → API Key
5. (Recommended) Restrict the key to YouTube Data API only

### Installation

```bash
# Clone the repository
git clone https://github.com/iirbdka/youtube_reference.git
cd youtube_reference

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

Edit `.env.local`:
```
YOUTUBE_API_KEY=your_api_key_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Main search page
│   ├── collection/page.tsx     # Saved references page
│   └── api/youtube/            # API routes
│       ├── search/route.ts
│       ├── videos/route.ts
│       └── channels/route.ts
├── components/
│   ├── search/                 # SearchBar, FilterSidebar
│   ├── video/                  # VideoCard, EfficiencyBadge
│   ├── tags/                   # TagCloud
│   └── ui/                     # Shadcn UI components
├── contexts/
│   ├── SearchContext.tsx       # Search state management
│   └── CollectionContext.tsx   # Collection with localStorage
├── lib/
│   ├── youtube.ts              # YouTube API helpers
│   └── utils.ts                # Utility functions
└── types/
    └── index.ts                # TypeScript interfaces
```

## API Quota Management

YouTube API has daily quota limits (default: 10,000 units/day):

| API Call | Cost | Optimization Strategy |
|----------|------|----------------------|
| `search.list` | 100 | Session storage caching |
| `videos.list` | 1/video | Batch requests (up to 50) |
| `channels.list` | 1/channel | Batch requests + deduplication |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `YOUTUBE_API_KEY` | Yes | YouTube Data API v3 key |

## Roadmap

- [ ] Translation API for global search
- [ ] Export collection (CSV/JSON)
- [ ] Shareable collection links
- [ ] Analytics dashboard
- [ ] Dark/Light theme toggle

## License

MIT License

## Author

Built with ❤️ using Next.js and YouTube Data API
