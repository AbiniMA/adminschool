// src/api/userService.js
import { FaCertificate } from "react-icons/fa6";
import apiService from "./apiService";
import Form from "antd/es/form/Form";

export const getUser = (limit, offset, value, courseId, status, batchId) => {
  return apiService.get(
    `/user?limit=${limit}&offset=${offset}&value=${value}&courseId=${courseId}&inStatus=${status}&batchId=${batchId}`
  );
};
export const getUserFilter = (value) => {
  return apiService.get(`/user?value=${value}`);
};
export const getBatch = () => {
  return apiService.get(`/batch`);
};

export const getUserId = (id) => {
  return apiService.get(`/user?id=${id}`);
};

export const LoginUser = (email, password) => {
  return apiService.post(`/user/login`, { email, password });
};

//postcourse
export const postCourse = (courseData) => {
  return apiService.post(`/course/create`, courseData);
};

export const getCourse = (limit, offset) => {
  return apiService.get(`/course/count?limit=${limit}&page=${offset}`);
};

//getcoursebyid
export const getCourseById = (id) => {
  return apiService.get(`/course/count?courseId=${id}`);
};
//editcourse
export const editCouse = (id, editData) => {
  return apiService.put(`/course/${id}`, editData);
};
//getbatch
export const getCourseBatch = () => {
  return apiService.get(`/batch`);
};
//postbatch
export const postCourseBatch = (data) => {
  return apiService.post(`/batch/create`, data);
};
//putbatch
export const updateCourseBatch = (id, editdata) => {
  return apiService.put(`/batch/${id}`, editdata);
};
// get batch by courseId
export const getCourseBatchByCourseId = (courseId, limit, offset) => {
  return apiService.get(
    `/batch?courseId=${courseId}&limit=${limit}&page=${offset}`
  );
};

export const addUser = (FormData) => {
  let data = {
    name: FormData.name,
    email: FormData.student_email,
    mobileNo: FormData.student_mobile,
    fatherName: FormData.student_father,
    alterMobileNo: FormData.parent_number,
    address: FormData.student_address,
    blood: FormData.student_bloodgroup,
    qualification: FormData.student_qualification,
    aadharURL: FormData.student_aadhar,
    certificateURL: FormData.student_original,
    profileURL: FormData.student_profile,
    courseId: FormData.student_course,
    batchId: FormData.student_batch,
    DOB: FormData.student_dob,
  };
  return apiService.post(`/user/create`, data);
};

export const updateUser = (FormData, id) => {
  let data = {
    name: FormData.name,
    email: FormData.student_email,
    mobileNo: FormData.student_mobile,
    fatherName: FormData.student_father,
    alterMobileNo: FormData.parent_number,
    address: FormData.student_address,
    blood: FormData.student_bloodgroup,
    qualification: FormData.student_qualification,
    aadharURL: FormData.student_aadhar,
    certificateURL: FormData.student_original,
    profileURL: FormData.student_profile,
    courseId: FormData.student_course,
    batchId: FormData.student_batch,
    DOB: FormData.student_dob,
    inStatus: FormData.inStatus,
  };
  return apiService.put(`/user/${id}`, data);
};

export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file); // key name must be 'file'

  return apiService.post("file/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteUserId = (id) => {
  return apiService.delete(`user/${id}`);
};

export const getBatchName = () => {
  return apiService.get(`/batch/batch`);
};

export const getBatchbyid = (id) => {
  return apiService.get(`/batch/batch?courseId=${id}`);
};

// events
export const getEvents = (limit, offset, status) => {
  return apiService.get(
    `/event?limit=${limit}&offset=${offset}&status=${status}`
  );
};

export const getEventcreate = (formdata) => {
  return apiService.post(`/event/create`, formdata);
};

export const deleteEvent = (id) => {
  return apiService.delete(`/event/${id}`);
};

export const updateEvent = (formdata, id) => {
  let data = {
    title: formdata.title,
    description: formdata.description,
    date: formdata.date,
    time: formdata.time,
  };
  return apiService.put(`/event/${id}`, data);
};

export const getEventById = (id) => {
  return apiService.get(`/event/${id}`);
};

// attendence
export const getAttendance = (
  limit,
  offset,
  searchtext,
  courseId,
  batchId,
  date
) => {
  return apiService.get(
    `/attendance?limit=${limit}&page=${offset}&value=${searchtext}&courseId=${courseId}&batchId=${batchId}&date=${date}`
  );
};

export const getAttendancerate = (date, courseId, batchId) => {
  return apiService.get(
    `/attendance/rate?date=${date}&courseId=${courseId}&batchId=${batchId}`
  );
};

// leave request

export const getLeaveRequest = (limit, offset, date, status, value) => {
  return apiService.get(
    `/leave?limit=${limit}&offset=${offset}&date=${date}&status=${status}&value=${value}`
  );
};

export const getLeaveRequestById = (id) => {
  return apiService.get(`/leave/${id}`);
};

export const updateLeaveRequest = (id, status) => {
  return apiService.put(`/leave/${id}`, { status: status });
};

// fee

export const getFee = (
  limit,
  offset,
  courseId,
  batchId,
  semester,
  searchtext
) => {
  return apiService.get(
    `/fee?limit=${limit}&offset=${offset}&courseId=${courseId}&batchId=${batchId}&noOfsem=${semester}&value=${searchtext}`
  );
};

export const getFeeById = (id) => {
  return apiService.get(`/fee/?_id=${id}`);
};

export const createFee = (formdata) => {
  return apiService.post(`/fee/create`, formdata);
};

export const calcfee = (courseId, batchId, semester, searchText) => {
  return apiService.get(
    `/fee/cal?courseId=${courseId}&batchId=${batchId}&noOfsem=${semester}&value=${searchText}`
  );
};

// dashboard

export const getDashboardUser = () => {
  return apiService.get(`/user`);
};

export const getDashboardEvents = () => {
  return apiService.get(`/event`);
};

export const getDashboardLeave = () => {
  return apiService.get(`/leave`);
};
