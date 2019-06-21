import { ModalStatus } from './index';

export default interface ModalUIProps {
  /* Title text in the header of modal */
  title: string;
  /* Nested content inside modal */
  children: any;
  /* Modal opened / closed according to this */
  isOpen?: boolean;
  /* Callback that triggers each time when isOpen changes */
  onToggle?: (status: ModalStatus) => void;
}
