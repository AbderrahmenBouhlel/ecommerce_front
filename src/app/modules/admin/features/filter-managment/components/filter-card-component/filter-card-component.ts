import { Component, computed, input, Signal } from '@angular/core';
import { Filter } from '../../../../stores/FilterManagementStore/models/filter.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-filter-card-component',
    templateUrl: './filter-card-component.html',
    styleUrl: './filter-card-component.css',
    imports: [CommonModule]
})
export class FilterCardComponent {
  readonly filter = input.required<Filter>();
  readonly MAX_FILTER_VALUES_TO_SHOW = 5;



  isMoreValues: Signal<boolean> = computed(() => this.filter().values.length > this.MAX_FILTER_VALUES_TO_SHOW);
  name: Signal<string> = computed(() => this.filter().name);
  description: Signal<string> = computed(() => this.filter().description)
}
