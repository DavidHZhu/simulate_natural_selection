import { getNearestDetails } from "./VectorMath";

const MUTATE_CHANCE = 0.05;
const KINETIC_ENERGY = 10;

export default class Creature {
  constructor(x, y, genes) {
    this.x = x;
    this.y = y;
    this.genes = genes;
    this.foodEaten = 0;

    // Calculate speed based on mass & kinetic energy equation
    this.genes.speed = Math.sqrt((2*KINETIC_ENERGY)/(3.14 * Math.pow(this.genes.size, 2)));
  }

  draw(p5) {
    p5.circle(this.x, this.y, this.genes.size);
  }

  birthChild() {
    const childGenes = {...this.genes};

    if (Math.random() < MUTATE_CHANCE) {
      childGenes.size = Math.random() * 50;
    }

    return new Creature(this.x, this.y, childGenes);
  }

  tick(state) {
    this.state = state;

    const nearestFood = getNearestDetails(this, this.state.food);

    if (this.state.food.length === 0) {
      return;
    }
    this.moveTowards(nearestFood.ref);

    if (nearestFood.distance < nearestFood.ref.size/2 + this.genes.size/2) {
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
    this.x += toFoodX * this.genes.speed;
    this.y += toFoodY * this.genes.speed;
  }

  json() {
    return this;
  }
}