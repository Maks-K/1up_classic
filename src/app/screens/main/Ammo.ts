import { Spine, SpineFromOptions } from "@esotericsoftware/spine-pixi-v8";
import { Container, ContainerChild, Point } from "pixi.js";

enum STATE {
  falling,
  explosion,
  idle,
}

interface AmmoConstructorParams {
  spineConfig: SpineFromOptions;
  boomSpineConfig: SpineFromOptions;
  dropPoint: Point;
  parent: Container<ContainerChild>;
}

export class Ammo {
  private readonly spine_: Spine;
  private readonly boomSpine_: Spine;
  private readonly container_: Container<Spine>;
  private readonly dropPosition_: Point;
  private readonly parent_: Container<ContainerChild>;
  private state: STATE;
  constructor({
    spineConfig,
    boomSpineConfig,
    dropPoint,
    parent,
  }: AmmoConstructorParams) {
    this.parent_ = parent;
    this.container_ = new Container();
    this.spine_ = Spine.from(spineConfig);
    this.boomSpine_ = Spine.from(boomSpineConfig);
    this.dropPosition_ = dropPoint;
    this.state = STATE.idle;

    this.setupInteraction();
  }

  setupInteraction() {
    document.addEventListener("keyup", (event) => {
      if (event.code === "Space" && this.state === STATE.idle) {
        this.drop();
      }
    });
  }

  get container() {
    return this.container_;
  }

  start() {
    this.spine_.state.setAnimation(0, "idle", true);
  }

  stop() {
    this.spine_.state.clearTracks();
    this.spine_.skeleton.setToSetupPose();
  }

  drop() {
    const { x, y } = this.dropPosition_;
    this.state = STATE.falling;
    this.parent_.addChild(this.container_);
    this.container.position.set(x, y);
    this.start();
    this.container_.addChild(this.spine_);
  }

  boom() {
    this.state = STATE.explosion;
    this.container_.addChild(this.boomSpine_);
    return new Promise((resolve) => {
      this.boomSpine_.state.addListener({ complete: resolve });
      this.boomSpine_.state.setAnimation(0, "boom", false);
    });
  }

  async hit() {
    this.stop();
    this.container.removeChild(this.spine_);
    await this.boom();
    this.state = STATE.idle;
    this.boomSpine_.state.clearListeners();
  }

  update() {
    if (this.state === STATE.falling) {
      this.container_.position.y += 2;
      if (this.container_.position.y === 320) {
        this.hit();
      }
    }
  }
}
