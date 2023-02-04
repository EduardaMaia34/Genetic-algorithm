//global var 
var population;
var lifespan = 200;
var count = 0;
var lifeP;
var target;

function setup() {
    createCanvas(500,600);
    population = new Population();
    lifeP = createP();
    target = createVector(width/2, 40);
}

function draw() {
    background(0);
    population.run();
    
    lifeP.html(count);
    count++;

    if (count == lifespan){
        population.evaluate();
        population.naturalSelection();
        count= 0;
    }

    fill(color("green"));
    square(target.x, target.y, 20);
}


function DNA(code) {

    //optional
    if (code){
        this.genes = code;
    } else {
        this.genes = [];
        for (var i = 0; i < lifespan; i++){
            this.genes[i] = p5.Vector.random2D();
            this.genes[i].setMag(0.5); //vel do gene
        }
    }
    
    this.crossover = function(partner) {
        var newgenes = [];
        var mid = floor(random(this.genes.length));

        for (var i = 0; i < this.genes.length; i++){
            if (i>mid){
                newgenes[i] = this.genes[i];
            } else {
                newgenes[i] = partner.genes[i];
            }
        }

        return new DNA(newgenes);
    }
}

function Population() {
    this.rockets = [];
    this.popsize = 20;
    this.matingPool = [];

    for (var i = 0; i < this.popsize; i++) {
      this.rockets[i] = new Rocket();  
    }

    this.evaluate = function(){ //passar por cada rocket e calcular fitness
        var maxFit = 0;

        for (var i = 0; this.popsize > i; i++){
            this.rockets[i].calcFitness();
            if (this.rockets[i].fitness > maxFit){
                maxFit = this.rockets[i].fitness;
            }
        }
    }

    for (var i = 0; i < this.popsize; i++) {
        this.rockets[i].fitness /= maxFit;
    }

    //ERRO
    this.matingPool = [];
    for (var i = 0; i < this.popsize; i++) {
        var n = this.rockets[i].fitness * 100;
        for (var j = 0; j<n; j++) {
            this.matingPool.push(this.rockets[i]);
        }
    }
    //ERRO
    this.naturalSelection = function() {
        var newpop = [];
        for (var i = 0; i < this.rockets.length; i++){
            var parentA = random(this.matingPool).dna;
            var parentB = random(this.matingPool).dna;
            var child = parentA.crossover(parentB);
            newpop[i] = new Rocket(child)
        }

        this.rockets = newpop;
    }

    this.run = function() {
        for (var i = 0; i < this.popsize; i++){
            this.rockets[i].updateMoviment();
            this.rockets[i].show();
        }
    }
    
}

function Rocket(dna) {
    this.pos = createVector(width/2, height);
    this.vel = createVector();
    this.acc = createVector();

    //optional
    if (dna) {
        this.dna = dna;
    } else {
        this.dna = new DNA();
    }

    this.fitness = 0;

    this.applyForce = function(force) {
        this.acc.add(force);
    }
    
    this.updateMoviment = function() { //movimento do foguete

        this.applyForce(this.dna.genes[count]);

        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    this.show = function() {
        push();
        translate(this.pos.x, this.pos.y);
        noStroke();
        fill(color("#1B88CC"));
        circle(0, 0, 10);
        pop();
    }

    this.calcFitness = function() {
        var d = dist(this.pos.x, this.pos.y, target.x, target.y);

        this.fitness = 1/d;
    }
}