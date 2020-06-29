'use strict'

feather.replace()

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})


$('input').on('keydown', function(e){
  if(e.key.length == 1 && e.key.match(/[^0-9'".]/)){
    return false;
  };
})

let selectGas = document.querySelector('.select-gas');
let gasTemperature = document.querySelector('.gas-temperature');

selectGas.addEventListener('change', () => {
  if (selectGas.selectedIndex === 0) {
    gasTemperature.textContent = 200
  }
  if (selectGas.selectedIndex === 1) {
    gasTemperature.textContent = 140
  }
  if (selectGas.selectedIndex === 2) {
    gasTemperature.textContent = 88
  }
  if (selectGas.selectedIndex === 3) {
    gasTemperature.textContent = 100
  }
  checkFields()
})

let molarMass = document.querySelector('.molar-mass');
let tInput = document.querySelector('.t-input');
let pInput = document.querySelector('.p-input');
let flowrate = document.querySelector('.flowrate');
let zInput = document.querySelector('.z-input');
let adiabat = document.querySelector('.adiabat');
let pOutput = document.querySelector('.p-output');
let zOutput = document.querySelector('.z-output');

let tOutput = document.querySelector('.t-output');
let powerHead = document.querySelector('.power-head');

let zAvg = document.querySelector('.z-avg');
let capacity = document.querySelector('.capacity');
let volFlowrate = document.querySelector('.vol-flowrate');
let polytropic = document.querySelector('.polytropic');
let polytropicRate = document.querySelector('.polytropic-rate');
let compressionRatio = document.querySelector('.compression-ratio');
let appT = document.querySelector('.app-t');
let trueT = document.querySelector('.true-t');
let trueP = document.querySelector('.true-p');
let polytropicHead = document.querySelector('.polytropic-head');
let isentropicHead = document.querySelector('.isentropic-head');
let isentropic = document.querySelector('.isentropic');
let power = document.querySelector('.power');
let powerLosses = document.querySelector('.power-losses');
let shaftPower = document.querySelector('.shaft-power');
let drivePower = document.querySelector('.drive-power');
let numWheels = document.querySelector('.num-wheels');

let checkT = document.querySelector('.card')

function calculation() {
  zAvg.textContent = (Number(zInput.value) + Number(zOutput.value))/2;
  capacity.textContent = Math.round((12.03*pInput.value*molarMass.value)/(zInput.value*(Number(tInput.value)+273)) * 1000) / 1000;
  volFlowrate.textContent = Math.round((flowrate.value/capacity.textContent)* 1000) / 1000;
  if (Number(volFlowrate.textContent) <= 340000){
    if (Number(volFlowrate.textContent) <= 850){
      polytropic.textContent = 0.63
    }
    if (Number(volFlowrate.textContent) > 850 & Number(volFlowrate.textContent) <= 12700){
      polytropic.textContent = 0.74
    }
    if (Number(volFlowrate.textContent) > 12700){
      polytropic.textContent = 0.77
    }
  }
  else {
    polytropic.textContent = '-'
    checkT.style.display = 'block';
    checkT.className = 'card text-white bg-danger d-print-none';
    checkT.innerHTML = '<div class="card-body"><h5 class="card-title">Необходим другой тип компрессора</h5></div>'
  }
  if (adiabat.value == 1) {
    checkT.style.display = 'block';
    checkT.className = 'card text-white bg-danger d-print-none';
    checkT.innerHTML = '<div class="card-body"><h5 class="card-title">Значение адиабаты не может быть равным 1</h5></div>'
  }
  if (pInput.value == pOutput.value) {
    checkT.style.display = 'block';
    checkT.className = 'card text-white bg-danger d-print-none';
    checkT.innerHTML = '<div class="card-body"><h5 class="card-title">Давление на выходе равно давлению на входе</h5></div>'
  }
  polytropicRate.textContent =  Math.round(((adiabat.value/(adiabat.value-1))*polytropic.textContent/((adiabat.value/(adiabat.value-1))*polytropic.textContent-1))* 100) / 100;
  compressionRatio.textContent = Math.round(((pOutput.value/pInput.value))* 1000) / 1000;
  appT.textContent = Math.round(((Number(tInput.value)+273.15)*((pOutput.value/pInput.value)**((adiabat.value-1)/adiabat.value)))* 100) / 100;
  trueP.textContent = Math.round((compressionRatio.textContent*pInput.value)* 10) / 10;
  polytropicHead.textContent = Math.round(((zAvg.textContent*8.314*(Number(tInput.value)+273.15))/
  (molarMass.value*(polytropicRate.textContent-1)/polytropicRate.textContent)*
  (((pOutput.value/pInput.value)**((polytropicRate.textContent-1)/polytropicRate.textContent))-1))* 1000) / 1000;
  isentropicHead.textContent = Math.round(((zAvg.textContent*8.314*(Number(tInput.value)+273.15))/
  (molarMass.value*(adiabat.value-1)/adiabat.value)* 
  (((pOutput.value/pInput.value)**((adiabat.value-1)/adiabat.value))-1))* 1000) / 1000;
  isentropic.textContent = Math.round((isentropicHead.textContent*polytropic.textContent/polytropicHead.textContent)* 1000) / 1000;
  trueT.textContent = Math.round((((Number(tInput.value)+273.15)*((pOutput.value/pInput.value)**((adiabat.value-1)/adiabat.value)-1)/isentropic.textContent)+(Number(tInput.value)+273.15))* 100) / 100;;
  power.textContent = Math.round(((flowrate.value*polytropicHead.textContent)/(polytropic.textContent*3600))* 100) / 100; 
  powerLosses.textContent = Math.round((0.75*((power.textContent)**0.4))* 100) / 100;;
  shaftPower.textContent = Math.round((Number(power.textContent) + Number(powerLosses.textContent))* 100) / 100;;
  drivePower.textContent = Math.round((shaftPower.textContent*1.1)* 100) / 100;
  numWheels.textContent = Math.ceil((0.03*polytropicHead.textContent-0.25));

  tOutput.value = Math.round((trueT.textContent-237.15)* 100) / 100;
  powerHead.value = Math.round((shaftPower.textContent)* 10) / 10;

  if(polytropic.textContent != '-' & adiabat.value != 1 & pInput.value != pOutput.value) {
    if (Number(tOutput.value) < Number(gasTemperature.textContent)) {
      checkT.style.display = 'block';
      checkT.className = 'card text-white bg-success d-print-none'
      checkT.innerHTML = '<div class="card-body"><h5 class="card-title">Температурное условие выполняется</h5></div>'
    }
    else {
      checkT.style.display = 'block';
      checkT.className = 'card text-white bg-danger d-print-none';
      checkT.innerHTML = '<div class="card-body"><h5 class="card-title">Температурное условие не выполняется! Необходимо использовать многоступенчатый компрессор</h5></div>'
    }
  }
}

function checkFields() {
  if (molarMass.value !== '' & tInput.value !== '' & pInput.value !== '' & flowrate.value !== '' & zInput.value !== '' & adiabat.value !== '' & pOutput.value !== '' & zOutput.value !== '') {
    calculation()
  }
  else {
    checkT.style.display = 'block';
    checkT.className = 'card text-white bg-warning d-print-none';
    checkT.innerHTML = '<div class="card-body"><h5 class="card-title">Введены не все данные</h5></div>'
  }
}

document.addEventListener('keyup', checkFields)

let manual =   document.querySelector('.manual')
let formulas =   document.querySelector('.formulas')
let compressorCal =   document.querySelector('.compressor-cal')
let help =   document.querySelector('.help')

function printPDF() {
  compressorCal.classList.toggle("printPDF")
  window.print();
  compressorCal.classList.toggle("printPDF")

}

function removeSelected() {
  let selected = document.querySelector('.menu').querySelectorAll(".nav-item");
  for(let elem of selected) {
    elem.classList.remove('active');
  }
}

function offMainBlock() {
  let selected = document.querySelector('body').querySelectorAll(".main-block");
  for(let elem of selected) {
    elem.style.display = "none";
  }
}

document.querySelector('.export').onclick = printPDF

document.querySelector('.menu-manual').onclick = function(ev) {
  removeSelected()
  ev.target.classList.add('active')
  offMainBlock()
  manual.style.display = "block"
}
document.querySelector('.menu-formulas').onclick = function(ev) {
  removeSelected()
  ev.target.classList.add('active')
  offMainBlock()
  formulas.style.display = "block"
}
document.querySelector('.menu-compressor-cal').onclick = function(ev) {
  removeSelected()
  ev.target.classList.add('active')
  offMainBlock()
  compressorCal.style.display = "block"
}
document.querySelector('.menu-help').onclick = function(ev) {
  removeSelected()
  ev.target.classList.add('active')
  offMainBlock()
  help.style.display = "block"
}
