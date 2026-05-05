import { Component, signal, effect, computed } from '@angular/core';

import { EmailFieldComponent } from '../../../../core/shared/ui/input/email-field-component/email-field-component';
import { PasswordFieldComponent } from '../../../../core/shared/ui/input/password-field-component/password-field-component';
import { CharacterOrchestratorService } from '../../services/CharacterOrchestrator/CharacterOrchestratorService';
import { AuthStore } from '../../store/auth.store';
import { CommonModule } from '@angular/common';



export type LoginCredentials = {
    email: string;
    password: string;
}



@Component({
  selector: 'app-login-page',
  imports: [EmailFieldComponent,PasswordFieldComponent,CommonModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {

  isPasswordVisible = signal<boolean>(false)

  loginState = signal<LoginCredentials>({
    email: "ddd",
    password: '',
  })



  readonly isLoading = computed(() =>
    this.authStore.loadingState$().status === 'loading'
  );

  readonly errorMessage = computed(() => {
    const loadState = this.authStore.loadingState$();
    if (loadState.status === 'error') {
      return loadState.error;
    }
    return null;
  })
    
 
 


  constructor(private animationOrchestrator: CharacterOrchestratorService , protected authStore: AuthStore) {
    effect(() => {
      const load = this.authStore.loadingState$();
      if (load.status === 'error') {
          this.animationOrchestrator.makeCharacterSad();
      }
    })
  }

    

  onEmailChange(newEmail:string){
    this.loginState.update(old =>{
      return {
        ...old,
        email:newEmail
      }
    })
  }

  onPasswordChange(newPassword:string){
    this.loginState.update(old =>{
      return {
        ...old,
        password:newPassword
      }
    })
  }


  onPasswordVisibiltyChange(isVisible:boolean){
    if (isVisible){
      this.animationOrchestrator.makeCharacterAnxious()
    }
    else{
      this.animationOrchestrator.reset();
    }
  }

  onEmailFocus(){
    this.animationOrchestrator.onEmailStartTyping()
  }
  onEmailBlur(){
    console.log('User finished editing email');
    this.animationOrchestrator.onEmailTypingFinished()
  }



  login(event: Event){
    this.authStore.login({
      email:this.loginState().email,
      password:this.loginState().password
    }) 
  }

}
