module.exports = function(app, UserInfo)
{
    app.get('/api/user/:user_id', function(req, res){
        UserInfo.findOne({user_id: req.params.user_id}, function(err, user){
            if(err) return res.status(500).json({error: err});
            if(!user) return res.status(404).json({error: 'user not found'});
            res.json(user);
        })
    });

    app.get('/api/userall', function(req, res){
        UserInfo.find(function(err, contacts){
        if(err) return res.status(500).send({error: 'database failure'});
            res.json(contacts);
        })
    });

    app.post('/api/phoneBook', function(req, res){
        
        id = req.body.user_id;
        phoneBook = req.body.phoneBook;

        console.log("id: " + id);

        UserInfo.update({ user_id: id}, {$push: {phoneBook: {$each: phoneBook}}}, function(err, user){
            if(err) return res.status(500).json({ error: "database failure" });
            if(!user) return res.status(404).json({error: 'user not found'});
            
            res.json({result: 1});
            
        })
    });

    app.post('/api/gallery', function(req, res){
        
        id = req.body.user_id;
        gallery = req.body.gallery;

        console.log("id: " + gallery);

        UserInfo.update({ user_id: id}, {$push: {gallery: {$each: gallery}}}, function(err, user){
            if(err) return res.status(500).json({ error: "database failure" });
            if(!user) return res.status(404).json({error: 'user not found'});
            
            res.json({result: 1});
            
        })
    });

    app.post('/api/user', function(req, res){
        
        id = req.body.user_id;
        phoneBook = req.body.phoneBook;
        gallery = req.body.gallery;

        console.log("id: " + id);


        var added_user = new UserInfo();
        added_user.user_id = id;
        added_user.phoneBook = phoneBook;
        added_user.gallery = gallery;

        added_user.save(function(err){
            if(err){
                console.error(err);
                res.json({result: 0});
                return;
            }
        
            res.json({result: 1});
        
        });
    });

    app.delete('/api/userall', function(req, res){
        UserInfo.remove({ }, function(err, output){
            if(err) return res.status(500).json({ error: "database failure" });

            /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
            if(!output.result.n) return res.status(404).json({ error: "contact not found" });
            res.json({ message: "contacdeleted" });
            */

            res.status(204).end();
        })
    });

    app.delete('/api/user:user_id', function(req, res){
        UserInfo.remove({user_id: user_id }, function(err, output){
            if(err) return res.status(500).json({ error: "database failure" });

            res.status(204).end();
        })
    });

    app.delete('/api/phoneBook', function(req, res){
        user_id = req.body.user_id;
        phoneBook = req.body.phoneBook;

        console.log("phonebook: " + phoneBook);

        UserInfo.update({ user_id: user_id}, {$pull: {phoneBook: {name: phoneBook.name, number: phoneBook.number}}}, function(err, output){
            if(err) return res.status(500).json({ error: "database failure" });

            /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
            if(!output.result.n) return res.status(404).json({ error: "contact not found" });
            res.json({ message: "contacdeleted" });
            */

            res.status(204).end();
        })
    });
}
