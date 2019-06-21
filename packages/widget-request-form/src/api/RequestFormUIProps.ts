import { SubmittedData, Language } from './index';

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
  selectedMethodPath: string;
}
