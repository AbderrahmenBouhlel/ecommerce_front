import { CreateFilterDTO } from "../apis/models/filter/createFilter.api";
import { FilterDTO, FilterValueDTO } from "../apis/models/filter/getFilters.api";
import { UpdateFilterDTO } from "../apis/models/filter/updateFilter.api";
import { CreateFilterValueDTO } from "../apis/models/filter-value/createFilterValue.api";

export interface FilterValue {
  id: number;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface Filter {
  id: number;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  values: FilterValue[];
}


export function mapFilterValueDTOToFilterValue(dto: FilterValueDTO): FilterValue {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: dto.description,
    isActive: dto.isActive,
    createdAt: dto.createdAt,
  };
}

export function mapCreateFilterValueDTOToFilterValue(dto: CreateFilterValueDTO): FilterValue {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: dto.description,
    isActive: dto.isActive,
    createdAt: dto.createdAt,
  };
}


export function mapFilterDTOToFilter(dto: FilterDTO): Filter {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: dto.description,
    isActive: dto.isActive,
    createdAt: dto.createdAt,
    updatedAt: undefined,
    values: dto.values.map(mapFilterValueDTOToFilterValue)
  };
}

export function mapCreateFilterDTOToFilter(dto: CreateFilterDTO): Filter {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: dto.description,
    isActive: dto.isActive,
    createdAt: dto.createdAt,
    updatedAt: undefined,
    values: []
  };
}

export function mapUpdateFilterDTOToFilter(dto: UpdateFilterDTO, existingFilter?: Filter): Filter {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: dto.description,
    isActive: dto.isActive,
    createdAt: existingFilter?.createdAt ?? dto.updatedAt,
    updatedAt: dto.updatedAt,
    values: existingFilter?.values ?? [],
  };
}



export const fakeFilters: Filter[] = [
  {
    id: 1,
    name: "TYPE",
    slug: "type",
    description: "Product type",
    isActive: true,
    createdAt: "2026-04-21T00:00:00Z",
    values: [
      { id: 101, name: "Cargo", slug: "cargo", description: "Cargo type", isActive: true, createdAt: "2026-04-21T00:00:00Z" },
      { id: 102, name: "Tailoring", slug: "tailoring", description: "Tailoring type", isActive: true, createdAt: "2026-04-21T00:00:00Z" },
      { id: 103, name: "Jeans", slug: "jeans", description: "Jeans type", isActive: true, createdAt: "2026-04-21T00:00:00Z" },
      { id: 104, name: "Short", slug: "short", description: "Short type", isActive: true, createdAt: "2026-04-21T00:00:00Z" }
    ]
  },
  {
    id: 2,
    name: "STYLE",
    slug: "style",
    description: "Product style",
    isActive: true,
    createdAt: "2026-04-21T00:00:00Z",
    values: [
      { id: 201, name: "Casual", slug: "casual", description: "Casual style", isActive: true, createdAt: "2026-04-21T00:00:00Z" },
      { id: 202, name: "Formal", slug: "formal", description: "Formal style", isActive: true, createdAt: "2026-04-21T00:00:00Z" },
      { id: 203, name: "Streetwear", slug: "streetwear", description: "Streetwear style", isActive: true, createdAt: "2026-04-21T00:00:00Z" },
      { id: 204, name: "Sport", slug: "sport", description: "Sport style", isActive: true, createdAt: "2026-04-21T00:00:00Z" }
    ]
  },
  {
    id: 3,
    name: "FIT",
    slug: "fit",
    description: "Product fit",
    isActive: true,
    createdAt: "2026-04-21T00:00:00Z",
    values: [
      { id: 301, name: "Slim", slug: "slim", description: "Slim fit", isActive: true, createdAt: "2026-04-21T00:00:00Z" },
      { id: 302, name: "Regular", slug: "regular", description: "Regular fit", isActive: true, createdAt: "2026-04-21T00:00:00Z" },
      { id: 303, name: "Loose", slug: "loose", description: "Loose fit", isActive: true, createdAt: "2026-04-21T00:00:00Z" },
      { id: 304, name: "Oversized", slug: "oversized", description: "Oversized fit", isActive: true, createdAt: "2026-04-21T00:00:00Z" }
    ]
  },
  {
    id: 4,
    name: "MATIERE",
    slug: "matiere",
    description: "Material",
    isActive: true,
    createdAt: "2026-04-21T00:00:00Z",
    values: [
      { id: 401, name: "Coton", slug: "coton", description: "Cotton material", isActive: true, createdAt: "2026-04-21T00:00:00Z" },
      { id: 402, name: "Lin", slug: "lin", description: "Linen material", isActive: true, createdAt: "2026-04-21T00:00:00Z" },
      { id: 403, name: "Laine", slug: "laine", description: "Wool material", isActive: true, createdAt: "2026-04-21T00:00:00Z" },
      { id: 404, name: "Denim", slug: "denim", description: "Denim material", isActive: true, createdAt: "2026-04-21T00:00:00Z" }
    ]
  }
];