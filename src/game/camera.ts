import type { LevelBounds, Position } from "../types/level";

export interface CameraViewport {
  width: number;
  height: number;
}

export interface CameraOptions {
  horizontalLead?: number;
  verticalLead?: number;
}

export class Camera {
  private readonly horizontalLead: number;
  private readonly verticalLead: number;
  private offset: Position = { x: 0, y: 0 };

  public constructor(
    private readonly viewport: CameraViewport,
    private readonly bounds: LevelBounds,
    options: CameraOptions = {},
  ) {
    this.horizontalLead = options.horizontalLead ?? viewport.width * 0.35;
    this.verticalLead = options.verticalLead ?? viewport.height * 0.35;
    this.offset = this.clampOffset(this.offset);
  }

  public follow(player: Position): Position {
    const desired = {
      x: player.x - this.horizontalLead,
      y: player.y - this.verticalLead,
    };
    this.offset = this.clampOffset(desired);
    return this.position;
  }

  public get position(): Position {
    return { ...this.offset };
  }

  public worldToScreen(world: Position): Position {
    return { x: world.x - this.offset.x, y: world.y - this.offset.y };
  }

  private clampOffset(offset: Position): Position {
    const maxX = Math.max(this.bounds.min.x, this.bounds.max.x - this.viewport.width);
    const maxY = Math.max(this.bounds.min.y, this.bounds.max.y - this.viewport.height);
    return {
      x: clamp(offset.x, this.bounds.min.x, maxX),
      y: clamp(offset.y, this.bounds.min.y, maxY),
    };
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
