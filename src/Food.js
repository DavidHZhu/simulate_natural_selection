const FOOD_SIZE = 20;

export default class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(p5) {
    p5.circle(this.x, this.y, FOOD_SIZE);
  }
}