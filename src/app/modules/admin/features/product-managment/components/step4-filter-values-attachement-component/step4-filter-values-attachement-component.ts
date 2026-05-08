import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ProductCreationService } from '../../services/ProductCreationService';

type AllowedFilterValue = {
  id: number;
  label: string;
  selected: boolean;
};

type AllowedFilter = {
  id: number;
  name: string;
  values: AllowedFilterValue[];
};

@Component({
  selector: 'app-step4-filter-values-attachement-component',
  imports: [],
  templateUrl: './step4-filter-values-attachement-component.html',
  styleUrl: './step4-filter-values-attachement-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Step4FilterValuesAttachementComponent {
  private readonly productCreationService = inject(ProductCreationService);

  // TODO: replace with API-backed category allowed filters.
  readonly filters = signal<AllowedFilter[]>([
    {
      id: 1,
      name: 'STYLE',
      values: [
        { id: 101, label: 'street wear', selected: false },
        { id: 102, label: 'casual', selected: false },
      ],
    },
    {
      id: 2,
      name: 'FIT',
      values: [
        { id: 201, label: 'baggy', selected: false },
        { id: 202, label: 'skinny', selected: false },
        { id: 203, label: 'straight', selected: false },
      ],
    },
    {
      id: 3,
      name: 'MATIERE',
      values: [
        { id: 301, label: 'denim', selected: false },
      ],
    },
    {
      id: 4,
      name: 'LENGTH',
      values: [
        { id: 401, label: 'court', selected: false },
        { id: 402, label: 'longue', selected: false },
      ],
    },
  ]);

  readonly selectedCount = computed(() =>
    this.filters().reduce((acc, filter) => acc + filter.values.filter(v => v.selected).length, 0),
  );

  toggleValue(filterId: number, valueId: number): void {
    this.filters.update((filters) =>
      filters.map((filter) => {
        if (filter.id !== filterId) return filter;

        return {
          ...filter,
          values: filter.values.map((value) =>
            value.id === valueId ? { ...value, selected: !value.selected } : value,
          ),
        };
      }),
    );
  }

  // For future API payload:
  // [{ filter_id, value_ids: [...] }]
  getSelectionPayload(): Array<{ filter_id: number; value_ids: number[] }> {
    return this.filters()
      .map((filter) => ({
        filter_id: filter.id,
        value_ids: filter.values.filter(v => v.selected).map(v => v.id),
      }))
      .filter((entry) => entry.value_ids.length > 0);
  }

  next(): void {
    // TODO: integrate with store endpoint when available.
    // const payload = this.getSelectionPayload();
    this.productCreationService.goNextStep();
  }

  previous(): void {
    this.productCreationService.goPreviousStep();
  }

}
