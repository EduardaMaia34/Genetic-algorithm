var target;
var count = 0;
var lifespan = 250;
var population;
var lifeP, maxFitP, distP;

function setup() {
    createCanvas(500,600);
    target = createVector(width/2, 40);
    lifeP = createP();
    maxFitP = createP();
    population = new Population();
}

function draw() {
    background(0);
    population.run();

    count++;
    lifeP.html(count);

    if (count == lifespan){
        
        count = 0;
        population.evaluate();
        population.naturalSelection();
    }

    fill(color("green"));
    square(target.x, target.y, 20);
}


function Population(){
    this.rockets = [];
    this.popsize = 20;
    this.matingPool = [];
    
    for (var i = 0; i < this.popsize; i++){
        this.rockets[i] = new Rocket();
    }


    this.evaluate = function(){

        this.matingPool = [];

        //normalize fitness values
        var maxFit = 0;
        for (var i = 0; i < this.popsize; i++) {
            this.rockets[i].calcFitness();
            if (this.rockets[i].fitness > maxFit) {
                maxFit = this.rockets[i].fitness;
            }
        }

        maxFitP.html(maxFit);

        //createP(maxFit);
        //console.log(maxFit);

        for (var i = 0; i < this.popsize; i++) {
            this.rockets[i].fitness /= maxFit;
        }

        this.matingPool = []
        for (var i = 0; i < this.popsize; i++) {
            var n = this.rockets[i].fitness * 100;
            for (var j = 0; j < n; j++){
                this.matingPool.push(this.rockets[i]);
            }
        }
    }


    this.naturalSelection = function() {
        var newpop = [];
        for (var i = 0; i < this.rockets.length; i++){
            var parentA = random(this.matingPool);
            var parentB = random(this.matingPool);
            var child = parentA.dna.crossover(parentB.dna);
            child.mutation();
            newpop[i] = new Rocket(child);
        }

        this.rockets = newpop;
        
    }

    this.run = function() {
        for (var i = 0; i < this.popsize; i++){
            this.rockets[i].updateMov();
            this.rockets[i].show();
        }
    }
}

function Rocket(dna){
    this.pos = createVector(width/2, height);
    this.acc = createVector();
    this.vel = createVector();
    this.fitness = 0;
    this.completed = false;


    if (dna) {
        this.dna = dna;
    } else {
        this.dna = new DNA();
    }

    this.applyForce = function(force){
        this.acc.add(force);
    }


    this.updateMov = function(){
        var d = dist(this.pos.x, this.pos.y, target.x, target.y);
        if (d<10){
            this.completed = true;
            this.pos = target.copy();
        }

        this.applyForce(this.dna.genes[count]);

        if (this.completed === true){
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);
        }
    }

    this.calcFitness = function(){
        var d = dist(this.pos.x, this.pos.y, target.x, target.y);
        this.fitness = map(d, 0, width, width, 0);
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
            this.genes[i].setMag(0.5);
        }
    }

    this.crossover = function(partner) {
        var newgenes = [];
        var mid = floor(random(this.genes.length));

        for (var i = 0; i < this.genes.length; i++){
            if (i>mid){
                newgenes[i] = this.genes[i];
            } else {
                newgenes[i] = partner[i];
            }
        }

        return new DNA(newgenes);
    }

    this.mutation = function() {
        for (var i = 0; i < this.genes.length; i++){
            if(random(1) < 0.01){
                this.genes[i] = p5.Vector.random2D();
                this.genes[i].setMag(0.5);
            }
        }
    }
}