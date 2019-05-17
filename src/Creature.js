export default class Creature {
  constructor(x, y, genes) {
    this.x = x;
    this.y = y;
    this.genes = genes;
  }

  draw(p5) {
    p5.circle(this.x, this.y, this.genes.size);
    console.log(this.x);
  }
}