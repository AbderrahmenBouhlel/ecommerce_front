import { BaseBodyShapeState } from "../../../../shared/body/core/BaseBodyShapeState";
import { Point, TransformData } from "../../../../shared/core/types/types";
import { interpolatePurpleBodyShape, interpolatePurpleBodyShapes } from "./interpolation.utils";




export interface PurpleBodyShape {
    topLeft: Point;
    topRight: Point;
    bottomRight: Point;
    bottomLeft: Point;

    leftCurve: {
        topSegment: { cp1: Point; cp2: Point },
        midSeg: Point,
        bottomSegment: { cp1: Point; cp2: Point }
    };
    rightCurve: {
        topSegment: { cp1: Point; cp2: Point },
        midSeg: Point,
        bottomSegment: { cp1: Point; cp2: Point }
    };

    cornerRadius: number;

    faceSocketPosition: TransformData;
}


export class PurpleBodyShapeState extends BaseBodyShapeState<PurpleBodyShape>{



    public override toPathString(): string {
        const s = this.current;
        const r = s.cornerRadius;

        const round = BaseBodyShapeState.round;
        return `
            M ${round(s.topLeft.x)},${round(s.topLeft.y + r)}
            Q ${round(s.topLeft.x)},${round(s.topLeft.y)}
              ${round(s.topLeft.x + r)},${round(s.topLeft.y)}
            L ${round(s.topRight.x - r)},${round(s.topRight.y)}
            Q ${round(s.topRight.x)},${round(s.topRight.y)}
              ${round(s.topRight.x)},${round(s.topRight.y + r)}


            C ${round(s.rightCurve.topSegment.cp1.x)},${round(s.rightCurve.topSegment.cp1.y)}
              ${round(s.rightCurve.topSegment.cp2.x)},${round(s.rightCurve.topSegment.cp2.y)}
              ${round(s.rightCurve.midSeg.x)},${round(s.rightCurve.midSeg.y)}
            C ${round(s.rightCurve.bottomSegment.cp1.x)},${round(s.rightCurve.bottomSegment.cp1.y)}
              ${round(s.rightCurve.bottomSegment.cp2.x)},${round(s.rightCurve.bottomSegment.cp2.y)}
              ${round(s.bottomRight.x)},${round(s.bottomRight.y)}

            L ${round(s.bottomLeft.x)},${round(s.bottomLeft.y)}
            C ${round(s.leftCurve.bottomSegment.cp1.x)},${round(s.leftCurve.bottomSegment.cp1.y)}
              ${round(s.leftCurve.bottomSegment.cp2.x)},${round(s.leftCurve.bottomSegment.cp2.y)}
              ${round(s.leftCurve.midSeg.x)},${round(s.leftCurve.midSeg.y)}
            C ${round(s.leftCurve.topSegment.cp1.x)},${round(s.leftCurve.topSegment.cp1.y)}
            ${round(s.leftCurve.topSegment.cp2.x)},${round(s.leftCurve.topSegment.cp2.y)}
            ${round(s.topLeft.x)},${round(s.topLeft.y + r)}
            Z
        `.replace(/\s+/g, ' ').trim();
    }

    public static interpolateToTarget(start: PurpleBodyShape, target: PurpleBodyShape, t: number): PurpleBodyShape {
      return interpolatePurpleBodyShape(start, target, t);
    }
  
    public static interpolateToTargets(targets: PurpleBodyShape[], t: number): PurpleBodyShape {
      return interpolatePurpleBodyShapes(targets,t);
    }
  

    public override getCurrentFaceSocketPosition(): TransformData {
        return this.current.faceSocketPosition;
    }

}