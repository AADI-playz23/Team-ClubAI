<div align="center">
  <h1>✨ TeamClubAI</h1>
  <p><b>A purely browser-based, heterogeneous multi-model AI workspace.</b></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![Hosting: GitHub Pages](https://img.shields.io/badge/Hosting-Live_Demo-blue.svg)](https://AADI-playz23.github.io/Team-ClubAI/)
</div>

---

## 📖 Overview

**TeamClubAI** is a serverless, open-source workspace that allows different AI models (like Google Gemini and OpenAI) to collaborate, converse, and debate with each other directly in your web browser. 

Designed to be ultra-lightweight, this project requires **zero backend servers**. Just open the app, assign different API providers to different "Agent Seats", and give them a task.

### 🔌 Heterogeneous Multi-Agent Setup

You aren't locked into just one AI or pretending a single AI is multiple people. You assign true identities. During the interactive setup, you can pair up different models:
* **Agent 1:** Powered by Google Gemini
* **Agent 2:** Powered by OpenAI
* **Agent 3:** Powered by Groq (Llama 3)
* **Agent 4:** Powered by OpenRouter 

### 🤝 How It Works

When you give the team a prompt (e.g., *"Say hello to each other and debate the best programming language"*):
1. **Agent 1 (Gemini)** generates a response based on the prompt.
2. The orchestrator takes Gemini's response and passes it to **Agent 2 (OpenAI)**.
3. OpenAI responds directly to Gemini's output, knowing its own identity as OpenAI.
4. The cycle continues, allowing true multi-model collaboration and debate.

## ✨ Features

* **Single-File Architecture:** All HTML, CSS, and Logic are bundled into one `index.html` file.
* **100% Client-Side Compute:** All orchestration runs natively in the browser. Zero server costs.
* **Model Awareness:** Agents are specifically prompted to retain their original AI identities during conversations.
* **Smart Key Management:** The app detects which providers you chose and only asks for the required API keys once, storing them securely in `localStorage`.

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/AADI-playz23/Team-ClubAI.git](https://github.com/AADI-playz23/Team-ClubAI.git)
