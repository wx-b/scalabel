import * as THREE from "three"

import { SpanPoint3D } from "./spanPoint3d"
import { SpanLine3D } from "./spanLine3d"
import { SpanRect3D } from "./spanRect3d"
import { Vector3D } from "../../../math/vector3d"

/**
 * ThreeJS class for rendering 3D cuboid
 */
export class SpanCuboid3D {
  private readonly _p1: SpanPoint3D
  private readonly _p2: SpanPoint3D
  private readonly _p3: SpanPoint3D
  private readonly _p4: SpanPoint3D
  private _center: THREE.Vector3

  /**
   * Constructor
   *
   * @param p1
   * @param p2
   * @param p3
   * @param p4
   */
  constructor(
    p1: SpanPoint3D,
    p2: SpanPoint3D,
    p3: SpanPoint3D,
    p4: SpanPoint3D
  ) {
    this._p1 = p1
    this._p2 = p2
    this._p3 = p3
    this._p4 = p4
    this._center = new THREE.Vector3(0, 0, 0)
  }

  /**
   * Add to scene for rendering
   *
   * @param scene
   */
  public render(scene: THREE.Scene): void {
    // generate cuboid formed by four points and add to scene
    const bottomFace = new SpanRect3D(this._p1, this._p2, this._p3)
    const bottomFacePoints = bottomFace.points
    const newPoints = this.translateRect()
    const topFace = new SpanRect3D(newPoints[0], newPoints[1], newPoints[2])
    const topFacePoints = topFace.points
    this.calcCenter([...bottomFacePoints, ...topFacePoints])
    const newLines = this.connectingLines(bottomFacePoints, topFacePoints)

    bottomFace.render(scene)
    topFace.render(scene)
    newLines.map((l) => l.render(scene))
  }

  /** Return cuboid center */
  public get center(): THREE.Vector3 {
    return this._center
  }

  /** Return cuboid dimensions */
  public get dimensions(): THREE.Vector3 {
    const [v1, v2, v3, v4] = [this._p1, this._p2, this._p3, this._p4].map((p) =>
      p.toVector3D()
    )
    const d12 = v1.distanceTo(v2)
    const d23 = v2.distanceTo(v3)
    const width = Math.max(d12, d23)
    const depth = Math.min(d12, d23)
    const height = v3.distanceTo(v4)
    return new THREE.Vector3(width, depth, height)
  }

  /** Return cuboid rotation */
  public get rotation(): THREE.Quaternion {
    const [v1, v2, v3] = [this._p1, this._p2, this._p3].map((p) =>
      p.toVector3D()
    )
    const v12 = v2.clone().subtract(v1)
    const v23 = v3.clone().subtract(v2)
    const d12 = v1.distanceTo(v2)
    const d23 = v2.distanceTo(v3)
    const theta =
      d12 >= d23 ? Math.atan2(v12.y, v12.x) : Math.atan2(v23.y, v23.x)
    const euler = new THREE.Euler()
    const angle = new THREE.Vector3(0, 0, theta)
    euler.setFromVector3(angle, "XYZ")
    const quaternion = new THREE.Quaternion()
    quaternion.setFromEuler(euler)

    return quaternion
  }

  /** Translate plane generated by first three points */
  private translateRect(): SpanPoint3D[] {
    const [v1, v2, v3, v4] = [this._p1, this._p2, this._p3, this._p4].map((p) =>
      p.toVector3D()
    )
    const v34 = v4.clone().subtract(v3)
    const [newV1, newV2, newV3] = [v1, v2, v3].map((v) => v.add(v34))
    const [newP1, newP2, newP3] = [newV1, newV2, newV3].map(
      (v) => new SpanPoint3D(v)
    )
    return [newP1, newP2, newP3]
  }

  /**
   * Calculate cuboid center
   *
   * @param vertices
   */
  private calcCenter(vertices: SpanPoint3D[]): void {
    if (vertices.length > 0) {
      const vectors = vertices.map((v) => {
        return new Vector3D(v.x, v.y, v.z)
      })
      const vCenter = vectors.reduce(function (acc, v) {
        return acc.add(v)
      })
      vCenter.divideScalar(vertices.length)
      this._center = new THREE.Vector3(vCenter.x, vCenter.y, vCenter.z)
    }
  }

  /**
   * Calculate lines connecting both faces
   *
   * @param points1
   * @param points2
   */
  private connectingLines(
    points1: SpanPoint3D[],
    points2: SpanPoint3D[]
  ): SpanLine3D[] {
    const lines = points1.map((p, i) => {
      return new SpanLine3D(p, points2[i])
    })
    return lines
  }
}
