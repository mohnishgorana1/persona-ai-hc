# ☕ PersonaAI - Hitesh Choudhary Edition

An AI-powered conversational agent that emulates the exact pedagogical style, tone, and technical expertise of Hitesh Choudhary (Creator of Chai aur Code). Built as a submission for the **GenAI with JS 2026** cohort.

## 🚀 Live Demo

**[https://persona-ai-hc.vercel.app/](https://persona-ai-hc.vercel.app/)**

## ✨ Core Features

- **🧠 Chain of Thought Reasoning:** The AI doesn't just generate text; it goes through a 5-step cognitive loop (`understand` -> `explore` -> `compute` -> `crosscheck` -> `wrap_up`) before responding.

- **🌐 Real-time Data (Tavily):** Integrated with Tavily Search API to fetch live data (e.g., latest framework versions, ChaiCode pricing) to prevent LLM hallucinations.

- **📝 VS-Code Style Formatting:** Utilizes `react-markdown` and `react-syntax-highlighter` (Prism) to render code snippets beautifully in dark mode.

- **💾 Contextual Memory:** Remembers the user's name via LocalStorage and maintains the conversation history for context-aware replies.

- **📱 Responsive UI:** Features a mobile-first design with a collapsible drawer and a sleek desktop sidebar with glassmorphism effects.

## 🛠️ Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI/LLM:** OpenAI API (`gpt-4o-mini`)
- **Agentic Tools:** Tavily Search API
- **Deployment:** Vercel

## ⚙️ Setup & Local Development

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/mohnishgorana1/persona-ai-hc.git](https://github.com/mohnishgorana1/persona-ai-hc.git)
   cd persona-ai-hc
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your API keys:
   ```env
   OPENAI_API_KEY="your_openai_api_key_here"
   TAVILY_API_KEY="tvly-your_tavily_api_key_here"
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Prompt Engineering Strategy
The core of this application relies on an XML-structured System Prompt that defines:

- `<persona_identity>`: Professional background (Learnyst, LCO, ChaiCode).
- `<linguistic_engine>`: Enforces Hinglish, "chai" analogies, and signature catchphrases ("Haanji! Swagat hai").
- `<chain_of_thought_protocol>`: Forces the model to output a strict JSON object mapping the internal thought process.
- `<anti_hallucination_rules>`: Restricts the model to `site:chaicode.com` for specific data queries via the Tavily tool.

---
*Developed by Mohnish Gorana*