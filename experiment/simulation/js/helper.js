/****
 * File containing helper functions
 *
 */

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

/**
 * Compute the direction (angle in degrees) of the path near its midpoint
 * by sampling points slightly before/after half-length.
 *
 *  0   = pointing right
 *  90  = pointing up
 * -90  = pointing down
 * 180  = pointing left
 */
function getMidAngle(pathElem) {
  const length = pathElem.getTotalLength();
  const half = length / 2;
  const sampleDist = 0.1;

  // A point just before midpoint
  const ptBefore = pathElem.getPointAtLength(Math.max(0, half - sampleDist));
  // A point just after midpoint
  const ptAfter = pathElem.getPointAtLength(Math.min(length, half + sampleDist));

  const dx = ptAfter.x - ptBefore.x;
  const dy = ptAfter.y - ptBefore.y;
  const radians = Math.atan2(dy, dx);
  return (radians * 180) / Math.PI; // in degrees, range ~(-180..180)
}

/**
 * Decide how far "above" or "below" to place the text from the midpoint.
 * If arrow is mostly "downish" (angle ~135..315), text goes below (positive offset).
 * Otherwise, text goes above (negative offset).
 */
function getVerticalOffset(angleDeg) {
  let a = angleDeg % 360;
  if (a < 0) a += 360;

  // For arrow angles in ~135..315 => "downish" => place text below
  if (a > 135 && a < 315) {
    return 12; // e.g. 12 pixels below
  } else {
    // else above
    return -10; // e.g. 10 pixels above
  }
}

/**
 * Main function to display the DFA in an SVG <canvas>.
 * Call this after you set global width, height, radius, etc.
 */
function displayCanvas(canvas, dfa, inputPointer, currNode) {
  // For adjusting x,y offsets on forward/back edges
  const sine45 = 0.707;

  // Clear any old drawing
  clearElem(canvas);

  // 1) Create an arrowhead definition once
  const defs = newElementNS("defs", []);
  const marker = newElementNS("marker", [
    ["id", "arrowhead"],
    ["markerWidth", "10"],
    ["markerHeight", "7"],
    ["refX", "5"],
    ["refY", "3.5"],
    ["orient", "auto"],
    ["markerUnits", "strokeWidth"],
  ]);
  const arrowPath = newElementNS("path", [
    ["d", "M0,0 L10,3.5 L0,7 Z"],
    ["fill", "black"],
  ]);
  marker.appendChild(arrowPath);
  defs.appendChild(marker);
  canvas.appendChild(defs);

  // 2) Prepare nodes
  const nodes = [];
  dfa.vertices.forEach((v, i) => {
    nodes.push({
      text: v.text,
      type: v.type,
      x: width / 5 + (i * width) / 5,
      y: height / 2,
    });
  });

  // 3) Draw nodes
  nodes.forEach((n) => {
    let fillColor = "#ffffff";
    let strokeColor = "black";
    let strokeWidth = "1px";

    // If this is the start node
    if (n.type === "start") {
      fillColor = "#6699CC";
      const startArrow = newElementNS("path", [
        ["d", `M ${n.x - radius - 40} ${n.y} L ${n.x - radius} ${n.y}`],
        ["fill", "none"],
        ["stroke", strokeColor],
        ["stroke-width", strokeWidth],
        ["marker-end", "url(#arrowhead)"],
      ]);
      canvas.appendChild(startArrow);
    }

    // If accept node => double circle
    if (n.type === "accept") {
      fillColor = "#97d23d";
      const outer = newElementNS("circle", [
        ["cx", n.x],
        ["cy", n.y],
        ["r", radius + 5],
        ["stroke", strokeColor],
        ["fill", "none"],
        ["stroke-width", strokeWidth],
      ]);
      canvas.appendChild(outer);
    }

    // If this node is currently "active"
    if (n.text === currNode) {
      fillColor = "Gray";
    }

    // Main circle
    const circle = newElementNS("circle", [
      ["cx", n.x],
      ["cy", n.y],
      ["r", radius],
      ["stroke", strokeColor],
      ["fill", fillColor],
      ["stroke-width", strokeWidth],
    ]);
    canvas.appendChild(circle);

    // Node label
    const label = newElementNS("text", [
      ["x", n.x],
      ["y", n.y],
      ["fill", "black"],
      ["text-anchor", "middle"],
      ["dominant-baseline", "middle"],
    ]);
    label.textContent = n.text;
    canvas.appendChild(label);
  });

  // 4) Prepare edges
  const edges = [];
  dfa.edges.forEach((e) => {
    const newEdge = {
      text: e.text, // single or array
      type: e.type,
      start: { text: e.start, x: 0, y: 0 },
      mid: { x: 0, y: 0 },
      end: { text: e.end, x: 0, y: 0 },
    };

    // Find coords
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

    if (e.type === "forward") {
      newEdge.start.x += offset * sine45;
      newEdge.start.y -= offset * sine45;
      newEdge.end.x -= offset * sine45;
      newEdge.end.y -= offset * sine45;

      newEdge.mid.x = (newEdge.start.x + newEdge.end.x) / 2;
      newEdge.mid.y = newEdge.start.y - (radius + extra);

    } else if (e.type === "backward") {
      newEdge.start.x -= offset * sine45;
      newEdge.start.y += offset * sine45;
      newEdge.end.x += offset * sine45;
      newEdge.end.y += offset * sine45;

      newEdge.mid.x = (newEdge.start.x + newEdge.end.x) / 2;
      newEdge.mid.y = newEdge.start.y + (radius + extra);

    } else if (e.type === "self") {
      newEdge.start.x += offset * sine45;
      newEdge.start.y += offset * sine45;
      newEdge.end.x -= offset * sine45;
      newEdge.end.y += offset * sine45;

      newEdge.mid.x = (newEdge.start.x + newEdge.end.x) / 2;
      newEdge.mid.y = newEdge.start.y + 3 * radius + extra;
    }

    edges.push(newEdge);
  });

  // 5) Draw edges & place labels at midpoint
  edges.forEach((edge) => {
    // 5a) Draw arrow path
    const pathStr = createQPath(edge.start, edge.mid, edge.end);
    const pathElem = newElementNS("path", [
      ["d", pathStr],
      ["fill", "none"],
      ["stroke", "black"],
      ["marker-end", "url(#arrowhead)"],
    ]);
    canvas.appendChild(pathElem);

    // 5b) Find midpoint coords
    const pathLen = pathElem.getTotalLength();
    const midPt = pathElem.getPointAtLength(pathLen / 2);

    // 5c) Decide if arrow is up or down
    const angleDeg = getMidAngle(pathElem);
    // If arrow is "downish", text goes below. Otherwise, above
    const vOffset = getVerticalOffset(angleDeg);

    // 5d) Prepare the label string (with commas if multiple symbols)
    let labelStr = "";
    if (Array.isArray(edge.text)) {
      // e.g. ["0","1"] => "0,1"
      labelStr = edge.text.join(",");
    } else {
      labelStr = edge.text;
    }

    // 5e) Create one <text> at (midPt.x, midPt.y ± offset)
    const edgeLabel = newElementNS("text", [
      ["fill", "black"],
      ["text-anchor", "middle"],
      ["dominant-baseline", "middle"],
    ]);

    // Place it above/below midpoint
    edgeLabel.setAttribute("x", midPt.x);
    edgeLabel.setAttribute("y", midPt.y + vOffset);
    edgeLabel.textContent = labelStr;
    canvas.appendChild(edgeLabel);
  });

  // Return for reference (not strictly needed)
  return [nodes, edges];
}
