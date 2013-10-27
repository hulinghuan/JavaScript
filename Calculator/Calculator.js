var buttons = document.querySelectorAll('#calculator .buttons span');
/* Definition of the Operator Class */

function Operator(operatorType) {
    this._operatorType = operatorType;
    this._operatorPrecedence = 0;
    
    if((operatorType == '-') || (operatorType == '+')) {
        this._operatorPrecedence = 2;
        return;
    }
    if((operatorType == '*') || (operatorType == '/')) {
        this._operatorPrecedence = 3;
        return;
    }
    if((operatorType == '^')) {
        this._operatorPrecedence = 4;
        return;
    }
}

Operator.prototype.get_operatorPrecedence = function(){
    return this._operatorPrecedence;
}
Operator.prototype.get_operatorType = function() {
    return this._operatorType;
}

/* Definition of the Calculator Class */
function Calculator() {
    this._infixArray = [];
    this._reversePolishArray = [];
    this._calculateStack = [];
    this._inputExpression = [];
}

Calculator.prototype.checkDemical = function() {
    var RPA = this._reversePolishArray;
    var RPAUnit = '';
    var fI = 0;     //first index of demical in RPN unit
    var lI = 0;     //last index of demical in RPN unit

    for(var i = 0; i < this._reversePolishArray.length ; i ++) {
        RPAUnit = RPA[i];
        fI = RPAUnit.indexOf('.');
        lI = RPAUnit.lastIndexOf('.');
        if(fI != lI) {
            throw 'Invalid Input';
        }
        if(fI == lI && fI != -1) {
            if(fI == RPAUnit.length - 1) {
                throw 'Invalid Input';
            } 
        }
    }
}

Calculator.prototype.calculate = function() /*throw Exception*/{
    var cStackLength = this._reversePolishArray.length;
    var operator = '';
    var firstNum = '';
    var secondNum = '';
    var fn = 0;
    var sn = 0;
    var result = 0;
    
    this.checkDemical();

    for(var i = 0; i < cStackLength; i++) {
        this._calculateStack.push(this._reversePolishArray[i]);
        if(this.isOperator(this._calculateStack[this._calculateStack.length - 1]) == true) {
            if(this._calculateStack.length < 3) {
                throw 'Invalid Input';
            }
            operator = this._calculateStack.pop();
            secondNum = this._calculateStack.pop();
            firstNum = this._calculateStack.pop();
            if(this.isOperator(firstNum) == true || this.isOperator(secondNum)) {
                throw 'Invalid Input';
            }
            fn = parseFloat(firstNum);
            sn = parseFloat(secondNum);
            if(operator == '+') {
                result = fn + sn;
                result += '';
                this._calculateStack.push(result);
                operator = '';
                secondNum = '';
                firstNum = '';
                continue;
            }
            if(operator == '-') {
                result = fn - sn;
                result += '';
                this._calculateStack.push(result);
                operator = '';
                secondNum = '';
                firstNum = '';
                continue;
            }
            if(operator == '*') {
                result = fn * sn;
                result += '';
                this._calculateStack.push(result);
                operator = '';
                secondNum = '';
                firstNum = '';
                continue;
            }
            if(operator == '/') {
                result = fn / sn;
                result += '';
                this._calculateStack.push(result);
                operator = '';
                secondNum = '';
                firstNum = '';
                continue;
            }
        }
        
    }
    //check if there are invalid parentheses
    if(operator != '') {
        throw 'Invalid Input';
    }
    return result;
}

Calculator.prototype.infixToRPN = function() /*throw Exception*/{
    var pushBuffer = '';
    var operatorStk = [];
    var infixStkLength = this._infixArray.length;
    
    //this._reversePolishArray.push('0');
    for(var i = 0; i < infixStkLength; i++) {
        pushBuffer = this._infixArray[i];
        if(!this.isOperator(pushBuffer) && !this.isParenthese(pushBuffer) == true) {
            this._reversePolishArray.push(pushBuffer);
            pushBuffer = '';
        }
        if(this.isOperator(pushBuffer) == true) {
            if(operatorStk.length == 0) {
                operatorStk.push(pushBuffer);
                pushBuffer = '';
            } else {
                var stkTop = new Operator(operatorStk[operatorStk.length - 1]);
                var newOperator = new Operator(pushBuffer);
                if(newOperator.get_operatorPrecedence() > stkTop.get_operatorPrecedence()) {
                    operatorStk.push(pushBuffer);
                    pushBuffer = '';
                } else {
                    this._reversePolishArray.push(operatorStk.pop());
                    operatorStk.push(pushBuffer);
                    pushBuffer = '';
                }
            }
        }
        if(this.isParenthese(pushBuffer) == true) {
            if(pushBuffer == '(') {
                operatorStk.push(pushBuffer);
                pushBuffer = '';
            }
            if(pushBuffer == ')') {
                while(true) {
                    pushBuffer = operatorStk.pop();
                    if(!(pushBuffer == '(')) {
                        this._reversePolishArray.push(pushBuffer);
                    } else {
                        pushBuffer = '';
                        break;
                    }
                    pushBuffer = '';
                    if(operatorStk == '') {
                        throw 'Invalid Input';
                    }
                }
            }
        }
    }
    if(operatorStk.length != 0) {
        var operatorStkSize = operatorStk.length;
        for(var i = 0; i < operatorStkSize; i++) {
            this._reversePolishArray.push(operatorStk.pop());
        }
    }
    //this._reversePolishArray.push('+');
}

Calculator.prototype.printRPA = function() {
    console.log('This is the this._reversePolishArray:');
    for(var i = 0; i < this._reversePolishArray.length; i++) {
        console.log(this._reversePolishArray[i]);
    }
}

Calculator.prototype.formalExpression = function(expression) {
    var expTemp = [];
    for(var i = 0; i < expression.length; i++) {
        expTemp.push(expression[i]);
    }
    for(var i = 0; i < expression.length; i++) {
        if(expTemp[i] == '×') {
            expTemp.splice(i, 1, '*');
            continue;
        }
        if(expTemp[i] == '÷') {
            expTemp.splice(i, 1, '/');
            continue;
        }
    }
    this._inputExpression = expTemp;
}

Calculator.prototype.initialInfixArray = function()/*throw Exception*/{
    var charInfixExp = this._inputExpression;
    var NumBuffer = '';
    var PNBuffer = '';
    var needPush = 0;
    var fPCount = 0;
    var sPCount = 0;
    var numCount = 0;

    // 0,+ is for checking parentheses purpose.
    this._infixArray.push('0');
    this._infixArray.push('+');
    for(var i = 0; i < charInfixExp.length; i++) {
        if(this.isSpace(charInfixExp[i]) == true) {
            continue;
        }
        if(this.isOperator(charInfixExp[i]) || this.isParenthese(charInfixExp[i])) {
            charInfixExp[i];
            if(this.isOperator(charInfixExp[i])) {
                if(NumBuffer == '') {
                    if(needPush == 1) {
                        this._infixArray.push(charInfixExp[i]);
                        needPush = 0;
                        continue;
                    } else {
                        PNBuffer = '' + charInfixExp[i];
                        needPush = 1;
                        continue;
                    }
                } else {
                    if(PNBuffer != '') {
                        if(PNBuffer == '+') {
                            this._infixArray.push(NumBuffer);
                            NumBuffer = '';
                            PNBuffer = '';
                            this._infixArray.push(charInfixExp[i]);
                            needPush = 0;
                            continue;
                        }
                        if(PNBuffer == '-') {
                            this._infixArray.push('-' + NumBuffer);
                            NumBuffer = '';
                            PNBuffer = '';
                            this._infixArray.push(charInfixExp[i]);
                            needPush = 0;
                            continue;
                        }
                        throw 'Invalid Input';
                    } else {
                        this._infixArray.push(NumBuffer);
                        this._infixArray.push(charInfixExp[i]);
                        NumBuffer = '';
                        continue;
                    }
                }
            }
            if(this.isParenthese(charInfixExp[i])) {
                if(charInfixExp[i] == '(') {

                    if(PNBuffer != '') {
                        throw 'Invalid Input';
                    }
                    if(NumBuffer != '') {
                        this._infixArray.push(NumBuffer);
                        NumBuffer = '';
                    }
                    if(this._infixArray.length > 0) {
                        if(this._infixArray[this._infixArray.length - 1] != '(' &&
                            !this.isOperator(this._infixArray[this._infixArray.length - 1])
                            ) {
                            throw 'Invalid Input';
                        }
                    }
                    this._infixArray.push('(');
                    continue;
                }
                if(charInfixExp[i] == ')') {
                    if(PNBuffer != '') {
                        if(NumBuffer != '') {
                            if(PNBuffer == '+') {
                                this._infixArray.push(NumBuffer);
                                NumBuffer = '';
                                PNBuffer = '';
                                this._infixArray.push(')');
                                needPush = 1;
                                continue;
                            }
                            if(PNBuffer == '-') {
                                this._infixArray.push('-' + NumBuffer);
                                NumBuffer = '';
                                PNBuffer = '';
                                this._infixArray.push(')');
                                needPush = 1;
                                continue;
                            }
                        } else {
                            throw 'Invalid Input';
                        }
                    } else {
                        if(NumBuffer != '') {
                            this._infixArray.push(NumBuffer);
                        }

                        if(this._infixArray[this._infixArray.length - 1] == ')' ||
                            (!this.isParenthese(this._infixArray[this._infixArray.length - 1]) &&
                                !this.isOperator(this._infixArray[this._infixArray.length - 1]) &&
                                this._infixArray[this._infixArray.length - 1] != '.'
                                )) {
                                
                            } else {
                                throw 'Invalid Input';
                            }

                        this._infixArray.push(')');
                        NumBuffer = '';
                        needPush = 1;
                        continue;
                    }
                }
            }
        } else {
            NumBuffer += charInfixExp[i];
        }
    }
    if(NumBuffer != '') {
        if(PNBuffer != '') {
            if(PNBuffer == '+') {
                this._infixArray.push(NumBuffer);
                NumBuffer = '';
                PNBuffer = '';
                return;
            }
            if(PNBuffer == '-') {
                this._infixArray.push('-' + NumBuffer);
                NumBuffer = '';
                PNBuffer = '';
                return;
            }
        } else {
            this._infixArray.push(NumBuffer);
            NumBuffer = '';
            return;
        }
    }
}

Calculator.prototype.printInfixArray = function() {
    var stkLength = this._infixArray.length;
    console.log('This is the _infixArray');
    for(var i = 0; i < stkLength; i++) {
        console.log(this._infixArray[i]);
    }
}

Calculator.prototype.isSpace = function(input) {
    if(input == ' ') {
        return true;
    } else {
        return false;
    }
}

Calculator.prototype.isParenthese = function(input) {
    if(input == '(' || input == ')') {
        return true;
    } else {
        return false;
    }
}

Calculator.prototype.isOperator = function(input) {
    if(input == '+' || input == '-' || input == '*' || input == '/') {
        return true;
    } else {
        return false;
    }
}

Calculator.prototype.reset = function() {
    this._infixArray = [];
    this._reversePolishArray = [];
    this._calculateStack = [];
    this._inputExpression = [];
}




/* End of the Calculator Class Difinition */

/* Main function*/
function isTooBigF(calResult) {
    if(calResult.indexOf('e') == -1) {
        return 0;
    } else {
        return 1;
    }
}
var clt = new Calculator();
var calResult;
/*var inputString = '3+5*8';
clt.initialInfixArray(inputString);
clt.printInfixArray();
clt.infixToRPN();
clt.printRPA();
console.log('The calculation result = ');
console.log(clt.calculate());*/

/* End of the Main function*/
var screen = document.querySelector('.screen');
screen.innerHTML = '0';
var isResultExist = 0;
var isTooBig = 0;

/* Add Listener to all buttons */
for(var i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function(e) {
        
        var btnValue = this.innerHTML;
        var screen = document.querySelector('.screen')
        var screenContent = screen.innerHTML;
        
        if(btnValue == 'C') {
            screen.innerHTML = '0';
            clt.reset();
            return;
        }
        if(btnValue == '←') {
            if(screenContent.length > 1) {
                screen.innerHTML = screenContent.substring(0,screenContent.length - 1);
                return;
            }
            if(screenContent.length == 1) {
                screen.innerHTML = '0';
            }
            return;
        }
        if(btnValue == '=') {
            clt.formalExpression(screen.innerHTML);
            try{
                clt.initialInfixArray();
                clt.infixToRPN();
                calResult = clt.calculate();
                if(calResult == 'NaN') {
                    screen.innerHTML = 'Invalid Input';
                } else {
                    screen.innerHTML = calResult;
                }
                isTooBig = isTooBigF(calResult);
                isResultExist = 1;
            } catch(e) {
                screen.innerHTML = e;
            }
            clt.reset();
            return;
        }
        if(btnValue == 'x' || btnValue == '÷' || btnValue == '-' || btnValue == '+') {
            if(isResultExist == 1)
            {
                isResultExist = 0;
            }
        } else {
            if(isResultExist == 1){
                screenContent = '0';
                isResultExist = 0;
            }
        }
        /* Remove the 0, Add new Number to Screen*/
        if(screenContent == '0' && (btnValue != '+' && btnValue != '-' && btnValue != 'x' && btnValue != '÷' && btnValue != '.')) {
            screen.innerHTML = '';
        }
        if(screen.innerHTML == 'Invalid Input') {
            screen.innerHTML = '';
        }
        if(isTooBig == 1) {
            if(btnValue != '+' && btnValue != '-' && btnValue != 'x' && btnValue != '÷' && btnValue != '.') {
                screen.innerHTML = '';
                isTooBig = 0;
            } else {
                screen.innerHTML = '0';
                isTooBig = 0;
            }
        }
        if(screen.innerHTML.length < 24) {
            screen.innerHTML += btnValue;
        }
        e.preventDefault();
    }
}

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        alert('Left was pressed');
    }
    else if(event.keyCode == 39) {
        alert('Right was pressed');
    }
});