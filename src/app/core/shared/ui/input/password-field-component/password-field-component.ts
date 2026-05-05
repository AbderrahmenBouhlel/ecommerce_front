import { Component, EventEmitter, input, InputSignal, Output, Signal, signal } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-password-field-component',
  imports: [MatIconModule],
  templateUrl: './password-field-component.html',
  styleUrl: './password-field-component.css',
})
export class PasswordFieldComponent  {
  label :InputSignal<string> = input("")
  value :InputSignal<string> = input("")
  disabled :InputSignal<boolean> = input(false)
  @Output() inputChangeEventEmitter : EventEmitter<string> = new EventEmitter<string>()
  @Output() passwordVisibilityToggleEventEmitter : EventEmitter<boolean> = new EventEmitter<boolean>()

  
  isPasswordVisible = signal(false);


  handleInputChange(event:Event){
  
    const input = event.target as HTMLInputElement;
    this.inputChangeEventEmitter.emit(input.value)

  }
  

  togglePasswordVisibility(){
    this.isPasswordVisible.set(!this.isPasswordVisible())
    this.passwordVisibilityToggleEventEmitter.emit(this.isPasswordVisible())
  }
}
