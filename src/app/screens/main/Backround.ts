import { Container, Texture, TilingSprite } from "pixi.js";

type TileConfig = { name: string; speedDivider: number };
const tileSettings: TileConfig[] = [
  {
    name: "back.png",
    speedDivider: 4,
  },
  {
    name: "middle.png",
    speedDivider: 2,
  },
  {
    name: "top.png",
    speedDivider: 1,
  },
];

const settings = {
  speed: 1,
};

export class Background extends Container {
  public basicSpeed: number;
  public backTiles: BackgroundTile[];
  private bgX: number;

  constructor() {
    super();
    this.bgX = 0;
    this.basicSpeed = settings.speed;

    this.backTiles = tileSettings.map((tileConfig) => {
      const texture = Texture.from(tileConfig.name);
      const tile = this.createTile(texture, tileConfig);
      tile.anchor.set(0.5);
      return tile;
    });
  }

  createTile(texture: Texture, config: TileConfig) {
    const tiling = new BackgroundTile(texture, 2048, 922, config);

    tiling.position.set(0, 0);
    return this.addChild(tiling);
  }

  update() {
    this.bgX = this.bgX + this.basicSpeed;
    this.backTiles.forEach((tile) => {
      tile.tilePosition.x = -this.bgX / tile.speedDivider;
    });
  }
}

class BackgroundTile extends TilingSprite {
  public speedDivider: number;

  constructor(
    texture: Texture,
    width: number,
    height: number,
    config: TileConfig,
  ) {
    super(texture, width, height);

    this.speedDivider = config.speedDivider;
  }
}
