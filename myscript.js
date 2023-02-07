var target;
var population;
var lifespan = 400;
var count = 0;
var maxforce = 0.2;
var lifeP, maxFitP;
var rx = 125;
var ry = 350;
var rw = 250;
var rh = 10;

//experiment
var deaths = 0;

function setup() {
    createCanvas(500,600);
    target = createVector(width/2, 40);
    population = new Population();
    lifeP = createP();
    maxFitP = createP();
}

function draw() {
    background(0);

    count++;
    lifeP.html(count);
    
    population.run();

    if (count == lifespan) {
        count = 0;
        population.evaluate();
        population.naturalSelection();
    }

    fill(color("green"));
    square(target.x, target.y, 20);
    fill(color("white"));
    rect(125, 350, 250, 10);
}

function Population() {
    this.rockets = [];
    this.popsize = 20;
    this.matingPool = [];

    for (var i = 0; i < this.popsize; i++) {
        this.rockets[i] = new Rocket();
    }

    this.evaluate = function(){
        this.matingPool = [];

        var maxFit = 0;
        for (var i = 0; i < this.popsize; i++) {
            this.rockets[i].calcFitness();
            if (this.rockets[i].fitness > maxFit) {
                maxFit = this.rockets[i].fitness;
                //maxfit será a maior fitness
            }
        }

        maxFitP.html(maxFit);

        for (var i = 0; i < this.popsize; i++) {
            this.rockets[i].fitness /= maxFit;
        }

        for (var i = 0; i < this.popsize; i++){
            var num = this.rockets[i].fitness * 100;
            for (var j = 0; j < num; j++){
                this.matingPool.push(this.rockets[i]);
            }
        }
    }

    this.naturalSelection = function() {
        var newpop = [];
        for (var i = 0; i<this.popsize; i++){
            var parentA = random(this.matingPool);
            var parentB = random(this.matingPool);
            var child = parentA.dna.crossover(parentB.dna);
            child.mutation();
            newpop[i] = new Rocket(child);
        }

        this.rockets = newpop; //careful
    }

    this.run = function() {
        for (var i = 0; i < this.popsize; i++) {
            this.rockets[i].updateMov();
            this.rockets[i].show();
        }
    }
}

function Rocket(dna) {
    this.pos = createVector(width/2, height);
    this.acc = createVector();
    this.vel = createVector();
    this.fitness = 0;
    this.completed = false;
    this.crashed = false;

    if (dna) {
        this.dna = dna;
    } else {
        this.dna = new DNA();
    }

    //movimento
    this.applyForce = function(force) {
        this.acc.add(force);
    }

    this.updateMov = function() {
        var distance = dist(this.pos.x, this.pos.y, target.x, target.y);
        if (distance < 25) {
            this.completed = true;
            this.pos = target.copy();
        }

        //crashed situations
        if (this.pos.x > rx && this.pos.x < rx + rw && this.pos.y > ry && this.pos.y < ry + rh){
            this.crashed = true;
            deaths += 1;
        }
        if (this.pos.x > width || this.pos.x < 0 || this.pos.y < 0 || this.pos.y > height){
            this.crashed = true;
            deaths += 1;
        }

        this.applyForce(this.dna.genes[count]);
        if (!this.completed && !this.crashed) {
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);
        }

        //experiment
        if (deaths == popsize){
            count = lifespan;
        }
    }

    //genetic algorithm
    this.calcFitness = function(){
        var distance = dist(this.pos.x, this.pos.y, target.x, target.y);
        this.fitness = map(distance, 0, width, width, 0);

        if (this.completed){
            this.fitness *= 5;
        }
        if (this.crashed) {
            this.fitness *= 0.5;
        }
    }

    this.show = function() {
        push();
        translate(this.pos.x, this.pos.y);
        noStroke();
        fill(color("#1B88CC"));
        circle(0, 0, 10);
        pop();
    }
}

function DNA(genes){
    if (genes) {
        this.genes = genes;
    } else {
        this.genes = [];
        for (var i = 0; i < lifespan; i++){
            this.genes[i] = p5.Vector.random2D();
            this.genes[i].setMag(maxforce);
        }
    }

    this.crossover = function(partner) {
        var newgenes = [];
        var mid = floor(random(this.genes.length));

        for(var i = 0; i < this.genes.length; i++){
            if (i < mid){
                newgenes[i] = this.genes[i];
            } else {
                newgenes[i] = partner[i];
            }
        }

        return new DNA(newgenes); //careful
    }

    this.mutation = function() { //careful
        for (var i = 0; i < this.genes.length; i++){
            if (random(1) < 0.01){
                this.genes[i] = p5.Vector.random2D();
                this.genes[i].setMag(maxforce);
            }
        }
    }

}