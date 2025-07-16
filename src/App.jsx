import React from "react";
import "./App.css";
import EditorPane from "./components/EditorPane";
import TerminalPane from "./components/TerminalPane";
import RunButton from "./components/RunButton";
import { AppProvider } from "./context"; 

export default function App() {
  return (
    <AppProvider>
      <div className="container">
        <div className="left-pane">
          {/* Left half - empty for now */}
        </div>
        <div className="right-pane">
          <div className="editor-container">
            <EditorPane />
            <RunButton />
          </div>
          <TerminalPane />
        </div>
      </div>
    </AppProvider>
  );
}