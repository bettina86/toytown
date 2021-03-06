/// <reference path="../typings/tsd.d.ts" />
/// <reference path="city.ts" />

interface Renderer {
  shakeOffset: number;

  clear();
  setAlpha(alpha: number);
  drawSprite(coord: Coord, sprite: Sprite, variantX: number, variantY: number, ox: number, oy: number, scale: number);
  flush();

  unproject(x: number, y: number): Coord;
}

class AbstractRenderer {
  protected canvasElt: HTMLCanvasElement;
  protected canvasWidth: number;
  protected canvasHeight: number;
  protected scale: number;

  shakeOffset = 0;

  constructor(protected city: City, protected canvas: JQuery) {
    this.canvasElt = <HTMLCanvasElement>canvas[0];

    $(window).on('resize', this.onResize.bind(this));
    this.onResize();
  }

  unproject(x: number, y: number): Coord {
    x -= this.canvasWidth / 2;
    y -= this.canvasHeight / 2 + this.scale * (Y_OFFSET + this.shakeOffset);
    x /= this.scale * SPRITE_WIDTH / 2;
    y /= this.scale * SPRITE_HEIGHT / 2;
    var i = Math.round((x + y - 1 + this.city.size) / 2);
    var j = Math.round((x - y - 1 + this.city.size) / 2);
    return i >= 0 && i < this.city.size && j >= 0 && j < this.city.size ? Coord.of(i, j) : null;
  }

  protected getCenterX(coord: Coord): number {
    return this.canvasWidth / 2 + this.scale * SPRITE_WIDTH / 2 * (coord.i + coord.j + 1 - this.city.size);
  }

  protected getCenterY(coord: Coord): number {
    return this.canvasHeight / 2 + this.scale * (Y_OFFSET + this.shakeOffset) + this.scale * SPRITE_HEIGHT / 2 * (coord.i - coord.j);
  }

  private onResize() {
    var w = window.innerWidth - 2*MARGIN;
    var h = window.innerHeight - 2*MARGIN;
    if (w*3 > h*5) {
      w = h*5/3;
    } else {
      h = w*3/5;
    }
    w = Math.floor(w);
    h = Math.floor(h);
    this.canvasElt.width = this.canvasWidth = w;
    this.canvasElt.height = this.canvasHeight = h;
    $('#all').css({
      width: w + 'px',
      height: h + 'px',
    });
    this.scale = w / (SPRITE_WIDTH * this.city.size);
    $(document.documentElement).css('font-size', w/100 + 'px');
  }
}
