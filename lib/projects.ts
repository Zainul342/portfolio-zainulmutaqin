export interface ProjectStackItem {
  label: string
  color?: string
}

export interface Project {
  id: string
  slug: string
  name: string
  description: string
  longDescription: string
  problem: string
  approach: string
  result: string
  challenges: string
  techDetails: { title: string; desc: string }[]
  stack: ProjectStackItem[]
  github?: string
  demo?: string
  featured?: boolean
  accentColor: string
  fieldNote?: {
    terrain: string
    route: string
    signal: string
  }
}

export const PROJECTS: Project[] = [
  {
    id: 'domcy-coffee',
    slug: 'domcy-coffee',
    name: 'domcy-coffee',
    description: 'A premium full-stack coffee shop platform featuring a highly-responsive UI, interactive menu, and streamlined transaction DX.',
    longDescription: 'domcy-coffee is a full-featured e-commerce catalog showcase built to solve the disjointed user experience common in local coffee shop websites. It prioritizes instant layout feedback, immersive product imagery, and lightning-fast checkout UX.',
    problem: 'Most local beverage sites are cluttered, slow, and fail to evoke the sensory pleasure of coffee, leading to high user bounce rates and abandoned checkouts.',
    approach: 'Built a modular next-gen commerce layout in Next.js using dynamic client states. Leveraged Tailwind CSS for fluid animations that guide the user visually through order builds, ensuring instant interactive state changes.',
    result: 'Developed a stunning and intuitive showcase that reduced catalog browsing friction. Features a highly optimized client cart and elegant spring transition modals.',
    challenges: 'Ensuring consistent layout responsiveness for wide, detailed grids on small phone viewports. Resolved by developing customized Tailwind grid structures and loading components asynchronously.',
    techDetails: [
      { title: 'Next.js 14 App Router', desc: 'Provides optimal SSR capability, hybrid routing, and fast initial paint.' },
      { title: 'Tailwind CSS', desc: 'Used extensively for design tokens, ensuring cohesive custom animations and themes.' },
      { title: 'TypeScript Core', desc: 'Enforces robust type-safety across cart payloads and menu models.' }
    ],
    stack: [
      { label: 'TypeScript', color: '#89b4fa' },
      { label: 'Next.js', color: '#a6e3a1' },
      { label: 'Tailwind CSS', color: '#89dceb' },
    ],
    github: 'https://github.com/Zainul342',
    demo: 'https://domcy-coffee.vercel.app',
    featured: true,
    accentColor: '#f9e2af',
    fieldNote: {
      terrain: 'e-commerce platform',
      route: 'concept → component → deploy',
      signal: 'premium transaction dx',
    },
  },
  {
    id: 'cinevault',
    slug: 'cinevault',
    name: 'CineVault',
    description: 'A sleek movie library catalog dashboard backed by PHP, boasting lightning-fast responses and responsive page layouts.',
    longDescription: 'CineVault is a lightweight media dashboard developed to aggregate film and review records cleanly. It leverages standard server-side rendering architecture to serve highly structured pages instantly.',
    problem: 'Modern web applications are often over-engineered, shipping massive client-side bundles for static index screens and causing high page load times.',
    approach: 'Leveraged native PHP routing and template rendering combined with clean CSS layouts. Used vanilla JS micro-interactions only when necessary to enrich navigation.',
    result: 'Created a blazing fast and clean dashboard that runs with near-zero runtime overhead. Highlights high-efficiency relational SQL queries and clean structured semantic outputs.',
    challenges: 'Handling pagination and high-resolution poster loads without slowing down the application. Solved by implementing an efficient server pagination query and native lazy-loading image tags.',
    techDetails: [
      { title: 'PHP Server core', desc: 'Handles routing, query processing, and direct HTML assembly efficiently.' },
      { title: 'Relational Queries', desc: 'Optimized schema indexing for lightning-fast movie search queries.' },
      { title: 'Modular CSS Design', desc: 'Direct, zero-build style sheets utilizing harmonized CSS custom properties.' }
    ],
    stack: [
      { label: 'PHP', color: '#cba6f7' },
      { label: 'JavaScript', color: '#f9e2af' },
      { label: 'Vanilla CSS', color: '#89b4fa' },
    ],
    github: 'https://github.com/Zainul342',
    accentColor: '#cba6f7',
    fieldNote: {
      terrain: 'movie library dashboard',
      route: 'php core → sql → templates',
      signal: 'high-efficiency zero-build',
    },
  },
  {
    id: 'studyflow',
    slug: 'studyflow',
    name: 'StudyFlow Tracker',
    description: 'Study timeline tracker specifically modeled for Indonesian high-schoolers prepping for the national UN/SNBT exams.',
    longDescription: 'StudyFlow is a customized candidate dashboard engineered for Indonesian students facing national entrance exams (SNBT). It offers clear timeline planning, subject checklists, and metric calculations to build steady study habits.',
    problem: 'Exam prep is overwhelming, and students struggle to visual-track their syllabus status across different test materials, leading to preparation gaps.',
    approach: 'Developed an interactive timeline board using React state containers. Modeled clear category trackers where students can mark their confidence scores per subject.',
    result: 'Produced a useful tracking platform used by high schoolers to visualize their progress. Reduced tracking friction via local client caching.',
    challenges: 'Handling real-time client state updates and saving progress offline securely. Implemented direct localStorage sync layers inside a React hook.',
    techDetails: [
      { title: 'React Hooks state', desc: 'Allows reactive, modular components updating status lists instantly.' },
      { title: 'LocalStorage caching', desc: 'Saves students\' state locally without complex database roundtrips.' },
      { title: 'Tailwind Design System', desc: 'Creates a focused, readable monospace UI minimizing student distractions.' }
    ],
    stack: [
      { label: 'TypeScript', color: '#89b4fa' },
      { label: 'React', color: '#89dceb' },
    ],
    github: 'https://github.com/Zainul342',
    demo: 'https://snbtflow.vercel.app',
    accentColor: '#a6e3a1',
    fieldNote: {
      terrain: 'student tracker board',
      route: 'react state → localstorage',
      signal: 'offline progress syncing',
    },
  },
  {
    id: 'weather-dashboard',
    slug: 'weather-dashboard',
    name: 'Weather Dashboard',
    description: 'Minimalist dashboard showing instant atmospheric forecasts, linking seamlessly with open weather APIs.',
    longDescription: 'A direct-to-point forecast screen built using vanilla JavaScript to parse and display real-time weather metadata from open APIs.',
    problem: 'Standard weather portals are congested with ads and redundant content, making simple weather checking slow and noisy.',
    approach: 'Utilized clean async-await fetch blocks to fetch JSON data, mapping key atmospheric indicators immediately onto a monospace, dark-themed HUD card.',
    result: 'Launched a fast, zero-ad HUD screen that delivers instantaneous weather status for searched coordinates.',
    challenges: 'Cabling error states and fallback values for invalid city names or network issues gracefully. Resolved using try-catch blocks and clean notification banners.',
    techDetails: [
      { title: 'Async/Await REST fetch', desc: 'Fetches global weather records efficiently from OpenWeatherMap endpoints.' },
      { title: 'Dynamic DOM updates', desc: 'Injects weather parameters safely avoiding standard innerHTML vulnerabilities.' }
    ],
    stack: [
      { label: 'JavaScript', color: '#f9e2af' },
      { label: 'REST API', color: '#89b4fa' },
    ],
    github: 'https://github.com/Zainul342',
    accentColor: '#89b4fa',
    fieldNote: {
      terrain: 'weather api visualizer',
      route: 'async fetch → dom injection',
      signal: 'fast atmospheric metrics',
    },
  },
  {
    id: 'ai-context-pro',
    slug: 'ai-context-pro',
    name: 'AI Context Pro',
    description: 'Utility for developers to optimize prompt engineering by chunking and structuring complex file tokens.',
    longDescription: 'AI Context Pro is a developer tool built to aggregate directories and code paths into highly structured, LLM-digestible markdown files, maximizing prompt context windows.',
    problem: 'Copy-pasting source code across files into AI chat interfaces is tedious and destroys file hierarchy context for the AI model.',
    approach: 'Implemented full directory parsing and token estimating logic, creating structured markdown blocks representing the complete tree and contents cleanly.',
    result: 'Speeds up developer prompting workflow by compiling entire directories into structured text payloads with one click.',
    challenges: 'Excluding large compiled directories (node_modules, .git) dynamically to avoid token overflow. Implemented robust regex directory filter arrays.',
    techDetails: [
      { title: 'TypeScript AST parsing', desc: 'Allows clean analysis of file paths and metadata representation.' },
      { title: 'Token optimization', desc: 'Analyzes code segments to estimate token sizes prior to prompt output.' }
    ],
    stack: [
      { label: 'TypeScript', color: '#89b4fa' },
      { label: 'AI/ML', color: '#cba6f7' },
    ],
    github: 'https://github.com/Zainul342',
    accentColor: '#cba6f7',
    fieldNote: {
      terrain: 'prompt context generator',
      route: 'ast parse → markdown build',
      signal: 'llm-digestible tokens',
    },
  },
  {
    id: 'diskdiet',
    slug: 'diskdiet',
    name: 'DiskDiet',
    description: 'Minimalistic Linux CLI automation to clean temp directories and package locks swiftly.',
    longDescription: 'DiskDiet is a command-line script and Svelte companion dashboard to automate package cache cleaning and disk audit logs on Linux distributions.',
    problem: 'Unused package managers and compile logs clutter Linux storage over time, and auditing storage using standard terminal logs is verbose.',
    approach: 'Engineered high-efficiency shell cleaning routines coupled with a modular Svelte dashboard interface for visual disk scanning.',
    result: 'Provides a clean, beautiful desktop companion utility for immediate disk analysis and space reclamation.',
    challenges: 'Executing system-level cleanups safely without risking crucial configuration files. Implemented dry-run options and restricted directories strictly to temporary log trees.',
    techDetails: [
      { title: 'Svelte reactive compiler', desc: 'Compiles down to a near-zero runtime footprint for optimal desktop speeds.' },
      { title: 'Shell scripting routines', desc: 'Direct OS system integrations scanning folders and executing cleaning threads.' }
    ],
    stack: [
      { label: 'Svelte', color: '#f38ba8' },
      { label: 'Linux OS', color: '#a6e3a1' },
    ],
    github: 'https://github.com/Zainul342',
    accentColor: '#f38ba8',
    fieldNote: {
      terrain: 'disk cleaning utility',
      route: 'bash script → svelte ui',
      signal: 'automated log trimming',
    },
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug)
}
