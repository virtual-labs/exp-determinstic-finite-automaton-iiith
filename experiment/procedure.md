
# Procedure

This experiment provides an interactive simulation to help you understand how Deterministic Finite Automata (DFA) process input strings and determine acceptance or rejection. The simulation includes five different DFA examples, each designed to recognize specific patterns in binary strings.

## Getting Started

The simulation interface consists of three main components:

1. **DFA State Diagram**: A visual representation of the current automaton showing states and transitions
2. **Input String Panel**: Displays the current input string being processed
3. **Execution Trace**: Shows the step-by-step execution history

## Available DFA Examples

The simulation includes five pre-configured DFA examples:

1. **DFA 1**: Accepts strings that begin with "01"
2. **DFA 2**: Accepts strings containing exactly three 1s
3. **DFA 3**: Accepts strings that end with "0"
4. **DFA 4**: Accepts strings with at least one 0 and ending with 1
5. **DFA 5**: Accepts strings where the first occurrence of 0 is in a group of at least three consecutive 0s

## Step-by-Step Instructions

### 1. Selecting a DFA

Click the **"Change DFA"** button to cycle through the five available automata. Each DFA has a description explaining the language it accepts. The current DFA's description is displayed above the state diagram.

### 2. Choosing Input Strings

Click the **"Change Input"** button to cycle through different pre-configured test strings for the current DFA. Each DFA comes with multiple example strings that demonstrate both accepted and rejected cases.

### 3. Understanding the Interface

- **Start State**: Marked with an incoming arrow and typically labeled "A"
- **Accept States**: Shown with double circles
- **Current State**: Highlighted in blue during execution
- **Processed Characters**: Displayed with a darker background in the input string
- **Current Character**: Highlighted with a distinct color

### 4. Stepping Through Execution

#### Initial Setup

When you load a DFA and input string, the automaton starts in the initial state before processing any characters.

#### Forward Execution

Click the **"Next Step"** button to advance the automaton one character at a time:

- The current character is highlighted in the input string
- The automaton transitions to the next state according to the transition function
- Each step is recorded in the execution trace
- The current state is visually highlighted in the diagram

#### Backward Execution

Click the **"Previous"** button to step backward through the execution:

- Returns to the previous state
- Removes the last step from the execution trace
- Updates the input string highlighting

### 5. Interactive Guessing Feature

The simulation includes an interactive quiz mode that helps reinforce learning:

#### How It Works

- When clicking "Next Step", you may be prompted to guess the next state
- A modal dialog appears showing the current state and character being read
- Select your predicted next state from the available options
- Receive immediate feedback on your guess

#### Streak System

- Correct guesses increase your current streak
- Your best streak is automatically saved
- Incorrect guesses reset your current streak
- Use the "Reset" button to clear your streak counters

#### Skip Option

If you're unsure about a transition, you can click "Skip Guess" to proceed without making a prediction, though this will reset your current streak.

### 6. Reading the Execution Trace

The execution trace panel provides a detailed history of the automaton's execution:

- Each line shows a state transition
- Format: "State X --character--> State Y"
- Special notation for string completion and acceptance/rejection
- Automatically scrolls to show the most recent steps

### 7. Understanding Results

#### String Acceptance

- If the automaton ends in an accept state after processing all characters, the string is **accepted**
- The final trace entry will indicate "String Accepted"

#### String Rejection

- If the automaton ends in a non-accept state after processing all characters, the string is **rejected**
- The final trace entry will indicate "String Rejected"