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

Calculator.prototype.calculate = function() /*throw Exception*/{
    var cStackLength = this._reversePolishArray.length;
    var operator = '';
    var firstNum = '';
    var secondNum = '';
    var fn = 0;
    var sn = 0;
    var result = 0;
    
    for(var i = 0; i < cStackLength; i++) {
        this._calculateStack.push(this._reversePolishArray[i]);
        if(this.isOperator(this._calculateStack[this._calculateStack.length - 1]) == true) {
            operator = this._calculateStack.pop();
            secondNum = this._calculateStack.pop();
            firstNum = this._calculateStack.pop();
            if(this.isOperator(firstNum) == true || this.isOperator(secondNum)) {
                throw Exception;
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
        throw Exception;
    }
    return result;
}

Calculator.prototype.infixToRPN = function() /*throw Exception*/{
    var pushBuffer = '';
    var operatorStk = [];
    var infixStkLength = this._infixArray.length;
    
    this._reversePolishArray.push('0');
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
    this._reversePolishArray.push('+');
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
        if(expTemp[i] == 'x') {
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
    
    for( var i = 0; i < charInfixExp.length; i++) {
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
                            continue;
                        }
                        if(PNBuffer == '-') {
                            this._infixArray.push('-' + NumBuffer);
                            NumBuffer = '';
                            PNBuffer = '';
                            this._infixArray.push(charInfixExp[i]);
                            continue;
                        }
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
                            throw Exception;
                        }
                    } else {
                        if(NumBuffer != '') {
                            this._infixArray.push(NumBuffer);
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
                _infixArray.push('-' + NumBuffer);
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
}




/* End of the Calculator Class Difinition */

/* Main function*/
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

/* Add Listener to all buttons */
for(var i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function(e) {
        var btnValue = this.innerHTML;
        var screen = document.querySelector('.screen')
        var screenContent = screen.innerHTML;
        
        if(btnValue == 'C') {
            screen.innerHTML = '';
            clt.reset();
            return;
        }
        if(btnValue == '←') {
            screen.innerHTML = screenContent.substring(0,screenContent.length - 1);
            return;
        }
        if(btnValue == '=') {
            clt.formalExpression(screen.innerHTML)
            clt.initialInfixArray();
            clt.infixToRPN();
            calResult = clt.calculate();
            screen.innerHTML = calResult;
            clt.reset();
            return;
        }
        screen.innerHTML += btnValue;
        e.preventDefault();
    }
}