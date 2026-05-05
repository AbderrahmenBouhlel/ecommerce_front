import { BaseBodyShapeState } from "../../../../shared/body/core/BaseBodyShapeState";
import { Point } from "../../../../shared/core/types/types";
import { interpolateBodyShape, interpolateBodyShapes } from "./interpolation.utils";
import { TransformData } from "../../../../shared/core/types/types";



export interface BlackBodyShape {
    topLeft: Point;
    topRight: Point;
    bottomRight: Point;
    bottomLeft: Point;

    leftCurve: { cp1: Point; cp2: Point };
    rightCurve: { cp1: Point; cp2: Point };

    cornerRadius: number;

    faceSocketPosition: TransformData;
}

export class BlackBodyShapeState extends BaseBodyShapeState<BlackBodyShape> {

    public toPathString(): string {
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
            C ${round(s.rightCurve.cp1.x)},${round(s.rightCurve.cp1.y)}
                ${round(s.rightCurve.cp2.x)},${round(s.rightCurve.cp2.y)}
                ${round(s.bottomRight.x)},${round(s.bottomRight.y)}
            L ${round(s.bottomLeft.x)},${round(s.bottomLeft.y)}
            C ${round(s.leftCurve.cp1.x)},${round(s.leftCurve.cp1.y)}
                ${round(s.leftCurve.cp2.x)},${round(s.leftCurve.cp2.y)}
                ${round(s.topLeft.x)},${round(s.topLeft.y)}
            Z
        `.replace(/\s+/g, ' ').trim();
    }

    public static interpolateToTarget(start: BlackBodyShape, target: BlackBodyShape, t: number): BlackBodyShape {
        return interpolateBodyShape(start, target, t);
    }

    public static interpolateToTargets(targets: BlackBodyShape[], t: number): BlackBodyShape {
        return interpolateBodyShapes(targets,t);
    }



    public override getCurrentFaceSocketPosition(): TransformData {
        return this.current.faceSocketPosition;
    }


}