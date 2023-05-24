
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
     * Velocitat de propagació de la llum uniforme en la regió.
     */
    _v; //TODO: segurament pot ser calculada


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

/* ********** CONSTANTS ********** */

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


/* ********** VARIABLES ********** */

/**
 * Indica si s'ha de pintar o no.
 * @type {boolean}
 */
let activat = false;
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

//TODO: pot ser una funció
let temps_propagacio_total = 0;

//TODO: pot ser una funció
let distancia_total_calculada = 0;



/**
 * Conjunt de Regions del canvas. La mida haurà de ser N+1. On la 0 no es té en compte per dibuixar però si per calcular
 * la y(0) d'inici.
 * @type {*[]}
 */
let regions = [];

//TODO: fer servir array d'objectes
let y = []; // Coordenades aleatòries y de la trajectòria

//TODO: això estarà a dintre dels objectes
let n1, n2; // Índexs de refracció dels medis
let v1, v2; // Velocitat propagació de la llum en el dos medis


/* ********** FUNCIONS BÀSIQUES P5.JS ********** */

/**
 * Codi executat una sola vegada a l'inici del programa.
 * Mètode propi de p5.js.
 */
function setup() {
    let canvas = createCanvas(800, 400);
    canvas.parent("myCanvas");

    crea_N_textbox();
    //crea_delta_slider();
    //Settejar valors inicial de les diferents n(i)
    for (let i = 0; i <= N; i++) {
        let n = 1;
        let y_reg = y[i]; 
        let v = c / n;
    
        let region = new Regio(n, y_reg, v);
        regions.push(region);
    }

    update_regions();
    
    apartat_a(); //S'haurà de borrar.
    setup_random_y_trajectories();
    draw_canvas_vora();
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
        print_y_valors();
        calcular_trajectoria();
        display_iteracions();
        display_temps_propagacio_calculat();
        display_trajectoria_calculada();
    }
}

/* ********** MÈTODES CRIDATS PER ELEMENTS VISUALS ********** */

function set_next_N(value) {
    next_N = value; // actualitzem valor N
}

/**
 * Cridat pel boto de SET N.
 * @param value
 */
function update_regions() {
    pause_iterations() // para execució
    reset_iteracions(); //reset iteracions
    draw_canvas_vora(); // fons blanc

    N = next_N; // actualitzem valor N

    regions = [] //fem que l'array de regions torni a tenir els valor correctes
    for (let i = 0; i <= N; i++) {
        let n = 1;
        let y_reg = y[i];
        let v = c / n;
  
        let region = new Regio(n, y_reg, v);
        regions.push(region);
    }
    crea_refraction_textboxes(); //crea els textboxes dels indexs
    setup_random_y_trajectories(); //actualitzem els valor de y dels objectes Regió

    draw_regions(); // redibuixem les regions
}

function crea_refraction_textboxes() {
    let refractionTextboxDiv = document.getElementById("refraction-textboxes");
    refractionTextboxDiv.innerHTML = "";

    for (let i = 1; i <= N; i++) {
        let label = document.createElement("label");
        label.setAttribute("for", "refraction-" + i);
        label.innerText = "n" + i + ": ";

        let input = document.createElement("input");
        input.setAttribute("type", "number");
        input.setAttribute("id", "refraction-" + i);
        input.setAttribute("min", "1");
        input.setAttribute("step", "0.1");

        input.style.width = "50px";
        input.style.height = "20px";
        input.style.fontSize = "12px";

        refractionTextboxDiv.appendChild(label);
        refractionTextboxDiv.appendChild(input);
    }
}
  

//TODO: ACABAR, hauria de resetejar valors a aleatoris
function setup_valors() {
    console.log("SETUP");
    setup_random_y_trajectories();
    draw_canvas_vora();
    draw_regions();
    draw_trajectoria_llum();
    print_y_valors();
    crea_refraction_textboxes();
    reset_iteracions(); //reset iteracions
    console.log(regions);
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

//TODO: solucionar problema quan s'envia un 0
function crea_N_textbox() {
    let textbox = createInput(N.toString(), "number");
    textbox.parent("N-textbox"); // posem el textbox en el contenidor HTML
    textbox.input(() => set_next_N(int(textbox.value()))); // actualitzem el valor de regions quan el valor del textbox canvia

    textbox.style("width", "50px");
    textbox.style("height", "20px");
    textbox.style("font-size", "12px");
}

function crea_delta_slider() {
    let slider = createSlider(5, 50, delta);
    slider.parent("container-delta"); // posem el sliders en el contenidor HTML
    slider.input(() => update_delta(slider.value())); // actualitzem el valor de regions quan el valor del slider canvia
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

//TODO: s'haurà de canviar per evitar processar la primera regió
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

//TODO: s'haurà de canviar per evitar processar la primera regió
/**
 * Dibuixem la trajectòria de la llum
 */
function draw_trajectoria_llum() {
    stroke(255,125,0);
    strokeWeight(3);

    for (let i = 0; i < N; i++) {
        let x1 = map(i, 0, N, 0, width);
        let x2 = map(i + 1, 0, N, 0, width);
        line(x1, y[i], x2, y[i + 1]);
    }
}


/* ********** ALTRES ********** */


//TODO: will be deprecated
//Setegem paràmetres de l'experiment
function setParameters(index1, index2) {
    n1 = index1; // índex refracció primer medi
    n2 = index2; // Índex de refracció segon medi
    v1 = c / n1; // Velocitat propagació de la llum en el primer medi
    v2 = c / n2; // Velocitat propagació de la llum en el segon medi
}

//TODO: will be deprecated
function apartat_a() {
    setParameters(1, 1.5);
}

//TODO: will be deprecated
function apartat_b() {
    setParameters(1.5, 1.33);
}


//--------------------------------------------------

function print_y_valors() {
    let yValuesDiv = document.getElementById("yValues");
    yValuesDiv.innerHTML = ""; // eliminem els y valors anteriors

    let ul = document.createElement("ul");

    for (let i = 0; i <= N; i++) {
      let li = document.createElement("li");
      li.innerHTML = "y[" + i + "]: " + y[i].toFixed(7);
      ul.appendChild(li);
    }

    yValuesDiv.appendChild(ul);
}


function display_iteracions() {
    let iterationsDiv = document.getElementById("iterations");
    iterationsDiv.innerHTML = "Iteracions: " + iteracions;
}

function reset_iteracions() {
    iteracions = 0;
    display_iteracions();
}


function display_temps_propagacio_calculat() {
    let tempsDiv = document.getElementById("temps-prop-calculat");
    tempsDiv.innerHTML = "Temps de propagació calculat: " + temps_propagacio_total;
}


function display_trajectoria_calculada() {
    let distanciaDiv = document.getElementById("distancia-calculada");
    distanciaDiv.innerHTML = "Trajectòria calculada de la llum: " + distancia_total_calculada;
}


//Inicialitzem les coordenades y aleatòriament
function setup_random_y_trajectories() {
    for (let i = 0; i <= N; i++) {
        y[i] = random(height); // fem servir com alçada la mida del canvas
        regions[i]._y = y[i]; //update dels objectes (en teoria va)
    }
    print_y_valors();
}


function update_delta(value) {
    delta = value; // actualitzem valor delta
    setup_random_y_trajectories(); // Actualitzem el valor de les trajectories random basades en la nova N
    calcular_trajectoria();
    draw_regions(); // redibuixem les regions
    reset_iteracions(); //resetem iteracions
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


// Funcio que calcula la distància total de propagació de la llum
function calcular_distancia_calculada() {
    let distancia = 0;
    for (let i = 0; i < N; i++) {
        let dx = dist(i, y[i], i + 1, y[i + 1]);
        distancia += dx;
    }
    return distancia;
}


//Fem un canvi random en les y en una regio i acualitzem el temps de propagació
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
    iteracions++;
    let t_prop = calcular_temps_propagacio_llum();
    let [t_prop_nou, y_noves] = random_canvi_y();

    //comprobem si el nou canvi disminueix el temps de propagació
    if (t_prop_nou < t_prop) {
        y = y_noves.slice(); // acceptem el canvi
        temps_propagacio_total = t_prop_nou;
        distancia_total_calculada = calcular_distancia_calculada();
    }
}