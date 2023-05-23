
/* CLASSES */
class Regio {
    n;
    y;
    v; //TODO: segurament pot ser calculada


    /* CONSTRUCTORS */

    constructor(n, y, v) {
        this._n = n;
        this._y = y;
        this._v = v;
    }

    /* GETTERS */

    get n() {
        return this._n;
    }

    get y() {
        return this._y;
    }

    get v() {
        return this._v;
    }

    //TODO: funció per obtenir coordenades de N donada les anteriors

}

/* CONSTANTS */

/**
 * Velocitat de la llum en el buit.
 * @type {number}
 */
const c = 1;

/**
 * Amplada de cada Regió.
 * @type {number}
 */
const ampladaRegio = 1;


/* VARIABLES */

/**
 * Valor màxim del canvi aleatori en y(i).
 * @type {number}
 */
let delta = 20;

/**
 * Nombre de regions.
 * @type {number}
 */
let N = 10;


//TODO: fer servir array d'objectes
let y = []; // Coordenades aleatòries y de la trajectòria

//TODO: això estarà a dintre dels objectes
let n1, n2; // Índexs de refracció dels medis
let v1, v2; // Velocitat propagació de la llum en el dos medis






//Setegem paràmetres de l'experiment
function setParameters(index1, index2) {
    n1 = index1; // índex refracció primer medi
    n2 = index2; // Índex de refracció segon medi
    v1 = c / n1; // Velocitat propagació de la llum en el primer medi
    v2 = c / n2; // Velocitat propagació de la llum en el segon medi
}

function apartat_a() {
    setParameters(1, 1.5);
}
  
function apartat_b() {
    setParameters(1.5, 1.33);
}

function color_linies(red, green, blue) {
    stroke(red, green, blue)
}


function amplada_linies(amplada_pixels) {
    strokeWeight(amplada_pixels);
}


function draw_canvas_vora() { 
    amplada_linies(3);
    color_linies(0, 0, 0);

    rect(0, 0, width, height);
}


function print_y_valors() {
    let yValuesDiv = document.getElementById("yValues");
    yValuesDiv.innerHTML = "valors de y: " + y.join(", ");
}


//Inicialitzem les coordenades y aleatòriament
function setup_random_y_trajectories() {
    for (let i = 0; i <= N; i++) {
        y[i] = random(height); // fem servir com alçada la mida del canvas
    }
    print_y_valors();
}


function update_regions(value) {
    N = value; // actualitzem valor N
    setup_random_y_trajectories(); // Actualitzem el valor de les trajectories random basades en la nova N
    draw_regions(); // redibuixem les regions
}


function crea_N_slider() {
    let slider = createSlider(1, 20, N);
    slider.parent("container-slider"); // posem el sliders en el contenidor HTML
    slider.input(() => update_regions(slider.value())); // actualitzem el valor de regions quan el valor del slider canvia
}

//Dibuixem les N regions uniformes on calculem la coordenada x de cada regió en funció del seu índex
function draw_regions() {
    color_linies(0,0,0);
    amplada_linies(2);

    for (let i = 1; i < N; i++) {
        //map(valor a convertir, limit inf rang actual, limit sup rang actual, 
        //limit inf rang desitjat, limit sup rang desitjat)
        let x = map(i, 0, N, 0, width); //calculem on hem de partir les regions en base a la mida del canvas
        line(x, 0, x, height); //line: traça linia entre dos punts line(x1,y1,x2,y2)
    }
}

// Dibuixem la trajectòria de la llum
function trajectoria_llum() {
    color_linies(255,125,0);
    amplada_linies(3);

    for (let i = 0; i < N; i++) {
        let x1 = map(i, 0, N, 0, width);
        let x2 = map(i + 1, 0, N, 0, width);
        line(x1, y[i], x2, y[i + 1]);
    }
}


// Cal minimitzar aquesta funció que calcula el temps de propagació de la llum
function calcular_temps_propagacio_llum() {
    let t = 0;
    for (let i = 0; i < N; i++) {
      let dx = dist(i, y[i], i + 1, y[i + 1]); //distancia euclidea entre regió i-i+1
      let v = (i < N-1) ? v1 : v2; //tots els índexs són uniformes i son n1, menys el darrer que és n2
      t += dx / v;
    }
    return t;
}


//Fem un canvi random en les y en una regió i actualitzem el temps de propagació
/*Es considera una i a l’atzar (0<i<N) i es fa un canvi aleatori en el valor de y(i) entre -delta i +delta. */
//Calculeu si aquest canvi fa disminuir el temps que triga la llum. 
function random_canvi_y() {
    let y_noves = y.slice(); // copia l'array de les y en un nou array coordenades actuals
    let i = floor(random(1, N)); // escollim una regió aleatòriament
    
    let trobat = false;
    while (!trobat) {
        let dy = random(-delta, delta); // calculem un canvi aleatori en y(i)
        if (dy+y_noves[i] >= 0 && dy+y_noves[i] <= height) {
            y_noves[i] += dy;
            trobat = true;
        }
    }

    let t_update = 0;
    for (let j = 0; j < N; j++) {
        let dx = dist(j, y_noves[j], j + 1, y_noves[j + 1]);
        let v = (j < N-1) ? v1 : v2;
        t_update += dx / v;
    }
    return [t_update,y_noves];
}


//Calculeu si aquest canvi fa disminuir el temps que triga la llum. 
//En cas afirmatiu, accepteu el canvi i continueu el procés.*/
function calcular_trajectoria() { 
    let t_prop = calcular_temps_propagacio_llum();
    let t_prop_nou = random_canvi_y()[0];
    let y_noves = random_canvi_y()[1];

    //comprobem si el nou canvi disminueix el temps de propagació
    if (t_prop_nou < t_prop) {
        y = y_noves.slice(); // acceptem el canvi
    }
}


/**
 * Codi executat una sola vegada a l'inici del programa.
 * Mètode propi de p5.js.
 */
function setup() {
    var canvas = createCanvas(800, 400);
    canvas.parent("myCanvas");

    apartat_a();
    setup_random_y_trajectories();
    crea_N_slider();
}


/**
 * Codi executat indefinidament fins que s'atura l'execució del programa,
 * Mètode propi de p5.js
 */
function draw() {
    background(255);
    
    draw_canvas_vora();
    draw_regions();
    trajectoria_llum();

    calcular_trajectoria();
}
