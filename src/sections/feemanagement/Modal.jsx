import { useState } from "react";
import styles from "./Modal.module.css";
const Modal = ({
  isOpen,
  onClose,
  children,
  sendReqColor,
  setReqSendColor,
  status
}) => {
  if (!isOpen) return null;
  function close() {
    onClose();
  }
  function sendReq() {
    onClose();
    setReqSendColor(true);
   status('Requested Fee');
  }
  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        {/* {children} */}
        <div className={styles.div}>Are you sure want to send request?</div>
        <div className={styles.button}>
          <div className={`${styles.btn} ${styles.extraClass}`}>
            <button
              className={styles.gradientbutton1}
              role="button"
              onClick={close}
            >
              Cancel
            </button>
          </div>

          <div className={styles.btn}>
            <button className={styles.gradientbutton2} onClick={sendReq}>
              Send request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Modal;
