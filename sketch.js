//global variables
var population;
var lifespan = 400;
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

  if (count == lifespan) { //sempre que chegar em 200 frames, vai reinciar
    count = 0;
    population = new Population();
  }

  count++;

  square(target.x, target.y, 16);
  noStroke();
  fill(color("green"));
}


function DNA() {
  this.genes = [];
  for (var i = 0; i < lifespan; i++) {
    this.genes[i] = p5.Vector.random2D();
    this.genes[i].setMag(0.1);
  }
}


function Population() {
  this.rockets = [];
  this.popsize = 25;

  for (var i = 0; i < this.popsize; i++) {
    this.rockets[i] = new Rocket();
  }

  this.evaluate = function() {
    for (var i = 0; i < this.popsize; i++) {
      
    }
  }


  this.run = function() {
    for (var i = 0; i < this.popsize; i++) {
      this.rockets[i].update();
      this.rockets[i].show();
    }
  }
}


function Rocket(){
  this.pos = createVector(width/2, height);
  this.vel = createVector();
  this.acc = createVector();
  this.dna = new DNA();

  this.applyForce = function(force) {
    this.acc.add(force); //adicionar para movimento
  }

  this.update = function() {
    this.applyForce(this.dna.genes[count]); 
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