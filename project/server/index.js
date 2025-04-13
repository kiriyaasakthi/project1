import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/studentdb')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    required: true
  },
  departmentName: {
    type: String,
    required: true
  },
  phoneNo: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  aboutMe: String
})

const User = mongoose.model('User', userSchema)

// Submit endpoint
app.post('/submit', async (req, res) => {
  try {
    console.log('Incoming data:', req.body)

    const { name, rollNo, departmentName, phoneNo } = req.body
    if (!name || !rollNo || !departmentName || !phoneNo) {
      return res.status(400).json({ error: 'All required fields must be filled' })
    }

    // Validate phone number
    if (!/^\d{10}$/.test(phoneNo)) {
      return res.status(400).json({ error: 'Phone number must be exactly 10 digits' })
    }

    console.log('Creating new user with data:', { name, rollNo, departmentName, phoneNo, aboutMe: req.body.aboutMe })

    // Create and save new user
    const user = new User(req.body)
    await user.save()

    console.log('User saved:', user)

    res.status(201).json({ message: 'User created successfully', user })
  } catch (error) {
    console.error('Error in /submit:', error.message)
    res.status(500).json({ error: 'Server error: ' + error.message })
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
