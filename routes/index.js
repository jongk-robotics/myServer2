module.exports = function(app, UserInfo, GroupInfo, upload, fs)
{
    app.get('/api/user/:user_id', function(req, res){
        UserInfo.findOne({user_id: req.params.user_id}, function(err, user){
            if(err) return res.status(500).json({error: err});
            if(!user) return res.status(404).json({error: 'user not found'});
            res.json(user);
        })
    });

    app.get('/api/phoneBook/:user_id', function(req, res){
        UserInfo.findOne({user_id: req.params.user_id}, function(err, user){
            if(err) return res.status(500).json({error: err});
            if(!user) return res.status(404).json({error: 'user not found'});
            res.json(user.phoneBook);
        })
    });

    app.get('/api/userall', function(req, res){
        UserInfo.find(function(err, users){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(users);
        })
    });

    app.get('/api/contacts', function(req,res){
        Contact.find(function(err, contacts){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(contacts);
        })
    });

    // app.post('/api/phoneBook', function(req, res){
        
    //     id = req.body.user_id;
    //     phoneBook = req.body.phoneBook;

    //     console.log("id: " + id);

    //     UserInfo.update({ user_id: id}, {$push: {phoneBook: {$each: phoneBook}}}, function(err, user){
    //         if(err) return res.status(500).json({ error: "database failure" });
    //         if(!user) return res.status(404).json({error: 'user not found'});
            
    //         res.json({result: 1});
            
    //     })
    // });

    app.post('/api/phoneBook', function(req, res){
        
        id = req.body.user_id;
        name = req.body.name;
        number = req.body.number;

        console.log("id: " + id);

        UserInfo.findOne({user_id: id}, function(err, user){
            if(err) return res.status(500).json({error: err});
            if(!user) return res.status(404).json({error: 'user not found'});


            UserInfo.findOne({$and: [{user_id: id}, {phoneBook: {$elemMatch: {name: name, number: number}}}]}, function(err, user){
                if(err) return res.status(500).json({error: err});
                if(!user){
                    UserInfo.update({ user_id: id}, {$push: {phoneBook: {name: name, number: number}}}, function(err, user){
                        if(err) return res.status(500).json({ error: "database failure" });
                        if(!user) return res.status(404).json({error: 'user not found'});
                        
                        
                    })
                }
            })
            

            res.json({result: 1});
        })
        
    });

    app.post('/api/user', function(req, res){
        
        id = req.body.user_id;
        phoneBook = req.body.phoneBook;

        console.log("id: " + id);

        UserInfo.findOne({user_id: id}, function(err, user){
            if(err) return res.status(500).json({error: err});
            if(!user){
                var added_user = new UserInfo();
                added_user.user_id = id;
                added_user.phoneBook = phoneBook;

                added_user.save(function(err){
                    if(err){
                        console.error(err);
                        res.json({result: 0});
                        return;
                    }
                });
            }
            
            res.json({result: 1});
        })
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
        name = req.body.name;
        number = req.body.number;

        UserInfo.update({ user_id: user_id}, {$pull: {phoneBook: {name: name, number: number}}}, function(err, output){
            if(err) return res.status(500).json({ error: "database failure" });

            /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
            if(!output.result.n) return res.status(404).json({ error: "contact not found" });
            res.json({ message: "contacdeleted" });
            */

            res.status(204).end();
        })
    });

    app.post('/api/group', function(req, res){
        
        name = req.body.group_name;

        GroupInfo.findOne({group_name: name}, function(err, group){
            if(err) return res.status(500).json({error: err});
            if(!group){
                var added_group = new GroupInfo();
                added_group.group_name = name;

                added_group.save(function(err){
                    if(err){
                        console.error(err);
                        res.json({result: 0, error: "save fail"});
                        return;
                    }
                    else{
                        res.json({result: 1});
                    }
                });
            }
            else{
                res.json({result: 0, error: "already exists"});
            }
        })

        
    });

    app.get('/api/groupall', function(req, res){
        GroupInfo.find(function(err, groups){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(groups);
        })
    });
    app.get('/api/groupNamesAll', function(req, res){
        GroupInfo.find({}, 'group_name', function(err, names){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(names);
        })
    });

    app.delete('/api/groupall', function(req, res){
        GroupInfo.remove(function(err, groups){
            if(err) return res.status(500).send({error: 'database failure'});
            res.status(204).end();
        })
    });

    app.post('/api/upload', upload.single('productImg'), async (req, res, next) => {
        
        group_name = req.body.group_name;
        file_name = req.file.filename;


        console.log("group_name: " + group_name);
        console.log("file_name: " + file_name);

        res.json({file_name: file_name});

        // try {
        //     res.redirect('api/uploads/'+req.file.filename)
        // } catch (e) {
        //   next(e);
        // }

        // GroupInfo.remove({}, function(err, user){
        //     console.log("ind b");
        //     if(err) return res.status(500).json({error: err});
        //     if(!user) return res.status(404).json({error: 'group not found'});


        //     // GroupInfo.update({ group_name: group_name}, {$push: {memoBook: {fileName: file_name}}}, function(err, user){
        //     //     if(err) return res.status(500).json({ error: "database failure" });
        //     //     if(!user) return res.status(404).json({error: 'user not found'});
                
                
        //     // })
            

        //     res.json({result: 1});
        // })

        

        // res.status(200).end();
      });

      app.post('/api/memoBook', function (req, res){

        group_name = req.body.group_name;
        file_name = req.body.file_name;

        console.log("group_name: " + group_name);
        console.log("file_name: " + file_name);
        

        GroupInfo.update({group_name: group_name}, {$push: {memoBook: {file_name: file_name}}}, function(err, user){
            console.log("ind b");
            if(err) return res.status(500).json({error: err});
            if(!user) return res.status(404).json({error: 'group not found'});


            // GroupInfo.update({ group_name: group_name}, {$push: {memoBook: {fileName: file_name}}}, function(err, user){
            //     if(err) return res.status(500).json({ error: "database failure" });
            //     if(!user) return res.status(404).json({error: 'user not found'});
                
                
            // })
            

            res.json({result: 1});
        })
      
      });

      app.get('/api/memoBook/:group_name', function(req, res){
        GroupInfo.findOne({group_name: req.params.group_name}, function(err, group){
            if(err) return res.status(500).json({error: err});
            if(!group) return res.status(404).json({error: 'user not found'});
            res.json(group.memoBook);
        })
    });

      

    //   app.get('/uploads/:upload', function (req, res){
    //     file = req.params.upload;
    //     console.log(req.params.upload);
    //     var img = fs.readFileSync(__dirname + "/../uploads/" + file);

        

    //     res.writeHead(200, {'Content-Type': 'image/png' });
    //     res.end(img, 'binary');
      
    //   });

      app.get("/download/:download", function(req, res){
        file = req.params.download;

        console.log("rawfile: " + file);

        var filename = __dirname + "/../uploads/";

        var jbSplit = file.split('+', 2);
        
        filename = filename + jbSplit[0] + "/" + jbSplit[1];
        

        console.log("file: " + filename);

        fs.readFile(filename,              //파일 읽기
          function (err, data)
          {
              if(err) return res.status(500).end();
              //http의 헤더정보를 클라이언트쪽으로 출력
              //image/jpg : jpg 이미지 파일을 전송한다
              //write 로 보낼 내용을 입력
              res.writeHead(200, { "Context-Type": "image/jpg" });//보낼 헤더를 만듬
              res.write(data);   //본문을 만들고
              res.end();  //클라이언트에게 응답을 전송한다
      
          }
        );
      
      });





}
