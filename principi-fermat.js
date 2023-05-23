//Constants
let N = 10; // Nombre de regions
let n1, n2; // Índexs de refracció dels medis
let v1, v2; // Velocitat propagació de la llum en el dos medis
let delta = 0.1; // delta := valor màxim del canvi random en y(i)

let y = []; // Coordenades aleatòries y de la trajectòria


//Setegem paràmetres de l'experiment
function setParameters(index1, index2) {
    n1 = index1; // índex refracció primer medi
    n2 = index2; // Índex de refracció segon medi
    v1 = 1 / n1; // Velocitat propagació de la llum en el primer medi
    v2 = 1 / n2; // Velocitat propagació de la llum en el segon medi
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

//Dibuixem les N regions uniformes on calculem la coordenada x de cada regió en funció del seu índex
function draw_regions() {
    color_linies(0,0,0);
    amplada_linies(2);

    for (let i = 1; i < N; i++) {
        //map(valor a convertir, limit inf rang actual, limit sup rang actual, limit inf rang desitjat, limit sup rang desitjat)
        let x = map(i, 0, N, 0, width); //calculem on hem de partir les regions en base a la mida del canvas
        line(x, 0, x, height); //line: traça linia entre dos punts line(x1,y1,x2,y2)
    }
}

//Inicialitzem les coordenades y aleatòriament
function setup_random_y_trajectories() {
    for (let i = 0; i <= N; i++) {
        y[i] = random(height); // fem servir com alçada la mida del canvas
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

function setup() {
    var canvas = createCanvas(800, 400);
    canvas.parent("myCanvas");

    apartat_a();
    setup_random_y_trajectories();
}


function draw() {
    background(255);
    
    draw_canvas_vora();
    draw_regions();
    trajectoria_llum();
}
