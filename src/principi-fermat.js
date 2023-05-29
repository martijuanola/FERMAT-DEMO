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
    angle_in;
    angle_out;

    /* CONSTRUCTORS */

    constructor(n, y, input) {
        this._n = n;
        this._y = y;
        this.input = input;
        this.angle_in = -1;
        this.angle_out = -1;
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

const floating_point = 2;

/**
 * En tant per u.
 * @type {number}
 */
const error_threshold = 0.005;

/* ********** VARIABLES ********** */

// PRINCIPALS

/**
 * Conjunt de Regions del canvas. La mida haurà de ser N+1. On la 0 no es té en compte per dibuixar però si per calcular
 * la y(0) d'inici.
 * @type {Regio[]}
 */
let regions = [];

let snell_y = [];
let snell_angle_in = [];
let snell_angle_out = [];

// SETEJABLES

/**
 * Nombre de regions.
 * @type {number}
 */
let N = 5;

/**
 * Valor màxim del canvi aleatori en y(i).
 * @type {number}
 */
let delta = 10;

/**
 * Angle inicial.
 * @type {number}
 */
let angle_inicial = toRadiants(10);

let y_inicial= canvas_y/2;

/**
 * Amplada de cada Regió.
 * @type {number}
 */
let ampladaRegio = canvas_x;

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
 * Nombre d'iteracions
 * @type {number}
 */
let iteracions = 0;

let values_set = false;

/* ********** FUNCIONS BÀSIQUES P5.JS ********** */

function load_escenari(escenari) {
    if (!confirm("Estàs segur de carregar l'escenari " + escenari + "?")) return;
    switch (escenari) {
        case 0:
            update_regions(4)
            document.getElementById("refraction-1").value = 1;
            document.getElementById("refraction-2").value = 1.33;
            document.getElementById("refraction-3").value = 1.5;
            document.getElementById("refraction-4").value = 1;
            delta = 10;
            angle_inicial = 0;
            y_inicial = canvas_y/2;
            break;
        case 1:
            update_regions(4)
            document.getElementById("refraction-1").value = 1;
            document.getElementById("refraction-2").value = 1;
            document.getElementById("refraction-3").value = 1.5;
            document.getElementById("refraction-4").value = 1.5;
            delta = 10;
            angle_inicial =toRadiants(25);
            y_inicial = 25;
            break;
        case 2:
            update_regions(4)
            document.getElementById("refraction-1").value = 1;
            document.getElementById("refraction-2").value = 1.33;
            document.getElementById("refraction-3").value = 1.9;
            document.getElementById("refraction-4").value = 1;
            delta = 10;
            angle_inicial = toRadiants(25);
            y_inicial = 25;
            break;
        case 3:
            update_regions(9)
            document.getElementById("refraction-1").value = 1;
            document.getElementById("refraction-2").value = 2.41;
            document.getElementById("refraction-3").value = 1;
            document.getElementById("refraction-4").value = 2.41;
            document.getElementById("refraction-5").value = 1;
            document.getElementById("refraction-6").value = 2.41;
            document.getElementById("refraction-7").value = 1;
            document.getElementById("refraction-8").value = 2.41;
            document.getElementById("refraction-9").value = 1;
            delta = 10;
            angle_inicial = toRadiants(33);
            y_inicial = 15;
            break;
        case 4:
            update_regions(13)
            document.getElementById("refraction-1").value = 1;
            document.getElementById("refraction-2").value = 1.33;
            document.getElementById("refraction-3").value = 1.36;
            document.getElementById("refraction-4").value = 1.41;
            document.getElementById("refraction-5").value = 1.46;
            document.getElementById("refraction-6").value = 1.5;
            document.getElementById("refraction-7").value = 1.52;
            document.getElementById("refraction-8").value = 1.6;
            document.getElementById("refraction-9").value = 1.61;
            document.getElementById("refraction-10").value = 1.7;
            document.getElementById("refraction-11").value = 1.81;
            document.getElementById("refraction-12").value = 1.9;
            document.getElementById("refraction-13").value = 2.41;
            delta = 10;
            angle_inicial = toRadiants(33);
            y_inicial = 15;
            break;
        case 5:
            update_regions(6)
            document.getElementById("refraction-1").value = 1;
            document.getElementById("refraction-2").value = 1.33;
            document.getElementById("refraction-3").value = 1.36;
            document.getElementById("refraction-4").value = 1.41;
            document.getElementById("refraction-5").value = 1.46;
            document.getElementById("refraction-6").value = 1.5;
            delta = 40;
            angle_inicial = toRadiants(4);
            y_inicial = 15;
            break;
        case 6: //tarda molt en convergir
            update_regions(10)
            document.getElementById("refraction-1").value = 1.9;
            document.getElementById("refraction-2").value = 2.41;
            document.getElementById("refraction-3").value = 1.9;
            document.getElementById("refraction-4").value = 2.41;
            document.getElementById("refraction-5").value = 1.9;
            document.getElementById("refraction-6").value = 2.41;
            document.getElementById("refraction-7").value = 1.9;
            document.getElementById("refraction-8").value = 2.41;
            document.getElementById("refraction-9").value = 1.9;
            document.getElementById("refraction-10").value = 2.41;
            delta = 5;
            angle_inicial = 0;
            y_inicial = 100;
            break;
        case 7: //aigua i vidre
            update_regions(6)
            document.getElementById("refraction-1").value = 1;
            document.getElementById("refraction-2").value = 1.33;
            document.getElementById("refraction-3").value = 1.5;
            document.getElementById("refraction-4").value = 1.33;
            document.getElementById("refraction-5").value = 1.5;
            document.getElementById("refraction-6").value = 1.33;
            delta = 100;
            angle_inicial = toRadiants(30);
            y_inicial = 0;
            break;
        case 8: //escenari molt gran
            update_regions(30)
            document.getElementById("refraction-1").value = 1;
            document.getElementById("refraction-2").value = 1.33;
            document.getElementById("refraction-3").value = 1.36;
            document.getElementById("refraction-4").value = 1.41;
            document.getElementById("refraction-5").value = 1.46;
            document.getElementById("refraction-6").value = 1.5;
            document.getElementById("refraction-7").value = 1.52;
            document.getElementById("refraction-8").value = 1.6;
            document.getElementById("refraction-9").value = 1.61;
            document.getElementById("refraction-10").value = 1.7;
            document.getElementById("refraction-11").value = 1;
            document.getElementById("refraction-12").value = 1.33;
            document.getElementById("refraction-13").value = 1.36;
            document.getElementById("refraction-14").value = 1.41;
            document.getElementById("refraction-15").value = 1.46;
            document.getElementById("refraction-16").value = 1.5;
            document.getElementById("refraction-17").value = 1.52;
            document.getElementById("refraction-18").value = 1.6;
            document.getElementById("refraction-19").value = 1.61;
            document.getElementById("refraction-20").value = 1.7;
            document.getElementById("refraction-21").value = 1;
            document.getElementById("refraction-22").value = 1.33;
            document.getElementById("refraction-23").value = 1.36;
            document.getElementById("refraction-24").value = 1.41;
            document.getElementById("refraction-25").value = 1.46;
            document.getElementById("refraction-26").value = 1.5;
            document.getElementById("refraction-27").value = 1.52;
            document.getElementById("refraction-28").value = 1.6;
            document.getElementById("refraction-29").value = 1.61;
            document.getElementById("refraction-30").value = 1.7;
            delta = 10;
            angle_inicial = 0;
            y_inicial = 150;
            break;
        case 9: //cada cop medi menys dens
            update_regions(22)
            document.getElementById("refraction-1").value = 2.41;
            document.getElementById("refraction-2").value = 1;
            document.getElementById("refraction-3").value = 1.9;
            document.getElementById("refraction-4").value = 1;
            document.getElementById("refraction-5").value = 1.7;
            document.getElementById("refraction-6").value = 1;
            document.getElementById("refraction-7").value = 1.61;
            document.getElementById("refraction-8").value = 1;
            document.getElementById("refraction-9").value = 1.6;
            document.getElementById("refraction-10").value = 1;
            document.getElementById("refraction-11").value = 1.52;
            document.getElementById("refraction-12").value = 1;
            document.getElementById("refraction-13").value = 1.5;
            document.getElementById("refraction-14").value = 1;
            document.getElementById("refraction-15").value = 1.46;
            document.getElementById("refraction-16").value = 1;
            document.getElementById("refraction-17").value = 1.41;
            document.getElementById("refraction-18").value = 1;
            document.getElementById("refraction-19").value = 1.36;
            document.getElementById("refraction-20").value = 1;
            document.getElementById("refraction-21").value = 1.33;
            document.getElementById("refraction-22").value = 1;
            delta = 1;
            angle_inicial = toRadiants(15);
            y_inicial = 200;
            break;
        default: alert("Escenari no implementat."); return;
    }
    setup_valors();
}

function add_listeners_botons() {
    document.addEventListener("keyup", function(event) {
        if (event.code === "KeyN") update_regions(document.getElementById('N-textbox').children[0].value);
        else if (event.code === "KeyR") setup_valors();
        else if (event.code === "KeyS") start_iterations();
        else if (event.code === "KeyP") pause_iterations();
        else if (event.code === "Space") {
            if (snell_y.length > 0) activat = !activat;
        }
        else if (event.key >= "0" && event.key <= "9" && event.ctrlKey) load_escenari(int(event.key));
    });
    window.addEventListener('keydown', function(e) {
        if(e.code === "Space" && e.target === document.body) {
            e.preventDefault();
        }
    });
}

/**
 * Codi executat una sola vegada a l'inici del programa.
 * Mètode propi de p5.js.
 */
function setup() {
    let canvas = createCanvas(canvas_x, canvas_y);
    canvas.parent("myCanvas");

    crea_N_textbox();
    crea_delta_slider();
    crea_angle_slider();
    crea_y_slider();

    draw_fons();
    display_valors_generics();

    add_listeners_botons();
}

/**
 * Codi executat indefinidament fins que s'atura l'execució del programa,
 * Mètode propi de p5.js
 */
function draw() {
    if (activat && values_set) { //Només fa les iteracions si està activat
        if (get_diferencia_ys() < error_threshold) {
            alert("S'ha convergit!!");
            pause_iterations();
        }
        draw_fons();
        draw_regions();
        draw_trajectoria_llum();
        draw_trajectoria_snell();
        update_trajectoria_step();
        taula();
        display_valors_generics();
        iteracions++;
    }
}

/* ********** MÈTODES CRIDATS PER ELEMENTS VISUALS ********** */

/**
 * Cridat pel boto de SET N.
 */
function update_regions(new_N) {
    if (new_N < 2 || new_N > 100) {
        alert("N out of range [2, 100]!");
        return;
    }
    if (!confirm("Estàs segur d'actualitzar el valor d'N? Perdràs l'execució actual!")) return
    pause_iterations() // para execució
    reset_iteracions(); //reset iteracions
    draw_fons(); // fons blanc

    N = new_N; // actualitzem valor N
    ampladaRegio = canvas_x/N;

    values_set = false;
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
            label.innerHTML = "n" + '<sub>' + i + '</sub>' + ": ";

            let input = document.createElement("input");
            input.setAttribute("type", "number");
            input.setAttribute("id", "refraction-" + i);
            input.setAttribute("min", "1");
            input.setAttribute("step", "0.1");
            input.value = default_n;

            input.style.width = "50px";
            input.style.height = "20px";
            input.style.fontSize = "12px";
            input.style.marginRight = "8px";
            refractionTextboxDiv.appendChild(label);
            refractionTextboxDiv.appendChild(input);

            regions.push(new Regio(default_n, 0, input));
        }
        else regions.push(new Regio(default_n, 0, null,));
    }
    draw_regions(); // redibuixem les regions
    display_valors_generics();
}

function setup_valors() {
    pause_iterations() // para execució
    reset_iteracions(); //reset iteracions

    temps = 0;
    distancia = 0;
    temps_esperat = 0;
    distancia_esperada = 0;
    update_valors_n();

    draw_fons();
    draw_regions();
    const final_y = calcular_tarjectoria_snell();
    setup_random_y_trajectories(final_y);
    draw_trajectoria_snell();
    draw_trajectoria_llum();
    temps = calcular_temps_propagacio_llum();
    distancia = calcular_distancia_calculada();
    taula(); //dibuixem la taula
    reset_iteracions(); //reset iteracions
    display_valors_generics();
    values_set = true;
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

function crea_N_textbox() {
    let textbox = createInput(N.toString(), "number");
    textbox.parent("N-textbox"); // posem el textbox en el contenidor HTML

    textbox.elt.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) update_regions(int(textbox.value()));
    });

    textbox.attribute("min", "2"); // min
    textbox.attribute("max", "200"); // max
    textbox.style("width", "60px");
    textbox.style("height", "35px");
    textbox.style("font-size", "12px");
}

function crea_delta_slider() {
    let slider = createSlider(1, 100, delta);
    slider.class("slider"); // apliquem la classe "slider" de css a l'element slider
    slider.parent("container-delta"); // posem el sliders en el contenidor HTML
    slider.input(() => delta = slider.value()); // actualitzem el valor de regions quan el valor del slider canvia
}

function update_angle(valor) {
    angle_inicial = toRadiants(valor);
    setup_valors();
}

function crea_angle_slider() {
    let slider = createSlider(-90, 90, angle_inicial ,1);
    slider.class("slider"); // apliquem la classe "slider" de css a l'element slider
    slider.parent("container-angle"); // posem el sliders en el contenidor HTML
    slider.input(() => update_angle(slider.value())) // actualitzem el valor de regions quan el valor del slider canvia
}

function update_y_inicial(value) {
    y_inicial = value;
    setup_valors()
}

function crea_y_slider() {
    let slider = createSlider(-canvas_y*0.5, 1.5*canvas_y, y_inicial, 1);
    slider.class("slider"); // apliquem la classe "slider" de css a l'element slider
    slider.parent("container-y"); // posem el sliders en el contenidor HTML
    slider.input(() => update_y_inicial(slider.value())); // actualitzem el valor de regions quan el valor del slider canvia
}


function toDegrees(rad) {
    return rad*180/Math.PI;
}

function toRadiants(deg) {
    return deg*Math.PI/180;
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
        //th.style.minWidth = "50px"; // amplada minima per cada columna
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
            //th.style.minWidth = "100px";
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
        let row4 = document.createElement("tr");
        let row5 = document.createElement("tr");
        let row6 = document.createElement("tr");
        let row7 = document.createElement("tr");

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


        let td4 = document.createElement("td");
        td4.textContent = "Angle incident esperat";
        td4.style.border = "1px solid black";
        td4.style.padding = "8px";
        row4.appendChild(td4);

        let td5 = document.createElement("td");
        td5.textContent = "Angle incident";
        td5.style.border = "1px solid black";
        td5.style.padding = "8px";
        row5.appendChild(td5);

        let td6 = document.createElement("td");
        td6.textContent = "Angle refractat esperat";
        td6.style.border = "1px solid black";
        td6.style.padding = "8px";
        row6.appendChild(td6);

        let td7 = document.createElement("td");
        td7.textContent = "Angle refractat";
        td7.style.border = "1px solid black";
        td7.style.padding = "8px";
        row7.appendChild(td7);

  
        // iterem cada regio i fem celes per cada columna
        for (let i = startRegion; i <= endRegion; i++) {
            let region = regions[i];
    
            let td1 = document.createElement("td");
            td1.textContent = region.n;
            td1.style.border = "1px solid black";
            td1.style.padding = "8px";
            row1.appendChild(td1);
    
            let td2 = document.createElement("td");
            td2.textContent = region.y.toFixed(floating_point);
            td2.style.border = "1px solid black";
            td2.style.padding = "8px";
            row2.appendChild(td2);

            let td3 = document.createElement("td");
            td3.textContent = snell_y[i].toFixed(floating_point);
            td3.style.border = "1px solid black";
            td3.style.padding = "8px";
            row3.appendChild(td3);


            let td4 = document.createElement("td");
            td4.textContent = toDegrees(snell_angle_in[i]).toFixed(floating_point) + "%";
            td4.style.border = "1px solid black";
            td4.style.padding = "8px";
            row4.appendChild(td4);

            let td5 = document.createElement("td");
            td5.textContent = toDegrees(regions[i].angle_in).toFixed(floating_point) + "%";
            td5.style.border = "1px solid black";
            td5.style.padding = "8px";
            row5.appendChild(td5);

            let td6 = document.createElement("td");
            td6.textContent = toDegrees(snell_angle_out[i]).toFixed(floating_point) + "%";
            td6.style.border = "1px solid black";
            td6.style.padding = "8px";
            row6.appendChild(td6);

            let td7 = document.createElement("td");
            td7.textContent = toDegrees(regions[i].angle_out).toFixed(floating_point) + "%";
            td7.style.border = "1px solid black";
            td7.style.padding = "8px";
            row7.appendChild(td7);
        }
    
        tbody.appendChild(row1);
        tbody.appendChild(row2);
        tbody.appendChild(row3);
        tbody.appendChild(row4);
        tbody.appendChild(row5);
        tbody.appendChild(row6);
        tbody.appendChild(row7);

        table.appendChild(tbody);
    
        tableContainer.appendChild(table);
    }
    tableDiv.appendChild(tableContainer);
}
  
  

/* ********** DIBUIXAR EL CANVAS ********** */

/**
 * Dibuixa el fons del canvas.
 */
function draw_fons() {
    background(255);
    stroke(0, 0, 0);
    strokeWeight(3);
    rect(0, 0, width, height);
}


/* Diccionari de parells [n,colorRGB] */
/* https://pixelandpoly.com/ior.html */
const refraction_colors = {
    1.0 : [255,255,255], // aire
    1.33: [35,137,214],  // aigua
    1.5: [168,254,255],  // vidre
    2.41: [203,227,240], // diamant
    1.52: [0, 204, 0],   // esmeralda
    1.4: [255, 0, 0],    // rubi
    1.7: [255, 153, 0],  // topazi
    1.46: [8, 37, 103],  // safir
    1.6: [128, 0, 128],  // ametista (lila clar)
    1.9: [255, 0, 255],  // perla (magenta)
    1.61: [255, 255, 0], // sulfur d'arsènic (groc)
    1.81: [255,217,103], // pirita (groc claret)
    1.36: [226,234,209]  // acetona
}

/* Donada una clau (n), retorna el color associat en RGB del diccionari refraction_color */
function index2color(refractiveIndex) {
    const color = refraction_colors[refractiveIndex];

    if (color) {
        return color;
    } else {
        return [230,230,230]; //no hi ha l'índex al diccionari
    }
}

/**
 * Dibuixem les N regions uniformes on calculem la coordenada x de cada regió en funció del seu índex
 */
function draw_regions() {
    stroke(0,0,0,100);
    strokeWeight(1);

    for (let i = 1; i <= N; i++) {
        let x = map(i-1, 0, N, 0, width);
        line(x, 0, x, height);

        let n = regions[i]._n;
        let color = index2color(n);
        fill(color[0], color[1], color[2]);
        rect(x, 0, ampladaRegio, height);
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
    snell_angle_in = [];
    snell_angle_out = [];

    distancia_esperada = 0;
    temps_esperat = 0;

    let angle_anterior = angle_inicial;
    let y_anterior = y_inicial;
    snell_y.push(y_anterior);
    snell_angle_in.push(-1);
    snell_angle_out.push(-1);

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
        snell_y.push(y_anterior);


        snell_angle_in.push(angle_anterior);
        snell_angle_out.push(angle_nou);
        angle_anterior=angle_nou;
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
    document.getElementById("angle").innerHTML = (toDegrees(angle_inicial)).toFixed(floating_point);
    document.getElementById("y").innerHTML = y_inicial;

    document.getElementById("iterations").innerHTML = iteracions;

    document.getElementById("temps").innerHTML = temps.toFixed(floating_point);
    document.getElementById("distancia").innerHTML = distancia.toFixed(floating_point);

    document.getElementById("temps-esperat").innerHTML = temps_esperat.toFixed(floating_point);
    document.getElementById("distancia-esperada").innerHTML = distancia_esperada.toFixed(floating_point);

    document.getElementById("dif-temps-rel").innerHTML = (get_diferencia_temps_relatiu()*100).toFixed(floating_point)+ "%";
    document.getElementById("dif-distancia-rel").innerHTML = (get_diferencia_dist_relatiu()*100).toFixed(floating_point)+ "%"
    document.getElementById("dif-ys").innerHTML = (get_diferencia_ys()*100).toFixed(floating_point)+ "%"
}

function get_diferencia_temps_relatiu(){
    if (distancia_esperada === 0) return null;
    return (Math.abs(temps_esperat-temps))/(temps_esperat);
}

function get_diferencia_dist_relatiu(){
    if (distancia_esperada === 0) return null;
    return (Math.abs(distancia_esperada-distancia))/(distancia_esperada);
}

function get_diferencia_ys(){
    if (snell_y.length <= 0) return null;
    let d = 0;
    for (let i = 1; i < N; i++) {
        d += Math.abs(regions[i].y-snell_y[i])/canvas_y;
    }
    return d/N;
}

//Inicialitzem les coordenades y aleatòriament
function setup_random_y_trajectories(final_y) {
    regions[0]._y = y_inicial;
    for (let i = 1; i < N; i++) {
        regions[i]._y = random(height); //update dels objectes (en teoria va)
    }
    regions[N]._y = final_y;
    calcular_angles_regions();
}

function get_angle_out_regio(i) {
    let y1 = regions[i - 1].y;
    let y2 = regions[i].y;
    let dy = y2 - y1;
    return Math.abs(Math.atan(dy / ampladaRegio));
}

function calcular_angles_regions() {
    for (let i = 1; i < N; i++) {
        if (i === 1) regions[i].angle_in = Math.abs(angle_inicial);
        else regions[i].angle_in = Math.abs(regions[i-1].angle_out);
        regions[i].angle_out = get_angle_out_regio(i);
    }
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


/**
 * Aplica un canvi de màxim delta sobre una y d'una regió aleatoria només si millora el temps de propagació total.
 */
function update_trajectoria() {

    const t_actual = calcular_temps_propagacio_llum();

    //Ys de les regions
    let y_noves = [];
    regions.forEach((element) => {
        y_noves.push(element.y);
    });

    const i = floor(random(1, N));//REGIÓ CANVIADA
    let dy = random(-delta, delta);//CANVI
    y_noves[i] += dy;

    //CALCULAR nou temps, s'hauria de cridar l'altre funció
    let t_nova = 0;
    for (let i = 0; i < N; i++) {
        let dx = dist(i, y_noves[i], i + ampladaRegio, y_noves[i + 1]); //distancia euclidea entre regió i-i+1
        t_nova += dx / regions[i+1].v;
    }

    if (t_nova < t_actual) {
        regions[i]._y += dy;

        regions[i].angle_out = get_angle_out_regio(i);
        if (i+1 <= N) {
            regions[i+1].angle_in = regions[i].angle_out;
            regions[i+1].angle_out = get_angle_out_regio(i+1);
        }
        if (i+2 <= N) {
            regions[i+2].angle_in = regions[i+1].angle_out;
        }

        temps = t_nova;
        distancia = calcular_distancia_calculada();
        return true;
    }
    return false;
}

function update_trajectoria_step() {
    let done = update_trajectoria();
    while(!done) {
        done = update_trajectoria();
    }
}