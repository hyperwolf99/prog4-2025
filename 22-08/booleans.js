// Variable boolean (true/false)

// Contexto booleano se da en if, while, y operadores &&, || y !.

// Habran ciertos valores que podran ser considerados como FALSY, como 0, "", null, undefined y NaN.
// Todos los demas valores seran considerados como TRUTHY.

// Falsy: 0, "", null, undefined, NaN, false, -0
// Truthy: 1, "hola", [], {}, true, () => {}

// Ejemplos:
console.log("Falsy:");
console.log(0 ? "Verdadero" : "Falso");
console.log("" ? "Verdadero" : "Falso");
console.log(null ? "Verdadero" : "Falso");
console.log(undefined ? "Verdadero" : "Falso");
console.log(NaN ? "Verdadero" : "Falso");
console.log(false ? "Verdadero" : "Falso");
console.log(-0 ? "Verdadero" : "Falso");


console.log("Truthy:");
console.log(1 ? "Verdadero" : "Falso");
console.log("hola" ? "Verdadero" : "Falso");
console.log([] ? "Verdadero" : "Falso");
console.log({} ? "Verdadero" : "Falso");
console.log(true ? "Verdadero" : "Falso");
console.log((() => {}) ? "Verdadero" : "Falso");

// Operador OR (||): Busca de izquierda a derecha el primer valor que se comporte como true
// Si no encuentra, devuelve el último. Útil para valores por defecto.
console.log(null || 'un mensaje' || 'otro mensaje' || undefined)

// Operador AND (&&): Busca de izquierda a derecha el primer valor que se comporte como false
// Si no encuentra, devuelve el último. Útil para ejecutar código condicionalmente.
console.log('un mensaje' && 'otro mensaje' && 0 && undefined)

// Operador && con funciones:
const func1 = () => {
    console.log("Función 1 ejecutada")
    return 1;
};
const func2 = () => {
    console.log("Función 2 ejecutada")
    return null;
};
const func3 = () => {
    console.log("Función 3 ejecutada")
    return "hola";
};

// Ejemplo de uso del operador &&
console.log(func1() && func2() && func3());