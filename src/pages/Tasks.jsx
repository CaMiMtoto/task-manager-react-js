import {Button, Form, Modal} from "react-bootstrap";
import {useEffect, useState} from "react";
import {FaEdit} from "react-icons/fa";
import {FaTrash} from "react-icons/fa6";
import http from "../configs/httpConfig.js";

const PRIORITIES = [
    "Low", "Medium", "High"
];
const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        _id: '',
        title: '',
        description: '',
        priority: ''
    });

    const fetchTasks = () => {
        http.get('/tasks')
            .then((response) => {
                console.log(response);
                setTasks(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const toggleTask = (id) => {
        console.log(id)
        // find the task with the id
        let task = tasks.find((task) => task._id === id);
        // toggle the completed property
        task.completed = !task.completed;
        // update the state
        setTasks([...tasks]);
    }

    function updateTask() {
        http.put(`/tasks/${formData._id}`, {
            title: formData.title,
            description: formData.description,
            priority: formData.priority
        })
            .then((response) => {
                console.log(response);
                // update the state
                setTasks(tasks.map((task) => {
                    if (task._id === formData._id) {
                        return response.data;
                    }
                    return task;
                }));
                resetFormData();
            })
            .catch((error) => {
                console.log(error);

            })
            .finally(() => {
                setLoading(false);
            });
    }

    function resetFormData() {
        // clear the form
        setFormData({
            _id: '',
            title: '',
            description: '',
            priority: ''
        });
        // close the modal
        setShowModal(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // add the new task to the tasks array
        if (editing) {
            // find the task with the id
            updateTask();
        } else {
            http.post('/tasks', {
                title: formData.title,
                description: formData.description,
                completed: false,
                priority: formData.priority
            }).then((response) => {
                console.log(response);
                // update the state
                setTasks([...tasks, response.data]);
                resetFormData();
            })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }

    }

    const handleEdit = (id) => {
        // find the task with the id
        let task = tasks.find((task) => task._id === id);
        // set the form data
        setFormData({
            _id: task._id,
            title: task.title,
            description: task.description,
            priority: task.priority
        });
        // set editing to true
        setEditing(true);
        // show the modal
        setShowModal(true);
    }
    const handleDelete = (id) => {
        // filter the tasks array
        http.delete(`/tasks/${id}`)
            .then((response) => {
                console.log(response);
                // update the state
                setTasks(tasks.filter((task) => task._id !== id));
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const  getTaskColor = (priority) => {
        switch (priority) {
            case 'Low':
                return 'success';
            case 'Medium':
                return 'warning';
            case 'High':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="mb-0">
                    Tasks
                </h1>
                <Button variant="primary" type="button" onClick={() => setShowModal(true)}>
                    Add Task
                </Button>
            </div>

            <div className="list-group">
                {tasks.map((task) => (
                    <div className="list-group-item list-group-item-action" key={task._id}>
                        <div className="d-flex  w-100 justify-content-between">
                            <div className="mb-1">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox"
                                           checked={task.completed} onChange={() => toggleTask(task._id)}
                                           value={task._id} id={`flexCheckDefault${task._id}`}/>
                                    <label
                                        className={`form-check-label fw-bold ${task.completed ? 'text-decoration-line-through' : ''}`}
                                        htmlFor={`flexCheckDefault${task._id}`}>
                                        {task.title}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <p className={`mb-1 border-start border-4 ps-2 border-${getTaskColor(task.priority)}`}>
                            {task.description}
                        </p>

                        <div className="d-flex align-items-center gap-2 justify-content-between">
                            <div>
                                    <span
                                        className={`badge rounded-pill small ${task.completed ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                {task.completed ? 'Completed' : 'Not Completed'}
                            </span>
                            </div>
                            <div className="d-flex justify-content-end  gap-2">
                                <Button variant="primary" size="sm"
                                        className="bg-primary-subtle text-primary border-0 rounded-pill d-inline-flex justify-content-center align-items-center p-2"
                                        onClick={() => handleEdit(task._id)}>
                                    <FaEdit/>
                                </Button>
                                <Button variant="danger" size="sm"
                                        className="bg-danger-subtle text-danger border-0 rounded-pill d-inline-flex justify-content-center align-items-center p-2"
                                        onClick={() => handleDelete(task._id)}>
                                    <FaTrash/>
                                </Button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={showModal}
                contentClassName="rounded-1"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add Task
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>

                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input type="text" className="form-control" id="title" name="title" required={true}
                                   value={formData.title} onChange={handleChange}/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                            <textarea className="form-control" id="description" name="description" required={true}
                                      value={formData.description} onChange={handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="priority" className="form-label">Priority</label>
                            <select className="form-select" id="priority" name="priority" required={true} value={formData.priority}
                                    onChange={handleChange}>
                                <option value="">Select Priority</option>
                                {PRIORITIES.map((priority) => (
                                    <option key={priority} value={priority}>{priority}</option>
                                ))}
                            </select>
                        </div>

                    </Modal.Body>
                    <Modal.Footer className="bg-light">
                        <Button type="submit" variant="primary" disabled={loading}>Save changes
                            {
                                loading && <div className="spinner-border spinner-border-sm ms-2" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            }
                        </Button>
                        <Button type="button"
                                onClick={() => setShowModal(false)}
                                variant="secondary">Close</Button>
                    </Modal.Footer>
                </Form>
            </Modal>


        </div>
    );
};

export default Tasks;