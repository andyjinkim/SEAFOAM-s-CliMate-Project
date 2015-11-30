var User          = require('../models/user_model.js')
    ,secret       = 'allyourbase'

function index(req,res){
  User.find({},function(err,users){
    if(err) console.log(err)
    res.json(users)
  })
}

function show(req,res){
  //.user_id should match route
  User.find({_id:req.params.user_id}, function(err,user){
    if(err) res.send(err)
    res.json(user)
  })
}

function create(req,res){
  var user = new User(req.body.user)
  console.log(req.body)
  user.save(function(err){
    if(err) res.json({err: err})
    res.json({message: 'User created!'})
  })
}

function update(req,res){
  User.findById(req.params.user_id, function(err,user){
    if(err) res.json({err:err})

    if(req.body.local.user_name)
      user.local.user_name = req.body.local.user_name
    if(req.body.local.email)
      user.local.email = req.body.local.email
    if(req.body.local.password)
      user.local.password = req.body.local.password
    if(req.body.city)
      user.city = req.body.city
    if(req.body.state)
      user.state = req.body.state
    if(req.body.country)
      user.country = req.body.country

    user.save(function(err){
      if(err) res.json({err:err})
      res.json({success: true, message: 'User has been updated!'})
    })
  })
}

function destroy(req,res){
  User.findOneAndRemove({_id:req.params.user_id}, function(err, user){
    if(err) res.json({err:err})
    res.json({success: true, message: 'User has been obliterated into the ether.'})
  })
}

module.exports = {
  allUsers: index,
  showUser: show,
  createUser: create,
  updateUser: update,
  deleteUser: destroy
}
