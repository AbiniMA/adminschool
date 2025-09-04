import React, { useEffect, useState } from "react";
import styles from "./courseDetails.module.css";
import { FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"; // ⬅️ New import for the back arrow icon

import { useParams, useNavigate } from "react-router-dom"; // ⬅️ useNavigate is already here
import {
  getCourseById,
  getCourseBatch,
  updateCourseBatch,
  getCourseBatchByCourseId,
} from "../../api/Serviceapi";

import EditCourseModal from "./EditCourseModel";
import CreateBatchModal from "./CreateBatchModal";
import Pagination from "@mui/material/Pagination";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          color: "#1f2937",
          "&.Mui-selected": {
            background: "linear-gradient(to bottom, #144196, #061530)",
            color: "#fff",
            border: "none",
          },
          "&:hover": {
            backgroundColor: "#f3f4f6",
          },
        },
      },
    },
  },
});

const CourseDetails = () => {
  const [limit, setLimit] = useState(4);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  const { id } = useParams();
  const navigate = useNavigate(); // ⬅️ Initialize useNavigate
  const [formData, setFormData] = useState([]);
  const [editTable, setEditTable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [totalstudent, settotalstudent] = useState(0);
  const [loading, setLoading] = useState(false);

  // ⬅️ Add the goBack function
  const goBack = () => {
    navigate(-1);
  };

  const handlePageChange = (event, value) => {
    setBatches([]);
    setPage(value);
    fetchCourse(value);
  };

  useEffect(() => {
    const totalPages = Math.ceil(totalItems / limit);
    setTotalPages(totalPages);
  }, [totalItems, limit]);

  // Fetch course details
  const fetchCourse = async () => {
    try {
      const res = await getCourseById(id);
      setFormData(res.data.data.data || []);
      settotalstudent(res.data.data.studentTotalCount);
    } catch (err) {
      console.error("Error fetching course:", err);
    }
  };
  useEffect(() => {
    fetchCourse();
  }, [id]);

  // Fetch batches
  const fetchBatch = async () => {
    try {
      setLoading(true);
      const offset = (page - 1);
      const res = await getCourseBatchByCourseId(id, limit, offset);
      setBatches(res.data.data.data || []);
      setTotalItems(res?.data?.data?.totalCount);
    } catch (err) {
      console.error("Error fetching batch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatch();
  }, [id, page, limit]);

  const handleEdit = () => {
    formData.map((ele) => {
      if (ele.studentCount <= 0) {
        setEditTable(true);
      } else return;
    });
  };

  const handleEditCards = (batchId) => {
    const batchToEdit = batches.find((b) => b._id === batchId);
    setSelectedBatch(batchToEdit);
    setShowModal(true);
  };

  const handleDeleteCards = async (batch) => {
    try {
      await updateCourseBatch(batch._id, { ...batch, deleted: true });
      setBatches((prev) => prev.filter((b) => b._id !== batch._id));
      console.log("Batch marked as deleted:", batch._id);
    } catch (err) {
      console.error("Error deleting batch:", err);
    }
  };

  return (
    <div className={styles.container}>
      {/* ⬅️ Updated Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={goBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <p>Course Details</p>
      </div>

      {/* Course Info Table */}
      <div className={styles.diplomatable}>
        <div className={styles.tablehead}>
          <p className={styles.tableheadpara}>
            {formData.length > 0 ? formData[0].courseName : "Loading..."}
          </p>
          <div className={styles.tableheadicon} onClick={handleEdit}>
            <FaPencilAlt className={styles.tableheadiconsvg} /> Edit
          </div>
        </div>

        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Duration</th>
                <th>Semesters</th>
                <th>Total Students</th>
                <th>Ongoing Students</th>
                <th>Admission Fees</th>
                <th>Sem 1 Fee</th>
                <th>Sem 2 Fee</th>
              </tr>
            </thead>
            <tbody>
              {formData.map((course) => (
                <tr key={course._id}>
                  <td>{course.duration}</td>
                  <td>{course.noOfSem}</td>
                  <td>{totalstudent}</td>
                  <td>{course.studentCount}</td>
                  <td>{course.admissionFee}</td>
                  <td>{course.firstsemFee}</td>
                  <td>{course.secondSemFee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <EditCourseModal
          visible={editTable}
          onCancel={() => setEditTable(false)}
          formData={formData}
          id={id}
          onUpdate={fetchCourse}
        />
      </div>

      {/* Batches Section */}
      <div className={styles.diplomacard}>
        <div className={styles.cardcreate}>
          <p className={styles.header}>Batches</p>
          <div className={styles.createbtn} onClick={() => setShowModal(true)}>
            <FaPlus className={styles.createbtnicon} /> Create Batch
          </div>
        </div>

        <div className={styles.cards}>
          {loading ? (
            <div className={styles.loadingText}>Loading ...</div>
          ) : batches.length > 0 ? (
            batches.map((batch) => {
              const isComplete = new Date(batch.endDate) < new Date();
              return (
                <div className={styles.divcards} key={batch._id}>
                  <p className={styles.divcardspara1}>{batch.batchName}</p>
                  <p className={styles.divcardspara2}>
                    No of Students : {batch.noOfStudents}
                  </p>
                  <div className={styles.datesection}>
                    <div>
                      <p className={styles.datesectionpara1}>Sem 1 Fee Date</p>
                      <p className={styles.datesectionpara2}>
                        {new Date(batch.sem1PayDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className={styles.datesectionpara1}>Sem 2 Fee Date</p>
                      <p className={styles.datesectionpara2}>
                        {new Date(batch.sem2PayDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={styles.iconsection}>
                    <div className={styles.icondiv}>
                      <div
                        className={styles.iconsectionsvg}
                        onClick={() => handleEditCards(batch._id)}
                      >
                        <FaPencilAlt className={styles.tableheadiconsvg} />
                      </div>
                      <div
                        className={styles.iconsectionsvg}
                        onClick={() => handleDeleteCards(batch)}
                      >
                        <FaTrash color="red" />
                      </div>
                    </div>

                    <div
                      className={`${styles.tableheadstatus} ${
                        isComplete ? styles.complete : styles.ongoing
                      }`}
                    >
                      {isComplete ? "Complete" : "Ongoing"}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className={styles.nobatch}>No batch available</p>
          )}
        </div>

        {totalPages > 1 && (
          <ThemeProvider theme={theme}>
            <div className="flex justify-center mt-4">
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                showFirstButton
                showLastButton
              />
            </div>
          </ThemeProvider>
        )}
      </div>

      {/* Edit Course Modal */}
      <EditCourseModal
        visible={editTable}
        onCancel={() => setEditTable(false)}
        formData={formData}
        id={id}
        onUpdate={fetchCourse}
      />

      {/* Create/Edit Batch Modal */}
      <CreateBatchModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedBatch(null);
        }}
        id={id}
        batchData={selectedBatch}
        onBatchCreated={fetchBatch}
      />
    </div>
  );
};

export default CourseDetails;