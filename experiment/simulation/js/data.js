

// DFA to accept even numbers
const dfa1 = {
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
    {
      "string": "0101010",
      "states": ["A", "B", "A", "B", "A", "B", "A", "B"]
    },
    {
      "string": "110100",
      "states": ["A", "A", "A", "B", "A", "B", "B"]
    },
    {
      "string": "1001",
      "states": ["A", "A", "B", "B", "A"]
    }
  ]
}

const dfa2 = {
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
    {
      "string": "10011",
      "states": ["A", "A", "B", "B", "C", "C"]
    },
    {
      "string": "1010",
      "states": ["A", "A", "B", "C", "B"]
    },
    {
      "string": "10101",
      "states": ["A", "A", "B", "C", "B", "C"]
    }
  ]
}

const dfa3 = {
  "vertices": [
    {"text": "A", "type": "start"},
    {"text": "B", "type": "none"},
    {"text": "C", "type": "none"},
    {"text": "D", "type": "accept"}
  ],
  "edges": [
    {"start": "A", "end": "A", "text": "1", "type": "self"},
    {"start": "A", "end": "B", "text": "0", "type": "forward"},
    {"start": "B", "end": "C", "text": "0", "type": "forward"},
    {"start": "C", "end": "D", "text": "0", "type": "forward"},
    {"start": "D", "end": "D", "text": "0,1", "type": "self"}
  ],
  "input": [
    {
      "string": "1000",
      "states": ["A", "A", "B", "C", "D"]
    },
    {
      "string": "00010",
      "states": ["A", "B", "C", "D", "D", "D"]
    },
    {
      "string": "101",
      "states": ["A", "A", "B", "B"]
    }
  ]
}
