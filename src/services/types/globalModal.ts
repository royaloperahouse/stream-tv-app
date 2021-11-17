export type TDefaultGlobalModalContentProps = {
  confirmActionHandler?: () => void;
  rejectActionHandler?: () => void;
  cancelActionHandler?: () => void;
};

export type TGlobalModalContentProps = {
  [key: string]: any;
} & TDefaultGlobalModalContentProps;
