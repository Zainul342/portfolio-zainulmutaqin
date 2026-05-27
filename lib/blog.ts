export interface BlogPost {
  slug: string
  title: string
  date: string
  readTime: string
  excerpt: string
  category: string
  content: string // Markdown/MDX text content
  tags: string[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'hello-world',
    title: 'Booting a Portfolio with Craft and Intent',
    date: 'May 27, 2026',
    readTime: '3 min read',
    excerpt: 'Behind the engineering decisions, performance budgets, and aesthetic values that shaped this developer portfolio boot process.',
    category: 'engineering',
    tags: ['Next.js', 'Tailwind', 'Aesthetics', 'Linux'],
    content: `
# Booting a Portfolio with Craft and Intent

Hello, World. This is the first commit of my digital workspace. 

When building this portfolio, I wanted to avoid creating just another cookie-cutter resume site. I wanted it to feel like an actual reflection of my workspace—a blend of terminal aesthetics, clean software engineering practices, and premium user experience.

Here is a breakdown of the key architecture decisions made:

## 1. Zero-Bloat Performance Budget
Every React component is scrutinized. Unused packages were systematically pruned, reducing the client bundle sizes. The main homepage runs as a **Server Component** by default, loading interactive hooks only where strictly necessary (e.g., custom event states and canvas globes).

## 2. Decoupled Canvas Sizing
The 3D Canvas Globe is designed to scale dynamically using browser \`ResizeObserver\` APIs. On smaller mobile phone viewports, the canvas drops into an absolute background layer with \`15%\` opacity, keeping the site content readable without fighting for precious vertical screen pixels.

## 3. Keyboard-Driven Discovery
By pressing \`Cmd+K\` or \`Ctrl+K\` globally, visitors can boot up the Command Palette to navigate the sections or trigger easter egg shells. Decade-old shell commands (\`sudo rm -rf\`) trigger custom micro-animations that add digital flavor to the browsing experience.

## 4. Catppuccin Mocha Palette
The colors respect the **Catppuccin Mocha** specifications, utilizing harmonized CSS custom properties:
* \`--base\`: The main dark page background (\`#1e1e2e\`)
* \`--surface\`: The widget/card fill layers (\`#181825\`)
* \`--mauve\`: The primary highlight accent (\`#cba6f7\`)

This is only the beginning. The core infra is ready, and I will be posting deeper write-ups on Linux system automation, React performance, and neural networks soon.

Stay curious.
\`\`\`bash
$ echo "Crafting with intent..."
\`\`\`
`,
  },
  {
    slug: 'linux-dotfiles-zen',
    title: 'The Zen of bspwm: Minimalist Window Management',
    date: 'May 15, 2026',
    readTime: '5 min read',
    excerpt: 'An in-depth look into my custom Zain-Zen EndeavourOS window manager configuration, custom hotkeys, and Ghostty terminal integration.',
    category: 'linux',
    tags: ['EndeavourOS', 'bspwm', 'Ghostty', 'Neovim'],
    content: `
# The Zen of bspwm: Minimalist Window Management

As a developer, my environment is my instrument. Over the years, I have gravitated toward an **EndeavourOS bspwm** setup. 

Here is why a tiling window manager makes a massive difference in code productivity, and how my "Zain-Zen" environment is organized.

## Why bspwm?
Unlike floating window managers, \`bspwm\` represents window layouts as leaves of a binary tree. This translates into pure deterministic hotkey navigation. My fingers never have to leave the home row to resize, shift, or swap active workspace panes.

## Core Setup Specs
* **OS**: EndeavourOS (minimal arch install)
* **WM**: bspwm + sxhkd (Simple X Hotkey Daemon)
* **Terminal**: Ghostty (ultra-fast GPU rendering)
* **Bar**: Polybar (minimal, Catppuccin tokens)
* **Editor**: Neovim Kickstart (tuned for instant startup times)

## Dynamic Keybinds to Keep flow
I map my hotkeys tightly to keep context transitions fluid:
\`\`\`config
# focus or send to desktop
super + {_,shift + }{1-9}
    bspc {desktop -f,node -d} '^{1-9}'

# focus the node in the given direction
super + {h,j,k,l}
    bspc node -f {west,south,north,east}
\`\`\`

By configuring my workspaces around specific workspace tasks (e.g. Workspace 1: Code, Workspace 2: Web, Workspace 3: Terminal, Workspace 4: Notes), my cognitive load remains close to zero.

A clean desk leads to a clean mind.
`,
  },
]

export function getAllPosts(): BlogPost[] {
  return BLOG_POSTS
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}
