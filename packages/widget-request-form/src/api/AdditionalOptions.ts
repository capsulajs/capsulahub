export interface Option {
  id: string;
  label: string;
}

export default interface AdditionalOptions {
  label: string;
  fieldName: string;
  options: Option[];
  initialValue?: string;
}
