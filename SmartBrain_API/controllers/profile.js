const handleProfileGet = (req,res,db)=>{
    const { id } = req.params;
    db.select('*').from('users').where({id: id})
    .then(user => {
        console.log(user)
        if (user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('not found')
        }
        res.json(user[0]);
    })
    .catch(err => res.status(400).json('error'))
    
    
}

module.exports = {handleProfileGet: handleProfileGet}