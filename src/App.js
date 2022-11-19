import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./App.css";


export const ACTIONS = {
  ADD_DIGIT: "add_digit",
  DELETE_DIGIT: "delete_digit",
  CHOOSE_OPERATION: "choose_operation",
  CLEAR: "clear",
  EVALUATE: "evaluate"
}

function reducer(state, { type, payload }) {
  switch (type) {
   
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
        currentOperand: payload.digit,
        previousOperand: null,
        operation: null,
        overwrite: false
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state
      if (payload.digit === "." && state.currentOperand.includes(".")) return state
      if (payload.digit !== "0" && payload.digit !== "." && state.currentOperand === "0") 
        return {
          ...state,
        currentOperand: `${payload.digit}`
        }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    

    case ACTIONS.CLEAR:
      return {currentOperand: "0"}
    

    case ACTIONS.CHOOSE_OPERATION:
      if (state.overwrite) {
        return {
          previousOperand: state.currentOperand,
          currentOperand: "0",
          operation: payload.operation,
          overwrite: false
        }
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: "0"
        }
      }
      
      if (payload.operation != null && state.currentOperand === "0") {
        return {
          ...state,
          operation: payload.operation
        }
      }


      return {
        ...state,
        operation: payload.operation,
        previousOperand: evaluate(state, payload),
        currentOperand: "0"
      }
    
    
    case ACTIONS.EVALUATE:
      if (state.operation == null || state.operation === "=") {
        return {
          ...state,
          previousOperand: state.currentOperand,
          operation: "=",
          overwrite: true
        }
      }
      // if (state.previousOperand == null || state.operation == null) {
      //   return state
      // }
      return {
        ...state,
        overwrite: true,
        currentOperand: evaluate(state)
      }


    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) return {
        ...state,
        previousOperand: null,
        operation: null,
      }
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: "0"
        }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }

    default:
      break;
  }
}

function evaluate({ currentOperand, previousOperand, operation, overwrite }) {
  const past = parseFloat(previousOperand)
  const now = parseFloat(currentOperand)
  let computation = ""

  switch (operation) {
    case "+":
      computation = past + now;
      break;
    case "-":
      computation = past - now;
      break;
    case "*":
      computation = past * now;
      break;
    case "÷":
      computation = past / now;
      break;
    default:
      break;
  }

  return computation.toString();
}

const INTERGER_FORMATTER = new Intl.NumberFormat("en-us", {maximumFractionDigits: 0});

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTERGER_FORMATTER.format(integer);
  return `${INTERGER_FORMATTER.format(integer)}.${decimal}`
}


function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {currentOperand: "0"});
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="000" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
   
    
    </div>
  );
}

export default App;
