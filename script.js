const display = document.querySelector('.display');
const dot = document.getElementById('dot');
const erase = document.querySelectorAll('.erase *');
const operators = document.querySelectorAll('.operators *');
const equals = document.getElementById('equals');
const keys = {
    numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'],
    operators: ['/', '*', '-', '+', 'Enter'],
    erase: ['c', 'Backspace'],
}
const operations = {
    '/': (a, b) => a / b,
    '*': (a, b) => a * b,
    '-': (a, b) => a - b,
    '+': (a, b) => a + b,
}
let state;
let a;
let b;
let operator;
let clearDisplayScheduled;

function updateState() {
    state = !operator && !b ? 'waitingA'
            : a && operator ? 'waitingB'
            : '';
    console.log('state:', state);
    console.log('display:', display.value, '\na:', a, '\nb:', b, '\noperator:', operator);
}

function handleNumber(numberInput) {
    erase[1].disabled = false;
    operators.forEach(operator => operator.disabled = false);
    if (clearDisplayScheduled) {
        display.value = '';
        clearDisplayScheduled = false;
    }
    if (display.value === '0') {
        display.value = numberInput;
    } else {
        display.value += numberInput;
    }
    if (display.value.includes('.')) {
        dot.disabled = true;
        if (display.value === '.') {
            display.value = '0.';
        }
    }
    if (state === 'waitingA') a = display.value, equals.disabled = true;        
    if (state === 'waitingB') b = display.value;
}

function operate(operator, a, b) {
    return Math.floor(operations[operator](a, b) * 100) / 100;
}

function handleDivisionByZero() {
    operator = a = b = '';
    operators.forEach(operator => operator.disabled = true);
    display.value = 'error';
}

function nextOperationSetup(operatorInput, result) {
    console.log('result:', result);
    display.value = result;
    operator = operatorInput;
    a = result;
    b = '';
    equals.disabled = true;
}

function handleOperation(operatorInput) {
    const result = operate(operator, +a, +b);
    if (result === Infinity) {
        handleDivisionByZero();
    } else {
        nextOperationSetup(operatorInput, result);
    }
}

function operationTeardown() {
    erase[1].disabled = true;
    dot.disabled = false;
    clearDisplayScheduled = true;
    if (operator === 'Enter') {
        operator = '';
    }
}

function handleOperator(operatorInput) {    
    if (operatorInput !== 'Enter' && !operators[0].disabled) {
        if (!operator || !b) {
            operator = operatorInput;
        } else {
            handleOperation(operatorInput);
        }
        operationTeardown();
    } else if (operatorInput === 'Enter' && !equals.disabled) {
        console.log('Enter');
        handleOperation(operatorInput);
        operationTeardown();
    }
}

function clear() {
    console.log('Clear');
    operator = a = b = '';
    display.value = '';
    dot.disabled = false;
    erase[1].disabled = true;
    operators.forEach(operator => operator.disabled = true);
}

function back() {
    if (!erase[1].disabled) {
        console.log('Back');
        const last = display.value.slice(-1);
        display.value = display.value.slice(0, -1);
        if (last === '.') {
            dot.disabled = false;
        }
        if (display.value === '') {
            dot.disabled = false;
            erase[1].disabled = true;
            operators.forEach(operator => operator.disabled = true);
        }
        if (state === 'waitingA') a = display.value, equals.disabled = true;        
        if (state === 'waitingB') b = display.value;
    }
}

function handleErase(eraseInput) {
    if (eraseInput === 'c') {
        clear();
    } else {
        back();
    }
}

operators.forEach(operator => operator.disabled = true);
erase[1].disabled = true;
updateState();

['click', 'keydown'].forEach(eventType => {
    document.addEventListener(eventType, e => {
        const input = e instanceof PointerEvent ? e.target.value : e.key;
        e.target.blur();
        if (keys.numbers.includes(input)) {
            handleNumber(input);
            updateState();
        }
        if (keys.operators.includes(input)) {
            handleOperator(input);
            updateState();
        }
        if (keys.erase.includes(input)) {
            handleErase(input);
            updateState();
        }
    });
});
