const urlParams = new URLSearchParams(window.location.search)

const numberOfColumns = urlParams.get('number-of-columns') || 35
const numberOfRows = urlParams.get('number-of-rows') || 20
const airResistanceConstant = urlParams.get('air-resistance') || 25
const l = urlParams.get('length') || 25
const constant = urlParams.get('spring-constant') || 300
const constantModifier = urlParams.get('spring-constant-modifier') || 10
