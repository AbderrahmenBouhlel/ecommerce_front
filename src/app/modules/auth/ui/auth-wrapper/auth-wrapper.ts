import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlackCharacter } from '../characters/black-character/black-character/black-character';
import { CharacterOrchestratorService } from '../../services/CharacterOrchestrator/CharacterOrchestratorService';
import { PurpleCharacter } from '../characters/purple-character/purple-character/purple-character';
import { YellowCharacter } from '../characters/yellow-character/yellow-character/yellow-character';

@Component({
  selector: 'app-auth-wrapper',
  imports: [RouterModule,PurpleCharacter,BlackCharacter,YellowCharacter],
  templateUrl: './auth-wrapper.html',
  styleUrl: './auth-wrapper.css',
})
export class AuthWrapper {
  

  constructor(private characterOrchestratorService: CharacterOrchestratorService) {}


  ngAfterViewInit() {
    this.characterOrchestratorService.playEntrance();
  }

}
