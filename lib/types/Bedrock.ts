export namespace Bedrock {
  /**
   * @see https://learn.microsoft.com/en-us/minecraft/creator/reference/content/schemasreference/schemas/minecraftschema_geometry_1.12.0?view=minecraft-bedrock-stable
   */
  export interface ModelGeo {
    debug?: boolean;
    format_version: "1.12.0";
    "minecraft:geometry": {
      description: {
        identifier: string;
        visible_bounds_width?: number;
        visible_bounds_height?: number;
        visible_bounds_offset?: [number, number, number];
        texture_width?: number;
        texture_height?: number;
      };
      cape?: string;
      bones?: Bone[];
    }[];
  }

  export interface Bone {
    name: string;
    parent?: string;
    pivot?: [number, number, number];
    rotation?: [number, number, number];
    mirror?: boolean;
    inflate?: number;
    debug?: boolean;
    render_group_id?: number;
    cubes?: Cube[];
    locators?: LocatorMap;
  }

  export interface Cube {
    /** This point declares the unrotated lower corner of cube (smallest x/y/z value in model space units). */
    origin?: [number, number, number];
    /** The cube extends this amount relative to its origin (in model space units). */
    size?: [number, number, number];
    /** The cube is rotated by this amount (in degrees, x-then-y-then-z order) around the pivot. */
    rotation?: [number, number, number];
    /** If this field is specified, rotation of this cube occurs around this point, otherwise its rotation is around the center of the box.  Note that in 1.12 this is flipped upside-down, but is fixed in 1.14. */
    pivot?: [number, number, number];
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
      | [number, number];
  }

  interface FaceUV {
    uv: [number, number];
    uv_size?: [number, number];
    material_instance?: string;
  }

  interface LocatorMap {
    [identifier: string]:
      | {
          offset?: [number, number, number];
          rotation?: [number, number, number];
          ignore_inherited_scale?: boolean;
        }
      | number[];
  }
}
