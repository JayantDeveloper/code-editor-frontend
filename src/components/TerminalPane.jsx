import React, { useEffect, useRef, useContext } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { TerminalContext } from "../context"; 
import "xterm/css/xterm.css";
import "./TerminalPane.css";

export default function TerminalPane() {
  const containerRef = useRef(null);
  const { setTerminal } = useContext(TerminalContext); 

  useEffect(() => {
    if (containerRef.current) {
        const term = new Terminal({
            fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
            fontSize: 14,
            cursorStyle: "bar",   
            cursorBlink: false,   
            disableStdin: true, 
            theme: {
              background: "#1e1e1e",
              cursor: "transparent" 
            }
        });
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(containerRef.current);
  
      // ✅ Fit the terminal layout first
      setTimeout(() => {
        fitAddon.fit();
      }, 0);
  
      setTerminal(term);
  
      // Debounced resize
      let resizeTimeout;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          requestAnimationFrame(() => fitAddon.fit());
        }, 100);
      };
      window.addEventListener("resize", handleResize);
  
      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(resizeTimeout);
        term.dispose(); // ✅ Clean up terminal on unmount
      };
    }
  }, [setTerminal]);
  
  return <div className="terminal-pane" ref={containerRef} />;
}