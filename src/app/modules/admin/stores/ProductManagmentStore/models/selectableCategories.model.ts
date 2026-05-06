

export type SelectableCategoryGender = "MALE" | "FEMALE";


export interface SelectableCategory {
  id: number;
  name: string;
  gender: SelectableCategoryGender;
  isActive: boolean;
}



export interface SelectableCategoryDTO {
  id: number;
  name: string;
  gender: SelectableCategoryGender;
  isActive: boolean;
}



export function mapSelectableCategoryDTOToSelectableCategory(dto: SelectableCategoryDTO): SelectableCategory {
  return {
    id: dto.id,
    name: dto.name,
    gender: dto.gender,
    isActive: dto.isActive,
  };
}
