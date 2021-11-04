const express = require('express');
const bodyparser = require('body-parser');
const cors = require("cors");
const app = express();
const fuzzy = require('fuzzy');
app.use(cors());
app.use(bodyparser.json());
const port = process.env.PORT || 3000;
let mainLogs=[];
let activeRoom = [

]
let Users=[

]
const typing = "!QAS@EDCV#^YHG";
global.iniRoom = (rid) => {
    var logs = [];
    var tub = [];
    var users = [];
    var universalus = [];
    app.get('/iniusers' + rid, (req, res) => {
        console.log(universalus);
        res.send(universalus);
    });
    app.get('/getCusers' + rid, (req, res) => {

        var checkone = req.query.user;

        for (var x = 0; x < users.length; x++) {
            if (checkone === users[x].user) {
                res.send(users[x].cusers);
                //console.log("List of Current Users Send To user : "+checkone);
                //console.log("The list is :"+ users[x].cusers);
                users[x].cusers = [];
                //console.log(" CUB Crate Emptied for user "+checkone);
                break;
            }
        }
    });
    app.post('/setUser' + rid, (req, res) => {
        var requester = req.body.user;
        let len=universalus.length;
        for(let i=0;i<len;i++)
        {
            if(universalus[i].user===requester)
            {

                res.send(true);
                return;
            }
        }
            tub.push({
                user: requester,
                imb: [],
            });
            users.push({
                user: requester,
                cusers: []
            });
            var l = users.length;
            var i;
            var lola=new Date();
            universalus.push({
                user: requester, 
                time: lola.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true
                })
            });

            for (i = 0; i < l; i++) {
                if (users[i].user !== requester) {
                    tub[i].imb.push({ msg: '!@#$%^&*(WERTY', user: String(requester),time: lola.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true
                }) });
                }
                users[i].cusers.push({ msg: '!@#$%^&*(WERTY', user: String(requester),time: lola.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true
                }) });
            }
            logs.push("Time=>" + String(new Date()) + " ====>User " + req.body.user + "joined.");
            res.send(true);

    });
    app.post('/sendmsg' + rid, (req, res) => {
        //console.log(req.body.msg,req.body.user+" sendmsg");
        var l = tub.length;
        for (var i = 0; i < l; i++) {
            if (tub[i].user !== req.body.user) {
                tub[i].imb.push({ msg: req.body.msg, user: req.body.user, time: req.body.time });
                console.log(tub[i].imb);
            }
        }

        res.send("Message Echoed To everyone Connected");
        }, (e) => {
        //console.log("Sorry problem sending message "+e)
        logs.push("Time=>" + String(new Date()) + " ====>Sorry problem sending message from post");
    });
    app.get('/getmsg' + rid, (req, res) => {
        var l = tub.length;
        for (var x = 0; x < l; x++) {
            if (tub[x].user === req.query.user) {
                if (tub[x].imb.length !== 0) {
                    res.send(tub[x].imb);
                    //console.log(tub[x].user+ "sended=>  " + tub[x].imb);
                    tub[x].imb = [];
                }
                else{
                    res.send([]);
                }
                break;
            }
        }
    }, (e) => {
        //console.log("Sorry problem sending message " + e)
        logs.push("Time=>" + String(new Date()) + "===>Sorry problem sending message from get")
    });
    app.get('/roomInfo' + rid, (req, res) => {
        res.send(logs);
        logs = [];
        tub = [];
        users = [];
        universalus = [];
    }, (e) => {
        res.send(false);
        console.log("Problem Connecting"+e);
    });
    app.post('/leaveRoom'+rid,(req,res)=>{
        let user=req.body.user;
        var temp=[];
        for(let i=0;i<universalus.length;i++)
        {   
            if(universalus[i].user!==user)
            {
                temp.push(universalus[i]);
            }
        }
        universalus=temp;
        temp=[];
        for (let i = 0; i < tub.length; i++) {
            if (tub[i].user !== user) {
                temp.push(tub[i]);
            }
        }
        tub=temp;
        temp=[];
        for (let i = 0; i < users.length; i++) {
            if (users[i].user !== user) {
                temp.push(users[i]);
            }
        }
        users=temp;
        let lola=new Date();
        for (let i = 0; i < users.length; i++) {
            tub[i].imb.push({ msg: '&^%#@WDRT%$##WE', user: String(user) ,time: lola.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true
                })});
            users[i].cusers.push({ msg: '&^%#@WDRT%$##WE', user: String(user),time: lola.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true
                }) });
        }
        res.send(true);
        console.log(universalus,tub,users,"leaved");
    })
    app.post('/delRoom' + rid, (req, res) => {
        let user = req.body.user;
        let lola = new Date();
        for (let i = 0; i < users.length; i++) {
            
            tub[i].imb.push({
                msg: '!Q@S#D$F%G^H&J*K', user: String(user), time: lola.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true
                })
            });
            users[i].cusers.push({
                msg: '!Q@S#D$F%G^H&J*K', user: String(user), time: lola.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true
                })
            });
        }
        var temp = [];
        let l = activeRoom.length;
        for (let i = 0; i < l; i++) {
            if (activeRoom[i].roomId !== rid) {
                temp.push(activeRoom[i])
            }
        }

        activeRoom = temp;
        logs.push("Time=>" + String(new Date()) + " ====>admin" + user + " Deleted Stream");
        res.send(true);
        
    });
    app.post('/typing'+rid,(req,res)=>{
        let user=req.body.user;
        for (let i = 0; i < users.length; i++) {
            tub[i].imb.push({
                msg: typing, user: String(user),q:true
                })
            users[i].cusers.push({
                msg: typing, user: String(user), time: lola.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true
                })
            });
        }
    });
}

//for creating room
app.post('/createRoom', (req, res) => {
    let rid=req.body.rid;
    let admin=req.body.admin;
    let roomName=req.body.rname;
    let rcode=req.body.rcode;
    var timeo = new Date();
    var creationtime = timeo.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true
    });
    let time = creationtime;
    activeRoom.push({
        roomId: rid,
        admin: admin,
        roomName: roomName,
        rcode:rcode,
        time:time
    });
    res.send({
        roomId: rid,
        admin: admin,
        roomName: roomName,
        rcode: rcode,
        time: time
    });
    console.log(activeRoom);
    global.iniRoom(rid);
    
})
app.get('/searchAvRname',(req,res)=>{
    let val = req.query.q;
    res.send(activeRoom.some((el)=>{
        return el.roomName === val;
    }));   
})


//guest users for setting name
app.get('/searchUser', (req, res) => {
    let val = req.query.q;
    res.send(Users.some((el) => {
        return el.name === val;
    }));
})
app.post('/setUniUser',(req,res)=>{
    Users.push({
        name:req.body.user,
        time:req.body.time
    });
    res.send(true);
})


//for joinning
app.get('/searchRoom', (req, res) => {
    let val = req.query.q;
    var options = {
        extract: function (el) { return el.roomName; }
    };
    var results = fuzzy.filter(val, activeRoom, options);
    var matches = results.map(function (el) { return el.string; });
    res.send(matches.length > 10 ? matches.slice(0, 11) : matches);
})
app.post('/searchRid',(req,res)=>{
    res.send(activeRoom.some((el) => {
        return el.roomName === req.body.rname
    }));
});
app.post('/checkRcode',(req,res)=>{

    var rname = req.body.rname;
    var rcode=req.body.rcode;
    var curInfo={
        roomName:rname,
        rcode:rcode,
        time:new Date().getMilliseconds(),
        rid:'',
        admin:'',
        asAdmin:false,
        homeUser:req.body.homeUser
    }
    let yes=activeRoom.some((el) => {
        if (el.roomName === rname && el.rcode === rcode)
        {
            curInfo.rid=el.roomId;
            curInfo.admin=el.admin;
        }
        return el.roomName === rname && el.rcode === rcode;
    });
    if(yes)
    {
        res.send({
            yes:true,
            current:curInfo
        });
        global.iniRoom(curInfo.rid);
    }
    else{
        res.send({yes:false})
    }
});


//exit
app.post('/exit', (req, res) => {
    let user=req.body.user;
    let temp=[];
    for(let i=0;i<Users.length;i++)
    {
        if(Users[i].name!==user)
        {
            temp.push(Users[i]);
        }
    }
    res.send(true);
});

app.post('/getInfo',(req,res)=>{
    
    res.send({
        Users:Users,
        activeRoom:activeRoom
    });
})

app.listen(port, () => {
    mainLogs.push("Time=>" + String(new Date()) + "===>Server is Live Since then...")
    console.log("Server is Live ...");
});
