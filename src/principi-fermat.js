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

/**
 * Indica si s'ha de pintar o no.
 * @type {boolean}
 */
let activat = false;
/**
 * Valor màxim del canvi aleatori en y(i).
 * @type {number}
 */
let delta = 10;

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

//TODO: store values of y and avoid calculating it every draw function
let snell_y = [];

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
    let canvas = createCanvas(canvas_x, canvas_y);
    canvas.parent("myCanvas");

    crea_N_textbox();
    crea_delta_slider();

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
        draw_trajectoria_snell();
        //taula();
        calcular_trajectoria();

        display_iteracions();
        display_temps_propagacio_calculat();
        display_trajectoria_calculada();

        iteracions++;
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
    ampladaRegio = canvas_x/N;

    regions = [] //fem que l'array de regions torni a tenir els valor correctes

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
}


function update_valors_n() {
    for (let i = 1; i <= N; i++) {
        regions[i].update_n_value;
    }
}

//TODO: ACABAR, hauria de resetejar valors a aleatoris
function setup_valors() {
    update_valors_n();

    draw_canvas_vora();
    draw_regions();
    final_y = draw_trajectoria_snell();
    setup_random_y_trajectories(final_y);
    draw_trajectoria_llum();

    reset_iteracions(); //reset iteracions
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
        line(x1, regions[i].y, x2, regions[i+1].y);
    }
}

/**
 * Dibuixa la trajectòria de Snell de la llum
 */
function draw_trajectoria_snell() {
    stroke(0, 255, 0);
    strokeWeight(3)


    let angle_anterior = PI/8;
    let y_anterior = regions[0].y;

    for (let i = 1; i <= N; i++) {
        let x1 = map(i-1, 0, N, 0, width);
        let x2 = map(i, 0, N, 0, width);

        let n_anterior = regions[i-1].n;
        let n = regions[i].n;


        let angle_nou = asin((n_anterior / n) * sin(angle_anterior));
        let y_nova = y_anterior + ampladaRegio * tan(angle_nou);

        line(x1, y_anterior, x2, y_nova);

        y_anterior = y_nova;
        angle_anterior=angle_nou;
    }
    return y_anterior;
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
function setup_random_y_trajectories(final_y) {
    for (let i = 1; i < N; i++) {
        regions[i]._y = random(height); //update dels objectes (en teoria va)
    }
    regions[N]._y = final_y;
}


function update_delta(value) {
    delta = value; // actualitzem valor delta
    //setup_random_y_trajectories(); // Actualitzem el valor de les trajectories random basades en la nova N
    calcular_trajectoria();
    draw_regions(); // redibuixem les regions
    reset_iteracions(); //resetem iteracions
}


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
        let dx = dist(i, regions[i].y, i + 1, regions[i + 1].y);
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

        temps_propagacio_total = t_prop_nou;
        distancia_total_calculada = calcular_distancia_calculada();
    }
}