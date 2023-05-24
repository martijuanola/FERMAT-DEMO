//Constants
let N = 10; // Nombre de regions incial
let n1, n2; // Índexs de refracció dels medis
let v1, v2; // Velocitat propagació de la llum en el dos medis
let delta = 20; // delta := valor màxim del canvi random en y(i) inicial
let c = 1; //Velocitat de la llum

let y = []; // Coordenades aleatòries y de la trajectòria

//Setegem paràmetres de l'experiment
function setParameters(index1, index2) {
    n1 = index1; // índex refracció primer medi
    n2 = index2; // Índex de refracció segon medi
    v1 = c / n1; // Velocitat propagació de la llum en el primer medi
    v2 = c / n2; // Velocitat propagació de la llum en el segon medi
}

//Valors genèrics
let iteracions = 0;
let temps_propagacio_total = 0; 
let distancia_total_calculada = 0; 


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
    }
    print_y_valors();
}


function update_regions(value) {
    N = value; // actualitzem valor N
    setup_random_y_trajectories(); // Actualitzem el valor de les trajectories random basades en la nova N
    draw_regions(); // redibuixem les regions
    reset_iteracions(); //resetem iteracions
}


function update_delta(value) {
    delta = value; // actualitzem valor delta
    setup_random_y_trajectories(); // Actualitzem el valor de les trajectories random basades en la nova N
    calcular_trajectoria(); 
    draw_regions(); // redibuixem les regions
    reset_iteracions(); //resetem iteracions
}


function crea_N_textbox() {
    let textbox = createInput(N.toString(), "number");
    textbox.parent("container-slider"); // posem el textbox en el contenidor HTML
    textbox.input(() => update_regions(int(textbox.value()))); // actualitzem el valor de regions quan el valor del textbox canvia
}


function crea_delta_slider() {
    let slider = createSlider(5, 50, delta);
    slider.parent("container-delta"); // posem el sliders en el contenidor HTML
    slider.input(() => update_delta(slider.value())); // actualitzem el valor de regions quan el valor del slider canvia
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
    let i = floor(random(1, N)); // escollim una regió aleatoriament
    
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


function setup() {
    var canvas = createCanvas(800, 400);
    canvas.parent("myCanvas");

    apartat_a();
    setup_random_y_trajectories();
    crea_N_textbox();
    crea_delta_slider();
}


function draw() {
    background(255);
    
    draw_canvas_vora();
    draw_regions();
    trajectoria_llum();
    print_y_valors();
    calcular_trajectoria();
    display_iteracions();
    display_temps_propagacio_calculat();
    display_trajectoria_calculada();
}