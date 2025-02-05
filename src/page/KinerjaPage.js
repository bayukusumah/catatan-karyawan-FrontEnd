import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Pagination } from 'react-bootstrap';


function KinerjaPage() {
    const [kinerja, setkinerja] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [formData, setFormData] = useState({
        ktp: '',
        evaluasi_kinerja: '',
        catatan_peringatan:'',
        prestasi:'',
    });
    const [errors, setErrors] = useState({});
    const [isClicked, setIsCliked] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const validateForm = () => {
        const newErrors = {};
        if(formData.ktp !==""){
            if (!formData.ktp || !/^[0-9]+$/.test(formData.ktp)) {
                newErrors.ktp = 'ID identity must be a valid number.';
            }
        }else{
            newErrors.ktp = 'ID identity is required.';
        }
        if(formData.evaluasi_kinerja !==""){
            if (!formData.evaluasi_kinerja || !/^[\w ]+$/.test(formData.evaluasi_kinerja)) {
                newErrors.evaluasi_kinerja = 'Evaluaasi kinerja must be a valid character.';
            }
        }else{
            newErrors.evaluasi_kinerja = 'valuaasi kinerja is required.';
        } 
        if(formData.catatan_peringatan !==""){
            if (!formData.catatan_peringatan || !/^[\w- ]+$/.test(formData.catatan_peringatan)) {
                newErrors.catatan_peringatan = 'Catatan peringatan must be a valid character.';
            }
        }  
        if(formData.prestasi !==""){
            if (!formData.prestasi || !/^[\w- ]+$/.test(formData.prestasi)) {
                newErrors.prestasi = 'Prestasi must be a valid character.';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

     const handleSubmit = async (e) => {
         e.preventDefault();
        if (!validateForm()) return;
        fetch('http://localhost:7000/api/kinerja/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                setFormData({ code: '', name: ''});
                setShowModal(false);
                setIsCliked(bool => !bool);
            })
            .catch((error) => console.error('Error adding akun:', error));    
     };
    
    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:7000/api/kinerja/list?page=${currentPage}`)
            .then((res) => res.json())
            .then((data) => {
                setkinerja(data.data);
                setTotalPages(data.totalPages);
                setLoading(false);
            });
    }, [currentPage,isClicked]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Kinerja Karyawan</h2>
                 <Button className="mb-3" onClick={() => setShowModal(true)}>
                    Tambah
                 </Button>
            </div>     
                {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>KTP</th>
                                <th>Evaluasi</th>
                                <th>Peringatan</th>
                                <th>Prestasi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kinerja.map((kinerja_karyawan,index) => (
                                <tr key={index + 1 }>
                                    <td>{index + 1}</td>
                                    <td>{kinerja_karyawan.ktp}</td>
                                    <td>{kinerja_karyawan.Evaluasi_Kinerja}</td>
                                    <td>{kinerja_karyawan.Catatan_Peringatan}</td>
                                    <td>{kinerja_karyawan.Prestasi}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    )}
                    <Pagination>
                    <Pagination.Prev
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        />
                         {currentPage > 3 && (
                            <>
                                <Pagination.Item onClick={() => handlePageChange(1)}>1</Pagination.Item>
                                <Pagination.Ellipsis />
                            </>
                        )}
                        {[...Array(totalPages).keys()].map((page) => (
                            <Pagination.Item
                                key={page + 1}
                                active={page + 1 === currentPage}
                                onClick={() => handlePageChange(page + 1)}
                            >
                                {page + 1}
                            </Pagination.Item>
                        ))}
                         {currentPage < totalPages - 2 && (
                            <>
                                <Pagination.Ellipsis />
                                <Pagination.Item onClick={() => handlePageChange(totalPages)}>
                                    {totalPages}
                                </Pagination.Item>
                            </>
                        )}
                         <Pagination.Next
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        />
                    </Pagination>
             <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Catatan Kinerja Karyawan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">KTP</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.ktp ? 'is-invalid' : ''}`}
                                    name="ktp"
                                    value={formData.ktp}
                                    isInvalid={!!errors.ktp} 
                                    onChange={handleInputChange}/>
                                {errors.ktp && <div className="invalid-feedback">{errors.ktp}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Evaluasi</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.evaluasi_kinerja ? 'is-invalid' : ''}`}
                                    name="evaluasi_kinerja"
                                    isInvalid={!!errors.evaluasi_kinerja} 
                                    value={formData.evaluasi_kinerja}
                                    onChange={handleInputChange}/>
                                {errors.evaluasi_kinerja && <div className="invalid-feedback">{errors.evaluasi_kinerja}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Catatan Peringatan</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.catatan_peringatan ? 'is-invalid' : ''}`}
                                    name="catatan_peringatan"
                                    isInvalid={!!errors.catatan_peringatan} 
                                    value={formData.catatan_peringatan}
                                    onChange={handleInputChange}/>
                                {errors.catatan_peringatan && <div className="invalid-feedback">{errors.catatan_peringatan}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Prestasi</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.prestasi ? 'is-invalid' : ''}`}
                                    name="prestasi"
                                    isInvalid={!!errors.prestasi} 
                                    value={formData.prestasi}
                                    onChange={handleInputChange}/>
                                {errors.prestasi && <div className="invalid-feedback">{errors.prestasi}</div>}
                            </div>
                            <button type="submit" className="btn btn-success">
                                Simpan
                            </button>
                        </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default KinerjaPage;