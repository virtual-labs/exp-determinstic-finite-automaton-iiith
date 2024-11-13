/*****
 * File containing main logic to display DFA
 *
 */

width = 500;
height = 200;
radius = 25;

dfa = [dfa1, dfa2, dfa3, dfa4, dfa5];
dfaIndex = 0

inputIndex = 0
inputPointer = -1

nodes = []
edges = []

function refreshCanvas(){
  clearElem(canvas);

  curr = ""
  if(inputPointer != -1){
    // console.log("before", inputPointer, curr);
    // console.log(dfa[dfaIndex]["input"]);
    curr = dfa[dfaIndex]["input"][inputIndex]["states"][inputPointer];
    // console.log("after", inputPointer, curr);
  }

  DFADescriptionContainer = document.getElementById("DFA_description_container");
  clearElem(DFADescriptionContainer);
  span = newElement("font", [["id", "DFA_description"], ["color", "brown"],["size", "5.5"]]);
  text = document.createTextNode(dfa[dfaIndex]["description"]);
  DFADescriptionContainer.appendChild(span);
  span.appendChild(text);

  res = displayCanvas(canvas, dfa[dfaIndex], inputPointer, curr);

  nodes = res[0]
  edges = res[1]
}

function resetInput(){
  inputIndex = 0
  inputPointer = -1

  refreshInput();
}

function refreshInput(){
  inputContainer = document.getElementById("input_container");
  clearElem(inputContainer);
  for(let i=0;i<dfa[dfaIndex]["input"][inputIndex]["string"].length;++i){
    textColor = "black";
    if(inputPointer == i){
      textColor = "red";
    }
    span = newElement("font", [["id", "text_"+i], ["color", textColor]]);
    text = document.createTextNode(dfa[dfaIndex]["input"][inputIndex]["string"][i]);
    span.appendChild(text);
    inputContainer.appendChild(span);
  }
}

function resetStack(){
  stack = document.getElementById("stack_list");
  clearElem(stack);
}

// function addToStack(str){
//   stack = document.getElementById("stack_list");
//   listElem = newElement("li", []);
//   textNode = document.createTextNode(str);
//   listElem.appendChild(textNode)
//   stack.appendChild(listElem);

// }
function addToStack(str) {
  stack = document.getElementById("stack_list");

  // Create a new list element with a bullet point
  listElem = newElement("li", []);
  textNode = document.createTextNode(str);
  listElem.appendChild(textNode);

  // Prepend the new list item at the top of the stack (insert before the first child)
  if (stack.firstChild) {
    stack.firstChild.style.fontWeight = "normal";
    stack.insertBefore(listElem, stack.firstChild);
  } else {
    stack.appendChild(listElem);
  }
  // Make the top element bold
  stack.firstChild.style.fontWeight = "bold";
}

function removeFromStack(){
  stack = document.getElementById("stack_list");
  if(stack.firstChild){
    stack.removeChild(stack.lastChild);
  }
}

window.addEventListener('load', function(e){
  canvas = document.getElementById("canvas1");

  refreshInput();
  refreshCanvas();
  resetStack();

  // Event listener for changing DFA
  changeDFA = document.getElementById("change_dfa");
  changeDFA.addEventListener("click", function(e){
    clearElem(canvas);
    dfaIndex = dfaIndex + 1;
    if(dfaIndex >= dfa.length){
      dfaIndex = 0;
    }
    resetInput();
    refreshCanvas();
    resetStack();
  });

  // Event listener for changing input
  changeInput = document.getElementById("change_input");
  changeInput.addEventListener("click", function(e){
    inputIndex = inputIndex + 1;
    if(inputIndex >= dfa[dfaIndex]["input"].length){
      inputIndex = 0;
    }
    inputPointer = -1;
    refreshInput();
    refreshCanvas();
    resetStack();
  });

  // Event listener for next
  next = document.getElementById("next");
  next.addEventListener("click", function(e){
    if(inputPointer != dfa[dfaIndex]["input"][inputIndex]["string"].length){
      inputPointer = inputPointer + 1;
      refreshInput();
      refreshCanvas();
      str = "";
      if(inputPointer!=0){
        str += "Read character "+dfa[dfaIndex]["input"][inputIndex]["string"][inputPointer-1];
        str += " and moved from State "+dfa[dfaIndex]["input"][inputIndex]["states"][inputPointer-1];
        str += " to State "+dfa[dfaIndex]["input"][inputIndex]["states"][inputPointer];
      }
      if(inputPointer==0){
        str += "Moved to Start State";
      }
      addToStack(str);

      // Display popup at end
      if(inputPointer==dfa[dfaIndex]["input"][inputIndex]["string"].length){

        computationStatus = "Rejected";

        for(itr=0;itr<dfa[dfaIndex]["vertices"].length;++itr){
          if(dfa[dfaIndex]["vertices"][itr]["text"] == curr){
            if(dfa[dfaIndex]["vertices"][itr]["type"] == "accept"){
              computationStatus = "Accepted";
            }
            break;
          }
        }
        swal("Input string was "+computationStatus);
      }
    }
  });

  // Event listener for prev
  prev = document.getElementById("prev");
  prev.addEventListener("click", function(e){
    if(inputPointer != -1){
      inputPointer = inputPointer - 1;
      refreshInput();
      refreshCanvas();
      removeFromStack();
    }
  });

  controlContainerDisplay = 0;
  instructionContainerDisplay = 0;
  traceContainerDisplay = 0;

  controlsToggle = document.getElementById("dfa-controls-toggle");
  controlsToggle.addEventListener("click", function(e){
    
    controlContainer = document.getElementById("control-container");
    
    if(controlContainerDisplay == 0){
      controlContainer.classList.remove("control-container-hide");
      controlContainer.classList.add("control-container-show");
      controlContainerDisplay = 1;
    }else{
      controlContainer.classList.remove("control-container-show");
      controlContainer.classList.add("control-container-hide");
      controlContainerDisplay = 0;
    }

  });

  instructionToggle = document.getElementById("dfa-instructions-toggle");
  instructionToggle.addEventListener("click", function(e){

    instructionContainer = document.getElementById("instruction-container");

    if(instructionContainerDisplay == 0){
      instructionContainer.classList.remove("instruction-container-hide");
      instructionContainer.classList.add("instruction-container-show");
      instructionContainerDisplay = 1;
    }else{
      instructionContainer.classList.remove("instruction-container-show");
      instructionContainer.classList.add("instruction-container-hide");
      instructionContainerDisplay = 0;
    }

  });

  traceToggle = document.getElementById("dfa-stack-trace-toggle");
  traceToggle.addEventListener("click", function(e){
    
    traceContainer = document.getElementById("trace-container");

    if(traceContainerDisplay == 0){
      traceContainer.classList.remove("trace-container-hide");
      traceContainer.classList.add("trace-container-show");
      traceContainerDisplay = 1;
    }else{
      traceContainer.classList.remove("trace-container-show");
      traceContainer.classList.add("trace-container-hide");
      traceContainerDisplay = 0;
    }

  });

});