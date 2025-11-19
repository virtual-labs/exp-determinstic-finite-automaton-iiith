/*****
 * File containing main logic to display DFA
 *
 */

// Global variables
let width = 500;
let height = 200;
let radius = 25;

let dfa = [];
let dfaIndex = 0;
let inputIndex = 0;
let inputPointer = -1;
let nodes = [];
let edges = [];

// Streak and Guessing System
let currentStreak = 0;
let bestStreak = 0;
let isGuessMode = false;
let correctAnswer = null;

// DFA Data Definitions
const dfa1 = {
    "description": "Check if input begins with 01.",
    "vertices": [
        {"text": "A", "type": "start"},
        {"text": "B", "type": "none"},
        {"text": "C", "type": "accept"},
        {"text": "D", "type": "none"} // dead state
    ],
    "edges": [
        {"start": "A", "end": "B", "text": "0", "type": "forward"},
        {"start": "A", "end": "D", "text": "1", "type": "forward"},
        {"start": "B", "end": "C", "text": "1", "type": "forward"},
        {"start": "B", "end": "D", "text": "0", "type": "forward"},
        {"start": "C", "end": "C", "text": ["0","1"], "type": "self"},
        {"start": "D", "end": "D", "text": ["0","1"], "type": "self"}
    ],
    "input": [
        // Accepted: starts with 01
        { "string": "010110", "states": ["A", "B", "C", "C", "C", "C", "C"] },
        // Rejected: does not start with 01
        { "string": "110011", "states": ["A", "D", "D", "D", "D", "D", "D"] },
        // Accepted: starts with 01 and has more characters
        { "string": "011001", "states": ["A", "B", "C", "C", "C", "C", "C"] },
        // Rejected: starts with 0 but second char is 0
        { "string": "001101", "states": ["A", "B", "D", "D", "D", "D", "D"] }
    ]
};

const dfa2 = {
  "description": "Check if input has exactly three 1s.",
  "vertices": [
    {"text": "A", "type": "start"},
    {"text": "B", "type": "none"},
    {"text": "C", "type": "none"},
    {"text": "D", "type": "accept"},
    {"text": "E", "type": "none"} // Dead state for more than three 1s
  ],
  "edges": [
    {"start": "A", "end": "A", "text": "0", "type": "self"},
    {"start": "A", "end": "B", "text": "1", "type": "forward"},
    {"start": "B", "end": "B", "text": "0", "type": "self"},
    {"start": "B", "end": "C", "text": "1", "type": "forward"},
    {"start": "C", "end": "C", "text": "0", "type": "self"},
    {"start": "C", "end": "D", "text": "1", "type": "forward"},
    {"start": "D", "end": "D", "text": "0", "type": "self"},
    {"start": "D", "end": "E", "text": "1", "type": "forward"},
    {"start": "E", "end": "E", "text": ["0","1"], "type": "self"}
  ],
  "input": [
    // Accepted: exactly three 1s
    { "string": "101010", "states": ["A", "B", "B", "C", "C", "D", "D"] },
    // Rejected: more than three 1s
    { "string": "111100", "states": ["A", "B", "C", "D", "E", "E", "E"] },
    // Accepted: exactly three 1s with 0s in between
    { "string": "100110", "states": ["A", "B", "B", "B", "C", "C", "D"] },
    // Rejected: only two 1s
    { "string": "101000", "states": ["A", "B", "B", "C", "C", "C", "C"] }
  ]
};

const dfa3 = {
  "description": "Check if input terminates with 0.",
  "vertices": [
    {"text": "A", "type": "start"},
    {"text": "B", "type": "accept"},
  ],
  "edges": [
    {"start": "A", "end": "A", "text": "1", "type": "self"},
    {"start": "A", "end": "B", "text": "0", "type": "forward"},
    {"start": "B", "end": "A", "text": "1", "type": "backward"},
    {"start": "B", "end": "B", "text": "0", "type": "self"}
  ],
  "input": [
    // Accepted: ends with 0
    { "string": "110100", "states": ["A", "A", "A", "B", "A", "B", "B"] },
    // Rejected: ends with 1
    { "string": "101101", "states": ["A", "A", "B", "A", "A", "B", "A"] },
    // Accepted: simple case ending with 0
    { "string": "111010", "states": ["A", "A", "A", "A", "B", "A", "B"] },
    // Rejected: simple case ending with 1
    { "string": "001011", "states": ["A", "B", "B", "A", "B", "A", "A"] }
  ]
};

const dfa4 = {
  "description": "Does input have atleast one 0 and terminates with 1?",
  "vertices": [
    {"text": "A", "type": "start"},
    {"text": "B", "type": "none"},
    {"text": "C", "type": "accept"}
  ],
  "edges": [
    {"start": "A", "end": "A", "text": "1", "type": "self"},
    {"start": "A", "end": "B", "text": "0", "type": "forward"},
    {"start": "B", "end": "C", "text": "1", "type": "forward"},
    {"start": "B", "end": "B", "text": "0", "type": "self"},
    {"start": "C", "end": "B", "text": "0", "type": "backward"},
    {"start": "C", "end": "C", "text": "1", "type": "self"}
  ],
  "input": [
    // Accepted: has at least one 0 and ends with 1
    { "string": "110101", "states": ["A", "A", "A", "B", "C", "B", "C"] },
    // Rejected: no 0 at all
    { "string": "111111", "states": ["A", "A", "A", "A", "A", "A", "A"] },
    // Accepted: multiple 0s and ends with 1
    { "string": "100011", "states": ["A", "A", "B", "B", "B", "C", "C"] },
    // Rejected: has 0 but ends with 0
    { "string": "101010", "states": ["A", "A", "B", "C", "B", "C", "B"] }
  ]
};

const dfa5 = {
  "description": "Does first occurence of 0 is in a group of size atleast three?",
  "vertices": [
    {"text": "A", "type": "start"},
    {"text": "B", "type": "none"},
    {"text": "C", "type": "none"}, 
    {"text": "D", "type": "accept"},
    {"text": "E", "type": "none"} // Reject state for insufficient 0s
  ],
  "edges": [
    {"start": "A", "end": "A", "text": "1", "type": "self"},
    {"start": "A", "end": "B", "text": "0", "type": "forward"},
    {"start": "B", "end": "C", "text": "0", "type": "forward"},
    {"start": "B", "end": "E", "text": "1", "type": "forward"}, // First group had only 1 zero
    {"start": "C", "end": "D", "text": "0", "type": "forward"},
    {"start": "C", "end": "E", "text": "1", "type": "forward"}, // First group had only 2 zeros
    {"start": "D", "end": "D", "text": ["0","1"], "type": "self"},
    {"start": "E", "end": "E", "text": ["0","1"], "type": "self"}
  ],
  "input": [
    // Accepted: first group of 0s is at least three
    { "string": "110001", "states": ["A", "A", "A", "B", "C", "D", "D"] },
    // Rejected: first group of 0s is only two
    { "string": "110011", "states": ["A", "A", "A", "B", "C", "E", "E"] },
    // Accepted: starts with three 0s
    { "string": "000111", "states": ["A", "B", "C", "D", "D", "D", "D"] },
    // Rejected: only one 0 in first group
    { "string": "110111", "states": ["A", "A", "A", "B", "E", "E", "E"] }
  ]
};

// Initialize DFA array
dfa = [dfa1, dfa2, dfa3, dfa4, dfa5];

// Helper Functions
function newElementNS(tag, attr) {
  const elem = document.createElementNS("http://www.w3.org/2000/svg", tag);
  attr.forEach(function ([name, value]) {
    elem.setAttribute(name, value);
  });
  return elem;
}

function newElement(tag, attr) {
  const elem = document.createElement(tag);
  attr.forEach(function ([name, value]) {
    elem.setAttribute(name, value);
  });
  return elem;
}

function clearElem(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.lastChild);
  }
}

function createQPath(start, mid, end) {
  return (
    "M " +
    start.x +
    " " +
    start.y +
    " Q " +
    mid.x +
    " " +
    mid.y +
    " " +
    end.x +
    " " +
    end.y
  );
}

function getMidAngle(pathElem) {
  const length = pathElem.getTotalLength();
  const half = length / 2;
  const sampleDist = 0.1;

  const ptBefore = pathElem.getPointAtLength(Math.max(0, half - sampleDist));
  const ptAfter = pathElem.getPointAtLength(Math.min(length, half + sampleDist));

  const dx = ptAfter.x - ptBefore.x;
  const dy = ptAfter.y - ptBefore.y;
  const radians = Math.atan2(dy, dx);
  return (radians * 180) / Math.PI;
}

function getVerticalOffset(angleDeg) {
  let a = angleDeg % 360;
  if (a < 0) a += 360;

  if (a > 135 && a < 315) {
    return 12;
  } else {
    return -10;
  }
}

// Main Display Function
function displayCanvas(canvas, dfa, inputPointer, currNode) {
  const sine45 = 0.707;
  clearElem(canvas);

  // Minimal arrowhead and color definitions
  const defs = newElementNS("defs", []);
  // Simple black arrowhead
  const marker = newElementNS("marker", [
    ["id", "arrowhead"],
    ["markerWidth", "7"],
    ["markerHeight", "5"],
    ["refX", "6"],
    ["refY", "2.5"],
    ["orient", "auto"],
    ["markerUnits", "strokeWidth"],
  ]);
  const arrowPath = newElementNS("path", [
    ["d", "M0,0 L7,2.5 L0,5 L2,2.5 Z"],
    ["fill", "#222"],
    ["stroke", "#222"],
    ["stroke-width", "0.5"],
  ]);
  marker.appendChild(arrowPath);
  defs.appendChild(marker);
  canvas.appendChild(defs);

  // More spread out: increase spacing
  const nodes = [];
  const nodeCount = dfa.vertices.length;
  const spacing = Math.max(width / (nodeCount + 1), 160); // More spread out
  const startX = (width - (nodeCount - 1) * spacing) / 2;
  dfa.vertices.forEach((v, i) => {
    nodes.push({
      text: v.text,
      type: v.type,
      x: startX + (i * spacing),
      y: height / 2,
    });
  });

  // Draw nodes (minimal style)
  nodes.forEach((n) => {
    let fillColor = "#fff";
    let strokeColor = "#222";
    let strokeWidth = "2";
    if (n.type === "accept") {
      strokeColor = "#222";
      strokeWidth = "3";
    }
    if (n.text === currNode) {
      fillColor = "#ffe066"; // highlight current state
      strokeColor = "#d97706";
      strokeWidth = "3";
    }
    const circle = newElementNS("circle", [
      ["cx", n.x],
      ["cy", n.y],
      ["r", radius],
      ["stroke", strokeColor],
      ["fill", fillColor],
      ["stroke-width", strokeWidth],
    ]);
    canvas.appendChild(circle);
    // Accept state: double circle
    if (n.type === "accept") {
      const outer = newElementNS("circle", [
        ["cx", n.x],
        ["cy", n.y],
        ["r", radius + 6],
        ["stroke", "#222"],
        ["fill", "none"],
        ["stroke-width", "2"],
      ]);
      canvas.appendChild(outer);
    }
    // Node label
    const label = newElementNS("text", [
      ["x", n.x],
      ["y", n.y],
      ["fill", "#222"],
      ["text-anchor", "middle"],
      ["dominant-baseline", "middle"],
      ["font-family", "Inter, sans-serif"],
      ["font-weight", "700"],
      ["font-size", "16"],
    ]);
    label.textContent = n.text;
    canvas.appendChild(label);
  });

  // Prepare edges
  const edgeGroups = {};
  dfa.edges.forEach((e) => {
    // Group by start-end (forwards and backwards are separate)
    const key = e.type === "self"
      ? `self-${e.start}`
      : `${e.start}->${e.end}`;
    if (!edgeGroups[key]) edgeGroups[key] = [];
    edgeGroups[key].push(e);
  });

  const edges = [];
  Object.entries(edgeGroups).forEach(([key, group]) => {
    group.forEach((e, idx) => {
      const newEdge = {
        text: e.text,
        type: e.type,
        start: { text: e.start, x: 0, y: 0 },
        mid: { x: 0, y: 0 },
        end: { text: e.end, x: 0, y: 0 },
      };
      nodes.forEach((n) => {
        if (n.text === e.start) {
          newEdge.start.x = n.x;
          newEdge.start.y = n.y;
        }
        if (n.text === e.end) {
          newEdge.end.x = n.x;
          newEdge.end.y = n.y;
        }
      });
      const offset = radius;
      const isMultiple = Array.isArray(e.text) && e.text.length > 1;
      const extra = isMultiple ? e.text.length * 10 : 0;
      // Alternate curvature direction for parallel edges
      const sign = idx % 2 === 0 ? 1 : -1;
      const alt = Math.floor(idx / 2) + 1;
      const curveBump = sign * alt * 24; // 24px bump per alternation
      if (e.type === "forward" || e.type === "backward") {
        // Calculate direction vector from start to end
        let dx = newEdge.end.x - newEdge.start.x;
        let dy = newEdge.end.y - newEdge.start.y;
        let len = Math.sqrt(dx * dx + dy * dy);
        // Move start and end points to the edge of the source and target nodes
        if (len > 0) {
          // Move start out from center
          newEdge.start.x = newEdge.start.x + (dx / len) * radius;
          newEdge.start.y = newEdge.start.y + (dy / len) * radius;
          // Move end in from center
          newEdge.end.x = newEdge.end.x - (dx / len) * radius;
          newEdge.end.y = newEdge.end.y - (dy / len) * radius;
        }
        if (e.type === "forward") {
          newEdge.mid.x = (newEdge.start.x + newEdge.end.x) / 2;
          newEdge.mid.y = newEdge.start.y - (radius + extra + 32 + curveBump);
        } else {
          newEdge.mid.x = (newEdge.start.x + newEdge.end.x) / 2;
          newEdge.mid.y = newEdge.start.y + (radius + extra + 32 + curveBump);
        }
      } else if (e.type === "self") {
        const node = nodes.find((n) => n.text === e.start);
        // Make self-loop very small
        let loopRadius = radius * 0; // much smaller than before
        newEdge.start.x = node.x;
        newEdge.start.y = node.y + radius;
        newEdge.end.x = node.x;
        newEdge.end.y = node.y + radius;
        newEdge.mid.x = node.x;
        newEdge.mid.y = node.y + loopRadius;
        newEdge.isSelfLoop = true;
        newEdge.arcRadius = loopRadius;
      }
      edges.push(newEdge);
    });
  });

  // Draw edges (minimal style)
  edges.forEach((edge) => {
    let pathStr;
    // Draw self-loops with very small diameter
    if (edge.isSelfLoop) {
      const x = edge.start.x;
      const y = edge.start.y;
      const r = Math.max(6, radius * 0.7);
      pathStr = `M ${x} ${y} A ${r} ${r} 0 1 1 ${x - 0.1} ${y}`;
    } else {
      const startIdx = nodes.findIndex(n => n.text === edge.start.text);
      const endIdx = nodes.findIndex(n => n.text === edge.end.text);
      const isNeighbor = Math.abs(startIdx - endIdx) === 1;
      // Check for bidirectional edge between neighbors
      let hasReverse = false;
      if (isNeighbor) {
        hasReverse = edges.some(e =>
          Math.abs(nodes.findIndex(n => n.text === e.start.text) - nodes.findIndex(n => n.text === e.end.text)) === 1 &&
          e.start.text === edge.end.text &&
          e.end.text === edge.start.text
        );
      }
      if (isNeighbor && !hasReverse) {
        // Single edge between neighbors: straight line
        pathStr = `M ${edge.start.x} ${edge.start.y} L ${edge.end.x} ${edge.end.y}`;
      } else if (isNeighbor && hasReverse) {
        // Two-way edge between neighbors: curve up or down
        const curveAmount = 32; // small curve
        const midX = (edge.start.x + edge.end.x) / 2;
        const midY = (edge.start.y + edge.end.y) / 2;
        // Curve up for one direction, down for the other
        const up = startIdx < endIdx ? -curveAmount : curveAmount;
        pathStr = `M ${edge.start.x} ${edge.start.y} Q ${midX} ${midY + up} ${edge.end.x} ${edge.end.y}`;
      } else {
        // Not neighbors: use original quadratic curve
        pathStr = createQPath(edge.start, edge.mid, edge.end);
      }
    }
    const pathElem = newElementNS("path", [
      ["d", pathStr],
      ["fill", "none"],
      ["stroke", "#222"],
      ["stroke-width", "2.5"],
      ["marker-end", "url(#arrowhead)"],
      ["opacity", "0.95"],
    ]);
    canvas.appendChild(pathElem);
    // Edge label
    let labelStr = Array.isArray(edge.text) ? edge.text.join(",") : edge.text;
    const pathLen = pathElem.getTotalLength();
    const midPt = pathElem.getPointAtLength(pathLen / 2);
    const angleDeg = getMidAngle(pathElem);
    const vOffset = getVerticalOffset(angleDeg);
    const edgeLabel = newElementNS("text", [
      ["fill", "#222"],
      ["text-anchor", "middle"],
      ["dominant-baseline", "middle"],
      ["font-family", "Inter, sans-serif"],
      ["font-weight", "600"],
      ["font-size", "13"],
    ]);
    edgeLabel.setAttribute("x", midPt.x);
    edgeLabel.setAttribute("y", midPt.y + vOffset);
    edgeLabel.textContent = labelStr;
    canvas.appendChild(edgeLabel);
  });
  return [nodes, edges];
}

// Core Functions
function refreshCanvas() {
  const canvas = document.getElementById("canvas1");
  
  // Add loading state
  canvas.classList.add("canvas-loading");
  
  setTimeout(() => {
    clearElem(canvas);

    let curr = "";
    if (inputPointer != -1) {
      curr = dfa[dfaIndex]["input"][inputIndex]["states"][inputPointer];
    }

    // Update DFA description - hidden by default
    const DFADescriptionContainer = document.getElementById("DFA_description_container");
    clearElem(DFADescriptionContainer);
    
    // Create container with reveal button
    const descriptionWrapper = newElement("div", [["class", "relative"]]);
    
    // Hidden description (initially blurred/hidden)
    const descriptionDiv = newElement("div", [
      ["id", "dfa-description-content"],
      ["class", "bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-2 border border-gray-200 blur-sm transition-all duration-300"]
    ]);
    const span = newElement("span", [
      ["id", "DFA_description"], 
      ["class", "text-black font-medium text-sm"]
    ]);
    const text = document.createTextNode(dfa[dfaIndex]["description"]);
    span.appendChild(text);
    descriptionDiv.appendChild(span);
    
    // Reveal button
    const revealBtn = newElement("button", [
      ["id", "reveal-language-btn"],
      ["class", "neu-button text-xs px-3 py-1 mt-2"]
    ]);
    revealBtn.innerHTML = `
      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
      </svg>
      Reveal Language
    `;
    revealBtn.onclick = function() {
      const content = document.getElementById("dfa-description-content");
      if (content.classList.contains("blur-sm")) {
        content.classList.remove("blur-sm");
        revealBtn.innerHTML = `
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"></path>
            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"></path>
          </svg>
          Hide Language
        `;
      } else {
        content.classList.add("blur-sm");
        revealBtn.innerHTML = `
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
          </svg>
          Reveal Language
        `;
      }
    };
    
    descriptionWrapper.appendChild(descriptionDiv);
    descriptionWrapper.appendChild(revealBtn);
    DFADescriptionContainer.appendChild(descriptionWrapper);

    const res = displayCanvas(canvas, dfa[dfaIndex], inputPointer, curr);
    nodes = res[0];
    edges = res[1];
    
    // Remove loading state and add active glow
    canvas.classList.remove("canvas-loading");
    canvas.classList.add("canvas-active");
    
    // Add state transition animation if there's a current state
    if (curr) {
      setTimeout(() => {
        const currentCircles = canvas.querySelectorAll('circle');
        currentCircles.forEach(circle => {
          if (circle.getAttribute('fill')?.includes('activeGradient')) {
            circle.classList.add('state-entering');
          }
        });
      }, 100);
    }
  }, 300);
}

function resetInput() {
  inputIndex = 0;
  inputPointer = -1;
  refreshInput();
}

function refreshInput() {
  const inputContainer = document.getElementById("input_container");
  clearElem(inputContainer);
  inputContainer.style.whiteSpace = "nowrap";
  inputContainer.style.overflowX = "auto";
  inputContainer.style.width = "100%";
  inputContainer.style.display = "block";
  const inputStr = dfa[dfaIndex]["input"][inputIndex]["string"];
  for (let i = 0; i < inputStr.length; ++i) {
    let className = "input-char font-bold text-black transition-all duration-300 transform";
    if (inputPointer == i) className += " bg-yellow-200 rounded";
    const span = document.createElement("span");
    span.id = `text_${i}`;
    span.className = className;
    span.style.margin = "0 0.25rem";
    span.textContent = inputStr[i];
    inputContainer.appendChild(span);
  }
  // Scroll to current character if needed
  if (inputPointer >= 0) {
    const activeChar = document.getElementById("text_" + inputPointer);
    if (activeChar) {
      const containerRect = inputContainer.getBoundingClientRect();
      const charRect = activeChar.getBoundingClientRect();
      if (charRect.left < containerRect.left || charRect.right > containerRect.right) {
        activeChar.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }
}

function resetStack() {
  const stack = document.getElementById("stack_list");
  clearElem(stack);
}

function addToStack(str) {
  const stack = document.getElementById("stack_list");

  const listElem = newElement("li", []);
  const textNode = document.createTextNode(str);
  listElem.appendChild(textNode);

  if (stack.firstChild) {
    stack.firstChild.style.fontWeight = "normal";
    stack.insertBefore(listElem, stack.firstChild);
  } else {
    stack.appendChild(listElem);
  }
  
  if (stack.firstChild) {
    stack.firstChild.style.fontWeight = "bold";
  }
}

function removeFromStack() {
  const stack = document.getElementById("stack_list");
  if (stack.firstChild) {
    stack.removeChild(stack.firstChild);

    if (stack.firstChild) {
      stack.firstChild.style.fontWeight = "bold";
    }
  }
}

// Clean implementation of step button management
function updateStepButtons() {
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const inputStr = dfa[dfaIndex]["input"][inputIndex]["string"];
  
  // Prev button: disabled when at or before initial state
  if (inputPointer <= -1) {
    prev.disabled = true;
    prev.classList.add('opacity-50', 'pointer-events-none');
  } else {
    prev.disabled = false;
    prev.classList.remove('opacity-50', 'pointer-events-none');
  }
  
  // Next button: disabled when all characters are processed
  if (inputPointer >= inputStr.length) {
    next.disabled = true;
    next.classList.add('opacity-50', 'pointer-events-none');
  } else {
    next.disabled = false;
    next.classList.remove('opacity-50', 'pointer-events-none');
  }
}

// Clean next step handler
function handleNextStep() {
  const inputStr = dfa[dfaIndex]["input"][inputIndex]["string"];
  const statesArr = dfa[dfaIndex]["input"][inputIndex]["states"];
  
  // If at initial state, move to first character
  if (inputPointer === -1) {
    inputPointer = 0;
    refreshInput();
    refreshCanvas();
    updateStepButtons(); // Update buttons after state change
    return;
  }
  
  // If all characters processed, do nothing
  if (inputPointer >= inputStr.length) {
    return;
  }
  
  // Show guess modal for current character
  if (showGuessModalQuiz(inputPointer, inputStr, statesArr)) {
    // Modal handles the rest, buttons will be updated after guess
    return;
  } else {
    // If can't show modal, proceed directly
    proceedWithTransition();
  }
}

// Clean previous step handler
function handlePrevStep() {
  if (inputPointer > -1) {
    inputPointer = inputPointer - 1;
    refreshInput();
    refreshCanvas();
    removeFromStack();
    updateStepButtons(); // Update buttons after state change
  }
}

// Show guess modal for quiz, for the current character
function showGuessModalQuiz(idx, inputStr, statesArr) {
  // idx is the character index to quiz on
  if (idx >= inputStr.length) return false;
  const currentChar = inputStr[idx];
  const currentState = statesArr[idx];
  correctAnswer = statesArr[idx + 1];
  if (typeof currentChar === 'undefined' || typeof currentState === 'undefined' || typeof correctAnswer === 'undefined') {
    return false;
  }
  document.getElementById('guess-character').textContent = currentChar;
  document.getElementById('guess-current-state').textContent = currentState;
  const optionsContainer = document.getElementById('guess-options');
  clearElem(optionsContainer);
  const allStates = dfa[dfaIndex]["vertices"].map(v => v.text);
  allStates.forEach(state => {
    const button = document.createElement('button');
    button.className = 'guess-option';
    button.textContent = `State ${state}`;
    button.addEventListener('click', () => makeGuessQuiz(state));
    optionsContainer.appendChild(button);
  });
  document.getElementById('guess-modal').classList.remove('hidden');
  isGuessMode = true;
  ensureGuessModalCloseButton();
  return true;
}

// Updated proceedWithTransition to include button updates
function proceedWithTransition() {
  const inputStr = dfa[dfaIndex]["input"][inputIndex]["string"];
  const statesArr = dfa[dfaIndex]["input"][inputIndex]["states"];
  
  // Move to next state
  inputPointer = inputPointer + 1;
  refreshInput();
  refreshCanvas();
  
  let str = "";
  if (inputPointer != 0) {
    str += "Read character '" + inputStr[inputPointer - 1] + "'";
    str += " and moved from State " + statesArr[inputPointer - 1];
    str += " to State " + statesArr[inputPointer];
  }
  if (inputPointer == 0) {
    str += "Moved to Start State " + statesArr[0];
  }
  addToStack(str);
  
  // Update buttons after state change
  updateStepButtons();
  
  // Check if computation is complete
  if (inputPointer == inputStr.length) {
    const curr = statesArr[inputPointer];
    let computationStatus = "Rejected";
    for (let itr = 0; itr < dfa[dfaIndex]["vertices"].length; ++itr) {
      if (dfa[dfaIndex]["vertices"][itr]["text"] == curr) {
        if (dfa[dfaIndex]["vertices"][itr]["type"] == "accept") {
          computationStatus = "Accepted";
        }
        break;
      }
    }
    
    // Visual feedback
    const canvas = document.getElementById("canvas1");
    if (computationStatus === "Accepted") {
      canvas.classList.add("accept-state-complete");
      setTimeout(() => canvas.classList.remove("accept-state-complete"), 2000);
    } else {
      canvas.classList.add("reject-state-shake");
      setTimeout(() => canvas.classList.remove("reject-state-shake"), 500);
    }
    
    // Show completion alert
    swal({
      title: computationStatus === "Accepted" ? "🎉 Accepted!" : "❌ Rejected!",
      text: `The input string "${inputStr}" was ${computationStatus.toLowerCase()}`,
      icon: computationStatus === "Accepted" ? "success" : "error",
      button: {
        text: "Continue",
        className: "neu-button interactive"
      },
      className: "modern-swal",
    });
  }
}

// Updated guess handler to include button updates
function makeGuessQuiz(guessedState) {
  const options = document.querySelectorAll('.guess-option');
  const isCorrect = guessedState === correctAnswer;
  
  // Visual feedback on buttons
  options.forEach(option => {
    const state = option.textContent.replace('State ', '');
    if (state === correctAnswer) {
      option.classList.add('correct');
    } else if (state === guessedState && !isCorrect) {
      option.classList.add('incorrect');
    } else {
      option.style.opacity = '0.5';
    }
    option.disabled = true;
  });
  
  // Update streak
  if (isCorrect) {
    currentStreak++;
    saveBestStreak();
  } else {
    resetStreak();
  }
  
  // Show feedback
  showFeedbackToast(isCorrect, guessedState, correctAnswer);
  
  // Close modal and proceed
  setTimeout(() => {
    document.getElementById('guess-modal').classList.add('hidden');
    isGuessMode = false;
    proceedWithTransition(); // This will call updateStepButtons()
    updateStreakDisplay();
  }, 1200);
}

// Add a compact, always-present close button to the guess modal overlay
function ensureGuessModalCloseButton() {
  const modal = document.getElementById('guess-modal').querySelector('.floating-card');
  let closeBtn = document.getElementById('guess-modal-close');
  if (!closeBtn) {
    closeBtn = document.createElement('button');
    closeBtn.id = 'guess-modal-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '0.5rem';
    closeBtn.style.right = '0.5rem';
    closeBtn.style.width = '2rem';
    closeBtn.style.height = '2rem';
    closeBtn.style.background = '#fff';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.fontSize = '1.25rem';
    closeBtn.style.fontWeight = 'bold';
    closeBtn.style.color = '#374151';
    closeBtn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07)';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.display = 'flex';
    closeBtn.style.alignItems = 'center';
    closeBtn.style.justifyContent = 'center';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = function() {
      document.getElementById('guess-modal').classList.add('hidden');
      isGuessMode = false;
    };
    modal.style.position = 'relative';
    modal.appendChild(closeBtn);
  }
}

// Initialize streak counter
function initializeStreakCounter() {
  const savedBestStreak = localStorage.getItem('dfa-best-streak');
  if (savedBestStreak) {
    bestStreak = parseInt(savedBestStreak);
    document.getElementById('best-streak').textContent = bestStreak;
  }
}

// Update streak display
function updateStreakDisplay() {
  document.getElementById('streak-counter').textContent = currentStreak;
  document.getElementById('best-streak').textContent = bestStreak;
  
  // Add animation
  const counterElement = document.getElementById('streak-counter');
  counterElement.classList.add('streak-increase');
  setTimeout(() => counterElement.classList.remove('streak-increase'), 600);
}

// Save best streak
function saveBestStreak() {
  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
    localStorage.setItem('dfa-best-streak', bestStreak.toString());
    updateStreakDisplay(); // Ensure DOM is updated immediately
  }
}

// Reset streak
function resetStreak(full = false) {
  currentStreak = 0;
  if (full) {
    bestStreak = 0;
    localStorage.removeItem('dfa-best-streak');
  }
  updateStreakDisplay();
  const counterElement = document.getElementById('streak-counter');
  counterElement.classList.add('streak-reset');
  setTimeout(() => counterElement.classList.remove('streak-reset'), 300);
}

// Show feedback toast
function showFeedbackToast(isCorrect, guessed, correct, skipped = false) {
  const toast = document.getElementById('feedback-toast');
  const icon = document.getElementById('feedback-icon');
  const title = document.getElementById('feedback-title');
  const message = document.getElementById('feedback-message');
  
  if (skipped) {
    icon.innerHTML = `<svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
    </svg>`;
    icon.className = 'w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center';
    title.textContent = 'Guess Skipped';
    message.textContent = `Correct answer was State ${correct}`;
  } else if (isCorrect) {
    icon.innerHTML = `<svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
    </svg>`;
    icon.className = 'w-8 h-8 rounded-full bg-green-100 flex items-center justify-center';
    title.textContent = '🎉 Correct!';
    message.textContent = `Streak: ${currentStreak + 1}`;
  } else {
    icon.innerHTML = `<svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
    </svg>`;
    icon.className = 'w-8 h-8 rounded-full bg-red-100 flex items-center justify-center';
    title.textContent = '❌ Incorrect';
    message.textContent = `Answer was State ${correct}`;
  }
  
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 4000);
}

// Skip guess (breaks streak)
function skipGuess() {
  resetStreak();
  showFeedbackToast(false, null, correctAnswer, true);
  
  setTimeout(() => {
    document.getElementById('guess-modal').classList.add('hidden');
    isGuessMode = false;
    proceedWithTransition();
    updateStreakDisplay();
  }, 1500);
}

// Clean window load event handler
window.addEventListener('load', function(e) {
  const canvas = document.getElementById("canvas1");
  
  refreshInput();
  refreshCanvas();
  resetStack();
  initializeStreakCounter();
  updateStreakDisplay();
  updateStepButtons(); // Initial button state
  
  // Change DFA button
  const changeDFA = document.getElementById("change_dfa");
  changeDFA.addEventListener("click", function(e) {
    changeDFA.classList.add("loading");
    
    setTimeout(() => {
      clearElem(canvas);
      dfaIndex = (dfaIndex + 1) % dfa.length;
      resetInput();
      refreshCanvas();
      resetStack();
      updateStepButtons(); // Update after DFA change
      changeDFA.classList.remove("loading");
    }, 200);
  });
  
  // Change input button
  const changeInput = document.getElementById("change_input");
  changeInput.addEventListener("click", function(e) {
    changeInput.classList.add("loading");
    
    setTimeout(() => {
      inputIndex = (inputIndex + 1) % dfa[dfaIndex]["input"].length;
      inputPointer = -1;
      refreshInput();
      refreshCanvas();
      resetStack();
      updateStepButtons(); // Update after input change
      changeInput.classList.remove("loading");
    }, 200);
  });
  
  // Next button - single clean handler
  const next = document.getElementById("next");
  next.addEventListener("click", handleNextStep);
  
  // Previous button - single clean handler
  const prev = document.getElementById("prev");
  prev.addEventListener("click", handlePrevStep);
  
  // Skip guess button
  document.getElementById("skip-guess")?.addEventListener("click", function() {
    skipGuess();
  });

  // Reset streak button
  document.getElementById("reset-streak")?.addEventListener("click", function() {
    if (confirm("Are you sure you want to reset your streak?")) {
      // To reset both, use: resetStreak(true);
      resetStreak(); // Only resets current streak by default
    }
  });

  // Panel toggle handlers
  const controlsToggle = document.getElementById("dfa-controls-toggle");
  controlsToggle?.addEventListener("click", function(e) {
    document.getElementById("control-container")?.classList.toggle("active");
  });

  const instructionToggle = document.getElementById("dfa-instructions-toggle");
  instructionToggle?.addEventListener("click", function(e) {
    document.getElementById("instruction-container")?.classList.toggle("active");
  });

  const traceToggle = document.getElementById("dfa-stack-trace-toggle");
  traceToggle?.addEventListener("click", function(e) {
    document.getElementById("trace-container")?.classList.toggle("active");
  });

  // Close button handlers for panels
  document.getElementById("controlsPanelClose")?.addEventListener("click", function() {
    document.getElementById("control-container")?.classList.remove("active");
  });
  document.getElementById("instructionsPanelClose")?.addEventListener("click", function() {
    document.getElementById("instruction-container")?.classList.remove("active");
  });
  document.getElementById("tracePanelClose")?.addEventListener("click", function() {
    document.getElementById("trace-container")?.classList.remove("active");
  });

  // Responsive DFA diagram redraw
  function resizeDfaCanvas() {
    const canvas = document.getElementById("canvas1");
    if (!canvas) return;
    
    // Set width based on parent container
    const parent = canvas.parentElement;
    let w = parent.offsetWidth || 320;
    let h = Math.max(280, Math.round(w / 2.2)); // Updated aspect ratio for bigger diagram
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);
    width = w;
    height = h;
    
    // Refresh canvas with new dimensions
    refreshCanvas();
  }
  
  window.addEventListener('resize', resizeDfaCanvas);
  resizeDfaCanvas();
  
  // Add smooth scroll and modern interactions
  document.addEventListener('click', function(e) {
    if (e.target.matches('.neu-button')) {
      e.target.classList.add('interactive');
    }
  });
});