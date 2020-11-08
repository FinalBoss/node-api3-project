const express = require('express');
const Users = require('../users/userDb');
const Posts = require('../posts/postDb')

const router = express.Router();


router.post('/', validateUser, (req, res) => {
  // do your magic!
  Users.insert(req.body)
  .then(usr => {
    res.status(201).json(usr);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      message: 'Error adding the User',
    })
  })
});

router.post('/:id/posts', [validateUserId, validatePosts], (req, res) => {
  // do your magic!
  const userId = req.params.id;
  const body = req.body;
  body.user_id = userId;
  Posts.insert(body)
  .then(usr => {
   if(usr){
    res.status(200).json(usr);
   } else {
     res.status(404).json({message: 'The users post could not be found'})
   }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({message: 'Error updating the posts', err})
  })
});

router.get('/', (req, res) =>{
  Users.get()
  .then(usr => {
    res.status(200).json(usr);
  })
  .catch(err => {
    res.status(500).json({
      message: 'Error retrieving the user',
    })
  })
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.usr)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  Users.getUserPosts(req.params.id)
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      message: 'Error getting the Post for the user'
    })
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.params.id)
  .then(count => {
    if (count > 0) {
      res.status(200).json({message: 'The user has been eliminated'})
    } else {
      res.status(404).json({message: 'Teh User could not be found'})
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({message: 'Error removing the user', err})
  })
});

router.put('/:id', [validateUserId, validateUser], (req, res) => {
  // do your magic!
  Users.update(req.params.id, req.body)
    .then(usr => {
      if (usr) {
        res.status(200).json(usr);
      } else {
        res.status(404).json({ message: 'The user could not be found' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: 'Error updating the user', error });
});
})

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const {id} = req.params;
  console.log(id);
  Users.getById(id)
  .then(usr => {
    if (usr) {
      req.usr = usr;
      next();
    } else {
     
      res.status(404).json({ message: 'User with this id does not exist' });
      // next(new Error('does not exist'));
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: 'exception', err });
  });

}

function validateUser(req, res, next) {
  // do your magic!
  const body = req.body;
  if(Object.keys(body).length === 0) {
   
  res.status(400).json({message: 'Please include request body'})
  
  } if (!body.name){
    res.status(400).json({message: "Please insert name for body"})
  } else {
    next();
  }
}

function validatePosts(req, res, next) {
  const body = req.body;
  if(Object.keys(body).length === 0){
    res.status(400).json({message: "Please include request body"})
  } if(!body.text){
    res.status(400).json({message: "Please insert text for body"})
  } else {
    next();
  }
}




module.exports = router;
