import { Component, signal, WritableSignal } from '@angular/core';
import { Input ,Output  } from '@angular/core';
import { Observable } from 'rxjs';
import { EventEmitter } from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { forwardRef } from '@angular/core';




export interface DropdownItem {
  id: number;
  name: string;
}

@Component({
  selector: 'app-async-dropdown',
  imports: [],
  templateUrl: './async-dropdown.html',
  styleUrl: './async-dropdown.css',
})
export class AsyncDropdown<T extends DropdownItem>  {

  isOpen = signal(false);
  isLoading = signal(false);
  items: WritableSignal<T[]> = signal([]);

  selectedItem: T|null = null;


  @Input() placeholder = 'Select item';
  @Input() fetchFn!: ()=> Observable<T[]> ;

  @Output() onSelected = new EventEmitter<T>();



  toggle() {
    this.isOpen.update(open => !open);


    if (this.isOpen() && this.items().length === 0) {
      this.load();
    }
  }

  load() {
    this.isLoading.set(true);

    this.fetchFn().subscribe({
      next: (res) => {
        this.items.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading dropdown items', err);
        this.isLoading.set(false);
      }
    });
  }

  selectItem(item: any) {
    this.selectedItem = item;

    this.onSelected.emit(item);
    this.isOpen.set(false);
  }




}
