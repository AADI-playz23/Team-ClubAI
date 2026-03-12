document.addEventListener("DOMContentLoaded", () => {
    const apiKeyInput = document.getElementById("apiKey");
    const saveKeyBtn = document.getElementById("saveKeyBtn");
    const taskInput = document.getElementById("taskInput");
    const sendBtn = document.getElementById("sendBtn");
    const clearBtn = document.getElementById("clearBtn");
    const chatBox = document.getElementById("chatBox");

    // Load API key and memory from localStorage
    apiKeyInput.value = localStorage.getItem("ai_squad_key") || "";
    let memory = JSON.parse(localStorage.getItem("ai_squad_memory")) || [];
    renderMemory();

    saveKeyBtn.addEventListener("click", () => {
        localStorage.setItem("ai_squad_key", apiKeyInput.value);
        alert("API Key Saved to your browser securely!");
    });

    clearBtn.addEventListener("click", () => {
        memory = [];
        localStorage.setItem("ai_squad_memory", JSON.stringify(memory));
        chatBox.innerHTML = '<div class="message system">Memory cleared.</div>';
    });

    // The Orchestrator Function
    sendBtn.addEventListener("click", async () => {
        const task = taskInput.value.trim();
        const apiKey = apiKeyInput.value.trim();

        if (!task || !apiKey) return alert("Please enter both an API key and a task.");

        taskInput.value = "";
        addMessageToUI("User", task, "user");
        saveToMemory("User", task);

        // Turn-Based Multi-Agent Logic
        try {
            // 1. The Architect (Generates Initial Code)
            updateStatus("architect", "Working...");
            const architectPrompt = `You are the Lead Architect. Provide a detailed code solution for this task: ${task}`;
            const architectDraft = await callGeminiAPI(apiKey, architectPrompt);
            addMessageToUI("The Architect", architectDraft, "agent");
            saveToMemory("The Architect", architectDraft);
            updateStatus("architect", "Done!");

            // 2. The Reviewer (Critiques the Code)
            updateStatus("reviewer", "Reviewing...");
            const reviewerPrompt = `You are a strict Code Reviewer. Review this code provided by the Architect. Point out bugs, security flaws, or optimizations. Do NOT rewrite the whole thing, just list the feedback.\n\nCode to review:\n${architectDraft}`;
            const reviewFeedback = await callGeminiAPI(apiKey, reviewerPrompt);
            addMessageToUI("The Reviewer", reviewFeedback, "agent");
            saveToMemory("The Reviewer", reviewFeedback);
            updateStatus("reviewer", "Done!");

            // 3. The Senior Lead (Finalizes)
            updateStatus("lead", "Finalizing...");
            const leadPrompt = `You are the Senior Lead Developer. Look at the original task: "${task}". \nLook at the Architect's draft:\n${architectDraft}\n\nLook at the Reviewer's feedback:\n${reviewFeedback}\n\nProvide the final, perfect, production-ready code combining the draft and fixing the feedback.`;
            const finalCode = await callGeminiAPI(apiKey, leadPrompt);
            addMessageToUI("The Senior Lead", finalCode, "agent");
            saveToMemory("The Senior Lead", finalCode);
            updateStatus("lead", "Done!");

        } catch (error) {
            addMessageToUI("System", `Error: ${error.message}`, "system");
        }
    });

    // Helper: Call Google Gemini API directly from browser
    async function callGeminiAPI(apiKey, prompt) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        
        if (!response.ok) throw new Error("API request failed. Check your key.");
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    // Helper: Update UI Status
    function updateStatus(agent, status) {
        const el = document.getElementById(`status-${agent}`);
        el.innerHTML = el.innerHTML.split(":")[0] + `: ${status}`;
        if (status.includes("Working") || status.includes("Reviewing") || status.includes("Finalizing")) {
            el.classList.add("active-agent");
        } else {
            el.classList.remove("active-agent");
        }
    }

    // Helpers: Memory and UI
    function saveToMemory(sender, text) {
        memory.push({ sender, text });
        localStorage.setItem("ai_squad_memory", JSON.stringify(memory));
    }

    function addMessageToUI(sender, text, type) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `message ${type}`;
        // Basic markdown formatting replacement for bold and code blocks
        let formattedText = text.replace(/
http://googleusercontent.com/immersive_entry_chip/0

### What's Next?

This V1 uses the Gemini API for all three "agents" by dynamically changing the system prompts behind the scenes. **Would you like to look at how we can modify the `app.js` file so users can select different API providers (like OpenAI or Anthropic) for different roles?**
