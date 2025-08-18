import {Spine, SpineFromOptions} from "@esotericsoftware/spine-pixi-v8";
import { Container } from "pixi.js";

export class Bomber {
  private readonly spine_: Spine
  private readonly container_: Container<Spine>
  constructor(spineConfig: SpineFromOptions) {
    this.container_ = new Container();
    this.spine_ = Spine.from(spineConfig)
    this.container_.addChild(this.spine_)
  }

  get container(){
    return this.container_
  }

  start(){
    this.spine_.state.setAnimation(0, 'idle', true);
  }
}