import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    departmentName: '',
    phoneNo: '',
    aboutMe: ''
  })
  const [errors, setErrors] = useState({})
  const [submitStatus, setSubmitStatus] = useState('')

  // Form validation
  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.rollNo.trim()) newErrors.rollNo = 'Roll No is required'
    if (!formData.departmentName.trim()) newErrors.departmentName = 'Department Name is required'
    if (!formData.phoneNo.trim()) newErrors.phoneNo = 'Phone No is required'
    else if (!/^\d{10}$/.test(formData.phoneNo)) newErrors.phoneNo = 'Phone number must be exactly 10 digits'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const response = await axios.post('http://localhost:3000/submit', formData)
      setSubmitStatus('Form submitted successfully!')
      setFormData({
        name: '',
        rollNo: '',
        departmentName: '',
        phoneNo: '',
        aboutMe: ''
      })
    } catch (error) {
      // Enhanced error logging
      const errorMessage = error.response?.data?.error || error.message
      setSubmitStatus('Error submitting form. Please try again.')
      console.error('Axios error:', errorMessage)
    }
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="form-container">
      <h1>Student Information Form</h1>
      {submitStatus && <p className={submitStatus.includes('Error') ? 'error' : 'success'}>{submitStatus}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rollNo">Roll No *</label>
          <input
            type="text"
            id="rollNo"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
          />
          {errors.rollNo && <span className="error">{errors.rollNo}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="departmentName">Department Name *</label>
          <input
            type="text"
            id="departmentName"
            name="departmentName"
            value={formData.departmentName}
            onChange={handleChange}
          />
          {errors.departmentName && <span className="error">{errors.departmentName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phoneNo">Phone No *</label>
          <input
            type="text"
            id="phoneNo"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
          />
          {errors.phoneNo && <span className="error">{errors.phoneNo}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="aboutMe">About Me</label>
          <textarea
            id="aboutMe"
            name="aboutMe"
            value={formData.aboutMe}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default App
