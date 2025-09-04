import React, { useEffect, useState } from "react";
import styles from "./feemenagement.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faSearch,
  faPlus,
  faEye,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import magnification from "../../assets/glass.png";
import Modal from "./Modal";
import ModalView from "./ModalView";
import { FormControl, InputLabel, MenuItem, Select, IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { BiSearchAlt } from "react-icons/bi";
import CloseIcon from '@mui/icons-material/Close';
import { calcfee, createFee, getBatchbyid, getBatchName, getFee, getUser, getUserFilter } from "../../api/Serviceapi";
import Pagination from '@mui/material/Pagination';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import nodata from '../../assets/nodata.jpg'
import Loader from "../../component/loader/Loader";
import Skeleton from '@mui/material/Skeleton';

const theme = createTheme({
  components: {
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          color: '#1f2937', // text-gray-800
          '&.Mui-selected': {
            background: 'linear-gradient(to bottom, #144196, #061530)',
            color: '#fff',
            border: 'none',
          },
          '&:hover': {
            backgroundColor: '#f3f4f6', // hover:bg-gray-100
          },
        },
      },
    },
  },
});
const FeeHome = () => {
  const [showDiv, setShowDiv] = useState(false);
  const [showDivError, setShowDivError] = useState("");
  const [enterName, setEntername] = useState("");
  const [showDiv2, setShowDiv2] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [sendReqColor, setReqSendColor] = useState(false);
  const [studentField, setStudentField] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailField, setEmailField] = useState("");
  const [emailError, setEmailError] = useState("");
  const [courseField, setCourseField] = useState("");
  const [courseError, setCourseError] = useState("");
  const [semError, setSemError] = useState("");
  const [payError, setPayError] = useState('')

  const [batchidField, setbatchidField] = useState("");
  const [feeidError, setFeeidError] = useState("");
  const [feeamountField, setFeeamountField] = useState("");
  const [feeamountError, setFeeamountError] = useState("");
  const [searchText, setSearchText] = useState('');
  const [course, setCourse] = useState([])
  const [batch, setBatch] = useState([])
  const [batchId, setBatchId] = useState('')
  const [courseId, setCourseId] = useState('')
  const [limit, setlimit] = useState(10);
  const [totallist, settotal] = useState(0);
  const [totalpages, setpage] = useState(0);
  const [offset, setoffset] = useState(1);
  const [list, setList] = useState([])
  const [semester, setSemester] = useState('')
  const [updatesemester, setUpdateSemester] = useState('')
  const [payment, setPayment] = useState('')
  const handleSearchChange = (e) => {
    setoffset(1)
    setSearchText(e.target.value);
    setList([])
  };

  const handleClearSearch = () => {
    setList([])
    setSearchText('');
    setoffset(1);
  };



  const handleChange = (event) => {
    setBatchId(event.target.value);
  };

  const handlecourseChange = (event) => {
    const selectedId = event.target.value;
    setCourseId(selectedId);
    setoffset(1);
    setBatchId("");
    getBatchnameid(selectedId);
  };

  const handlesemChange = (event) => {
    const selectedId = event.target.value;
    setSemester(selectedId);
    setoffset(1);
    setList([])

  };

  const handleupdatesemChange = (event) => {
    const selectedId = event.target.value;
    setUpdateSemester(selectedId);
    semValidation(selectedId);
    // setoffset(1);
    // setList([])

  };
  const handlepayment = (event) => {
    const selectedId = event.target.value;
    setPayment(selectedId);
    payValidation(selectedId);

    // setoffset(1);
    // setList([])

  };

  useEffect(() => {
    const totalPages = Math.ceil(totallist / limit);
    setpage(totalPages);
  }, [totallist, limit]);

  const handlePageChange = (event, value) => {
    setList([]);
    if (value === offset) {
      getfeelist();
    } else {
      setoffset(value);
    }
  };

  useEffect(() => {
    getBatchname()
  }, []);

  const handleCourseName = (e) => {
    const selectedCourseId = e.target.value;


    setCourseField(e.target.value);
    courseValidation(e.target.value);
    getBatchnameid(selectedCourseId);
  };

  let getBatchnameid = async (id) => {
    try {
      const res = await getBatchbyid(id);
      const course = res?.data?.data?.find(c => c._id === id);
      setBatch(
        course?.batches
          ? Array.isArray(course.batches)
            ? course.batches
            : [course.batches]
          : []
      );
      // setBatchId("");
    } catch (error) {
      console.error("error", error.response?.data || error);
    }
  };


  let getBatchname = async () => {
    try {
      const res = await getBatchName();
      setCourse(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (error) {
      console.error("error", error.response?.data || error);
    }
  };

  useEffect(() => {
    getfeelist()
  }, [offset, courseId, batchId, semester, searchText]);

  const [loading, setLoading] = useState(false);
  const [id, setID] = useState('')
  let getfeelist = async () => {
    setLoading(true);
    try {
      const res = await getFee(limit, offset - 1, courseId, batchId, semester, searchText)
      console.log(res?.data?.data, 'feelist')
      setList(res?.data?.data?.data)
      settotal(res?.data?.data?.totalCount)
    }
    catch (error) {
      console.error("error", error.response?.data || error);
    } finally {
      setLoading(false)
    }
  }

  const handlecompleted = (id) => {
    setOpenView(true),
      setID(id)
  }

  const handleRequestfee = (id) => {
    setShowModal(true)
    setID(id)
  }


  function updateFee() {
    setShowDiv(true);
  }
  function closeUpdateFee() {
    setShowDiv(false);
    setEntername(''),
      setSearchList([])
  }

  const [searchlist, setSearchList] = useState({})
  const [searchloading, setSearchLoading] = useState(false)
  const [studentId, setStudentId] = useState('')
  const updateFee2 = async (e) => {
    e.preventDefault();
    let isValid = studentNameValidation(enterName);
    if (isValid) {
      setSearchLoading(true)
      try {
        let res = await getUserFilter(enterName)
        setSearchList(res.data?.data?.data[0] || {});
        setStudentField(res.data?.data?.data[0].name);
        setEmailField(res.data?.data?.data[0].email);
        setCourseField(res.data?.data?.data[0].courseDetails._id);
        setbatchidField(res.data?.data?.data[0].batchDetails._id)
        getBatchnameid(res.data?.data?.data[0].courseDetails._id);
        setStudentId(res.data?.data?.data[0]._id)
        console.log(res.data?.data?.data[0]._id, 'studentid')
      } catch (err) {
        console.log(err)
      } finally {
        setSearchLoading(false)
      }
    }
  }
  const handleClearSearchList = () => {
    setSearchList([])
    setEntername('');

  };
  function studentNameValidation(value) {
    if (!value.trim()) {
      setShowDivError("This cannot be empty.");
      return false;
    } else {
      setShowDivError("");
      return true;
    }
  }

  function closeUpdateFee2() {
    setShowDiv2(false);
    setShowDiv(false);
  }

  // popup2
  function handleSubmit(e) {
    e.preventDefault();
  }
  function nameValidation(value) {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setNameError("This should not be empty");
    } else if (!/^[A-Za-z\s]+$/.test(trimmedValue)) {
      setNameError("Should contain only letters");
    } else {
      setNameError("");
    }
  }
  function emailValidation(value) {
    const trimmedEmail = value.trim();

    if (!trimmedEmail) {
      setEmailError("Email should not be empty");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  }
  function courseValidation(value) {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setCourseError("This should not be empty");
    } else {
      setCourseError("");
    }
  }

  function payValidation(value) {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setPayError("This should not be empty");
    } else {
      setPayError("");
    }
  }

  function semValidation(value) {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setSemError("This should not be empty");
    } else {
      setSemError("");
    }
  }
  function feeidValidation(value) {
    const trimmedfeeid = value.trim();
    if (!trimmedfeeid) {
      setFeeidError("This field should not be empty");
    } else {
      setFeeidError("");
    }
  }
  function feeamountValidation(value) {
    const trimmedfeeamount = value.trim();
    if (!trimmedfeeamount) {
      setFeeamountError("This field should not be empty");
    } else if (!/^[0-9]+$/.test(trimmedfeeamount)) {
      setFeeamountError("This field must contain only numbers");
    } else {
      setFeeamountError("");
    }
  }
  const update = async () => {

    nameValidation(studentField);
    emailValidation(emailField);
    courseValidation(courseField);
    feeidValidation(batchidField);
    feeamountValidation(feeamountField);
    semValidation(updatesemester);
    payValidation(payment);

    if (nameError || emailError || courseError || feeidError || feeamountError || semError || payError) {
      setShowDiv2(true);
    }
    else {
      try {
        const data = {
          "name": studentField,
          "email": emailField,
          "courseId": courseField,
          "batchId": batchidField,
          "paidAmount": feeamountField,
          "noOfsem": updatesemester,
          "modeOfPayment": payment,
          "userId": studentId,

        }
        await createFee(data)
        closeUpdateFee2();
        getfeelist()
        setEntername('')
        setSearchList([])
        setStudentField('')
        setUpdateSemester('')
        setPayment('')
        setFeeamountField('')

      } catch (error) {
        console.log(error);
      }


    }
  }

  const handlefeedetailsid = (id) => {
    setShowDiv2(true);

  }

  const [feeStatus, setFeeStatus] = useState('Request Sent')

  const [calc, setCalc] = useState([])

  useEffect(() => {
    calculation()
  }, [courseId, batchId, semester, searchText])

  const [calloading, setCallodading] = useState(false)
  let calculation = async () => {
    setCallodading(true)
    try {
      let res = await calcfee(courseId, batchId, semester, searchText)
      setCalc(res.data?.data[0])
      console.log('hjjj', res.data?.data)
    } catch (error) {
      console.log(error)
    } finally {
      setCallodading(false)
    }


  }

  return (
    <div className={styles.container}>
      <div className={styles.feemanagement}>
        <div className={styles.feehead}>
          <div className={styles.feetitle}>
            <p>Fee Management</p>
          </div>
          <div className={styles.feeform}>
            <div className={styles.formselect1}>
              <div className={styles.selectWrapper}>
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{
                    minWidth: '100%',
                    backgroundColor: '#F6F6F6', // match the image background
                    borderRadius: '6px',
                    border: 'none'
                  }}
                >
                  <Select
                    value={courseId}
                    onChange={handlecourseChange}
                    displayEmpty
                    IconComponent={KeyboardArrowDownIcon}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      fontSize: '14px',
                      padding: '4px 10px',
                      height: '36px',
                      border: 'none'
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {course.map((item, index) => {
                      return (
                        <MenuItem value={item._id} key={index}>{item.courseName}</MenuItem>
                      )
                    })}
                  </Select>

                </FormControl>
              </div>
            </div>
            <div className={styles.formselect2}>
              <div className={styles.selectWrapper}>
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{
                    minWidth: '100%',
                    backgroundColor: '#F6F6F6', // match the image background
                    borderRadius: '6px',
                    border: 'none',

                  }}
                >
                  <Select
                    value={batchId}
                    onChange={handleChange}
                    displayEmpty
                    IconComponent={KeyboardArrowDownIcon}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      fontSize: '14px',
                      padding: '4px 10px',
                      height: '36px',
                      border: 'none'
                    }}
                    disabled={!courseId}
                  // style={{ cursor: courseId ? 'pointer' : 'not-allowed' }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {Array.isArray(batch) &&
                      batch.map((item, index) => (
                        <MenuItem value={item._id} key={index}>
                          {item.batchName}
                        </MenuItem>
                      ))}
                  </Select>

                </FormControl>
              </div>
            </div>
            <div className={styles.formselect3}>
              <div className={styles.selectWrapper}>
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{
                    minWidth: '100%',
                    backgroundColor: '#F6F6F6', // match the image background
                    borderRadius: '6px',
                    border: 'none'
                  }}
                >
                  <Select
                    value={semester}
                    onChange={handlesemChange}
                    displayEmpty
                    IconComponent={KeyboardArrowDownIcon}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      fontSize: '14px',
                      padding: '4px 10px',
                      height: '36px',
                      border: 'none',

                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="1st">Semester 1</MenuItem>

                    <MenuItem value="2nd">Semester 2</MenuItem>


                  </Select>

                </FormControl>
              </div>
            </div>
            <div >
              <div style={{ width: '190px' }}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search here"
                  value={searchText}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BiSearchAlt style={{ fontSize: 18, color: '#555' }} />

                      </InputAdornment>
                    ),
                    endAdornment: searchText && (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClearSearch} edge="end">
                          <CloseIcon style={{ fontSize: 18 }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                    style: {
                      backgroundColor: '#F6F6F6',
                      borderRadius: '6px',
                      height: '36px',
                      fontSize: '14px',
                      padding: '4px 10px'
                    },
                    notched: false
                  }}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    minWidth: 120,
                  }}
                />
              </div>
            </div>
            <div className={styles.formbtn}>
              <button onClick={updateFee}>
                {" "}
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "16px",
                    transform: "translateY(-50%)",
                  }}
                />
                Update Fee
              </button>
            </div>
          </div>
        </div>
        {calloading ?
          <div className={styles.feeamount}>
            <div className={styles.feeamt}>
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width={80} height={40} />
            </div>
            <div className={styles.feeamt}>
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width={80} height={40} />
            </div>
            <div className={styles.feeamt}>
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width={80} height={40} />
            </div>
          </div>
          :
          calc && (
            <div className={styles.feeamount}>
              <div className={styles.feeamt}>
                <div className={styles.feeamthead}>
                  <p className={styles.amtText}>Total Fee Amount</p>
                </div>
                <div className={styles.feeamtamount}>
                  <p className={styles.amtValue}>{calc?.totalFee}</p>
                </div>
              </div>
              <div className={styles.feeamt}>
                <div className={styles.feeamthead}>
                  <p className={styles.amtText}>Collected Fee Amount</p>
                </div>
                <div className={styles.feeamtamount}>
                  <p className={styles.amtValue}>{calc?.paidFee}</p>
                </div>
              </div>
              <div className={styles.feeamt}>
                <div className={styles.feeamthead}>
                  <p className={styles.amtText}>Pending Fee Amount</p>
                </div>
                <div className={styles.feeamtamount}>
                  <p className={styles.amtValue}>{calc?.pendingFee}</p>
                </div>
              </div>
            </div>
          )}

        <div className={styles.feetable}>
          <table className={styles.tabledetails}>
            <thead>
              <tr>
                <th>Fee ID</th>
                <th>Name</th>
                <th>ID No</th>
                <th>Mobile</th>
                <th>Course</th>
                <th>Total Fees</th>
                <th>Pending Fees</th>
                <th>Payment Date</th>
                <th>Action</th>
              </tr>
            </thead>
            {loading ?
              <tr>
                <td colSpan="10" className="text-center py-20 text-lg text-gray-500 font-semibold" style={{ border: "none" }}>
                  <Loader />
                </td>
              </tr>
              :
              <tbody>
                {
                  list.length > 0 ?
                    list.map((item) => (
                      <tr key={item._id}>
                        <td>{item.receiptId}</td>
                        <td>{item.userDetails?.name}</td>
                        <td>{item.userDetails?.studentId}</td>
                        <td>{item.userDetails?.mobileNo}</td>
                        <td>{item.courseName}</td>
                        <td>{item.userDetails?.totalFee}</td>
                        <td style={{ color: item.userDetails?.pendingFee === 0 ? "green" : "red" }}>{item.userDetails?.pendingFee === 0 ? 'Completed' : item.userDetails?.pendingFee}</td>
                        <td style={{ color: item.userDetails?.pendingFee === 0 ? "green" : "red" }}>{item.paymentDate?.split("T")[0]}</td>
                        <td
                          className={styles.viewBtn}
                          onClick={() => { item.userDetails?.pendingFee === 0 && handlecompleted(item._id) }}
                        >
                          {item.userDetails?.pendingFee === 0 ? <div>
                            <FontAwesomeIcon
                              icon={faEye}
                              style={{ marginRight: "5px" }}
                              className={styles.viewIcon}
                            />
                            <span className={styles.viewText}>View</span>
                          </div>
                            :
                            <p style={{
                              color: feeStatus === "Requested Fee"
                                ? "blue" : 'red'


                            }} onClick={() => (setShowModal(true))}>{feeStatus}</p>
                          }
                        </td>
                      </tr>
                    ))
                    :
                    <tr >
                      <td colSpan="10" className="text-center py-20 text-lg text-gray-500 font-semibold " style={{ border: "none" }}>
                        <img src={nodata} alt="" width={'200px'} height={'200px'} className='m-auto' />
                        <p className="text-center">No Data Found</p>
                      </td>
                    </tr>
                }


              </tbody>
            }
          </table>
        </div>



        {totalpages > 1 &&
          <ThemeProvider theme={theme}>
            <div style={{ marginLeft: "auto", marginTop: "20px" }}>
              <Pagination

                count={totalpages}
                page={offset}
                onChange={handlePageChange}
                showFirstButton
                showLastButton
                sx={{ display: "flex", justifyContent: "flex-end" }}
              />
            </div>
          </ThemeProvider>
        }




        {/* modal view starts */}
        <ModalView viewOpen={openView} id={id} viewClose={() => setOpenView(false)}>
          <div className={styles.viewHead1}>
            <div className={styles.h1}>Fee Details</div>
            <div className={styles.h1}>
              <FontAwesomeIcon
                cursor={"pointer"}
                icon={faTimes}
                onClick={() => { setOpenView(false) }}
              />
            </div>
          </div>
        </ModalView>
        {/* modal view ends */}

        {/* req send starts */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          sendReqColor={sendReqColor}
          setReqSendColor={setReqSendColor}
          status={setFeeStatus}
        ></Modal>
        {/* req send end */}

        {/* showdiv  start */}
        {showDiv && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0,0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,

            }}>
            {/* <div className={styles.updatefeediv}> */}
            <div className={styles.updatefee}>
              <div className={styles.updatefeehead}>
                <div className={styles.updatefeetitle}>
                  <p>Update Fee</p>
                </div>
                <div className={styles.updatefeetitle}>
                  <FontAwesomeIcon icon={faTimes} cursor={"pointer"} onClick={closeUpdateFee} />
                </div>
              </div>
              <form className={styles.updatefeeinput}>
                <div className={styles.updatefeeinputlabel}>
                  <label htmlFor="">
                    Select Student ID <sup style={{ color: "red" }}>*</sup>
                  </label>
                </div>
                <div className={styles.updatefeeinputinput}>
                  <div className={styles.searchdiv}>
                    <input
                      type="text"
                      placeholder="Enter Name"
                      value={enterName}
                      onChange={(e) => {
                        // studentNameValidation(e.target.value);
                        setShowDivError('')
                        setEntername(e.target.value);
                      }}
                    />
                    {enterName &&
                      <p style={{ cursor: "pointer" }} onClick={handleClearSearchList} className={styles.closesearch}>
                        <CloseIcon style={{ fontSize: 18 }} />
                      </p>
                    }
                  </div>

                  <button onClick={(e) => updateFee2(e)}>
                    <FontAwesomeIcon
                      icon={faSearch}
                      style={{ marginRight: "8px" }}
                    />
                    Search
                  </button>
                </div>
              </form>
              <div className={styles.errorinput}>
                <p
                  style={{
                    color: "red",
                    fontSize: "11px",
                    fontFamily: '"Poppins", sans-serif',
                  }}
                >
                  {showDivError}
                </p>
              </div>

              {searchloading ? <Loader /> :
                <div>
                  {
                    searchlist && searchlist._id ?
                      <div>

                        <div className={styles.updatefeedata}>
                          <div >
                            <p style={{ marginTop: "10px" }}>Profile</p>
                            <div className={styles.updatefeepic}>
                              <img src={searchlist?.profileURL} alt="" />
                            </div>
                          </div>
                          <div className={styles.nameemaildiv}>
                            <div className={styles.namediv}>
                              <label htmlFor="" className={styles.updatefeeinputlabel}>
                                Student name
                              </label>
                              <input
                                style={{ cursor: 'not-allowed', backgroundColor: '#6a6a6a18', color: '#848282ff' }}
                                type="text"
                                placeholder="Enter Name"
                                value={studentField}
                                disabled
                                onChange={(e) => {
                                  setStudentField(e.target.value);
                                  nameValidation(e.target.value);
                                }}
                              />
                              <p className={styles.stderror1}>{nameError}</p>
                            </div>
                            <div className={styles.namediv}>
                              <label htmlFor="" className={styles.updatefeeinputlabel}>
                                E-mail
                              </label>
                              <input
                                style={{ cursor: 'not-allowed', backgroundColor: '#6a6a6a18', color: '#848282ff' }}
                                type="text"
                                placeholder="Enter Email"
                                value={emailField}
                                disabled
                                onChange={(e) => {
                                  setEmailField(e.target.value);
                                  emailValidation(e.target.value);
                                }}
                              />
                              <p className={styles.stderror1}>{emailError}</p>
                            </div>
                          </div>
                          <div className={styles.nameemaildiv1}>
                            <div className={styles.namediv1}>
                              <label htmlFor="" className={styles.updatefeeinputlabel}>
                                Course <sup style={{ color: "red" }}>*</sup>
                              </label>


                              <select style={{ cursor: 'not-allowed', backgroundColor: '#6a6a6a18', color: '#848282ff' }} className={styles.select_field} disabled onChange={(e) => {
                                handleCourseName(e);
                              }} value={courseField}
                                id="course" name="course">
                                <option value="" >Select a course</option>
                                {course.map((course) => (
                                  <option value={course._id} key={course._id}>{course.courseName}</option>

                                ))}

                              </select>
                              <p className={styles.stderror1}>{courseError}</p>
                            </div>
                            <div className={styles.namediv1}>
                              <label htmlFor="" className={styles.updatefeeinputlabel}>
                                Batch
                              </label>


                              <select value={batchidField} onChange={(e) => {
                                setbatchidField(e.target.value);
                                feeidValidation(e.target.value);
                              }} className={styles.select_field} disabled style={{ cursor: 'not-allowed', backgroundColor: '#6a6a6a18', color: '#848282ff' }} id="batch" name="batch">
                                <option value="" >Select a batch</option>
                                {Array.isArray(batch) &&
                                  batch.map((batch) => (

                                    <option value={batch._id} key={batch._id} >{batch.batchName}</option>
                                  ))}
                              </select>
                              <p className={styles.stderror1}>{feeidError}</p>
                            </div>
                          </div>
                          <div className={styles.nameemaildiv1}>
                            <div className={styles.namediv2}>
                              <label htmlFor="" className={styles.updatefeeinputlabel}>
                                Select Semester <sup style={{ color: "red" }}>*</sup>
                              </label>
                              <FormControl
                                variant="outlined"
                                size="small"
                                sx={{
                                  minWidth: '100%',
                                  backgroundColor: '#F6F6F6', // match the image background
                                  borderRadius: '6px',
                                  border: 'none'
                                }}
                              >
                                <Select
                                  value={updatesemester}
                                  onChange={handleupdatesemChange}
                                  displayEmpty
                                  IconComponent={KeyboardArrowDownIcon}
                                  sx={{
                                    '& .MuiOutlinedInput-notchedOutline': {
                                      border: 'none',
                                    },
                                    fontSize: '14px',
                                    padding: '4px 10px',
                                    height: '43px',
                                    border: 'none',

                                  }}
                                >
                                  <MenuItem value="">All</MenuItem>
                                  <MenuItem value="1st">Semester 1</MenuItem>

                                  <MenuItem value="2nd">Semester 2</MenuItem>


                                </Select>

                              </FormControl>
                              <p className={styles.stderror1}>{semError}</p>
                            </div>
                            <div className={styles.namediv}>
                              <label htmlFor="" className={styles.updatefeeinputlabel}>
                                Enter Fee Amount <sup style={{ color: "red" }}>*</sup>
                              </label>
                              <input
                                type="text"
                                placeholder="Enter Fee amount"
                                value={feeamountField}
                                onChange={(e) => {
                                  setFeeamountField(e.target.value);
                                  feeamountValidation(e.target.value);
                                }}
                              />
                              <p className={styles.stderror1}>{feeamountError}</p>
                            </div>
                            <div className={styles.namediv2}>
                              <label htmlFor="" className={styles.updatefeeinputlabel}>
                                Mode of Payment <sup style={{ color: "red" }}>*</sup>
                              </label>
                              <FormControl
                                variant="outlined"
                                size="small"
                                sx={{
                                  minWidth: '100%',
                                  backgroundColor: '#F6F6F6', // match the image background
                                  borderRadius: '6px',
                                  border: 'none'
                                }}
                              >
                                <Select
                                  value={payment}
                                  onChange={handlepayment}
                                  displayEmpty
                                  IconComponent={KeyboardArrowDownIcon}
                                  sx={{
                                    '& .MuiOutlinedInput-notchedOutline': {
                                      border: 'none',
                                    },
                                    fontSize: '14px',
                                    padding: '4px 10px',
                                    height: '43px',
                                    border: 'none',

                                  }}
                                >
                                  <MenuItem value="">All</MenuItem>
                                  <MenuItem value="Online">Online</MenuItem>

                                  <MenuItem value="Cash">Cash</MenuItem>


                                </Select>

                              </FormControl>
                              <p className={styles.stderror1}>{payError}</p>
                            </div>
                          </div>
                          <div className={styles.updatefeebtn}>
                            <button onClick={update}>Update</button>
                          </div>
                        </div>
                      </div>
                      :
                      <div className={styles.updatefeesearch}>
                        <div className={styles.img}>
                          <img src={magnification} alt="" />
                        </div>
                      </div>
                  }
                </div>
              }
            </div>



          </div>
        )}


      </div>
    </div>
  )
}

export default FeeHome

