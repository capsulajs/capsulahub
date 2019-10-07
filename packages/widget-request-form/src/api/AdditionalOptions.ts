export interface Option {
  id: string;
  label: string;
}

export default interface AdditionalOptions {
  name: string;
  options: Option[];
}
