"use strict";

/* ********** CLASSES ********** */

class Regio {

    /**
     * Índex de refracció uniforme en la regió.
     */
    _n;
    /**
     * Component y del punt d'intersecció del raig en la superfície dreta de la regió.
     */
    _y;
    /**
     * Objecte de JS que guarda la informació de la textbox
     */
    input;

    /* CONSTRUCTORS */

    constructor(n, y, input) {
        this._n = n;
        this._y = y;
        this.input = input;
    }

    /* GETTERS */

    get n() {
        return this._n;
    }

    get y() {
        return this._y;
    }

    get v() {
        return c / this.n;
    }

    get input() {
        return this.input;
    }

    get update_n_value() {
        this._n = this.input.valueAsNumber;
        return this._n;
    }

}


/* ********** CONSTANTS ********** */

/**
 * Velocitat de la llum en el buit.
 * @type {number}
 */
const c = 1;

const default_n = 1;

const canvas_x = 800;
const canvas_y = 400;

/**
 * Amplada de cada Regió.
 * @type {number}
 */
let ampladaRegio = canvas_x;


/* ********** VARIABLES ********** */

// PRINCIPALS

/**
 * Conjunt de Regions del canvas. La mida haurà de ser N+1. On la 0 no es té en compte per dibuixar però si per calcular
 * la y(0) d'inici.
 * @type {Regio[]}
 */
let regions = [];

let snell_y = [];

// SETEJABLES

/**
 * Nombre de regions.
 * @type {number}
 */
let N = 10;

/**
 * Valor màxim del canvi aleatori en y(i).
 * @type {number}
 */
let delta = 10;

/**
 * Angle inicial.
 * @type {number}
 */
let angle_inicial = Math.PI/8;

// OBTINGUDES

let temps = 0;
let distancia = 0;
let temps_esperat = 0;
let distancia_esperada = 0;

// INTERNES

/**
 * Indica si s'ha de pintar o no.
 * @type {boolean}
 */
let activat = false;

/**
 * N modificada per la caixeta de text. Es fa servir aquesta quan es selecciona amb el botó.
 * @type {number}
 */
let next_N = 10;

/**
 * Nombre d'iteracions
 * @type {number}
 */
let iteracions = 0;

/* ********** FUNCIONS BÀSIQUES P5.JS ********** */

/**
 * Codi executat una sola vegada a l'inici del programa.
 * Mètode propi de p5.js.
 */
function setup() {
    let canvas = createCanvas(canvas_x, canvas_y);
    canvas.parent("myCanvas");

    crea_N_textbox();
    crea_delta_slider();

    draw_canvas_vora();
    display_valors_generics();
}

/**
 * Codi executat indefinidament fins que s'atura l'execució del programa,
 * Mètode propi de p5.js
 */
function draw() {
    if (activat) { //Només fa les iteracions si està activat
        background(255);

        draw_canvas_vora();
        draw_regions();
        draw_trajectoria_llum();
        draw_trajectoria_snell();
        calcular_trajectoria();
        taula();
        display_valors_generics();
        iteracions++;
    }
}

/* ********** MÈTODES CRIDATS PER ELEMENTS VISUALS ********** */

function set_next_N(value) {
    next_N = value; // actualitzem valor N
}


/**
 * Cridat pel boto de SET N.
 */
function update_regions() {
    pause_iterations() // para execució
    reset_iteracions(); //reset iteracions
    draw_canvas_vora(); // fons blanc   

    N = next_N; // actualitzem valor N
    ampladaRegio = canvas_x/N;

    regions = [];
    snell_y = [];
    temps = 0;
    distancia = 0;
    temps_esperat = 0;
    distancia_esperada = 0;

    let refractionTextboxDiv = document.getElementById("refraction-textboxes");
    refractionTextboxDiv.innerHTML = "";

    for (let i = 0; i <= N; i++) {
        //Crear label i input
        if (i > 0) {
            let label = document.createElement("label");
            label.setAttribute("for", "refraction-" + i);
            label.innerText = "n" + i + ": ";
            let input = document.createElement("input");
            input.setAttribute("type", "number");
            input.setAttribute("id", "refraction-" + i);
            input.setAttribute("min", "1");
            input.setAttribute("step", "0.1");
            input.value = default_n;

            input.style.width = "50px";
            input.style.height = "20px";
            input.style.fontSize = "12px";
            refractionTextboxDiv.appendChild(label);
            refractionTextboxDiv.appendChild(input);

            regions.push(new Regio(default_n, 0, input));
        }
        else regions.push(new Regio(default_n, 0, null));
    }
    draw_regions(); // redibuixem les regions
    display_valors_generics();
}

//TODO: ACABAR, hauria de resetejar valors a aleatoris
function setup_valors() {
    pause_iterations() // para execució
    reset_iteracions(); //reset iteracions
    temps = 0;
    distancia = 0;
    temps_esperat = 0;
    distancia_esperada = 0;

    update_valors_n();
    draw_canvas_vora();
    draw_regions();
    const final_y = calcular_tarjectoria_snell();
    setup_random_y_trajectories(final_y);
    draw_trajectoria_snell();
    draw_trajectoria_llum();
    taula(); //dibuixem la taula
    reset_iteracions(); //reset iteracions
    display_valors_generics();

}

function update_valors_n() {
    for (let i = 1; i <= N; i++) {
        regions[i].update_n_value;
    }
}

//TODO: ACABAR, hauria de resetejar valors a aleatoris
function start_iterations() {
    activat = true;
    console.log("START ITERATIONS (activat=" + activat + ")");
    console.log(regions);
}

function pause_iterations() {
    activat = false;
    console.log("PAUSE ITERATIONS (activat=" + activat + ")");
    console.log(regions);
}


/* ********** ELEMENTS INTERACCIÓ VISUALS ********** */

//TODO: posar min i max
function crea_N_textbox() {
    let textbox = createInput(N.toString(), "number");
    textbox.parent("N-textbox"); // posem el textbox en el contenidor HTML
    textbox.input(() => set_next_N(int(textbox.value()))); // actualitzem el valor de regions quan el valor del textbox canvia

    textbox.style("width", "50px");
    textbox.style("height", "20px");
    textbox.style("font-size", "12px");
}

function crea_delta_slider() {
    let slider = createSlider(2, 100, delta);
    slider.parent("container-delta"); // posem el sliders en el contenidor HTML
    slider.input(() => update_delta(slider.value())); // actualitzem el valor de regions quan el valor del slider canvia
}

function taula() {
    let tableDiv = document.getElementById("region-info");
    tableDiv.innerHTML = ""; // elimina la taula anterior
  
    let tableContainer = document.createElement("div");
    tableContainer.classList.add("table-container"); //ho posem amb un contenidor
  
    let tableTitle = document.createElement("h3");
    tableTitle.textContent = "Taula de valors"; //titol de la taula
    tableContainer.appendChild(tableTitle);
  
    // nombre de taules necesaries
    let numTables = Math.ceil(N / 10);
  
    // it cada taula
    for (let t = 0; t < numTables; t++) {
        // fem taula
        let table = document.createElement("table");
        table.classList.add("data-table");
    
        // fem header de cada taula
        let thead = document.createElement("thead");
        let headerRow = document.createElement("tr");
    
        let th = document.createElement("th");
        th.textContent = "Regió";
        th.style.border = "1px solid black";
        th.style.padding = "8px";
        th.style.minWidth = "100px"; // amplada minima per cada columna
        headerRow.appendChild(th);
    
        // calculem primera i ultima regio de la taula
        let startRegion = t * 10 + 1;
        let endRegion = Math.min(startRegion + 9, N);
    
        // it cadad regio i fem columna
        for (let i = startRegion; i <= endRegion; i++) {
            let th = document.createElement("th");
            th.textContent = i;
            th.style.border = "1px solid black";
            th.style.padding = "8px";
            th.style.minWidth = "100px";
            headerRow.appendChild(th);
        }
  
        thead.appendChild(headerRow);
        table.appendChild(thead);
    
        // contingut de la taula
        let tbody = document.createElement("tbody");
    
        // iterem per la informació(atributs) que te cada regió i fem una fila per cada atribut
        let row1 = document.createElement("tr");
        let row2 = document.createElement("tr");
        let row3 = document.createElement("tr");

        let td1 = document.createElement("td");
        td1.textContent = "n";
        td1.style.border = "1px solid black";
        td1.style.padding = "8px";
        row1.appendChild(td1);
    
        let td2 = document.createElement("td");
        td2.textContent = "y";
        td2.style.border = "1px solid black";
        td2.style.padding = "8px";
        row2.appendChild(td2);

        let td3 = document.createElement("td");
        td3.textContent = "y esperada";
        td3.style.border = "1px solid black";
        td3.style.padding = "8px";
        row3.appendChild(td3);
  
        // iterem cada regio i fem celes per cada columna
        for (let i = startRegion; i <= endRegion; i++) {
            let region = regions[i];
    
            let td1 = document.createElement("td");
            td1.textContent = region.n;
            td1.style.border = "1px solid black";
            td1.style.padding = "8px";
            row1.appendChild(td1);
    
            let td2 = document.createElement("td");
            td2.textContent = region.y;
            td2.style.border = "1px solid black";
            td2.style.padding = "8px";
            row2.appendChild(td2);

            let td3 = document.createElement("td");
            td3.textContent = snell_y[i];
            td3.style.border = "1px solid black";
            td3.style.padding = "8px";
            row3.appendChild(td3);
        }
    
        tbody.appendChild(row1);
        tbody.appendChild(row2);
        tbody.appendChild(row3);

        table.appendChild(tbody);
    
        tableContainer.appendChild(table);
    }
    tableDiv.appendChild(tableContainer);
}
  
  

/* ********** DIBUIXAR EL CANVAS ********** */

/**
 * Dibuixa el fons del canvas.
 */
function draw_canvas_vora() {
    stroke(0, 0, 0);
    strokeWeight(3);
    rect(0, 0, width, height);
}

/**
 * Dibuixem les N regions uniformes on calculem la coordenada x de cada regió en funció del seu índex
 */
function draw_regions() {
    stroke(0,0,0);
    strokeWeight(2);

    for (let i = 1; i < N; i++) {
        //map(valor a convertir, limit inf rang actual, limit sup rang actual,
        //limit inf rang desitjat, limit sup rang desitjat)
        let x = map(i, 0, N, 0, width); //calculem on hem de partir les regions en base a la mida del canvas
        line(x, 0, x, height); //line: traça linia entre dos punts line(x1,y1,x2,y2)
    }
}

/**
 * Dibuixem la trajectòria de la llum
 */
function draw_trajectoria_llum() {
    stroke(255,125,0);
    strokeWeight(3);

    for (let i = 0; i < N; i++) {
        let x1 = map(i, 0, N, 0, width);
        let x2 = map(i + 1, 0, N, 0, width);
        line(x1, regions[i].y, x2, regions[i+1].y);
    }
}

/**
 * Dibuixa la trajectòria de Snell de la llum.
 * Actualitza els valors de snell,
 */
function calcular_tarjectoria_snell() {
    snell_y = [];
    distancia_esperada = 0;
    temps_esperat = 0;

    let angle_anterior = angle_inicial;
    let y_anterior = regions[0].y;
    snell_y.push(y_anterior);

    for (let i = 1; i <= N; i++) {
        let x1 = map(i-1, 0, N, 0, width);
        let x2 = map(i, 0, N, 0, width);

        let n_anterior = regions[i-1].n;
        let n = regions[i].n;

        let angle_nou = asin((n_anterior / n) * sin(angle_anterior));
        let y_nova = y_anterior + ampladaRegio * tan(angle_nou);

        let dx = dist(x1, y_anterior, x2, y_nova); //distancia euclidea entre regió i-i+1
        let dt = dx / regions[i].v;

        distancia_esperada += dx;
        temps_esperat += dt;

        y_anterior = y_nova;
        angle_anterior=angle_nou;
        snell_y.push(y_anterior);
    }
    return y_anterior;
}

function draw_trajectoria_snell() {
    stroke(0, 255, 0, 126);
    strokeWeight(3)

    for (let i = 0; i < N; i++) {
        let x1 = map(i, 0, N, 0, width);
        let x2 = map(i + 1, 0, N, 0, width);
        line(x1, snell_y[i], x2, snell_y[i+1]);
    }
}


function reset_iteracions() {
    iteracions = 0;
    document.getElementById("iterations").innerHTML = iteracions;
}

/* PASSAR VALORS A HTML */

function display_valors_generics() {
    document.getElementById("iterations").innerHTML = iteracions;
    document.getElementById("temps").innerHTML = temps.toFixed(2);
    document.getElementById("distancia").innerHTML = distancia.toFixed(2);
    document.getElementById("temps-esperat").innerHTML = temps_esperat.toFixed(2);
    document.getElementById("distancia-esperada").innerHTML = distancia_esperada.toFixed(2);
}

//Inicialitzem les coordenades y aleatòriament
function setup_random_y_trajectories(final_y) {
    for (let i = 1; i < N; i++) {
        regions[i]._y = random(height); //update dels objectes (en teoria va)
    }
    regions[N]._y = final_y;
}


function update_delta(value) {
    delta = value; // actualitzem valor delta
    calcular_trajectoria();
    draw_regions(); // redibuixem les regions
    reset_iteracions(); //resetem iteracions
}


//TODO: GENERALITZAR perquè hi ha codi duplica a 3 llocs que fa això
// Cal minimitzar aquesta funció que calcula el temps de propagació de la llum
function calcular_temps_propagacio_llum() {
    let t = 0;
    for (let i = 0; i < N; i++) {
      let dx = dist(i, regions[i].y, i + ampladaRegio, regions[i + 1].y); //distancia euclidea entre regió i-i+1
      t += dx / regions[i+1].v;
    }
    return t;
}


// Funcio que calcula la distància total de propagació de la llum
function calcular_distancia_calculada() {
    let distancia = 0;
    for (let i = 0; i < N; i++) {
        let dx = dist(i, regions[i].y, i + ampladaRegio, regions[i + 1].y);
        distancia += dx;
    }
    return distancia;
}


//Fem un canvi random en les y en una regio i acualitzem el temps de propagació
function random_canvi_y() {

    let y_noves = [];
    regions.forEach((element) => {
        y_noves.push(element.y);
    });

    const i = floor(random(1, N)); // escollim una regió aleatòriament
    let y_canviada;

    let trobat = false;
    while (!trobat) {
        let dy = random(-delta, delta); // calculem un canvi aleatori en y(i)
        if (dy+y_noves[i] >= 0 && dy+y_noves[i] <= height) {
            y_noves[i] += dy;
            y_canviada = y_noves[i];
            trobat = true;
        }
    }

    let t = 0;
    for (let i = 0; i < N; i++) {
        let dx = dist(i, y_noves[i], i + ampladaRegio, y_noves[i + 1]); //distancia euclidea entre regió i-i+1
        t += dx / regions[i+1].v;
    }

    return [t, i, y_canviada];
}


//Calculeu si aquest canvi fa disminuir el temps que triga la llum. 
//En cas afirmatiu, accepteu el canvi i continueu el procés.*/
function calcular_trajectoria() {
    let t_prop = calcular_temps_propagacio_llum();
    let [t_prop_nou, i, y_nova] = random_canvi_y();

    //comprobem si el nou canvi disminueix el temps de propagació
    if (t_prop_nou < t_prop) {
        regions[i]._y = y_nova;

        temps = t_prop_nou;
        distancia = calcular_distancia_calculada();
    }
}