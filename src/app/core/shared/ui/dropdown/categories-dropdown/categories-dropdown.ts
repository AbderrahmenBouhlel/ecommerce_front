import { Component, computed, forwardRef, inject, input, Input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ProductsStore } from '../../../../../modules/admin/stores/ProductManagmentStore/products.store';
import { SelectableCategory } from '../../../../../modules/admin/stores/ProductManagmentStore/models/product.model';

  
@Component({
  selector: 'app-categories-dropdown',
  templateUrl: './categories-dropdown.html',
  styleUrl: './categories-dropdown.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategoriesDropdown),
      multi: true
    }
  ]
})
export class CategoriesDropdown implements ControlValueAccessor {

  public categories = computed(() => this.productsStore.selectableCategoriesState$().items);

  isInvalid = input<boolean>(false);

  selectedCategory = signal<SelectableCategory | null>(null);

  selectedGenderLabel = computed(() => {
    const category = this.selectedCategory();
    if (!category) {
      return null;
    }

    return category.gender === 'MALE' ? 'Men' : 'Women';
  });

  groupedCategories = computed(() => {
    const items = this.categories();
    return {
      MALE: items.filter(c => c.gender === 'MALE'),
      FEMALE: items.filter(c => c.gender === 'FEMALE')
    };
  });
  
  // UI state
  isOpen = signal(false);

  // CVA callbacks
  private onChange = (value: number | null) => {};
  private onTouched = () => {};

  constructor(private productsStore: ProductsStore) {
    // lazy load if not already loaded
    if (this.categories().length === 0) {
      this.productsStore.loadSelectableCategories().subscribe();
    }
  }

  // -------------------------
  // UI logic
  // -------------------------

  toggle() {
    this.isOpen.update(v => !v);
  }

  handleBlur() {
    // close dropdown when it loses focus
    this.onTouched();
    this.isOpen.set(false);
  }

  selectCategory(category: SelectableCategory) {
    this.selectedCategory.set(category);

    // 🔥 sync to form
    this.onChange(category.id);   
    this.onTouched();

    this.isOpen.set(false);
  }

  getSelectedName(): string | null {
    const category = this.selectedCategory();
    if (category) {
      return category.name;
    }
    return null;
  }

  // -------------------------
  // ControlValueAccessor implementation
  // -------------------------

  // write value from form to component
  writeValue(value: number | null): void {
    if (value === null)  return;

    const category = this.categories().find(c => c.id === value) ?? null;
    if (category) {
      this.selectedCategory.set(category);
    } else {
      // reset form value if invalid
      console.warn(`Category with id ${value} not found`);
      this.selectedCategory.set(null);
      this.onChange(null); 
    }
  }


  registerOnChange(fn: any): void {
    // write value from component to form
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // optional later (disable UI)
  }
}