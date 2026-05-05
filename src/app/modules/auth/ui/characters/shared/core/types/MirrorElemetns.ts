

// for mirror body support, the mirror effect allows to allow some visual elements to be located outside the original body
// but still move , rotate , morph with the original body, as if they were part of it
// this is useful for example to allow the character to have a mouth that is located outside the body shape, but still move with the body when it moves or morphs
// sepcifically for the yellow character: the body have a clipPath that the mouth need to not be affected by 

export type MirrorElementsGroup = {
    original: SVGGElement;
    mirrors: SVGGElement[];
}


export function normalizeToMirrorElementsGroup(input: SVGGElement | MirrorElementsGroup): MirrorElementsGroup {
    if ('original' in input && 'mirrors' in input) {
        return input;
    }
    return {
        original: input as SVGGElement,
        mirrors: []
    };
}


// this utility function is used to apply a callback on a group elements and its mirrors if exists
export function applyToAllElements(faceGroup: MirrorElementsGroup, callback: (element: SVGGElement) => void): void {
    callback(faceGroup.original);
    faceGroup.mirrors.forEach(callback);
}
