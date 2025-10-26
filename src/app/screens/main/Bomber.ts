import { Spine, SpineFromOptions } from "@esotericsoftware/spine-pixi-v8";
import { Container } from "pixi.js";

enum STATE {
  forward,
  backwards,
  idle,
}

export class Bomber {
  private readonly spine_: Spine;
  private readonly container_: Container<Spine>;
  private state: STATE;
  private keysToListen: string[];
  constructor(spineConfig: SpineFromOptions) {
    this.container_ = new Container();
    this.spine_ = Spine.from(spineConfig);
    this.container_.addChild(this.spine_);
    this.state = STATE.idle;
    this.keysToListen = ["ArrowLeft", "ArrowRight"];

    this.setupInteraction();
  }

  get container() {
    return this.container_;
  }

  start() {
    this.spine_.state.setAnimation(0, "idle", true);
  }

  setupInteraction() {
    document.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "ArrowLeft":
          this.state = STATE.backwards;
          break;
        case "ArrowRight":
          this.state = STATE.forward;
          break;
      }
    });
    document.addEventListener("keyup", (event) => {
      if (this.keysToListen.includes(event.code)) {
        this.state = STATE.idle;
      }
    });
  }

  update() {
    if (this.state === STATE.backwards) {
      this.container.position.x -= 1;
    } else if (this.state === STATE.forward) {
      this.container.position.x += 1;
    }
  }
}
