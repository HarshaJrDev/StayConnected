const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
dotenv.config('../Api/.env');

const app = express();
// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Connect to MongoDB
mongoose
  .connect(
    'mongodb+srv://HarshaDev:29ZMrlr84VyEcp4Q@cluster0.anojlgc.mongodb.net/Stayconnected?retryWrites=true&w=majority&appName=Cluster0',
    {useNewUrlParser: true, useUnifiedTopology: true},
  )
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.log('Could not connect to MongoDB', error);
  });

// Define the Message Schema
const messageSchema = new mongoose.Schema({
  senderid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserRegister',
    required: true,
  },
  receiverid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserRegister',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model('Message', messageSchema);

// Define the User Register Schema
const RegisterSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 15,
  },
  requests: [
    {
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserRegister',
        required: true,
      },
      message: {
        type: String,
        default: 'You must select at least one friend',
        require: true,
      },
      status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Accepted', 'Declined'],
      },
    },
  ],
  friends: [
    {
      friend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserRegister',
        required: true,
      },
      status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Accepted', 'Declined'],
      },
    },
  ],
});

RegisterSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});
RegisterSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const RegisterBackend = mongoose.model('UserRegister', RegisterSchema);

app.get('/Users/:Userid', async (req, res) => {
  try {
    const UserId = req.params.userId;
    const users = await RegisterBackend.find({_id: {$ne: UserId}});
    res.json(users);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({message: 'Server error', error});
  }
});

app.post('/sendRequest', async (req, res) => {
  try {
    const {senderid, receiverid, message} = req.body;

    const receiver = await RegisterBackend.findById(receiverid);
    if (!receiver) return res.status(404).json({message: 'User not found'});

    // Create a new message document
    const newMessage = new Message({ senderid, receiverid, message });
    await newMessage.save();

    receiver.requests.push({from: senderid, message});
    await receiver.save();

    res.status(200).json({message: 'Request sent successfully', senderid, receiverid});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Internal Server Error'});
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'UserRegister');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, {recursive: true});
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `image-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({storage: storage});

const JWT_SECRET = 'jwtToken';

const generateToken = id => {
  return jwt.sign({id}, JWT_SECRET, {
    expiresIn: '30d',
  });
};

app.post('/UserRegister', upload.single('image'), async (req, res) => {
  const {username, email, password, phone} = req.body;

  try {
    // Create and save the user
    const UserRegisterData = new RegisterBackend({
      username,
      email,
      password,
      phone,
    });
    const savedUser = await UserRegisterData.save();

    // Generate a token for the user
    const token = generateToken(savedUser._id);

    // Send response with the token
    res.status(200).json({
      message: 'User registered successfully!',
      token: token,
    });
  } catch (error) {
    console.log('Error creating a user:', error);
    res.status(500).json({message: 'Error registering the user'});
  }
});

app.post('/signin', async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await RegisterBackend.findOne({email});
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({message: 'Invalid credentials'});
    }
    const token = generateToken(user._id);
    res.status(200).json({message: 'User signed in successfully', token});
  } catch (error) {
    console.log('Error signing in:', error);
    res.status(500).json({message: 'Server error', error});
  }
});

const protect = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({message: 'Not authorized, token failed'});
    }
  } else {
    res.status(401).json({message: 'Not authorized, no token'});
  }
};

app.get('/protected', protect, (req, res) => {
  res.status(200).json({message: 'This is a protected route', user: req.user});
});

const port = 6000;

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port} 🔥`);
});
