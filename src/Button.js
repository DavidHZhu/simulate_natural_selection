export default class Button {
  constructor(x, y, w, h, text, handler) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
    this.handler = handler;
  }

  draw(p5) {
    let shade = 255;
    if (this.contains(p5.mouseX, p5.mouseY)) shade -= 100;
    const base_fill = p5.color(shade, shade, shade);

    p5.fill(base_fill);
    p5.rect(this.x, this.y, this.w, this.h);
    p5.fill(p5.color(0,0,0));
    const textSize = Math.floor(this.h);
    p5.textSize(textSize);
    p5.text(this.text, this.x + 2, this.y + this.h/2 + textSize/2 - 2);
  }

  contains(x, y) {
    return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
  }

  checkPress(x, y) {
    if (this.contains(x,y)) this.handler();
  }
}