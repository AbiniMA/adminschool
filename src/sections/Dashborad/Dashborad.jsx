import React, { useEffect, useState } from 'react'
import dashboradcss from './Dashborad.module.css'
import profile from '../../assets/dashboardimgs/profile.png'
import profile1 from '../../assets/dashboardimgs/profile1.png'
import profile2 from '../../assets/dashboardimgs/profile2.png'
import profile3 from '../../assets/dashboardimgs/profile3.png'
import profileicon from '../../assets/dashboardimgs/profile_icon.png'
import resizeicon from '../../assets/dashboardimgs/re-size.png'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
    CircularProgressbarWithChildren,
    buildStyles
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link } from 'react-router-dom'
import { getDashboardEvents, getDashboardLeave, getDashboardUser } from '../../api/Serviceapi'
export const Dashborad = () => {
    const [days, setdays] = useState('this_week');
    const [studentList, setStudentList] = useState([])
    const [eventList, setEventList] = useState([])
    const [leaveList, setLeaveList] = useState([])


    const percentage = 75;

    const handleChange = (event) => {
        setdays(event.target.value);
    };

    useEffect(() => {
        studentlist()
    }, [])
    useEffect(() => {
        eventlist()
    }, [])
    useEffect(() => {
        leavelist()
    }, [])

    let studentlist = async () => {
        try {
            let res = await getDashboardUser()
            setStudentList(res?.data?.data?.data)

        } catch (err) {
            console.log(err)
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0"); // ensures 03 instead of 3
        const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase(); // "SEP"
        const year = date.getFullYear();
        return { day, month, year };
    };


    let eventlist = async () => {
        try {
            let res = await getDashboardEvents()
            setEventList(res?.data?.data?.data)
        } catch (err) {
            console.log(err)
        }
    }

    let leavelist = async () => {
        try {
            let res = await getDashboardLeave()
            setLeaveList(res?.data?.data?.data)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <div className={dashboradcss.dashboradcontainer}>
                <div class="flex justify-between items-center">
                    <h4 class=' m-[10px] text-xl font-normal'>Dashboard Overview</h4>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 ">
                    <div className={dashboradcss.dashcard}>
                        <div className="flex justify-between items-center">
                            <div><p className=' text-lg font-normal'>Total Students</p></div>
                            <div className={dashboradcss.profileicon}><img src={profileicon} alt="" width={'100%'} /></div>
                        </div>
                        <div className={dashboradcss.dashcount}>262</div>
                        <div class="flex justify-between items-center">

                            <div className={dashboradcss.avatars}>
                                <img src={profile} alt="profile" width={'100%'} />
                                <img src={profile1} alt="profile" width={'100%'} />
                                <img src={profile2} alt="profile" width={'100%'} />
                                <img src={profile3} alt="profile" width={'100%'} />
                            </div>

                            <div className={dashboradcss.avatar_text}>Aurelia, Finn, Zara +258 others</div>
                        </div>
                    </div>
                    <div className={dashboradcss.dashcard}>
                        <div class="flex justify-between items-center">
                            <div><p className=' text-lg font-normal'>Active Students</p></div>
                            <div className={dashboradcss.profileicon}><img src={profileicon} alt="" width={'100%'} /></div>
                        </div>
                        <div className={dashboradcss.dashcount}>42</div>
                        <div class="flex justify-between items-center">

                            <div className={dashboradcss.avatars}>
                                <img src={profile} alt="profile" width={'100%'} />
                                <img src={profile1} alt="profile" width={'100%'} />
                                <img src={profile2} alt="profile" width={'100%'} />
                                <img src={profile3} alt="profile" width={'100%'} />
                            </div>

                            <div className={dashboradcss.avatar_text}>Aurelia, Finn, Zara +258 others</div>
                        </div>
                    </div>
                    <div className={dashboradcss.dashcard} >
                        <div className="flex justify-between items-center">
                            <div><p className=' text-lg font-normal'>Attendance rate</p><p className={dashboradcss.dashdate}>30/05/2025,Firday</p></div>
                            <div className={dashboradcss.profileicon}><img src={profileicon} alt="" width={'100%'} /></div>
                        </div>
                        <div class="flex justify-between items-center pt-[20px]">
                            <div className={dashboradcss.dashcount}>95%</div>
                            <div className={dashboradcss.avatar_text}>ViewDetails</div>
                        </div>
                    </div>

                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 ">
                    <div className={dashboradcss.dashcard} style={{ height: '420px', overflowY: 'hidden' }} >
                        <div className="flex justify-between items-center mx-2 mb-[20px]">
                            <div><h4 className=' text-lg font-normal'>Leave Request</h4></div>
                            <div style={{ width: '130px', }}>
                                <FormControl
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        minWidth: 120,
                                        backgroundColor: '#ffffff', // match the image background
                                        borderRadius: '6px',
                                        border: 'none'
                                    }}
                                >
                                    <Select
                                        value={days}
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
                                    >
                                        <MenuItem value="this_week">This week</MenuItem>
                                        <MenuItem value="last_week">Last week</MenuItem>
                                        <MenuItem value="this_month">This month</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div style={{ height: '400px', overflowY: 'auto', paddingBottom: '60px' }} >
                            {leaveList.map((leave) => (
                                <div key={leave._id} className="flex justify-between items-center py-[10px] border-b-[2px] border-b-[#0000001A] border-b-solid">
                                    <div className="flex items-center">
                                        <div className='w-[50px] h-[50px] rounded-[50%] overflow-hidden mx-2 border-[3px] border-[#ffff] border-solid'>
                                            <img src={leave?.userDetails?.profileURL} alt="profile" width={'100%'} height={'100%'} />
                                        </div>
                                        <div className='mx-2'>
                                            <h6 className='text-[14px]'>{leave?.userDetails?.name}</h6>
                                            <p className='text-[12px] font-[400] text-[#888484]'>ID: {leave?.userDetails?.studentId}</p>
                                        </div>
                                    </div>
                                    <div > <button className='text-[14px] text-[#2274D4] bg-[#D7E9FF] p-[5px] w-[100px] mx-[10px] rounded-lg ' style={{
                                        background:  leave?.status === 'Rejected' && '#FFD6D6' || leave?.status === 'Created' && '#D7E9FF' ||  leave?.status === 'Approved' && '#C5FFD8',
                                        color:  leave?.status === 'Rejected' && '#F81111' ||  leave?.status === 'Created' && '#2274D4' ||  leave?.status === 'Approved' && '#08792E',

                                    }}>{leave?.status}</button></div>
                                </div>
                            ))}

                        </div>
                    </div>
                    <div className={dashboradcss.dashcard}>
                        <div className='flex justify-between flex-col h-100'>
                            <div className="flex justify-between items-center mb-[20px] mx-2">
                                <div><h4 className=' text-lg font-normal'>Attendance Rate</h4></div>
                                <div style={{ width: '130px', }}>
                                    <FormControl
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            minWidth: 120,
                                            backgroundColor: '#ffffff', // match the image background
                                            borderRadius: '6px',
                                            border: 'none'
                                        }}
                                    >
                                        <Select
                                            value={days}
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
                                        >
                                            <MenuItem value="this_week">02/06/2025</MenuItem>
                                            <MenuItem value="last_week">03/06/2025</MenuItem>
                                            <MenuItem value="this_month">04/06/2025</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>

                            <div style={{ width: 200, height: 200, margin: 'auto', display: 'block' }}>
                                <CircularProgressbarWithChildren
                                    value={percentage}
                                    styles={buildStyles({
                                        pathColor: 'url(#gradient)',
                                        trailColor: '#eee',
                                        strokeLinecap: 'butt',
                                    })}
                                >

                                    <svg style={{ height: 0 }}>
                                        <defs>
                                            <linearGradient id="gradient" gradientTransform="rotate(90)">
                                                <stop offset="0%" stopColor="#144196" />
                                                <stop offset="100%" stopColor="#061530" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div style={{ fontSize: 24, fontWeight: 'bold' }}>{percentage}%</div>
                                </CircularProgressbarWithChildren>
                            </div>

                            <div className='flex justify-between '>
                                <div style={{ color: 'green', fontSize: '14px' }}>No Of Student Present: 28</div>

                                <div style={{ color: 'red', fontSize: '14px' }}>No Of Student Absent: 7</div>
                            </div>
                        </div>

                    </div>
                    <div className={`${dashboradcss.dashcard} row-span-3`} style={{ height: '741px', overflowY: 'hidden' }}>
                        <div className="flex justify-between items-center mx-2 mb-[20px]">
                            <div><h4 className=' text-lg font-normal'>Events</h4></div>
                            <div style={{ width: '130px', }}>
                                <FormControl
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        minWidth: 120,
                                        backgroundColor: '#ffffff', // match the image background
                                        borderRadius: '6px',
                                        border: 'none'
                                    }}
                                >
                                    <Select
                                        value={days}
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
                                    >
                                        <MenuItem value="this_week">This week</MenuItem>
                                        <MenuItem value="last_week">Last week</MenuItem>
                                        <MenuItem value="this_month">This month</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div style={{ height: '680px', overflowY: 'scroll', paddingBottom: '20px' }}>
                            {eventList.map((item) => {
                                const { day, month, year } = formatDate(item.date);
                                return (
                                    <div key={item._id} className="flex justify-around items-center py-[10px] border-b-[2px] border-b-[#0000001A] border-b-solid">
                                        <div className="flex items-center w-[70%]">

                                            <div>
                                                <h6 className=' text-[17px] text-transparent bg-clip-text bg-gradient-to-b from-[#144196] to-[#061530] font-[500] my-1' style={{ textTransform: 'capitalize' }}>{item?.title}</h6>
                                                <p className='text-[13px] text-[#555]'>
                                                    {item?.description}                                            </p>
                                                <div className='text-[13px] text-[#06752B] px-[10px] bg-[#D1FFC2] rounded inline-block my-2' style={{
                                                    background: item.status === 'upcoming' && '#FFCA96' || item.status === 'ongoing' && '#D7E9FF' || item.status === 'completed' && '#D1FFC2',
                                                    color: item.status === 'upcoming' && '#8D4600' || item.status === 'ongoing' && '#2274D4' || item.status === 'completed' && '#06752B',

                                                }}>{item?.status}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className='bg-[#D9D9D9] px-[5px] py-[5px]  rounded-lg text-center'>
                                                <h5 className='text-transparent bg-clip-text bg-gradient-to-b from-[#144196] to-[#061530] font-[600]'>{day}</h5>
                                                <p className='text-transparent bg-clip-text bg-gradient-to-b from-[#144196] to-[#061530] font-[600] text-[13px]'>{month} {year}</p>
                                                <p className='text-transparent bg-clip-text bg-gradient-to-b from-[#144196] to-[#061530]  text-[12px]'>{item?.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                    </div>
                    <div className={`${dashboradcss.dashcard} lg:col-span-2 md:col-span-2 col-span-1 mt-2 h-100`} style={{ height: '300px', overflowY: 'hidden' }}>
                        <div className="flex justify-between items-center mx-2 my-[10px]">
                            <div><h4 className=' text-lg font-normal'>Student List</h4></div>
                            <div><Link to='/students'><img src={resizeicon} alt="resizeicon" /></Link></div>
                        </div>

                        <div class="overflow-x-auto " style={{ height: '300px', overflowY: 'scroll', paddingBottom: '100px' }}>
                            <table class="min-w-full text-sm text-left rounded-[10px] overflow-hidden">
                                <thead class="bg-[#ffff]">
                                    <tr >
                                        <th class="px-4 py-3 text-transparent bg-clip-text bg-gradient-to-b from-[#144196] to-[#061530] font-semibold">Profile</th>
                                        <th class="px-4 py-3 text-transparent bg-clip-text bg-gradient-to-b from-[#144196] to-[#061530] font-semibold">ID No</th>
                                        <th class="px-4 py-3 text-transparent bg-clip-text bg-gradient-to-b from-[#144196] to-[#061530] font-semibold">Name</th>
                                        <th class="px-4 py-3 text-transparent bg-clip-text bg-gradient-to-b from-[#144196] to-[#061530] font-semibold">Mobile</th>
                                        <th class="px-4 py-3 text-transparent bg-clip-text bg-gradient-to-b from-[#144196] to-[#061530] font-semibold">Course</th>
                                        <th class="px-4 py-3 text-transparent bg-clip-text bg-gradient-to-b from-[#144196] to-[#061530] font-semibold">Batch</th>
                                        <th class="px-4 py-3 text-transparent bg-clip-text bg-gradient-to-b from-[#144196] to-[#061530] font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentList.map((item) => (
                                        <tr class="border-b border-gray-200" key={item?._id}>
                                            <td class="px-4 py-3">
                                                <img src={item?.profileURL} alt="Profile" class="rounded-full w-10 h-10" />                                           </td>
                                            <td class="px-4 py-3">{item?.studentId}</td>
                                            <td class="px-4 py-3">{item?.name}</td>
                                            <td class="px-4 py-3">{item?.mobileNo}</td>
                                            <td class="px-4 py-3">{item?.courseDetails?.courseName}</td>
                                            <td class="px-4 py-3">{item?.batchDetails?.batchName}</td>
                                            <td class="px-4 py-3 text-green-500 font-medium">{item.inStatus}</td>
                                        </tr>
                                    ))}


                                </tbody>
                            </table>
                        </div>


                    </div>
                </div>


            </div>
        </>

    )
}

export default Dashborad
