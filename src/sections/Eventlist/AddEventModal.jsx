import React, { useState } from 'react';
import styles from './AddEventModal.module.css';
import { AiOutlineClose } from "react-icons/ai";
import { SlCalender } from 'react-icons/sl';
import { MdAccessTimeFilled } from "react-icons/md";
import { getEventcreate } from '../../api/Serviceapi';

const AddEventModal = ({ closeModal, onevent }) => {

  const [formdata, setFormdata] = useState({
    title: "",
    description: "",
    date: "",
    time: ""
  })

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    date: '',
    time: ''
  });

  const convertTo12Hour = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(':');
    const hr = +hour % 12 || 12;
    const ampm = +hour >= 12 ? 'PM' : 'AM';
    return `${hr}:${minute} ${ampm}`;
  };


  let validateForm = () => {
    let newErrors = {};
    if (!formdata.title.trim()) newErrors.title = "Event title is required";
    if (!formdata.description.trim()) newErrors.description = "Event description is required";
    if (!formdata.date) newErrors.date = "Event date is required";
    // if (!formdata.time) newErrors.time = "Event time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formattedData = {
          ...formdata,
          time: convertTo12Hour(formdata.time)
        };
        const res = await getEventcreate(formattedData);
        if (onevent) onevent();
      } catch (err) {
        console.log(err.response?.data.message);
      }
      console.log("Submitting event:", formdata);
      closeModal();
    }
  };

  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_content}>
        <div className={styles.header}>
          <h2>Add Event</h2>
          <span className={styles.close_icon} onClick={closeModal}><AiOutlineClose /></span>
        </div>
        <form className={styles.form}>
          <div className={styles.input_group}>
            <label htmlFor="title">Event Title<span className={styles.required}>*</span></label>
            <input type="text" value={formdata.title} id="title" placeholder="Seminar on UI/UX" onChange={(e) => { setFormdata({ ...formdata, title: e.target.value }), setErrors({ ...errors, title: '' }) }} />
            <p className={styles.error}>{errors.title}</p>
          </div>

          <div className={styles.input_group}>
            <label htmlFor="description">Description<span className={styles.required}>*</span></label>
            <textarea id="description" value={formdata.description} placeholder="Event description here..." onChange={(e) => { setFormdata({ ...formdata, description: e.target.value }), setErrors({ ...errors, description: '' }) }}></textarea>
            <p className={styles.error}>{errors.description}</p>
          </div>

          <div className={styles.row}>
            <div className={`${styles.input_group} ${styles.input_icon}`} style={{ flex: 1 }}>
              <label htmlFor="date">Date<span className={styles.required}>*</span></label>
              <input type="date" id="date" value={formdata.date} onChange={(e) => { setFormdata({ ...formdata, date: e.target.value }), setErrors({ ...errors, date: '' }) }} required />
              <p className={styles.error}>{errors.date}</p>
            </div>

            <div className={`${styles.input_group} ${styles.input_icon}`} style={{ flex: 1 }}>
              <label htmlFor="time">Time </label>
              <input type="time" id="time" value={formdata.time} onChange={(e) => { setFormdata({ ...formdata, time: e.target.value }), setErrors({ ...errors, time: '' }) }} />
              <p className={styles.error}>{errors.time}</p>
            </div>
          </div>

          <button type="submit" onClick={handleSubmit} className={styles.submit_btn}>Create</button>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
