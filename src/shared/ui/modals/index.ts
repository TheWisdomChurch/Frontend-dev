// Single entry point for all modal components.
// Use: import { BaseModal, SuccessModal, ... } from '@/shared/ui/modals'

export {
  BaseModal,
  modalStyles,
  SuccessModal,
  ServiceUnavailableSheet,
} from './Modal';
export type {
  BaseModalProps,
  SuccessModalProps,
  ServiceUnavailableSheetProps,
} from './Modal';

export { EventDetailsModal } from './EventModal';
export { WorkforceRegistrationModal } from './WorkforceRegistrationModal';
export { ReminderModal } from './reminderModal';
export { EventRegistrationModal } from './FormModal';
export { default as GivingModal } from './GivingModal';
export { default as JoinCommunityModal } from './joinUsModal';
export { default as EventAdModal } from './EventAdModal';
export { default as ConfessionPopup } from './ConfessionPopup';
export { JoinUsModal } from './DepartmentModals';
