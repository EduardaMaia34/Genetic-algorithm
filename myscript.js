var target;
var population;
var lifespan = 200;
var count = 0;
var lifeP;

function setup() {
    createCanvas(500,600);
    target = createVector(width/2, 40);
    population = new Population();
    lifeP = createP();
}

function draw() {
    background(0);

    count++;
    lifeP.html(count);
    
    population.run();

    if (count > lifespan) {
        count = 0;
        population = new Population();
        population.run();
    }

    fill(color("green"));
    square(target.x, target.y, 20);
}

function Population() {
    this.rockets = [];
    this.popsize = 20;

    for (var i = 0; i < this.popsize; i++) {
        this.rockets[i] = new Rocket();
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

    if (dna) {
        this.dna = dna;
    } else {
        this.dna = new DNA();
    }

    this.applyForce = function(force) {
        this.acc.add(force);
    }

    this.updateMov = function() {
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
}