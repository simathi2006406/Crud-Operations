import { Button } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API = "http://localhost:4000";
// Srimathi
function App() {

  const [people, setPeople] = useState([]);
  const [form, setForm] = useState({name: "",age: ""});

  //form edit
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({name: "",age: ""});

  // create user
  async function load() {
    const res = await axios.get(`${API}/`);
    setPeople(res.data);
  }
  useEffect(() => {load();},[])

  //create user
  async function addPerson(e) {
    e.preventDefault();
    if(!form.name || !form.age) return alert("enter name & age");
    alert("Success");
    const res = await axios.post(`${API}/`,{
      name: form.name,
      age : Number(form.age)
    });
    setPeople([...people, res.data]);
    setForm({name:"", age:""});
  }

  //edit user
  function startEditId(p){
    setEditId(p._id);
    setEditForm({name:p.name, age: Number(p.age)});
  }

  function cancelEdit(){
    setEditId(null);
  }

  //save edit update
  async function saveEdit(id){
    if(!editForm.name || !editForm.age)
      return alert ("enter name and age") ;
    const res = await axios.put(`${API}/${id}`,{ 
      name : editForm.name,
      age : editForm.age
    });
    setPeople(people.map(p => (p._id === id? res.data : p)));
    setEditId(null);
  }
    async function remove(id){
    await axios.delete(`${API}/${id}`);
    setPeople(people.filter(p=>p._id!==id));
  }

  return (
    <div className="container mt-5">
      {/* row for add users */}
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <h1>BIT Students - Add Students</h1>
          <hr></hr>
          <form onSubmit={addPerson}>
            <input type='text' 
            className='form-control mb-3' 
            placeholder='Enter Name' 
            value={form.name} 
            onChange={(e) => setForm({...form, name: e.target.value})} 
            required/>

            <input type='number' 
            className='form-control mb-3' 
            placeholder='Enter Age' 
            value={form.age} 
            onChange={(e) => setForm({...form, age: e.target.value})} 
            required/>
            <button className='btn btn-primary w-100'>Create</button>
         </form>
       </div>
      </div>

      {/* row for list users */}
      <div className='row mt-5'>
        <div className='col'>
          <h3 className='mb-3'>Students list</h3>
          {people.length===0 ? (
            <p>No students found</p>
          ) : (
            <table className='table table-bordered table-striped'>
              <thead className='table-dark'>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th style={{width: "200px"}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {people.map(p => (
                  <tr key={p._id}>

                      {editId === p._id ? (

                         <>
                         <td>
                          <input type='text' className='form-control'
                          value={editForm.name}
                          onChange={e => setEditForm({...editForm, name : e.target.value})}  />
                        </td>

                         <td>
                          <input type='Number' className='form-control'
                          value={editForm.age}
                          onChange={(e) => setEditForm({...editForm, age : e.target.value})} />
                         </td>

                         <td>
                          <button className='btn btn-success' onClick={() => saveEdit(p._id)}>save</button>
                          <button className='btn btn-primary' onClick={cancelEdit}>cancel</button>
                         </td>
                         </>
                      ) : (

                        <>
                         <td>{p.name}</td>
                         <td>{p.age}</td>
                         <td>
                           <Button className='btn btn-warning' onClick={() => startEditId(p)}>Edit</Button>
                           <Button className='btn btn-danger'onClick={()=>remove(p._id)}>Delete</Button>
                         </td>
                         </>
                      )
                    }
                  </tr>
                )
                )}
              </tbody>
            </table>
          )
          }
        </div>
      </div>
    </div>
  );
}
export default App;