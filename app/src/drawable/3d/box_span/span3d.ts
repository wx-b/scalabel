import * as THREE from "three"

// import { Box3D } from "../box3d"
import { SpanPoint3D } from "./spanPoint3d"
import { SpanLine3D } from "./spanLine3d"
import { SpanRect3D } from "./spanRect3d"
// import { SpanCuboid3D } from "./spanCuboid3d"

/**
 * ThreeJS class for rendering 3D span object
 */
export class Span3D {
  private _p1: SpanPoint3D | null
  private _p2: SpanPoint3D | null
  private _p3: SpanPoint3D | null
  private _p4: SpanPoint3D | null
  private _pTmp: THREE.Vector2
  private _complete: boolean

  /** Constructor */
  constructor() {
    this._p1 = null
    this._p2 = null
    this._p3 = null
    this._p4 = null
    this._pTmp = new THREE.Vector2(0, 0)
    this._complete = false
  }

  /**
   * Modify ThreeJS objects to draw labels
   *
   * @param {THREE.Scene} scene: ThreeJS Scene Object
   * @param scene
   * @param camera
   */
  public render(scene: THREE.Scene): void {
    // TODO: use points data to render temporary geometries
    // TODO: figure out whether to render lines/planes/cuboids natively
    // TODO: with ThreeJS or encapsulate in a custom class

    const tmpPoint = new SpanPoint3D(this._pTmp.x, this._pTmp.y)

    if (this._p2 === null) {
      // TODO: render first point
      // TODO: render line between first point and temp point
      this._p1?.render(scene)
      const line = new SpanLine3D(this._p1 as SpanPoint3D, tmpPoint)
      line.render(scene)
    } else if (this._p3 === null) {
      // TODO: render first, second point
      // TODO: render plane formed by first, second point and temp point
      if (this._p1 !== null && this._p2 !== null) {
        this._p1.render(scene)
        this._p2.render(scene)
        const plane = new SpanRect3D(this._p1, this._p2, tmpPoint)
        plane.render(scene)
      }
    } else if (this._p4 === null) {
      // TODO: render first, second, third point
      // TODO: render cuboid formed by first, second, third point and temp point
    } else {
      // should not reach this case, throw an error
      throw new Error("Span3D: invalid state")
    }
  }

  /**
   * Register new temp point given current mouse position
   *
   * @param x
   * @param y
   */
  public updatePointTmp(x: number, y: number): void {
    this._pTmp.x = x
    this._pTmp.y = y
  }

  /**
   * Register new point given current mouse position
   *
   * @param x
   * @param y
   */
  public registerPoint(x: number, y: number): void {
    if (this._p1 === null) {
      this._p1 = new SpanPoint3D(x, y)
    } else if (this._p2 === null) {
      this._p2 = new SpanPoint3D(x, y)
    } else if (this._p3 === null) {
      this._p3 = new SpanPoint3D(x, y)
    } else if (this._p4 === null) {
      this._p4 = new SpanPoint3D(x, y)
      this._complete = true
    } else {
      throw new Error("Span3D: error registering new point")
    }
  }

  // /**
  //  * Handle mouse up
  //  *
  //  * @param x
  //  * @param y
  //  * @param camera
  //  */
  // public onMouseUp(x: number, y: number): void {
  //   /**
  //    * TODO: set next point as current mouse position
  //    * TODO: render new point that follows mouse along an axis
  //    * TODO: orthogonal to vectors generated by previous points
  //    */
  //   if (this._p1 === null) {
  //     this._p1 = new SpanPoint3D(x, y)
  //   } else if (this._p2 === null) {
  //     this._p2 = new SpanPoint3D(x, y)
  //   } else if (this._p3 === null) {
  //     this._p3 = new SpanPoint3D(x, y)
  //   } else if (this._p4 === null) {
  //     this._p4 = new SpanPoint3D(x, y)
  //     this._complete = true
  //   } else {
  //     throw new Error("Span3D: error registering new point")
  //   }
  // }

  // /**
  //  * Handle mouse move
  //  *
  //  * @param x
  //  * @param y
  //  * @param camera
  //  */
  // public onMouseMove(x: number, y: number): void {
  //   /**
  //    * TODO: update temp point to current mouse position
  //    */
  //   this._pTmp.set(x, y)
  // }

  /** whether span box is complete */
  public get complete(): boolean {
    return this._complete
  }

  /** convert span box to Box3D */
  public spanToBox3D(): void {
    // TODO: convert point data to box coordinates
    // TODO: add an appropriate Label3D class based on
    // TODO: currently selected category or default
  }
}
