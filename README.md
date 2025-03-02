# KnowCode

KnowCode is a web application that helps users understand code snippets by providing clear, simple explanations. It analyzes code and breaks down both the syntax elements and the logical flow, making programming concepts accessible to everyone.

## Features

- **Code Language Detection**: Automatically identifies the programming language of submitted code
- **Syntax Breakdown**: Explains the syntax elements used in the code
- **Logic Explanation**: Provides a step-by-step explanation of how the code works
- **Modern UI**: Clean, responsive interface with dark/light mode support

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com/) - UI component library
- [Google Generative AI (Gemini)](https://ai.google.dev/) - AI model for code analysis
- [Highlight.js](https://highlightjs.org/) - Syntax highlighting

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- A Google Generative AI API key

### Environment Setup

Create a `.env.local` file in the root directory with your Google Generative AI API key:

```
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/knowcode.git
cd knowcode

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Paste your code snippet into the code input area
2. Click "Explain This Code"
3. View the detailed explanation of your code's syntax and logic

## Development

```bash
# Run development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a custom font from Vercel.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Google Generative AI](https://ai.google.dev/docs) - learn about Gemini API capabilities
- [Tailwind CSS](https://tailwindcss.com/docs) - explore the utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com/docs) - discover reusable components

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is licensed under the MIT License - see the LICENSE file for details.