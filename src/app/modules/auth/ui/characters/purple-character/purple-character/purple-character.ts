import { Component, ElementRef, ViewChild } from '@angular/core';
import { CharacterOrchestratorService } from '../../../../services/CharacterOrchestrator/CharacterOrchestratorService';
import { PurpleCharacterController } from '../controller/PurpleCharacterController';

@Component({
  selector: 'app-purple-character',
  imports: [],
  templateUrl: './purple-character.html',
  styleUrl: './purple-character.css',
})
export class PurpleCharacter {

    
  @ViewChild('characterBody') characterBody!: ElementRef;
  @ViewChild('faceContainer') faceContainer!: ElementRef;
  @ViewChild('characterShape') bodyShapeElement!: ElementRef;
 
  @ViewChild('mouth') mouthElement!: ElementRef;

  private characterController! :PurpleCharacterController ;


  constructor(private orchestratorService: CharacterOrchestratorService) {
    this.orchestratorService = orchestratorService;
  }
  


  ngAfterViewInit() {
    this.characterController = new PurpleCharacterController(
      this.orchestratorService.getLatestPos,
      this.mouthElement.nativeElement,
      this.bodyShapeElement.nativeElement,
      this.characterBody.nativeElement,
      this.faceContainer.nativeElement
    );
    
    this.orchestratorService.register(this.characterController);
  }

}
