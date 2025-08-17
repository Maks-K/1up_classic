import { Container, Texture, TilingSprite } from "pixi.js";

export class Background extends Container {
  public backTile: TilingSprite;
  public backMiddleTile: TilingSprite;
  public backTopTile: TilingSprite;
  public basicSpeed: number;
  private bgX: number;

  constructor() {
    super();

    const back = "back.png";
    const backMiddle = "middle.png";
    const backTop = "top.png";
    this.bgX = 0;
    this.basicSpeed = 1;

    const backTexture = Texture.from(back);
    this.backTile = this.createTile(backTexture);
    this.backTile.anchor.set(0.5);

    const backMiddleTexture = Texture.from(backMiddle);
    this.backMiddleTile = this.createTile(backMiddleTexture);
    this.backMiddleTile.anchor.set(0.5);

    const backTopTexture = Texture.from(backTop);
    this.backTopTile = this.createTile(backTopTexture);
    this.backTopTile.anchor.set(0.5);
  }

  createTile(texture: Texture) {
    const tiling = new TilingSprite({
      texture,
      width: 1920,
      height: 1080,
    });

    tiling.position.set(0, 0);
    return this.addChild(tiling);
  }

  update() {
    this.bgX = this.bgX + this.basicSpeed;
    this.backTopTile.tilePosition.x = -this.bgX;
    this.backMiddleTile.tilePosition.x = -this.bgX / 2;
    this.backTile.tilePosition.x = -this.bgX / 4;
  }
}
