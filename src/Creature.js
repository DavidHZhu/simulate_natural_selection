import { getNearestDetails } from "./Helpers";
import {MUTATE_CHANCE, KINETIC_ENERGY} from "./Constants";
import Genes from "./Genes";

export default class Creature {
  constructor(x, y, genes) {
    this.x = x;
    this.y = y;
    this.genes = genes;
    this.foodEaten = 0;

    this.size = this.genes.size * 10;

    // Calculate speed based on mass & kinetic energy equation
    // this.speed = Math.sqrt((2*KINETIC_ENERGY)/(3.14 * Math.pow(this.size, 2)));
    this.speed = genes.speed;

    this.distance_remaining = genes.distance * 100;
  }

  draw(p5) {
    p5.circle(this.x, this.y, this.size);
  }

  birthChild() {
    let childGenes = {...this.genes};

    if (Math.random() < MUTATE_CHANCE) {
      childGenes = Genes.randomGenes();
    }

    return new Creature(this.x, this.y, childGenes);
  }

  tick(state) {
    this.distance_remaining -= this.speed;
    if (this.distance_remaining <= 0) {
      this.speed = 0;
    }
    this.state = state;

    const nearestFood = getNearestDetails(this, this.state.food);

    if (this.state.food.length === 0) {
      return;
    }
    this.moveTowards(nearestFood.ref);

    if (nearestFood.distance < nearestFood.ref.size/2 + this.size/2) {
      // in range, eat food
      this.eat(nearestFood.ref);
    }
  }

  eat(food) {
    // remove from arr
    this.state.food = this.state.food.filter((ref) => ref !== food);

    this.foodEaten++;
  }

  moveTowards(obj) {
    // Calculate direction towards food
    let toFoodX = obj.x - this.x;
    let toFoodY = obj.y - this.y;

    // Normalize
    const toPlayerLength = Math.hypot(toFoodX, toFoodY);
    toFoodX /= toPlayerLength;
    toFoodY /= toPlayerLength;

    // Move towards the player
    this.x += toFoodX * this.speed;
    this.y += toFoodY * this.speed;
  }

  json() {
    return this;
  }
}