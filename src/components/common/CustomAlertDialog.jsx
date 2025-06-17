import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useAlertDialog } from "@/context/AlertDialogProvider";

const CustomAlertDialog = () => {
  const { isOpen, closeDialog, dialogProps } = useAlertDialog();

  return (
    <AlertDialog open={isOpen} onOpenChange={closeDialog} dir="rtl">
      <AlertDialogContent onOverlayClick={() => closeDialog()} className="bg-white border-0">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-right">{dialogProps.title}</AlertDialogTitle>
          <AlertDialogDescription className="text-right">{dialogProps.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              dialogProps.onCancel?.();
              closeDialog();
            }}
          >
            {dialogProps.cancelText || "انصراف"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              dialogProps.onConfirm?.();
              closeDialog();
            }}
            className="bg-primary hover:bg-primary-shade-3 text-white"
          >
            {dialogProps.confirmText || "تایید"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlertDialog;
