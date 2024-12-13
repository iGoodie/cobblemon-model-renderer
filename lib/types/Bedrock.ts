export namespace Bedrock {
  type Vec2<T> = [T, T];
  type Vec3<T> = [T, T, T];

  /**
   * @see https://learn.microsoft.com/en-us/minecraft/creator/reference/content/schemasreference/schemas/minecraftschema_geometry_1.12.0?view=minecraft-bedrock-stable
   */
  export interface ModelGeoConfig {
    debug?: boolean;
    format_version: "1.12.0";
    "minecraft:geometry": {
      description: {
        identifier: string;
        visible_bounds_width?: number;
        visible_bounds_height?: number;
        visible_bounds_offset?: Vec3<number>;
        texture_width?: number;
        texture_height?: number;
      };
      cape?: string;
      bones?: GeoBone[];
    }[];
  }

  /**
   * @see https://learn.microsoft.com/en-us/minecraft/creator/reference/content/schemasreference/schemas/minecraftschema_actor_animation_1.8.0?view=minecraft-bedrock-stable
   */
  export interface ActorAnimationConfig {
    format_version: "1.8.0";
    animations: Record<string, ActorAnimation>;
  }

  export interface ActorAnimation {
    /**
     * - **If the value is a boolean**: should this animation stop, loop, or stay on the last frame when finished (true, false, "hold_on_last_frame"
     * - **If the value is "hold_on_last_frame"**: should this animation stop, loop, or stay on the last frame when finished (true, false, "hold_on_last_frame"
     */
    loop?: boolean | "hold_on_last_frame";
    /** How long to wait in seconds before playing this animation.  Note that this expression is evaluated once before playing, and only re-evaluated if asked to play from the beginning again.  A looping animation should use 'loop_delay' if it wants a delay between loops. */
    start_delay?: MolangExpr;
    /** How long to wait in seconds before looping this animation.  Note that this expression is evaluated after each loop and on looping animation only. */
    loop_delay?: MolangExpr;
    /** how does time pass when playing the animation.  Defaults to "query.anim_time + query.delta_time" which means advance in seconds. */
    anim_time_update?: MolangExpr;
    blend_weight?: MolangExpr;
    /** reset bones in this animation to the default pose before applying this animation */
    override_previous_animation?: boolean;
    bones?: Record<string, BoneAnimation>;
  }

  export type MolangExpr = string | number;

  export interface BoneAnimation {
    relative_to?: {
      /** if set, makes the bone rotation relative to the entity instead of the bone's parent */
      rotation?: "entity";
    };

    /** override calculated value (set as the max keyframe or event time) and set animation length in seconds. */
    animation_length?: number;

    position?: Animation;
    rotation?: Animation;
    scale?: Animation;

    // TODO: particle_effects
    // TODO: sound_effects
    // TODO: timeline
  }

  export type Animation =
    | MolangExpr
    | Vec3<MolangExpr>
    | {
        [time_stamp: number]:
          | Vec3<MolangExpr>
          | {
              lerp_mode?: "linear" | "catmullrom";
              pre: Vec3<MolangExpr>;
              post: Vec3<MolangExpr>;
            };
      };

  export interface GeoBone {
    name: string;
    parent?: string;
    /** The bone pivots around this point (in model space units). */
    pivot?: Vec3<number>;
    rotation?: Vec3<number>;
    mirror?: boolean;
    inflate?: number;
    debug?: boolean;
    render_group_id?: number;
    cubes?: Cube[];
    locators?: LocatorMap;
  }

  export interface Cube {
    /** This point declares the unrotated lower corner of cube (smallest x/y/z value in model space units). */
    origin?: Vec3<number>;
    /** The cube extends this amount relative to its origin (in model space units). */
    size?: Vec3<number>;
    /** The cube is rotated by this amount (in degrees, x-then-y-then-z order) around the pivot. */
    rotation?: Vec3<number>;
    /** If this field is specified, rotation of this cube occurs around this point, otherwise its rotation is around the center of the box.  Note that in 1.12 this is flipped upside-down, but is fixed in 1.14. */
    pivot?: Vec3<number>;
    /** Grow this box by this additive amount in all directions (in model space units), this field overrides the bone's inflate field for this cube only. */
    inflate?: number;
    /** Mirrors this cube about the unrotated x axis (effectively flipping the east / west faces), overriding the bone's 'mirror' setting for this cube. */
    mirror?: boolean;
    /**
     * - **If the value is an array**: Specifies the upper-left corner on the texture for the start of the texture mapping for this box.
     * - **If the value is an object**: This is an alternate per-face uv mapping which specifies each face of the cube.  Omitting a face will cause that face to not get drawn.
     */
    uv?:
      | {
          north?: FaceUV;
          south?: FaceUV;
          east?: FaceUV;
          west?: FaceUV;
          up?: FaceUV;
          down?: FaceUV;
        }
      | Vec2<number>;
  }

  export interface FaceUV {
    /** Specifies the uv origin for the face. For this face, it is the upper-left corner, when looking at the face with y being up. */
    uv: Vec2<number>;
    /** The face maps this many texels from the uv origin. If not specified, the box dimensions are used instead. */
    uv_size?: Vec2<number>;
    material_instance?: string;
  }

  export interface LocatorMap {
    [identifier: string]:
      | {
          offset?: Vec3<number>;
          rotation?: Vec3<number>;
          ignore_inherited_scale?: boolean;
        }
      | number[];
  }
}
