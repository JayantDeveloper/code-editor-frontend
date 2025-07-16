import React, { useContext, useEffect, useCallback } from "react";
import { CodeContext, TerminalContext } from "../context";
import "./RunButton.css";

const DEFAULT_LANGUAGE = "python";

export default function RunButton() {
  const { code } = useContext(CodeContext);
  const { terminal } = useContext(TerminalContext);

  const safeScroll = useCallback(() => {
    if (!terminal) return;
    try {
      setTimeout(() => {
        terminal.scrollToBottom();
        terminal.refresh(0, terminal.rows - 1);
      }, 0);
    } catch (e) {
      console.warn("Scroll failed:", e);
    }
  }, [terminal]);

  useEffect(() => {
    if (terminal) {
      terminal.writeln("Terminal ready. Click \"Run\" to execute.");
      safeScroll();
    }
  }, [terminal, safeScroll]);

  const writeLinesToTerminal = (lines) => {
    if (!terminal) return;
    lines.forEach((line) => terminal.writeln(line));
    safeScroll();
  };

  const runCode = async () => {
	if (!terminal) return;
  
	if (!code || code.trim() === "") {
	  terminal.writeln("No code to run.");
	  safeScroll();
	  return;
	}
  
	terminal.reset(); // Full clear
	terminal.writeln(">>> Running...");
	safeScroll();
  
	try {
	  const res = await fetch("http://localhost:5001/api/run", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ code, language: DEFAULT_LANGUAGE }),
	  });
  
	  if (!res.ok) {
		throw new Error(`HTTP error! status: ${res.status}`);
	  }
  
	  const data = await res.json();
	  const lines = (data.output || "No output.").trim().split("\n");
  
	  // Clear previous lines to "replace" Running...
	  terminal.reset(); 
	  writeLinesToTerminal([...lines, "\x1b[32m✔ Done\x1b[0m"]);
	} catch (err) {
	  terminal.writeln("Error: " + err.message);
	  if (err.name === "TypeError" && err.message.includes("fetch")) {
		terminal.writeln("Make sure the backend server is running on http://localhost:5001");
	  }
	  safeScroll();
	}
  };

  return (
    <button className="run-button" onClick={runCode} disabled={!terminal}>
      Run
    </button>
  );
}
