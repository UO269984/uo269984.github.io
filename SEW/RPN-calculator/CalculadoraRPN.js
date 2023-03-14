
class CalculadoraRPN {
	constructor() {
		this.clearStack()
	}
	
	addNumber(number) {
		this.stack.push(number)
	}
	
	clearStack() {
		this.stack = new Array()
	}
	
	delLast() {
		this.stack.pop()
	}
	
	computeOp2(op) {
		let op1 = this.stack.pop()
		this.addNumber(op.compute(this.stack.pop(), op1))
	}
	
	computeOp1(op) {
		this.addNumber(op.compute(this.stack.pop()))
	}
	
	canMakeOp(numOperators) {
		return this.stack.length >= numOperators
	}
	
	getHtmStackRepr() {
		var repr = ""
		var last2 = this.stack.length - 2
		
		var i = 0
		for (let elem of this.stack)
			repr += (i++ < last2 ? "<li>" : "<li class='LastElems'>") + elem + "</li>"
		
		return '<ol id="listaPila">' + (repr.length != 0 ? repr : "<li></li>") + "</ol>"
	}
}

class NumberGenerator {
	constructor() {
		this.reset()
	}
	
	addDigit(digit) {
		if (this.number[0] == "0" && digit.match("[0-9]"))
			this.number = this.number.substring(1)
		
		this.number = this.number.concat(digit)
	}
	
	reset() {
		this.number = "0"
	}
	
	delLast() {
		if (this.number.length != 1)
			this.number = this.number.substring(0, this.number.length - 1)
		
		else
			this.reset()
	}
	
	getNumber() {
		return parseFloat(this.number)
	}
	
	getNumberAndReset() {
		var n = this.getNumber()
		this.reset()
		return n
	}
}

class GUI {
	constructor() {
		this.numGenerator = new NumberGenerator()
		this.calc = new CalculadoraRPN()
		
		this.op1Elements = document.getElementsByClassName("op1")
		this.op2Elements = document.getElementsByClassName("op2")
		this.canMakeOp1 = true
		this.canMakeOp2 = true
	}
	
	addDigitToNumber(digit) {
		this.numGenerator.addDigit(digit)
		this.updateNumberGen()
	}
	
	resetNumber() {
		this.numGenerator.reset()
		this.updateNumberGen()
	}
	
	number_delLast() {
		this.numGenerator.delLast()
		this.updateNumberGen()
	}
	
	addNumberToStack() {
		this.calc.addNumber(this.numGenerator.getNumberAndReset())
		this.updateNumberGen()
		this.updateStack()
		this.updateCanMakeOperations()
	}
	
	clearStack() {
		this.calc.clearStack()
		this.updateStack()
		this.updateCanMakeOperations()
	}
	
	stack_delLast() {
		this.calc.delLast()
		this.updateStack()
		this.updateCanMakeOperations()
	}
	
	computeOp1(op) {
		if (this.calc.canMakeOp(1)) {
			this.calc.computeOp1(op)
			this.updateStack()
		}
		else
			this.showInScreen("Faltan operandos")
	}
	
	computeOp2(op) {
		if (this.calc.canMakeOp(2)) {
			this.calc.computeOp2(op)
			this.updateStack()
			this.updateCanMakeOperations()
		}
		else
			this.showInScreen("Faltan operandos")
	}
	
	showInScreen(text) {
		document.getElementById("pantallaCalculadora").value = text
	}
	
	updateNumberGen() {
		this.showInScreen(this.numGenerator.number)
	}
	
	updateStack() {
		document.getElementById("pilaCalculadora").innerHTML = this.calc.getHtmStackRepr()
		var ol = document.getElementById("listaPila")
		ol.scrollTop = ol.scrollHeight
	}
	
	updateCanMakeOperations() {
		if (this.canMakeOp1 != this.calc.canMakeOp(1)) {
			this.canMakeOp1 = ! this.canMakeOp1
			this.updateButtonsBackgoround(this.op1Elements, this.getColorEnabled(this.canMakeOp1))
		}
		
		if (this.canMakeOp2 != this.calc.canMakeOp(2)) {
			this.canMakeOp2 = ! this.canMakeOp2
			this.updateButtonsBackgoround(this.op2Elements, this.getColorEnabled(this.canMakeOp2))
		}
	}
	
	getColorEnabled(isEnabled) {
		return isEnabled ? "" : DISABLED_COLOR
	}
	
	updateButtonsBackgoround(buttons, backgroundColor) {
		for (let button of buttons)
			button.style.background = backgroundColor
	}
	
	sin() {
		this.computeOp1(new Sin())
	}
	
	cos() {
		this.computeOp1(new Cos())
	}
	
	tan() {
		this.computeOp1(new Tan())
	}
	
	pow() {
		this.computeOp2(new Pow())
	}
	
	square() {
		this.computeOp1(new Square())
	}
	
	asin() {
		this.computeOp1(new Asin())
	}
	
	acos() {
		this.computeOp1(new Acos())
	}
	
	atan() {
		this.computeOp1(new Atan())
	}
	
	div() {
		this.computeOp2(new Div())
	}
	
	sqrt() {
		this.computeOp1(new Sqrt())
	}
	
	mul() {
		this.computeOp2(new Mul())
	}
	
	fact() {
		this.computeOp1(new Fact())
	}
	
	sub() {
		this.computeOp2(new Sub())
	}
	
	ln() {
		this.computeOp1(new Ln())
	}
	
	sum() {
		this.computeOp2(new Sum())
	}
	
	exp() {
		this.computeOp1(new Exp())
	}
}

class IntermittentMananger {
	constructor() {
		this.visible = false
		this.inputToChange = null
	}
	
	update() {
		if (this.inputToChange == null)
			this.inputToChange = document.getElementById("pantallaCalculadora")
		
		this.inputToChange.style.textDecoration = this.visible ? "none" : "underline"
		this.visible = ! this.visible
	}
}

DISABLED_COLOR = "#4e5e4f"
var gui = new GUI()
var intermittent = new IntermittentMananger()
window.setInterval(() => intermittent.update(), 1500)
setTimeout(() => window.setInterval(() => intermittent.update(), 1500), 850)

class Sum {
	compute(a, b) {
		return a + b
	}
}

class Sub {
	compute(a, b) {
		return a - b
	}
}

class Mul {
	compute(a, b) {
		return a * b
	}
}

class Div {
	compute(a, b) {
		return a / b
	}
}

class Sin {
	compute(n) {
		return Math.sin(n)
	}
}

class Cos {
	compute(n) {
		return Math.cos(n)
	}
}

class Tan {
	compute(n) {
		return Math.tan(n)
	}
}

class Asin {
	compute(n) {
		return Math.asin(n)
	}
}

class Acos {
	compute(n) {
		return Math.acos(n)
	}
}

class Atan {
	compute(n) {
		return Math.atan(n)
	}
}

class Square {
	compute(n) {
		return n**2
	}
}

class Pow {
	compute(b, e) {
		return b**e
	}
}

class Sqrt {
	compute(n) {
		return n**0.5
	}
}

class Ln {
	compute(n) {
		return Math.log(n)
	}
}

class Exp {
	compute(n) {
		return Math.exp(n)
	}
}

class Fact {
	compute(n) {
		if (n < 0)
			return NaN
		
		var fact = 1
		for (let i = 2; i <= n; i++)
			fact *= i
		
		return fact
	}
}