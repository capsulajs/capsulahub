import { SubmittedData, Language, AdditionalOptions } from './index';

export default interface RequestFormUIProps {
  /** Callback that will be triggered after a user has submitted a valid data in the form */
  onSubmit: (submittedData: SubmittedData) => void;
  /** The language and the value for each editor in the form */
  content: {
    /** Language for all the editors in the form */
    language: Language;
    /**
     * The value of each editor in the form
     * If a string is provided - the same value will be applied for each editor in the form
     */
    requestArgs: string[] | string;
  };
  /** selectedService/selectedMethodInTheService */
  selectedMethodPath?: string;
  /**
   * The visibility of "Language" dropdown
   * @default true
   */
  isChangeLanguageVisible?: boolean;
  /**
   * The visibility of "Args count"" dropdown
   * @default true
   */
  isChangeArgsCountVisible?: boolean;
  /**
   * The visibility of selected methods path
   * @default true
   */
  isSelectedMethodPathVisible?: boolean;
  /**
   * The visibility of line numbers in the editor
   * @default true
   */
  isLineNumberVisible?: boolean;
  /**
   * The title of the form
   * @default "Request Form"
   */
  title?: string;
  /**
   * The width of the editor
   * @default "100%"
   */
  width?: string;
  /**
   * The height of the editor
   * @default "100%"
   */
  height?: string;
  /**
   * If provided, the dropdown with these options will appear in the form and the selected value will be included in
   * SubmittedData
   */
  additionalOptions?: AdditionalOptions;
}
