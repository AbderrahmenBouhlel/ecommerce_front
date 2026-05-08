import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type SizeRow = {
  id: number;
  size: string;
  physicalStock: string;
};

type VariantTab = {
  id: number;
  colorName: string;
  colorCode: string;
  rows: SizeRow[];
};

@Component({
  selector: 'app-step3-skus-creation-component',
  imports: [],
  templateUrl: './step3-skus-creation-component.html',
  styleUrl: './step3-skus-creation-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Step3SkusCreationComponent {

  readonly variants = signal<VariantTab[]>([
    {
      id: 1,
      colorName: 'midnight',
      colorCode: '#111827',
      rows: [],
    },
    {
      id: 2,
      colorName: 'sand',
      colorCode: '#d6b48c',
      rows: [],
    },
  ]);

  readonly selectedVariantId = signal<number>(1);

  readonly selectedVariant = computed(() => {
    const selectedId = this.selectedVariantId();
    return this.variants().find((variant) => variant.id === selectedId) ?? null;
  });

  selectVariant(variantId: number): void {
    this.selectedVariantId.set(variantId);
  }

  addSizeRow(): void {
    const selectedVariant = this.selectedVariant();
    if (!selectedVariant) {
      return;
    }

    const newRow: SizeRow = {
      id: Date.now(),
      size: '',
      physicalStock: '',
    };

    this.variants.update((variants) =>
      variants.map((variant) =>
        variant.id === selectedVariant.id
          ? { ...variant, rows: [...variant.rows, newRow] }
          : variant,
      ),
    );
  }

  updateRowValue(rowId: number, field: 'size' | 'physicalStock', event: Event): void {
    const target = event.target as HTMLInputElement | null;
    const value = target?.value ?? '';
    const selectedVariant = this.selectedVariant();

    if (!selectedVariant) {
      return;
    }

    this.variants.update((variants) =>
      variants.map((variant) => {
        if (variant.id !== selectedVariant.id) {
          return variant;
        }

        return {
          ...variant,
          rows: variant.rows.map((row) =>
            row.id === rowId ? { ...row, [field]: value } : row,
          ),
        };
      }),
    );
  }

  deleteRow(rowId: number): void {
    const selectedVariant = this.selectedVariant();

    if (!selectedVariant) {
      return;
    }

    this.variants.update((variants) =>
      variants.map((variant) => {
        if (variant.id !== selectedVariant.id) {
          return variant;
        }

        return {
          ...variant,
          rows: variant.rows.filter((row) => row.id !== rowId),
        };
      }),
    );
  }

}
