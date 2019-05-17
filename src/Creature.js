const MUTATE_CHANCE = 0.1;

export default class Creature {
  constructor(x, y, genes) {
    this.x = x;
    this.y = y;
    this.genes = genes;
  }

  draw(p5) {
    p5.circle(this.x, this.y, this.genes.size);
  }

  mutate() {
    if (Math.random() < MUTATE_CHANCE) {
      this.genes.size = Math.random() * 50;
    }
  }

  tick(state) {
    this.state = state;
    this.move();
  }

  move() {
    this.moveTowards(this.getNearest(this.state.food));
  }

  getNearest(objs) {
    const distances = [...objs].map((obj) => {
      return {
        distance: Math.hypot(obj.x - this.x, obj.y - this.y),
        obj: obj
      }
    });

    let min = distances[0], max = distances[0];

    for (let i = 1, len=distances.length; i < len; i++) {
      let v = distances[i];
      min = (v.distance < min.distance) ? v : min;
      max = (v.distance > max.distance) ? v : max;
    }

    return min.obj;
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