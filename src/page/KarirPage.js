import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Pagination } from 'react-bootstrap';
import moment from "moment";

function KarirPage() {
    const [karir, setkarir] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [formData, setFormData] = useState({
        ktp: '',
        jabatan: '',
        departemen:'',
        tanggal_bergabung:'',
        status:'',
        gaji_pokok:'',
        bonus:'',
        riwayat_promosi:'',
    });
    const [errors, setErrors] = useState({});
    const [isClicked, setIsCliked] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch(name){
           case "gaji_pokok" :
           case "bonus" : 
                const formattedValue = value
                    .replace(/\D/g, '') 
                    .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); 
                    setFormData({ ...formData, [name]: formattedValue });      
                break;
            default:
                setFormData({ ...formData, [name]: value });
                break;
        }
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
        if(formData.jabatan !==""){
            if (!formData.jabatan || !/^[\w ]+$/.test(formData.jabatan)) {
                newErrors.jabatan = 'Jabatan must be a valid character.';
            }
        }else{
            newErrors.jabatan = 'Jabatan kinerja is required.';
        } 
        if(formData.departemen !==""){
            if (!formData.departemen || !/^[\w ]+$/.test(formData.departemen)) {
                newErrors.departemen = 'Departemen must be a valid character.';
            }
        }else{
            newErrors.departemen = 'Departemen peringatan is required.';
        }    
        if(formData.tanggal_bergabung !==""){
            const date_tmp = moment(new Date(formData.tanggal_bergabung )).utc().format("YYYY-MM-DD");
            if (!formData.tanggal_bergabung || !/^\d{4}-\d{2}-\d{2}$/.test(date_tmp)) {
                newErrors.tanggal_bergabung = 'Tanggal bergabung must be a valid date.';
            }
        }else{
            newErrors.tanggal_bergabung = 'Tanggal bergabung is required.';
        }
        if(formData.status !==""){
            if (!formData.status || !/^[\w ]+$/.test(formData.status)) {
                newErrors.status = 'Status must be a valid character.';
            }
        }else{
            newErrors.status = 'Status bergabung is required.';
        }
       
        if(formData.gaji_pokok !==""){
            const amountTemp= formData.gaji_pokok.replaceAll(".","");
            if (!formData.gaji_pokok || !/^[0-9]+$/.test(amountTemp)) {
                newErrors.gaji_pokok = 'Gaji pokok must be a valid number.';
            }
        }else{
            newErrors.gaji_pokok = 'Gaji pokok bergabung is required.';
        }
        if(formData.bonus !==""){
            const amountTemp= formData.bonus.replaceAll(".","");
            if (!formData.bonus || !/^[0-9]+$/.test(amountTemp)) {
                newErrors.bonus = 'Bonus must be a valid number.';
            }
        }else{
            newErrors.bonus = 'Bonus bergabung is required.';
        }
        if(formData.riwayat_promosi !==""){
            if (!formData.riwayat_promosi || !/^[\w- ]+$/.test(formData.riwayat_promosi)) {
                newErrors.riwayat_promosi = 'Riwayat promosi must be a valid character.';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const tanggal_Value=(tanggal)=>{
        return moment(new Date(tanggal)).utc().format("MM/DD/YYYY");
    }
     const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        formData.tanggal_bergabung = moment(new Date(formData.tanggal_bergabung )).utc().format("YYYY-MM-DD");
        formData.gaji_pokok= formData.gaji_pokok.replaceAll(".","");
        formData.bonus = formData.bonus.replaceAll(".","");
        fetch('http://localhost:7000/api/karir/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                setFormData({ ktp: '',
                    jabatan: '',
                    departemen:'',
                    tanggal_bergabung:'',
                    status:'',
                    gaji_pokok:'',
                    bonus:'',
                    riwayat_promosi:''});
                setShowModal(false);
                 setIsCliked(bool => !bool);
            })
            .catch((error) => console.error('Error adding akun:', error));    
     };
    
    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:7000/api/karir/list?page=${currentPage}`)
            .then((res) => res.json())
            .then((data) => {
                setkarir(data.data);
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
                <h2>Karir Karyawan</h2>
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
                                <th>Jabatan</th>
                                <th>Departemen</th>
                                <th>Tanggal bergabung</th>
                                <th>Status</th>
                                <th>Gaji pokok</th>
                                <th>Bonus</th>
                                <th>Riwayat promosi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {karir.map((karir_karyawan,index) => (
                                <tr key={index + 1 }>
                                    <td>{index + 1}</td>
                                    <td>{karir_karyawan.ktp}</td>
                                    <td>{karir_karyawan.Jabatan}</td>
                                    <td>{karir_karyawan.Departemen}</td>
                                    <td>{tanggal_Value(karir_karyawan.tanggal_Bergabung)}</td>
                                    <td>{karir_karyawan.Status}</td>
                                    <td>{karir_karyawan.Gaji_Pokok}</td>
                                    <td>{karir_karyawan.Bonus}</td>
                                    <td>{karir_karyawan.Riwayat_Promosi}</td>
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
                    <Modal.Title>Tambah Catatan Karir Karyawan</Modal.Title>
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
                                <label className="form-label">Jabatan</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.jabatan ? 'is-invalid' : ''}`}
                                    name="jabatan"
                                    isInvalid={!!errors.jabatan} 
                                    value={formData.jabatan}
                                    onChange={handleInputChange}/>
                                {errors.jabatan && <div className="invalid-feedback">{errors.jabatan}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Departemen</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.departemen ? 'is-invalid' : ''}`}
                                    name="departemen"
                                    isInvalid={!!errors.departemen} 
                                    value={formData.departemen}
                                    onChange={handleInputChange}/>
                                {errors.departemen && <div className="invalid-feedback">{errors.departemen}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Tanggal Bergabung</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.tanggal_bergabung ? 'is-invalid' : ''}`}
                                    name="tanggal_bergabung"
                                    isInvalid={!!errors.tanggal_bergabung} 
                                    value={formData.tanggal_bergabung}
                                    onChange={handleInputChange}/>
                                {errors.tanggal_bergabung && <div className="invalid-feedback">{errors.tanggal_bergabung}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.status ? 'is-invalid' : ''}`}
                                    name="status"
                                    isInvalid={!!errors.status} 
                                    value={formData.status}
                                    onChange={handleInputChange}/>
                                {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Gaji Pokok</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.gaji_pokok ? 'is-invalid' : ''}`}
                                    name="gaji_pokok"
                                    isInvalid={!!errors.gaji_pokok} 
                                    value={formData.gaji_pokok}
                                    onChange={handleInputChange}/>
                                {errors.gaji_pokok && <div className="invalid-feedback">{errors.gaji_pokok}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Bonus</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.bonus ? 'is-invalid' : ''}`}
                                    name="bonus"
                                    isInvalid={!!errors.bonus} 
                                    value={formData.bonus}
                                    onChange={handleInputChange}/>
                                {errors.bonus && <div className="invalid-feedback">{errors.bonus}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Riwayat Promosi</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.riwayat_promosi ? 'is-invalid' : ''}`}
                                    name="riwayat_promosi"
                                    isInvalid={!!errors.riwayat_promosi} 
                                    value={formData.riwayat_promosi}
                                    onChange={handleInputChange}/>
                                {errors.riwayat_promosi && <div className="invalid-feedback">{errors.riwayat_promosi}</div>}
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

export default KarirPage;