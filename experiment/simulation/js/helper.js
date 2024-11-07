/****
 * File containing helper functions
 *
 */

function newElementNS(tag, attr) {
  const elem = document.createElementNS('http://www.w3.org/2000/svg', tag);
  attr.forEach(function (item) {
    elem.setAttribute(item[0], item[1]);
  });
  return elem;
}

function newElement(tag, attr) {
  const elem = document.createElement(tag);
  attr.forEach(function (item) {
    elem.setAttribute(item[0], item[1]);
  });
  return elem;
}

function clearElem(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.lastChild);
  }
}

// Global variables width, height, and radius need to be set before invoking this function
function displayCanvas(canvas, dfa, inputPointer, currNode) {
  const sine45 = 0.707;

  const nodes = [];
  const edges = [];

  // Define arrowhead marker for edges
  const defs = newElementNS('defs', []);
  const marker = newElementNS('marker', [
    ['id', 'arrowhead'],
    ['markerWidth', '10'],
    ['markerHeight', '7'],
    ['refX', '5'],
    ['refY', '3.5'],
    ['orient', 'auto'],
    ['markerUnits', 'strokeWidth']
  ]);

  const arrow = newElementNS('path', [
    ['d', 'M0,0 L10,3.5 L0,7 Z'],
    ['fill', 'black']
  ]);
  marker.appendChild(arrow);
  defs.appendChild(marker);
  canvas.appendChild(defs);

  // Parse nodes in DFA
  dfa["vertices"].forEach(function (elem, index) {
    const newnode = {
      "text": elem["text"],
      "type": elem["type"],
      "x": width / 5 + index * width / 5,
      "y": height / 2
    };
    nodes.push(newnode);
  });

  // Display nodes in DFA
  nodes.forEach(function (elem) {
    let color = "black";
    let stroke_width = "1px";
    let fillColor = "#ffffff";
    if (elem["type"] == "start") {
      fillColor = "#6699CC";
      const startArrow = newElementNS('path', [
        ["id", elem["text"] + "_start_arrow"],
        ["d", "M " + (elem["x"] - radius - 40) + " " + elem["y"] + " L " + (elem["x"] - radius) + " " + elem["y"]],
        ["fill", "none"],
        ["stroke", color],
        ["stroke-width", stroke_width],
        ["marker-end", "url(#arrowhead)"]
      ]);
      canvas.appendChild(startArrow);
    } else if (elem["type"] == "accept") {
      fillColor = "#97d23d";
      const outerCircle = newElementNS('circle', [
        ["id", elem["text"] + "_outer_circle"],
        ["cx", elem["x"]],
        ["cy", elem["y"]],
        ["r", radius + 5],
        ["stroke", color],
        ["fill", "none"],
        ["stroke-width", stroke_width]
      ]);
      canvas.appendChild(outerCircle);
    }
    if (currNode == elem["text"]) {
      fillColor = "Gray";
    }

    const circleElem = newElementNS('circle', [
      ["id", elem["text"] + "_circle"],
      ["cx", elem["x"]],
      ["cy", elem["y"]],
      ["r", radius],
      ["stroke", color],
      ["fill", fillColor],
      ["stroke-width", stroke_width]
    ]);

    const textElem = newElementNS('text', [
      ["id", elem["text"] + "_circle_text"],
      ['x', elem["x"]],
      ['y', elem["y"]],
      ['fill', '#000'],
      ['text-anchor', 'middle'],
      ['dominant-baseline', 'middle']
    ]);
    textElem.textContent = elem["text"];

    canvas.appendChild(circleElem);
    canvas.appendChild(textElem);
  });

  // Parse edges in DFA
  dfa["edges"].forEach(function (elem) {
    const newEdge = {
      "text": elem["text"],
      "type": elem["type"],
      "start": {
        "text": elem["start"],
        "x": 0,
        "y": 0
      },
      "mid": {
        "x": 0,
        "y": 0
      },
      "end": {
        "text": elem["end"],
        "x": 0,
        "y": 0
      }
    };

    nodes.forEach(function (nodeElem) {
      if (nodeElem["text"] == elem["start"]) {
        newEdge["start"]["x"] = nodeElem["x"];
        newEdge["start"]["y"] = nodeElem["y"];
      }
      if (nodeElem["text"] == elem["end"]) {
        newEdge["end"]["x"] = nodeElem["x"];
        newEdge["end"]["y"] = nodeElem["y"];
      }
    });

    // Adjust edge positions to touch node boundaries
    const offset = radius;
    const isMultipleSymbols = Array.isArray(elem["text"]) && elem["text"].length > 1;
    const additionalOffset = isMultipleSymbols ? elem["text"].length * 10 : 0; // Apply an additional offset based on symbol count

    if (elem["type"] == "forward") {
      newEdge["start"]["x"] += offset * sine45;
      newEdge["start"]["y"] -= offset * sine45;
      newEdge["end"]["x"] -= offset * sine45;
      newEdge["end"]["y"] -= offset * sine45;

      newEdge["mid"]["x"] = (newEdge["start"]["x"] + newEdge["end"]["x"]) / 2;
      newEdge["mid"]["y"] = newEdge["start"]["y"] - (radius + additionalOffset);
    } else if (elem["type"] == "backward") {
      newEdge["start"]["x"] -= offset * sine45;
      newEdge["start"]["y"] += offset * sine45;
      newEdge["end"]["x"] += offset * sine45;
      newEdge["end"]["y"] += offset * sine45;

      newEdge["mid"]["x"] = (newEdge["start"]["x"] + newEdge["end"]["x"]) / 2;
      newEdge["mid"]["y"] = newEdge["start"]["y"] + (radius + additionalOffset);
    } else if (elem["type"] == "self") {
      newEdge["start"]["x"] += offset * sine45;
      newEdge["start"]["y"] += offset * sine45;
      newEdge["end"]["x"] -= offset * sine45;
      newEdge["end"]["y"] += offset * sine45;

      newEdge["mid"]["x"] = (newEdge["start"]["x"] + newEdge["end"]["x"]) / 2;
      newEdge["mid"]["y"] = newEdge["start"]["y"] + (3 * radius + additionalOffset);
    }

    edges.push(newEdge);
  });

  // Display edges in DFA
  edges.forEach(function (elem) {
    const baseId = elem["start"]["text"] + "_" + elem["end"]["text"];

    let linepoints = "M " + elem["start"]["x"] + " " + elem["start"]["y"] +
      " C " + elem["start"]["x"] + " " + elem["start"]["y"] + "," +
      elem["mid"]["x"] + " " + elem["mid"]["y"] + "," +
      elem["end"]["x"] + " " + elem["end"]["y"];

    const line = newElementNS('path', [
      ["id", baseId],
      ["d", linepoints],
      ["fill", "none"],
      ["stroke", "black"],
      ["marker-end", "url(#arrowhead)"]
    ]);

    const textElem = newElementNS('text', [
      ["id", baseId + "_text"],
      ["fill", "black"],
      ["text-anchor", "middle"],
      ["dominant-baseline", "middle"],
      ["dy", "-0.5em"]
    ]);

    // Add text to the path
    const textPath = newElementNS('textPath', [
      ["href", "#" + baseId],
      ["startOffset", "50%"]
    ]);
    textPath.textContent = Array.isArray(elem["text"]) ? elem["text"].join(", ") : elem["text"];

    // Calculate the slope
    const deltaX = elem["end"]["x"] - elem["start"]["x"];
    const deltaY = elem["end"]["y"] - elem["start"]["y"];

    if (deltaY > 0) {
      textPath.setAttribute("side", "right");
    }

    textElem.appendChild(textPath);
    canvas.appendChild(line);
    canvas.appendChild(textElem);
  });

  return [nodes, edges];
}

