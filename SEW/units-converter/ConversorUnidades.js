
class Converter {
	constructor(unitsData) {
		this.setUnitsData(unitsData)
	}
	
	setUnitsData(unitsData) {
		this.unitsData = unitsData
		
		this.srcUnits = null
		this.dstUnit = null
		this.convertFactor = 0
	}
	
	setUnits(srcUnit, dstUnit) {
		this.srcUnit = srcUnit
		this.dstUnit = dstUnit
		this.updateFactor()
	}
	
	setSrcUnit(srcUnit) {
		this.srcUnit = srcUnit
		this.updateFactor()
	}
	
	setDstUnit(dstUnit) {
		this.dstUnit = dstUnit
		this.updateFactor()
	}
	
	updateFactor() {
		this.convertFactor = this.unitsData[this.srcUnit] / this.unitsData[this.dstUnit]
	}
	
	convert(amount) {
		return amount * this.convertFactor
	}
}

DISTANCE = {"anyoLuz": 9460e12, "millNau": 1852, "mill": 1609.344, "km": 1000, "m": 1,
	"yd": 0.9144, "pies": 0.3048, "dc": 0.1, "in": 0.0254, "cm": 0.01, "mm": 1e-3, "µm": 1e-6, "nm": 1e-9, "pc": 1e-12}

SURFACE = {"km2": 1e6, "hm2": 1e4, "m2": 1, "dm2": 0.01, "mm2": 1e-6, "µm2": 1e-12, "nm2": 1e-18}
VOLUME = {"km3": 1e9, "m3": 1, "dm3": 1e-3, "l": 1e-3, "mc3": 1e-6, "mm3": 1e-9}
TIME = {"anyo": 31536000, "semana": 604800, "día": 86400, "h": 3600, "min": 60, "s": 1, "ms": 0.001}
POWER = {"kw": 1e3, "hp": 745.699872, "cv": 735.49875, "w": 1}
ENERGY = {"kw·h": 3.6e6, "MJ": 1e6, "w·h": 3.6e3, "KJ": 1e3, "cal": 4.184, "J": 1, "w·h": 2.7777778e-4, "ev": 1.602177e-19}

CONVERTERS = {"Distancia": DISTANCE, "Superficie": SURFACE, "Volumen": VOLUME, "Tiempo": TIME, "Potencia": POWER, "Energia": ENERGY}

ID_UNITS_TO_NAMES = {"anyoLuz": "año luz", "millNau": "mill nau", "anyo": "año"}

STANDARD_COLOR_FG = "black"
SELECTED_COLOR_FG = "white"
STANDARD_COLOR_BG = "#88f987"
SELECTED_COLOR_BG = "#383a24"

class GUI {
	constructor() {
		this.converter = new Converter(CONVERTERS["Distancia"])
		this.number = "0"
		
		this.unitsDataBt = null
		this.srcUnitBt = null
		this.dstUnitBt = null
	}
	
	startup() {
		this.updateToConvertScreen()
		this.setUnitsData('Distancia')
	}
	
	getDefaultVal(obj) {
		for (let name in obj) {
			if (obj[name] == 1)
				return name
		}
		return null
	}
	
	setUnitsData(unitsDataName) {
		var units = CONVERTERS[unitsDataName]
		var defaultUnits = this.getDefaultVal(units)
		
		this.converter.setUnitsData(units)
		this.converter.setUnits(defaultUnits, defaultUnits)
		
		this.setPressedSrcBt(defaultUnits)
		this.setPressedDstBt(defaultUnits)
		
		this.resertColorBt(this.unitsDataBt)
		this.unitsDataBt = document.getElementById(unitsDataName)
		this.setSelectedColor(this.unitsDataBt)
		this.filterUnitButtons(unitsDataName)
		
		this.updateConvertedValue()
	}
	
	filterUnitButtons(className) {
		for (let unitsBtsGroup of document.getElementsByClassName("unitsBts")) {
			for (let bt of unitsBtsGroup.children)
				bt.style.display = bt.classList.contains(className) ? "block" : "none"
		}
	}
	
	setSrcUnit(srcUnit) {
		this.converter.setSrcUnit(srcUnit)
		this.setPressedSrcBt(srcUnit)
		this.updateConvertedValue()
	}
	
	setDstUnit(dstUnit) {
		this.converter.setDstUnit(dstUnit)
		this.setPressedDstBt(dstUnit)
		this.updateConvertedValue()
	}
	
	setPressedSrcBt(srcUnit) {
		this.setLabelUnit(document.getElementById("pantallaAConvertirLb"), srcUnit)
		this.resertColorBt(this.srcUnitBt)
		
		this.srcUnitBt = document.getElementsByClassName("src " + srcUnit)[0]
		this.setSelectedColor(this.srcUnitBt)
	}
	
	setPressedDstBt(dstUnit) {
		this.setLabelUnit(document.getElementById("pantallaConvertidoLb"), dstUnit)
		this.resertColorBt(this.dstUnitBt)
		
		this.dstUnitBt = document.getElementsByClassName("dst " + dstUnit)[0]
		this.setSelectedColor(this.dstUnitBt)
	}
	
	resertColorBt(bt) {
		if (bt != null) {
			bt.style.color = STANDARD_COLOR_FG
			bt.style.background = STANDARD_COLOR_BG
		}
	}
	
	setSelectedColor(bt) {
		bt.style.color = SELECTED_COLOR_FG
		bt.style.background = SELECTED_COLOR_BG
	}
	
	setLabelUnit(label, unit) {
		label.innerHTML = ID_UNITS_TO_NAMES.propertyIsEnumerable(unit) ? ID_UNITS_TO_NAMES[unit] : unit
	}
	
	pressCharBt(charPressed) {
		if (this.number.length == 1 && this.number[0] == "0" && charPressed != ".")
			this.number = ""
		
		this.number += charPressed
		this.updateToConvertScreen()
		this.updateConvertedValue()
	}
	
	clearScreen() {
		this.number = "0"
		this.updateToConvertScreen()
		this.updateConvertedValue()
	}
	
	updateConvertedValue() {
		try {
			let num = parseFloat(this.number)
			this.printInConvertedScreen(this.converter.convert(num))
		}
		catch (err) {
			this.printInConvertedScreen("Número inválido")
		}
	}
	
	printInConvertedScreen(toPrint) {
		document.getElementById("pantallaConvertido").value = toPrint
	}
	
	updateToConvertScreen() {
		document.getElementById("pantallaAConvertir").value = this.number
	}
}

gui = new GUI()