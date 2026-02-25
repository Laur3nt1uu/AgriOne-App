import { toast } from "react-hot-toast";
import { getErrorMessage } from "../api/endpoints";

export const toastError = (err, fallback = "A apărut o eroare.") => {
  toast.error(getErrorMessage(err, fallback));
};

export const toastSuccess = (message) => {
  if (message) toast.success(message);
};
