import { createContext, useContext, useState } from "react";

const AlertDialogContext = createContext();

export const AlertDialogProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState({
    title: "",
    description: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const openDialog = (props) => {
    setDialogProps(props);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return <AlertDialogContext.Provider value={{ isOpen, openDialog, closeDialog, dialogProps }}>{children}</AlertDialogContext.Provider>;
};

export const useAlertDialog = () => useContext(AlertDialogContext);
