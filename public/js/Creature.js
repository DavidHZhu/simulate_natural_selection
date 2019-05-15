export default class Creature {
  constructor(x, y, genes) {
    this.x = x;
    this.y = y;
    this.genes = genes;
  }

  draw() {
    ellipse(50, 50, 80, 80);
  }
}