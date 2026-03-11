const Modal = ({ open, children }) => {
  if (!open) return null;
  return <div className="modal">{children}</div>;
};

export default Modal;
