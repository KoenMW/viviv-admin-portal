type ToastPromiseMessage = {
  loading: string;
  success: string;
  error: string;
};

type ToastType = "success" | "error" | "info" | "warning" | "loading";

let toaster: HTMLDivElement | null = null;

const createToast = (type: ToastType): [HTMLDivElement, HTMLDivElement] => {
  if (!toaster) {
    toaster = document.querySelector("#toaster");
  }
  if (!toaster) {
    console.error(
      "Toaster element not found, creating a new one (this is a fallback)."
    );
    toaster = document.createElement("div");
    toaster.id = "toaster";
    document.body.appendChild(toaster);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toaster.appendChild(toast);

  const content = document.createElement("div");
  content.className = "toast-content";
  toast.appendChild(content);

  const closeBtn = document.createElement("button");
  closeBtn.className = "toast-close";
  closeBtn.innerText = "X";

  closeBtn.onclick = () => {
    toast.remove();
  };

  toast.appendChild(closeBtn);

  return [toast, content];
};

export const AddToast = (message: string, type: ToastType = "info") => {
  const [toast, content] = createToast(type);
  content.innerText = message;

  setTimeout(() => {
    toast.remove();
  }, 3000);
};

export const AddToastPromise = <T>(
  promise: Promise<T>,
  messages: ToastPromiseMessage
) => {
  const [toast, content] = createToast("loading");
  content.innerText = messages.loading;

  promise
    .then(() => {
      toast.className = "toast success";
      content.innerText = messages.success;
    })
    .catch(() => {
      toast.className = "toast error";
      content.innerText = messages.error;
    })
    .finally(() => {
      setTimeout(() => {
        toast.remove();
      }, 3000);
    });
};
