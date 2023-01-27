//global variables
var population;
var lifespan = 200;
var count = 0;
var lifeInf;
var target;


function setup() {
  createCanvas(500,500);
  population = new Population();
  lifeInf = createP() //criar paragrafo
  target = createVector(width/2, 50);
}

function draw() {
  background(220);
  population.run();
  lifeInf.html(count);
  count++;

  if (count == lifespan) { //sempre que chegar em 200 frames, vai reinciar
    population.evaluate();
    population.selection();

    count = 0;
  }


  square(target.x, target.y, 16);
  noStroke();
  fill(color("green"));
}


function DNA(genes) {
  if (genes) {
    this.genes = genes;
  } else {
    this.genes = [];
    for (var i = 0; i < lifespan; i++) {
      this.genes[i] = p5.Vector.random2D();
      this.genes[i].setMag(0.1);
    }
  }

  this.crossover = function(partner) {
    var newgenes = [];
    var mid = floor(random(this.genes.length)); //"meio" uma linha para separar

    for (var i = 0; i < this.genes.length; i++) {
      if (i > mid) {
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
  this.popsize = 25;
  this.matingPool = [];

  for (var i = 0; i < this.popsize; i++) {
    this.rockets[i] = new Rocket();
  }

  this.evaluate = function() {
    var maxfit = 0; //target
    for (var i = 0; i < this.popsize; i++) {
      this.rockets[i].calcFitness();

      if (this.rockets[i].fitness > maxfit) {
        maxfit = this.rockets[i].fitness;
      }
    }

    for (var i=0; i < this.popsize; i++) {
      this.rockets[i].fitness /= maxfit; //fitness/maxfit
    }

    this.matingPool = [];
    for (var i = 0; i < this.popsize; i++) {
      var mp = this.rockets[i].fitness * 100;
      for (var j = 0; j < mp; j++) { //add to mating pool mp times
        this.matingPool.push(this.rockets[i]);
      }
    }
  }

  this.selection = function() {
    var newRockets = [];
    for (var i = 0; i < this.rockets.length; i++) {
      var parentA = random(this.matingPool).dna;
      var parentB = random(this.matingPool).dna;
      var child = parentA.crossover(parentB);
      newRockets[i] = new Rocket(child);
    }

    this.rockets = newRockets;
  }

  this.run = function() {
    for (var i = 0; i < this.popsize; i++) {
      this.rockets[i].update();
      this.rockets[i].show();
    }
  }
}


function Rocket(dna){
  this.pos = createVector(width/2, height);
  this.vel = createVector();
  this.acc = createVector();
  this.count = 0;

  if (dna) {
    this.dna = dna;
  } else {
    this.dna = new DNA();
  }

  this.fitness = 0;

  this.applyForce = function(force) {
    this.acc.add(force); //adicionar para movimento
  }

  this.calcFitness = function() {
    //closer to target, best fitness
    var dist = dist(this.pos.x, this.pos.y, target.x, target.y);
    this.fitness = 1/dist; //dist=100 -> fitness = 0,1
  }

  this.update = function() {
    this.applyForce(this.dna.genes[this.count]); 
    //array dna tem 200 mov, aqui vai pegar um e aplicar ao obj

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  this.show = function() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    fill(color("#1B88CC"));
    circle(0,0,8);
    pop();
  }
}