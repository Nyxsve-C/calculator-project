const display = document.querySelector('.display');
const numbers = document.querySelectorAll('.numbers *');
const dot = document.getElementById('dot');
const erase = document.querySelectorAll('.erase *');
const operators = document.querySelectorAll('.operators *');
const equals = document.getElementById('equals');
const keys = {
    numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'],
    operators: {
        '/': '÷',
        '*': '×',
        '-': '-',
        '+': '+',
    },
    'Enter': '=',
    erase: {
        'c': 'C', 
        'Backspace': 'Back',
    },
}
const operations = {
    '÷': (a, b) => a / b,
    '×': (a, b) => a * b,
    '-': (a, b) => a - b,
    '+': (a, b) => a + b,
}

let state;
let operator;
let clearDisplayScheduled;
let a;
let b;

function updateState() {
    state = !operator && !b ? 'waitingA' :
            a && operator ? 'waitingB' :
            '';
    console.log(state);
}

function handleInput(input) {
    console.log(input);
    erase[1].disabled = false;
    operators.forEach(operator => operator.disabled = false);
    if (clearDisplayScheduled) {
        display.value = '';
        clearDisplayScheduled = false;
    }
    if (display.value === '0') {
        display.value = input;
    } else {
        display.value += input;
    }
    if (display.value.includes('.')) {
        dot.disabled = true;
        if (display.value === '.') {
            display.value = '0.';
        }
    }
    if (state === 'waitingA') a = display.value, equals.disabled = true;        
    if (state === 'waitingB') b = display.value;
    console.log('display:', display.value, '\na:', a, '\nb:', b, '\noperator:', operator);
}

function operate(operator, a, b) {
    return Math.floor(operations[operator](a, b) * 100) / 100;
}

function handleDivisionByZero() {
    operator = a = b = '';
    operators.forEach(operator => operator.disabled = true);
    display.value = 'error';
}

function nextOperationSetup(operatorGetter, result) {
    console.log(operator, result);
    display.value = result;
    operator = operatorGetter();
    a = result;
    b = '';
    equals.disabled = true;
}

function operationTeardown() {
    erase[1].disabled = true;
    dot.disabled = false;
    clearDisplayScheduled = true;
    if (operator === '=') {
        operator = '';
    }
}

function handleOperator(operatorGetter) {
    if (!operator || !b) {
            operator = operatorGetter();
            console.log(operator);
        } else {
            const result = operate(operator, +a, +b);
            if (result === Infinity) {
                handleDivisionByZero();
            } else {
                nextOperationSetup(operatorGetter, result);
            }
        }
        operationTeardown();
}

function clear() {
    console.log('Clear');
    display.value = '';
    dot.disabled = false;
    operator = a = b = '';
    operators.forEach(operator => operator.disabled = true);
}

function back() {
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
    console.log('display:', display.value, '\na:', a, '\nb:', b, '\noperator:', operator);
}

operators.forEach(operator => operator.disabled = true);
erase[1].disabled = true;
updateState();

numbers.forEach(button => {
    button.addEventListener('click', e => {
        e.target.blur();
        const input = e.target.innerText;
        handleInput(input);
        updateState();
    });
});

operators.forEach(button => {
    button.addEventListener('click', e => {
        e.target.blur();
        const getOperator = () => e.target.innerText;
        handleOperator(getOperator);
        updateState();
    });
});

erase.forEach(button => {
    button.addEventListener('click', e => {
        e.target.blur();
        const action = e.target.innerText;
        if (action === 'C') {
            clear();
            updateState();
        } else {
            back();
            updateState();
        }
    });
});

document.addEventListener('keydown', e => {
    const key = e.key;
    const getOperator = () => keys.operators[key];
    if (keys.numbers.includes(key)) {
        const input = key;
        handleInput(input);
        updateState();
    }
    if (!operators[0].disabled) {
        if (key in keys.operators) {
            handleOperator(getOperator);
            updateState();
        }
    }
    if(key === 'Enter' && !equals.disabled) {
        console.log('Enter');
        const result = operate(operator, +a, +b);
        if (result === Infinity) {
            handleDivisionByZero();
        } else {
            nextOperationSetup(getOperator, result);
        }
        operationTeardown();
        updateState();
    }
    if (key in keys.erase) {
        const action = keys.erase[key];
        if (action === 'C') {
            clear();
            updateState();
        } else if (!erase[1].disabled) {
            back();
            updateState();
        }
    }
});
