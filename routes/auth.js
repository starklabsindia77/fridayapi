 const router = require ('express').Router();
 const User = require('../model/User');
 const jwt  = require('jsonwebtoken');
 const bcrypt = require('bcryptjs');
 const { registerValidation, loginValidation } = require('../validation');



function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if (token === 'null') {
    return res.status(401).send('Unauthorized request')
  }
  let payload = jwt.verify(token, process.env.TOKEN_SECRET)
  if (!payload) {
    return res.status(401).send('Unauthorized request')
  }
  req.userId = payload.subject
  next()
}


 // registration api code//

  router.post('/register', async (req, res) => {

    const { error } = registerValidation(req.body);
      if (error) return res.status(400).send(error.details[0].message); 
     
    const emailExit = await User.findOne({ email:req.body.email });
      if (emailExit) return res.status(400).send('Email Already Exist');



     //hashed Password
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(req.body.password, salt);

      //create new user         
      const user = new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile,
            password:hashedPassword
        }); 
       
        try{
            const savedUser = await user.save();
            res.send({ user:user });
            console.log({user:user})
        }catch(err){
            res.status(400).send(err);
        }
  });


  // Login api Code//

  router.post('/login', async (req, res) => {

    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message); 

    //user check   
    const user = await User.findOne({ mobile: req.body.mobile });
    if (!user) return res.status(400).send('Email or Password is wrong');
     // password check

     const validPass= await bcrypt.compare(req.body.password, user.password);
     if(!validPass) return res.status(400).send('Invalid Password')
      //res.send(user);

     //const loginUser = res.send(user);
     //return loginUser;


     // Create and assign a token

     const token= jwt.sign({_id: user._id }, process.env.TOKEN_SECRET);
     //res.header('auth_token', token).send({token});
     res.status(200).send({token});


     
 

  });
  
   
 module.exports = router;