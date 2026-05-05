import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { BlackCharacterController } from '../controller/BlackCharacterController';
import { CharacterOrchestratorService } from '../../../../services/CharacterOrchestrator/CharacterOrchestratorService';


@Component({
  selector: 'app-black-character',
  imports: [],
  templateUrl: './black-character.html',
  styleUrl: './black-character.css',
})
export class BlackCharacter implements OnDestroy{

  
  @ViewChild('characterBody') characterBody!: ElementRef;
  @ViewChild('eyePairContainer') eyePairContainer!: ElementRef;
  @ViewChild('characterShape') bodyShapeElement!: ElementRef;
 

  @ViewChild('eyePair') eyePairElement!: ElementRef;
  

  private characterController! :BlackCharacterController ;
  private orchestratorService: CharacterOrchestratorService;

  constructor(orchestratorService: CharacterOrchestratorService) {
    this.orchestratorService = orchestratorService;
  }

  ngAfterViewInit() {
    this.characterController = new BlackCharacterController(
      this.orchestratorService.getLatestPos,
      this.bodyShapeElement.nativeElement,
      this.characterBody.nativeElement,
      this.eyePairContainer.nativeElement,
      this.eyePairElement.nativeElement,
    );
    
    this.orchestratorService.register(this.characterController);
  }




  ngOnDestroy() {
    // Tell the service to drop the reference
    this.orchestratorService.unregister(this.characterController);
  }
}
