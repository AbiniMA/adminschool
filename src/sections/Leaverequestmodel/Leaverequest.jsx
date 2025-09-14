import React, { useEffect, useState } from 'react'
import styles from "./LeaveRequest.module.css";
import { BiSearchAlt } from "react-icons/bi";
import { FormControl, InputLabel, MenuItem, Select, IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { getLeaveRequest, getLeaveRequestById, updateLeaveRequest } from '../../api/Serviceapi';
import Pagination from '@mui/material/Pagination';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Modal from 'react-modal';
import { MdClose } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import nodata from '../../assets/nodata.jpg'
import Loader from '../../component/loader/Loader';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

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
const LeaveRequest = () => {
  const [searchText, setSearchText] = useState('');
  const [date, setDate] = useState('')
  const [open, setOpen] = useState(false)
  const [list, setList] = useState([])
  const [limit, setlimit] = useState(10);
  const [totallist, settotal] = useState(0);
  const [totalpages, setpage] = useState(0);
  const [offset, setoffset] = useState(1);
  const [status, setStatus] = useState('')
  const [update, setUpdate] = useState(false)
  const [data, setData] = useState([])
  const [updatestatus, setUpdatestatus] = useState('')
  const [loading, setLoading] = useState(false)
  const adminId = localStorage.getItem('userId')
  const [reason, setReason] = useState('')
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD
    setDate(formattedDate);
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(totallist / limit);
    setpage(totalPages);
  }, [totallist, limit]);

  const handlePageChange = (event, value) => {
    setList([]);
    if (value === offset) {

      getleavelist()
    } else {
      setoffset(value);
    }
  };

  const { date: paramDate } = useParams()

  useEffect(() => {
    if (paramDate) {
      setDate(paramDate); // Set it once when param changes
    }
  }, [paramDate]);
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

  useEffect(() => {
    if (!date) return;
    getleavelist()
  }, [offset, date, status, searchText])

  let getleavelist = async () => {
    setLoading(true)
    try {
      let res = await getLeaveRequest(limit, offset - 1, date, status, searchText)
      setList(res.data?.data?.result)
      settotal(res.data?.data?.totalCount)

    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (e) => {
    setStatus(e.target.value)
    setoffset(1)
    setList([])
  }
  const handlegetbyClick = async (id) => {
    setUpdate(true)
    try {
      let res = await getLeaveRequestById(id)
      setData(res.data?.data?.result[0])
    } catch (err) {
      console.log(err)
    }

  }

  const [reasonerror, setReasonerror] = useState('')

  const validation = () => {
    if (reason.trim() === '') {
      setReasonerror('Reason is required');
      return false; // ❌ invalid
    }
    setReasonerror('');
    return true; // ✅ valid
  };

  const [idloading, setIdlloading] = useState(false)

  const handleUpdateClick = async (id, status, adminId, reason) => {
    if (!validation()) {
      return; // stop execution if reason is empty
    }
    setIdlloading(true)
    try {
      let res = await updateLeaveRequest(id, status, adminId, reason)
      setUpdatestatus(status)
      setUpdate(false)
      getleavelist()
      setReason('')

    }
    catch (err) {
      console.log(err)
    } finally {
      setIdlloading(false)
    }
  }
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      // second: "numeric",
      hour12: true,
      timeZone: "UTC",
    });
  };



  const formatTimehours = (decimalHours) => {
    if (!decimalHours) return "0 mins"; // handle null/undefined/0 safely

    const totalMinutes = Math.round(decimalHours * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let parts = [];

    if (hours > 0) {
      parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
    }
    if (minutes > 0) {
      parts.push(`${minutes} ${minutes === 1 ? "min" : "mins"}`);
    }

    return parts.join(" ") || "0 mins";
  };




  return (
    <>
      <div className={styles.container}>
        <div className={styles.attendance_container}>
          <div className={styles.header_container}>
            <div className={styles.header_container1}>
              <div >
                <IoMdArrowRoundBack style={{ cursor: 'pointer', fontSize: '20px', marginTop: '2px' }} onClick={() => window.history.back()} />

              </div>
              <h3 className={styles.attendance_h3}>Leave Request</h3>
            </div>
            <div className={styles.header_container2}>
              <div className={styles.dropdown}>
                <div className={styles.dropdownWrapper}>
                  <div className={styles.selectWrapper}>
                    <FormControl
                      variant="outlined"
                      size="small"
                      sx={{
                        minWidth: 120,
                        backgroundColor: '#F6F6F6', // match the image background
                        borderRadius: '6px',
                        border: 'none'
                      }}
                    >
                      <Select
                        value={status}
                        onChange={handleStatusChange}
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
                        <MenuItem value="Created">Created</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                      </Select>

                    </FormControl>
                  </div>
                </div>
              </div>
              <div className={styles.dateWrapper}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={date ? dayjs(date, "YYYY-MM-DD") : null}
                    onChange={(newValue) => {
                      if (newValue) {
                        const formatted = dayjs(newValue).format("YYYY-MM-DD");
                        setDate(formatted);
                      } else {
                        setDate("");
                      }
                    }}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        placeholder: 'DD/MM/YYYY',
                        onClick: () => setOpen(true),
                        error: Boolean(Error?.DateofBrith),
                        sx: {
                          '& .MuiPickersOutlinedInput-root': {
                            height: '35px',
                            outline: 'none',
                            width: '100%',
                            backgroundColor: ' #f2f2f2'
                          },
                          '& fieldset': {
                            border: 'none',
                          },
                          '&:hover fieldset': {
                            border: 'none',
                            outline: 'none'
                          },
                          '& .MuiPickersOutlinedInput-root.Mui-focused .MuiPickersOutlinedInput-notchedOutline': {
                            border: 'none'
                          }
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
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
          </div>
        </div>


        <div>
          <div className={styles.table_container}>
            <table className={styles.table}>
              <tr className={styles.tr}>
                <th>Name</th>
                <th>ID No</th>
                <th>Mobile</th>
                <th>No of Days</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
              </tr>
              {loading ?
                <tr>
                  <td colSpan="10" className="text-center py-20 text-lg text-gray-500 font-semibold border-0">
                    <Loader />
                  </td>
                </tr>
                : <tbody>
                  {
                    Array.isArray(list) && list.length > 0 ?
                      list.map((item) => (
                        <tr key={item._id} className={styles.trtd}>
                          <td>{item?.userDetails?.name}</td>
                          <td>{item?.userDetails?.studentId}</td>
                          <td>{item?.userDetails?.mobileNo}</td>
                          {item.isPermission || item?.isEarlyPermission ?
                            <td>{formatTimehours(item?.permissionTime)}</td> :
                            <td>{item?.noOfDays} {item?.noOfDays > 1 ? 'days' : 'day'}</td>

                          }
                          {item.isPermission || item?.isEarlyPermission?
                            <td>{formatTime(item?.startTime)}</td>
                            :
                            <td>{item?.fromDate?.split("T")[0]}</td>
                          }
                          {item.isPermission|| item?.isEarlyPermission ?
                            <td>{formatTime(item?.endTime)}</td>
                            :
                            <td>{item?.toDate?.split("T")[0]}</td>
                          }
                          <td className={styles.green} style={{
                            color: item.status === 'Approved' && 'green' || item.status === 'Created' && '#144196' || item.status === 'Rejected' && 'red',
                            cursor: item?.status == 'Created' && 'pointer'
                          }} onClick={() => item?.status == 'Created' && handlegetbyClick(item?._id)}>{item?.status == 'Created' ? <div><FontAwesomeIcon
                            icon={faEye}
                            style={{ marginRight: "5px" }}
                            className={styles.viewIcon}
                          />
                            <span>View</span></div> : item.status} </td>
                        </tr>
                      ))
                      :
                      <tr >
                        <td colSpan="10" className="text-center py-20 text-lg text-gray-500 font-semibold " style={{ border: "none" }}>
                          <img src={nodata} alt="" width={'200px'} height={'200px'} className='m-auto' />
                          <p className="text-center ">No Data Found</p>
                        </td>
                      </tr>


                  }

                </tbody>
              }
            </table>
          </div>
        </div>
        {totalpages > 1 &&
          <ThemeProvider theme={theme}>
            <div style={{ marginTop: '20px' }}>
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
      </div>

      <Modal
        isOpen={update}
        onRequestClose={() => setUpdate(true)}
        contentLabel="Delete Student"
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgb(21 21 21 / 81%)', // gray overlay
            zIndex: 1000,
          },
          content: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '1rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
            width: 'max-content',
            height: '600px',
            overflow: 'auto',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 1001,
          },
        }}
      >
        <div

        >
          <div className={styles.leavereq}>
            <div className={styles.reqhead}>
              <p>Leave Request</p>
              <MdClose className={styles.closeIcon} onClick={() => { setUpdate(false), setData({}), setReason(''), setReasonerror('') }} />
            </div>
            <div className={styles.div}>
              <div className={styles.profile}>
                <p>Profile</p>
                <div className={styles.profilediv}>
                  <img src={data?.userDetails?.profileURL} alt="" />
                </div>
              </div>
              <div className={styles.grid}>
                <div className={styles.grid1}>
                  <label for="">Student Name</label>
                  <input type="text" style={{ color: 'grey', cursor: 'not-allowed' }} placeholder="Enter student name" value={data?.userDetails?.name} disabled />
                </div>
                <div className={styles.grid1}>
                  <label for="">Phone Number</label>
                  <input type="tel" style={{ color: 'grey', cursor: 'not-allowed' }} placeholder="Enter phone number" value={data?.userDetails?.mobileNo} disabled />
                </div>
              </div>
              <div className={styles.grids}>
                <div className={styles.grid2}>
                  <label for="">
                    Duration
                  </label>
                  {data?.isPermission || data?.isEarlyPermission ? 
                  <input type="text" style={{ color: 'grey', cursor: 'not-allowed' }} placeholder="no of days" value={formatTimehours(data?.permissionTime)} disabled /> :
                  <input type="text" style={{ color: 'grey', cursor: 'not-allowed' }} placeholder="no of days" value={data?.noOfDays} disabled />}
                </div>
                <div className={styles.grid2}>
                  <label for="">From</label>
                  {data?.isPermission || data?.isEarlyPermission ? <input disabled className={styles.dateinput} value={formatTime(data?.startTime)}
                  /> :
                    <input style={{ color: 'grey', cursor: 'not-allowed' }} disabled className={styles.dateinput} value={data?.fromDate ? data.fromDate.slice(0, 10) : ""}
                    />}

                </div>
                <div className={styles.grid2}>
                  <label for="">To</label>
                  {data?.isPermission || data?.isEarlyPermission ? <input style={{ color: 'grey', cursor: 'not-allowed' }} disabled className={styles.dateinput} value={formatTime(data?.endTime)}
                  /> :
                    <input style={{ color: 'grey', cursor: 'not-allowed' }} disabled className={styles.dateinput} value={data?.toDate ? data.toDate.slice(0, 10) : ""}
                    />
                  }
                </div>
              </div>
              <div className={styles.gridss}>
                <div className={styles.grid3}>
                  <label>Description</label>
                  <textarea
                    disabled
                    style={{ color: 'grey', cursor: 'not-allowed' }}
                    placeholder="Enter description"
                    className={styles.description}
                    value={data?.discription}
                  ></textarea>
                </div>
              </div>
              <div className={styles.gridss}>
                <div className={styles.grid3}>
                  <label>Reason <span style={{ color: "red" }}>*</span></label>
                  <textarea
                    placeholder="Enter Reason"
                    className={styles.description}
                    value={reason}
                    onChange={(e) => { setReason(e.target.value), setReasonerror('') }}
                  ></textarea>
                  {reasonerror && <p style={{ color: "red", fontSize: "12px" }}>{reasonerror}</p>}

                </div>
              </div>
              <div className={styles.gridsss}>
                <button className={styles.rejectBtn} onClick={() => handleUpdateClick(data?._id, 'Rejected', adminId, reason)}>  Reject</button>
                <button className={styles.acceptBtn} onClick={() => handleUpdateClick(data?._id, 'Approved', adminId, reason)}>Accept</button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default LeaveRequest
