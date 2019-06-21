import { Language } from './index';

/** The data that is received in the callback function after a user has submitted a form */
export default interface SubmittedData {
  /** Language of the request arguments */
  language: Language;
  /** An array of the stringified values for each argument of the selected method */
  requestArgs: string[];
}
