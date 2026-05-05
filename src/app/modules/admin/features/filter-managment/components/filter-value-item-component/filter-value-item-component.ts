import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FilterValue } from '../../../../stores/FilterManagementStore/models/filter.model';

@Component({
  selector: 'app-filter-value-item-component',
  imports: [CommonModule, MatIconModule],
  templateUrl: './filter-value-item-component.html',
  styleUrl: './filter-value-item-component.css',
})
export class FilterValueItemComponent {
  readonly filterValue = input.required<FilterValue>();

  readonly toggleEvent = output<FilterValue>();
  readonly deleteEvent = output<FilterValue>();

  protected onToggleClick(): void {
    this.toggleEvent.emit(this.filterValue());
  }

  protected onDeleteClick(): void {
    this.deleteEvent.emit(this.filterValue());
  }
}