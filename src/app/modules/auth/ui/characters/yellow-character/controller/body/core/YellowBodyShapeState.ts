import { BaseBodyShapeState } from "../../../../shared/body/core/BaseBodyShapeState";
import { Point, TransformData } from "../../../../shared/core/types/types";
import { interpolateYellowBodyShape, interpolateYellowBodyShapes } from "./interpolation.utils";





export interface YellowBodyShape {
    shoulderLeft: Point;
    shoulderRight: Point;    
    
    cp1: Point; 
    cp2: Point; 
   

    bottomRight: Point; 
    bottomLeft: Point; 

    faceSocketPosition: TransformData;
}



export class YellowBodyShapeState extends BaseBodyShapeState<YellowBodyShape>{



    public override toPathString(): string {
        const s = this.current;
        const round = BaseBodyShapeState.round;

        return `
            M ${round(s.bottomLeft.x)},${round(s.bottomLeft.y)}
            L ${round(s.shoulderLeft.x)},${round(s.shoulderLeft.y)}
            C ${round(s.cp1.x)},${round(s.cp1.y)}
            ${round(s.cp2.x)},${round(s.cp2.y)}
            ${round(s.shoulderRight.x)},${round(s.shoulderRight.y)}
            L ${round(s.bottomRight.x)},${round(s.bottomRight.y)}
            Z
        `.replace(/\s+/g, ' ').trim();
    }


    public static interpolateToTarget(start: YellowBodyShape, target: YellowBodyShape, t: number): YellowBodyShape {
        return interpolateYellowBodyShape(start, target, t);
    }
    
    public static interpolateToTargets(targets: YellowBodyShape[], t: number): YellowBodyShape {
        return interpolateYellowBodyShapes(targets,t);
    }
      
    


    public override getCurrentFaceSocketPosition(): TransformData {
        return this.current.faceSocketPosition;
    }

}