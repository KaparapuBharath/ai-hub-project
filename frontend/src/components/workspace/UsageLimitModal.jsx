import Modal from "../ui/Modal";

const UsageLimitModal = ({ open }) => {
  return (
    <Modal open={open}>
      <h3>Usage limit reached</h3>
    </Modal>
  );
};

export default UsageLimitModal;
