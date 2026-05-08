export type SubmissionState =
  | 'idle'
  | 'success'
  | 'failed';

  
export type VariantSku = {
  id: number; // local draft id
  size: string;
  stock: number; // better as number than string
};

export type Result<T> = {
  success: boolean;
  error?: string;
  data?: T;
};

export interface VariantDraftImage {
  id: number;
  url: string;
  image: File | null;
}

export type VariantDraft = {
  id:  number;
  color_name: string;
  color_code: string;
  images: VariantDraftImage[];
  skus: VariantSku[];
}

export type BasicProductInfo = {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number | null;
  submitted: boolean; // To track if the basic info has been submitted successfully
}





export type VariantCreationState = {
  items : VariantDraft[];
  step_2_submitted: boolean;
  step_3_submitted: boolean;
}

