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

  json() {
    return this;
  }
}