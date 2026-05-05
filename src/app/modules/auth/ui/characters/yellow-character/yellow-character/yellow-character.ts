import { Component, ElementRef, ViewChild } from '@angular/core';
import { YellowCharacterController } from '../controller/YellowCharacterController';
import { CharacterOrchestratorService } from '../../../../services/CharacterOrchestrator/CharacterOrchestratorService';
import { MirrorElementsGroup } from '../../shared/core/types/MirrorElemetns';

@Component({
  selector: 'app-yellow-character',
  imports: [],
  templateUrl: './yellow-character.html',
  styleUrl: './yellow-character.css',
})
export class YellowCharacter {
  
  @ViewChild('characterBody') characterBody!: ElementRef;
  @ViewChild('characterBodyMirror') characterBodyMirror!: ElementRef;
  
  @ViewChild('faceContainer') faceContainer!: ElementRef;
  @ViewChild('faceContainerMirror') faceContainerMirror!: ElementRef;

  @ViewChild('characterShape') bodyShapeElement!: ElementRef;
  @ViewChild('characterShapeClip') bodyClipPathElement!: ElementRef;
 
  @ViewChild('face') faceElement!: ElementRef;
  @ViewChild('faceMirror') faceMirrorElement!: ElementRef;
  
  @ViewChild('mouth') mouthElement!: ElementRef;

  private characterController!: YellowCharacterController;

  constructor(private orchestratorService: CharacterOrchestratorService) {
    this.orchestratorService = orchestratorService;
  }

  ngAfterViewInit() {
    // Create mirror groups for body
    const bodyMirrorGroup: MirrorElementsGroup = {
      original: this.characterBody.nativeElement,
      mirrors: [this.characterBodyMirror.nativeElement]
    };
    
    // Create mirror groups for face containers
    const faceContainerMirrorGroup: MirrorElementsGroup = {
      original: this.faceContainer.nativeElement,
      mirrors: [this.faceContainerMirror.nativeElement]
    };
    
    // Create mirror groups for face (eyes/mouth groups)
    const faceMirrorGroup: MirrorElementsGroup = {
      original: this.faceElement.nativeElement,
      mirrors: [this.faceMirrorElement.nativeElement]
    };
    
    this.characterController = new YellowCharacterController(
      this.orchestratorService.getLatestPos,
      this.bodyShapeElement.nativeElement,
      bodyMirrorGroup,
      faceContainerMirrorGroup,
      faceMirrorGroup,
      this.bodyClipPathElement.nativeElement,
      this.mouthElement.nativeElement
    );
    
    this.orchestratorService.register(this.characterController);
  }
}
