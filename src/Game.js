import Creature from "./Creature";
import Food from "./Food";
import {BLUE, DEAD_BREED, MIN_SIZE, N_FOOD, RED} from "./Constants";
import {getRandomInt} from "./Helpers/Helpers";
import Genes from "./Genes";

export default class Game {
  constructor(width, height, n_food) {
    this.width = width;
    this.height = height;
    this.generations = [];
    this.gen = 0;

    this.randomGen(n_food);

  }

  draw(p5) {
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
    // return whether there is at least one alive creature
    return this.creatures.filter((creature) => !creature.dead && creature.speed > 0).length === 0;
  }

  state() {
    // return {
    //   creatures: this.creatures,
    //   food: this.food
    // }

    return this;
  }

  nextGen() {
    const stats = this.getStats();
    const n = stats.n;

    this.generations.push({
      gen: this.gen++,
      creatures: this.creatures,
      avg_size: stats.avg_size,
      avg_speed: stats.avg_speed,
      avg_distance: stats.avg_distance,
      avg_sense: stats.avg_sense
    });

    const oldCreatures = this.creatures;

    this.creatures = [];

    // breed
    for (let creature of oldCreatures) {
      if (!DEAD_BREED && creature.dead) continue; // dont breed if eaten
      for (let i = 0; i < creature.foodEaten; i++) {
        this.creatures.push(creature.birthChild());
      }
    }

    this.creatures.map((creature) => {
      creature.x = getRandomInt(this.width);
      creature.y = getRandomInt(this.height);
    });

    this.genFood(N_FOOD);
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

  json() {
    const output = {
      num_generations: this.generations.length,
      generations: []
    };

    this.generations.forEach((gen) => {
      output.generations.push({
        gen: gen.gen,
        avg_distance: gen.avg_distance,
        avg_speed: gen.avg_speed,
        avg_size: gen.avg_size,
        avg_sense: gen.avg_sense
        // creatures: gen.creatures.map((creature) => {
        //   return {
        //     size: creature.genes.size,
        //     speed: creature.genes.speed,
        //     distance: creature.genes.distance,
        //     sense: creature.genes.sense,
        //   }
        // })
      });
    });

    return output;
  }

  // Ghetto implementation, can probably refactor using join()
  csv() {
    const output = {
      num_generations: this.generations.length,
      headers: ["Generation","Distance","Speed","Size","Sense"],
      generations: [],
      csvRows: []
    };

    this.generations.forEach((gen) => {
      const row = [gen.gen, gen.avg_distance, gen.avg_speed, gen.avg_size, gen.avg_sense];
      output.generations.push(row);
    });
    
    output.csvRows.push(output.headers);
    output.csvRows.push(output.generations);
    const objectToCSV = output.csvRows.join("\n");
    return downloadCSV(objectToCSV);
    //return output.csvRows.join("\n");

  }

  // Ghetto download that uses a hidden 'a' tag
  downloadCSV(data) {
    const downloadBlob = new Blob([data], { type: 'text/csv'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `ns_${this.generations.length}.csv`);
    document.body.appendChild('a');
    a.click();
    document.body.removeChild('a');
}
      

  getStats() {
    let avg_size = 0;
    let avg_speed = 0;
    let avg_distance = 0;
    let avg_sense = 0;

    const n = this.creatures.length;

    this.creatures.forEach((creature) => {
      avg_speed += creature.genes.speed;
      avg_size += creature.genes.size;
      avg_distance += creature.genes.distance;
      avg_sense += creature.genes.sense;
    });

    return { avg_size: avg_size / n, avg_speed: avg_speed / n, avg_distance: avg_distance / n , avg_sense: avg_sense / n, n}
  }
}