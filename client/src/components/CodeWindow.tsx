import React from "react";

interface CodeWindowProps {
  code: string;
  filename: string;
}

export default function CodeWindow({ code, filename }: CodeWindowProps) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const codeWindowRef = React.useRef<HTMLDivElement>(null);

  // Handle mouse move to update gradient position
  const handleMouseMove = (e: React.MouseEvent) => {
    if (codeWindowRef.current) {
      const rect = codeWindowRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // Split the code into lines and add line numbers
  const codeLines = code.split("\n").map((line, index) => {
    return (
      <div key={index} className="group">
        <span className="line-number">{index + 1}</span>
        <span 
          className="text-github-text"
          dangerouslySetInnerHTML={{ 
            __html: highlightSyntax(line) 
          }} 
        />
      </div>
    );
  });

  return (
    <div 
      ref={codeWindowRef}
      className="code-window w-full relative group"
      onMouseMove={handleMouseMove}
    >
      {/* Gradient glow effect */}
      <div 
        className="absolute -inset-[1px] bg-gradient-to-r from-github-blue/30 via-purple-500/30 to-github-green/30 rounded-lg blur-lg group-hover:opacity-100 opacity-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(88,166,255,0.15), transparent 40%)`
        }}
      />
      
      <div className="code-header relative">
        <div className="window-button bg-red-500"></div>
        <div className="window-button bg-yellow-500"></div>
        <div className="window-button bg-green-500"></div>
        <div className="ml-4 text-xs text-github-muted">{filename}</div>
      </div>
      <div className="code-content relative">
        <pre>{codeLines}</pre>
      </div>
    </div>
  );
}

// Simple syntax highlighting function
function highlightSyntax(line: string): string {
  // Replace keywords with colored spans
  return line
    .replace(
      /(import|export|const|let|var|function|return|from|default)/g,
      '<span class="text-purple-400">$1</span>'
    )
    .replace(
      /(\{|\}|\(|\)|\[|\]|;|,|=>)/g,
      '<span class="text-github-text">$1</span>'
    )
    .replace(
      /(useState|useEffect|React)/g,
      '<span class="text-blue-400">$1</span>'
    )
    .replace(
      /('[^']*'|"[^"]*")/g,
      '<span class="text-green-300">$1</span>'
    )
    .replace(
      /(\d+)/g,
      '<span class="text-orange-400">$1</span>'
    )
    .replace(
      /(&lt;[^\/&]*&gt;|&lt;\/.*?&gt;)/g,
      '<span class="text-blue-300">$1</span>'
    );
}

// CSS styles
const styles = {
  codeWindow: `
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #30363D;
    background: #0D1117;
  `,
  codeHeader: `
    display: flex;
    background: #161B22;
    padding: 8px 16px;
    border-bottom: 1px solid #30363D;
  `,
  windowButton: `
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 8px;
  `,
  codeContent: `
    padding: 16px;
    font-family: 'SF Mono', monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    color: #C9D1D9;
    overflow-x: auto;
  `,
  lineNumber: `
    color: #8B949E;
    user-select: none;
    text-align: right;
    padding-right: 12px;
    min-width: 40px;
    display: inline-block;
  `
};

// Add CSS to the page
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `
    .code-window {
      ${styles.codeWindow}
    }
    .code-header {
      ${styles.codeHeader}
    }
    .window-button {
      ${styles.windowButton}
    }
    .code-content {
      ${styles.codeContent}
    }
    .line-number {
      ${styles.lineNumber}
    }
  `;
  document.head.appendChild(styleElement);
}