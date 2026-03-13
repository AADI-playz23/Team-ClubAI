import React, { useState, useEffect, useRef } from 'react';
import './App.css';

export default function App() {
  // --- State Management ---
  const [setupStep, setSetupStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [teamSize, setTeamSize] = useState(3);
  const [agents, setAgents] = useState([]);
  
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isDebating, setIsDebating] = useState(false);

  // Auto-scroll reference
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom whenever messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Handlers ---
  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), text, sender }]);
  };

  const handleSetupSubmit = (e) => {
    e.preventDefault();
    if (setupStep === 0 && userName.trim()) {
      setSetupStep(1);
    } else if (setupStep === 1) {
      if (teamSize >= 2 && teamSize <= 5) {
        // Auto-generate agents based on the Debate mechanic
        const roles = ["Proposer", "Critic", "Synthesizer", "Security QA", "Performance Optimizer"];
        const newAgents = Array.from({ length: teamSize }, (_, i) => ({
          id: i + 1,
          role: roles[i],
          status: "Idle"
        }));
        setAgents(newAgents);
        setSetupStep(2); // Move to Main Chat
        addMessage(`Welcome, ${userName}. Your ${teamSize}-agent debate council is initialized. What would you like us to build?`, 'system');
      } else {
        alert("Please enter a number between 2 and 5.");
      }
    }
  };

  const triggerDebateLoop = async (task) => {
    setIsDebating(true);
    addMessage(task, 'user');
    setInputValue("");

    // Simulate the Debate Loop
    for (let i = 0; i < agents.length; i++) {
      if (!isDebating) break; // Emergency stop check
      
      const agent = agents[i];
      
      // UI Update: Show agent thinking
      setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: "Debating..." } : a));
      
      // Simulate API Delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (agent.role === "Proposer") {
        addMessage(`[${agent.role}]: I propose we build this using a React functional component with a custom hook for state...`, 'agent-proposer');
      } else if (agent.role === "Critic") {
        addMessage(`[${agent.role}]: I disagree. A custom hook is overkill here. We should keep the state local to avoid unnecessary re-renders...`, 'agent-critic');
      } else {
        addMessage(`[${agent.role}]: Synthesizing the best of both approaches. Here is the final optimized code.`, 'agent-synthesizer');
      }

      // UI Update: Agent finished
      setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: "Idle" } : a));
    }
    
    setIsDebating(false);
    addMessage("Debate concluded. The optimal solution has been generated.", 'system');
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isDebating) return;
    triggerDebateLoop(inputValue);
  };

  const emergencyStop = () => {
    setIsDebating(false);
    setAgents(prev => prev.map(a => ({ ...a, status: "Idle" })));
    addMessage("System: Debate forcefully halted by user.", 'error');
  };

  // --- Render Functions ---
  if (setupStep < 2) {
    return (
      <div className="app-container flex-center fade-in">
        <div className="glass-panel setup-box">
          <h1 className="neon-text">Initialize Swarm</h1>
          <form onSubmit={handleSetupSubmit} className="setup-form">
            {setupStep === 0 ? (
              <>
                <label>What is your name, Commander?</label>
                <input 
                  type="text" 
                  autoFocus
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)} 
                  placeholder="e.g., Aadi" 
                />
              </>
            ) : (
              <>
                <label>How many AI debaters do you want? (2-5)</label>
                <input 
                  type="number" 
                  min="2" max="5"
                  autoFocus
                  value={teamSize} 
                  onChange={(e) => setTeamSize(parseInt(e.target.value))} 
                />
              </>
            )}
            <button type="submit" className="btn-primary">Next</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container fade-in">
      <header className="app-header">
        <h2 className="neon-text">{userName}'s AI Council</h2>
        <button className="btn-danger-outline" onClick={() => window.location.reload()}>Reboot</button>
      </header>

      <main className="main-grid">
        {/* Workspace */}
        <section className="glass-panel workspace">
          <div className="chat-box">
            {messages.map((msg) => (
              <div key={msg.id} className={`msg-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {/* THIS INVISIBLE DIV FIXES THE SCROLL BUG */}
            <div ref={chatEndRef} /> 
          </div>

          <form onSubmit={handleChatSubmit} className="input-area">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Give the council a task..."
              disabled={isDebating}
            />
            {isDebating ? (
              <button type="button" className="btn-danger" onClick={emergencyStop}>Stop Debate</button>
            ) : (
              <button type="submit" className="btn-primary">Deploy</button>
            )}
          </form>
        </section>

        {/* Sidebar */}
        <aside className="glass-panel sidebar">
          <h3>Council Status</h3>
          <div className="agent-list">
            {agents.map(agent => (
              <div key={agent.id} className={`agent-card ${agent.status !== 'Idle' ? 'active' : ''}`}>
                <div className="agent-role">{agent.role}</div>
                <div className="agent-status">
                  <span className={`status-dot ${agent.status !== 'Idle' ? 'pulse' : ''}`}></span>
                  {agent.status}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
}
