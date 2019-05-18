import Creature from "./Creature";
import Food from "./Food";
import {BLUE, MIN_SIZE, N_FOOD, RED} from "./Constants";
import {getRandomInt} from "./Helpers";
import Genes from "./Genes";

export default class Game {
  constructor(width, height, n) {
    this.width = width;
    this.height = height;
    this.generations = [];
    this.gen = 0;

    this.randomGen(n);

  }

  draw(p5) {
    p5.fill(p5.color(...RED));
    this.creatures.forEach((creature) => creature.draw(p5));
    p5.fill(p5.color(...BLUE));
    this.food.forEach((food) => food.draw(p5));
  }

  tick() {
    this.creatures.forEach((creature) => creature.tick(this.state()));

    if (this.food.length === 0) {
      this.nextGen();
    }

    if (this.allStopped()) {
      this.nextGen();
    }
  }

  allStopped() {
    return this.creatures.filter((creature) => creature.speed > 0).length === 0;
  }

  state() {
    // return {
    //   creatures: this.creatures,
    //   food: this.food
    // }

    return this;
  }

  json() {
    const output = {
      num_generations: this.generations.length,
      generations: []
    };

    this.generations.forEach((gen) => {
      output.generations.push({
        avg_distance: gen.avg_distance,
        avg_speed: gen.avg_speed,
        avg_size: gen.avg_size,
        creatures: gen.creatures.map((creature) => {
          return {
            size: creature.genes.size,
            speed: creature.genes.speed,
            distance: creature.genes.distance
          }
        })
      });
    });

    return output;
  }

  nextGen() {
    let avg_size = 0;
    let avg_speed = 0;
    let avg_distance = 0;

    const n = this.creatures.length;

    this.creatures.forEach((creature) => {
      avg_speed += creature.genes.speed;
      avg_size += creature.genes.size;
      avg_distance += creature.genes.distance;
    });

    this.generations.push({
      gen: this.gen++,
      creatures: this.creatures,
      avg_size: avg_size / n,
      avg_speed: avg_speed / n,
      avg_distance: avg_distance / n
    });

    const oldCreatures = this.creatures;

    this.creatures = [];

    // breed
    for (let creature of oldCreatures) {
      for (let i = 0; i < creature.foodEaten; i++) {
        this.creatures.push(creature.birthChild());
      }
    }

    this.creatures.map((creature) => {
      creature.x = getRandomInt(this.width);
      creature.y = getRandomInt(this.height);
    });

    this.genFood(N_FOOD);

    console.log(this.generations);

  }

  randomGen(n) {
    this.creatures = [];

    for (let i = 0; i < n; i++) {
      this.creatures.push(new Creature(getRandomInt(this.width), getRandomInt(this.height), Genes.randomGenes()))
    }

    this.genFood(n);
  }

  genFood(n) {
    this.food = [];

    for (let i = 0; i < n; i++) {
      this.food.push(new Food(getRandomInt(this.width), getRandomInt(this.height)));
    }
  }
}