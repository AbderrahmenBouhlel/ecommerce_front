
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';


@Component({
  selector: 'app-email-field-component',
  imports: [],
  templateUrl: './email-field-component.html',
  styleUrl: './email-field-component.css',
})
export class EmailFieldComponent  {

  @Input() label :String = ""
  @Input() value :String = ""
  @Input() disabled :boolean = false
  @Output() inputChangeEventEmitter : EventEmitter<string> = new EventEmitter<string>()
  @Output() focusEventEmitter : EventEmitter<void> = new EventEmitter<void>()
  @Output() blurEventEmitter : EventEmitter<void> = new EventEmitter<void>()

  



  handleInputChange(event:Event){
    const input = event.target as HTMLInputElement;
    this.inputChangeEventEmitter.emit(input.value)
  }

  handleFocus(){
    this.focusEventEmitter.emit()
  }

  handleBlur() {
    this.blurEventEmitter.emit()
  }
  

}

