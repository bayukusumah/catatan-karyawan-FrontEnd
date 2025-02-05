import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Pagination } from 'react-bootstrap';


function EmployeePage() {
    const [file, setFile] = useState(null);
    const [employee, setemployee] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [formData, setFormData] = useState({
        ktp: '',
        nama: '',
        alamat:'',
        foto:'',
        kelamin:'',
        status:'',
        agama:'',
        email:'',
        wa:'',
    });
    const [errors, setErrors] = useState({});
    const [isClicked, setIsCliked] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if(name ==='foto'){
            setFile(e.target.files[0]);
            formData.foto = e.target.files[0].name;
            setFormData({ ...formData, [name]: value });
        }else{
            setFormData({ ...formData, [name]: value });
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
        if(formData.name !==""){
            if (!formData.nama || !/^[\w ]+$/.test(formData.nama)) {
                newErrors.nama = 'Name must be a valid character.';
            }
        }else{
            newErrors.nama = 'Name is required.';
        } 
        if(formData.alamat !==""){
            if (!formData.alamat || !/^[\w ]+$/.test(formData.alamat)) {
                newErrors.alamat = 'Address must be a valid character.';
            }
        }else{
            newErrors.alamat = 'Address is required.';
        }    
        if(formData.foto !==""){
            const file = formData.foto;
            if (file) {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    newErrors.foto="File size exceeds 5MB. Please select a smaller file.";
                  return;
                }
            // if (!formData.foto || !/^[\w- ]+$/.test(formData.foto)) {
            //     newErrors.foto = 'Photo must be a valid address.';
            }
        }
        // else{
        //     newErrors.foto = 'Photo is required.';
        // }
        if(formData.kelamin !==""){
            if (!formData.kelamin || !/^(?:L|P)+$/.test(formData.kelamin)) {
                newErrors.kelamin = 'Gender must be a valid character.';
            }
        }else{
            newErrors.kelamin = 'Gender is required.';
        }
        if(formData.status !==""){
            if (!formData.status || !/^[\w ]+$/.test(formData.status)) {
                newErrors.status = 'Status must be a valid character.';
            }
        }else{
            newErrors.status = 'Status is required.';
        }
        if(formData.agama !==""){
            if (!formData.agama || !/^[\w ]+$/.test(formData.agama)) {
                newErrors.agama = 'Religion must be a valid character.';
            }
        }else{
            newErrors.agama = 'Religion is required.';
        }
        if(formData.email !==""){
            if (!formData.email || !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(formData.email)) {
                newErrors.email = 'Religion must be a valid character.';
            }
        }else{
            newErrors.email = 'Religion is required.';
        }
        if(formData.wa !==""){
            if (!formData.wa || !/^[0-9]+$/.test(formData.wa)) {
                newErrors.wa = 'Whatsapp must be a valid character.';
            }
        }else{
            newErrors.wa = 'Whatsapp is required.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

     const handleSubmit = async (e) => {
         e.preventDefault();
        
         if (!validateForm()) return;
         const formDataPersonal = new FormData();
         formDataPersonal.append('foto',file);
         formDataPersonal.append('agama',formData.agama);
         formDataPersonal.append('alamat',formData.alamat);
         formDataPersonal.append('email',formData.email);
         formDataPersonal.append('kelamin',formData.kelamin);
         formDataPersonal.append('ktp',formData.ktp);
         formDataPersonal.append('nama',formData.nama);
         formDataPersonal.append('status',formData.status);
         formDataPersonal.append('wa',formData.wa);
        fetch('http://localhost:7000/api/personal/send', {
            method: 'POST',
           // headers: {'content-type': 'multipart/form-data' },
            body: formDataPersonal,//JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                setFormData({ ktp: '',
                    nama: '',
                    alamat:'',
                    foto:'',
                    kelamin:'',
                    status:'',
                    agama:'',
                    email:'',
                    wa:'',});
                setShowModal(false);
                setIsCliked(bool => !bool);
            })
            .catch((error) => console.error('Error adding akun:', error));    
     };
    
    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:7000/api/personal/list?page=${currentPage}`)
            .then((res) => res.json())
            .then((data) => {
                setemployee(data.data);
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
                <h2>Data Karyawan</h2>
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
                                <th>Nama</th>
                                <th>alamat</th>
                                <th>Kelamin</th>
                                <th>Email</th>
                                <th>Whatsapp</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employee.map((employees,index) => (
                                <tr key={index + 1 }>
                                    <td>{index + 1}</td>
                                    <td>{employees.ktp}</td>
                                    <td>{employees.nama}</td>
                                    <td>{employees.alamat}</td>
                                    <td>{employees.kelamin}</td>
                                    <td>{employees.email}</td>
                                    <td>{employees.wa}</td>
                                    <td>{employees.status}</td>
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
                    <Modal.Title>Tambah Karyawan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={handleSubmit} eencType="multipart/form">
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
                                <label className="form-label">Nama</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.nama ? 'is-invalid' : ''}`}
                                    name="nama"
                                    isInvalid={!!errors.nama} 
                                    value={formData.nama}
                                    onChange={handleInputChange}/>
                                {errors.nama && <div className="invalid-feedback">{errors.nama}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Alamat</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.alamat ? 'is-invalid' : ''}`}
                                    name="alamat"
                                    isInvalid={!!errors.alamat} 
                                    value={formData.alamat}
                                    onChange={handleInputChange}/>
                                {errors.alamat && <div className="invalid-feedback">{errors.alamat}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Photo</label>
                                <input
                                    type="file"
                                    className={`form-control ${errors.foto ? 'is-invalid' : ''}`}
                                    name="foto"
                                    isInvalid={!!errors.foto} 
                                    value={formData.foto}
                                    onChange={handleInputChange}/>
                                {errors.foto && <div className="invalid-feedback">{errors.foto}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Jenis Kelamin</label>
                                <select
                                        name="kelamin"
                                        className={`form-select ${errors.kelamin ? 'is-invalid' : ''}`}
                                        value={formData.kelamin} 
                                        onChange={e => handleInputChange(e)}>
                                    <option value="" selected>Pilih Jenis Kelamin</option>
                                    <option value="L">Laki-Laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                                {errors.kelamin && <div className="invalid-feedback">{errors.kelamin}</div>}
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
                                <label className="form-label">Agama</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.agama ? 'is-invalid' : ''}`}
                                    name="agama"
                                    isInvalid={!!errors.agama} 
                                    value={formData.agama}
                                    onChange={handleInputChange}/>
                                {errors.agama && <div className="invalid-feedback">{errors.agama}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    name="email"
                                    isInvalid={!!errors.email} 
                                    value={formData.email}
                                    onChange={handleInputChange}/>
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Whatsapp</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.wa ? 'is-invalid' : ''}`}
                                    name="wa"
                                    isInvalid={!!errors.wa} 
                                    value={formData.wa}
                                    onChange={handleInputChange}/>
                                {errors.wa && <div className="invalid-feedback">{errors.wa}</div>}
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

export default EmployeePage;