const express = require("express");
const mysql = require("mysql");
var bodyParser = require("body-parser");
const redis = require("redis");
const dayjs = require("dayjs");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "yoursqlsecret",
  database: "dati",
});

connection.connect((err) => {
  if (err) {
    console.error("failed to connect to database, error: ", err);
    process.exit(1);
  }
  console.log("mysql已连接")
});

const app = express();
app.use(express.json());
app.use(express.static("./"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require("cors");
app.use(cors());
// const redisClient = redis.createClient(6379, '127.0.0.1',)
// redisClient.on('error', err => {
//   console.log(err)
// })

/**
 * @param {string} sql
 * @return {Promise} result
 * @description 封装成promise的mysql数据操作，只要写sql就行,如果出错会抛出错误，所以还要trycathc包裹一下
 * @example let result = await query("select * from table")
 *
 * */
function query(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

/**
 * @return {string} dateString  根据时间字符串格式化
 * @description 根据时间字符串格式化
 * @example let date = formatDate()
 * */
function formatDate(date) {
  return dayjs(new Date(date).toISOString()).format("YYYY-MM-DD HH:mm:ss");
}

//管理员登录
app.get("/login/manager",async function (req, res) {
  try {
    const thisname = req.query.username;
  const thispassword = req.query.password;
  const sql =
    `SELECT * FROM manager_tbl WHERE userName ='${thisname}' AND password =${thispassword}`;
  console.log(sql);
  let result = await query(sql);
  if(!result || result.length==0){
    return res.status(500).json({message:"用户名或密码错误"})
  }
  return  res.status(200).send();
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"用户名或密码错误"})
  }
});

//添加用户信息功能
// app.post('/add/user', function (req, res) {
//   const thisnickname = req.body.nickname
//   const thisavatar = req.body.avatar
//   const thisusername=req.body.username
//   const thisregistertime=req.body.register_time
//   const thislogintime=req.body.login_time
//   const thisvxid=req.body.vx_id
//   const thisremark=req.body.remark
//   const sql1="SELECT UUID();"
//   const sql2 = `INSERT INTO user_tbl (userid,nickname,avatar,username,register_time,login_time,vx_id,remark) VALUES (
//     '${UUID}','${thisnickname}','${thisavatar}','${thisusername}','${thisregistertime}','${thislogintime}','${thisvxid}',
//     '${thisremark}')`;
//   connection.query(sql1,(err,result)=>{
//     if(err){
//       res.status(500).json("生成UUID失败");
//     }
//   })
//   connection.query(sql2, (err, result) => {
//     if (result.length == 0 || err) {
//       res.status(500).json("添加用户信息失败")
//     }
//     else {//查到该记录，添加用户信息成功
//       res.status(200).json(result)
//     }
//   })
// })

//更新用户信息
app.put("/renew/user", function (req, res) {
  const thisuserid = req.body.userid;
  const thisnickname = req.body.nickname;
  const thisavatar = req.body.avatar;
  const thisusername = req.body.username;
  const thisregistertime = req.body.register_time;
  const thislogintime = req.body.login_time;
  const thisvxid = req.body.vx_id;
  const thisremark = req.body.remark;
  const sql =
    `UPDATE user_tbl SET nickname='${thisnickname}',avatar='${thisavatar}',username='${thisusername}',
    register_time='${thisregistertime}',login_time='${thislogintime}',vx_id='${thisvxid}',
    remark='${thisremark}' WHERE userid='${thisuserid}'`; 
  connection.query(sql, (err, result) => {
    if (result.length == 0 || err) {
      res.status(500).json("更新用户信息失败");
    } else {
      res.status(200).json(result);
    }
  });
});

//获取用户信息功能
app.get("/get/user", function (req, res) {
  const { id } = req.query;
  const sql = `SELECT * FROM user_tbl WHERE userid ='${id}'`;
  connection.query(sql, (err, result) => {
    if (err || !result || result.length == 0) {
      console.log(err)
      res.status(500).json({ message: err });
    } else {
      //查到该记录，获取用户成功
      result = {
        ...result[0],
        register_time: formatDate(result[0].register_time),
        login_time: formatDate(result[0].login_time),
      };
      console.log(result);
      res.status(200).json(result);
    }
  });
});


//获取所有用户信息功能
app.get("/get/alluser", async function (req, res) {
  try {
      //下面获取用户的普通模式总分和挑战模式平均分数
  let history = await query(`
  select sum(IF(t2.\`mode\`='普通模式',t2.current_score,NULL)) sum_score,AVG(IF(t2.\`mode\`='普通模式',NULL,answer_accuracy)) avg,t2.userid,t2.\`mode\` from history_tbl t2
  join 
  (
    select coursetype,userid,\`mode\`,max(date) date1 from history_tbl
    group by userid,coursetype,\`mode\`

  ) t1 on t1.coursetype=t2.coursetype and t1.userid=t2.userid AND
  t1.\`mode\`=t2.\`mode\` and t1.date1=t2.date
  GROUP BY t2.userid, t2.\`mode\`
    `);
  let userList = await query("select userid,nickname,register_time,login_time from user_tbl")
  userList=userList.map(i=>{
    let sum_score=0,avg=0
    history.forEach(j=>{
      if(j.userid==i.userid && j.mode=='普通模式'){
        sum_score=j.sum_score
      }
      if(j.userid==i.userid && j.mode=='挑战模式'){
        avg=j.avg
      }
    })
    return{
      ...i,commonSumNumber:sum_score,challengeAccuracy:avg,register_time:formatDate(i.register_time),login_time:formatDate(i.login_time)
    }
  })
  res.status(200).json(userList);
  } catch (error) {
    res.status(500).json({message:error.message})
  }
});


app.get("/userInfo",async (req,res)=>{
  const {userId} = req.query
  if(!userId){
    return res.status(400).json({message:"用不存在"})
  }
  try {

  let userList = await query(`select userid,nickname,register_time,login_time,username,avatar from user_tbl where userid='${userId}'`)
  console.log(userList)
  if(!userList.length){
    return res.status(400).json({message:"用户不存在"})
  }
  let history=await query(`
  select sum(IF(t2.\`mode\`='普通模式',t2.current_score,NULL)) sum_score,AVG(IF(t2.\`mode\`='普通模式',NULL,answer_accuracy)) avg,t2.userid,t2.\`mode\`from history_tbl t2
  join 
  (
    select coursetype,\`mode\` ,userid,max(date) date1 from history_tbl
    where userid='${userId}'
    group by coursetype,\`mode\`,userid 

  ) t1 on t1.coursetype=t2.coursetype and t1.userid=t2.userid AND
  t1.\`mode\`=t2.\`mode\` and t1.date1=t2.date
  GROUP BY t2.userid, t2.\`mode\`
  `)
  if(!history.length){
    return res.status(200).json({...userList[0],commonSumNumber:0,challengeAccuracy:0})
  }
  userList=userList.map(i=>{
    let sum_score=0,avg=0
    history.forEach(j=>{
      if( j.mode=='普通模式'){
        sum_score=j.sum_score
      }
      if(j.mode=='挑战模式'){
        avg=j.avg
      }
    })
    return{
      ...i,
      commonSumNumber:sum_score,
      challengeAccuracy:(avg*1).toFixed(2)
    }
  })[0]
  res.status(200).json(userList);
  } catch (error) {
    console.log(error)
    res.status(500).json({message:error.message})
  }
  

})


//获取所有题库信息功能
app.get('/get/allquestionbank',async (req,res)=>{
  try {
    let questionBanks=await query('select * from questionbank_tbl')
    return res.status(200).json(questionBanks)
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:error.message})
  }
})



//获取某个题库的全部题目信息
app.get("/get/allquestion", async function (req, res) {
  try {
    const { name: questionBank } = req.query;
    const sql = `SELECT * FROM question_tbl where coursetype='${questionBank}'`;
    let result = await query(sql);
    if (result.length == 0) {
      return res.status(200).json({ message: "题库为空" });
    }
    //查到该记录，获取用户成功

    let array = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let a = Object.getOwnPropertyNames(result[0]).filter(
      (i) => !i.includes("num")
    );
    result = result.map((i) => {
      let obj = {};
      for (let x = 0; x < i.columnnum; x++) {
        obj[array[x] + "num"] = i[array[x] + "num"];
      }
      let obj2 = {};
      a.forEach((x) => {
        obj2[x] = i[x];
      });
      return {
        ...obj2,
        ...obj,
      };
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

//删除题目
app.delete("/question", async (req, res) => {
  try {
    const { id: idList } = req.body;
    await query(
      `delete from question_tbl where id in ('${idList.join("','")}')`
    );
    res.status(200).json({ message: "删除成功" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});



//获取对应的题库信息功能
app.get("/get/questionbank/certainly", function (req, res) {
  const thisbankname = req.query.bankname;
  const sql =
    `SELECT * FROM question_tbl WHERE coursetype ='${thisbankname}'`;
  connection.query(sql, (err, result) => {
    if (!result || result.length == 0 || err) {
      console.log(err)
      res.status(500).json("获取题库信息失败");
    } else {
      //查到该记录，获取题库信息成功
      res.status(200).json(result);
    }
  });
});


//获取题库信息
app.get("/get/question", function (req, res) {
  const thisid = req.query.id;
  const sql = `SELECT * FROM question_tbl WHERE id ='${thisid}'`;
  connection.query(sql, (err, result) => {
    if (result.length == 0 || err) {
      res.status(500).json("获取题库信息失败");
    } else {
      //查到该记录，获取用户成功
      res.status(200).json(result);
    }
  });
});

//获取题库列表
app.get("/questionBanks", async (req, res) => {
  console.log("获取题库的列表");
  let result = await query("select distinct  bankname from questionbank_tbl");
  result = result.map((i, index) => {
    return {
      value: i.bankname,
      label: i.bankname,
    };
  });
  res.status(200).json({ options: result });
});

//添加历史答题信息
app.post("/add/answer_history", function (req, res) {
  const thisuserid = req.body.userid;
  const thiscoursetype = req.body.name;
  const thisdate = req.body.time;
  const thisnormalnum = req.body.normalnum;
  const thisnormaltrue = req.body.normaltrue;
  const thisaccuracy = req.body.accuracy;
  const thisanswertime = req.body.answertime;
  const sql =
    `INSERT INTO answer_history_tbl (userid,coursetype,date,normal_answer_number,normal_answer_true,answer_accuracy,answer_time) VALUES(
      '${thisuserid}','${thiscoursetype}','${thisdate}','${thisnormalnum}','${thisnormaltrue}','${thisaccuracy}','${thisanswertime}')`;
  connection.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json("添加历史答题信息失败");
    }
    res.status(200).json(result);
  });
});


//获取题库信息功能
app.get("/get/questionbank", function (req, res) {
  const thisbankname = req.query.bankname;
  const sql =
    `SELECT * FROM questionbank_tbl WHERE bankname ='${thisbankname}'`;
  connection.query(sql, (err, result) => {
    if (result.length == 0 || err) {
      res.status(500).json("获取题库信息失败");
    } else {
      //查到该记录，获取题库信息成功
      res.status(200).json(result);
    }
  });
});

//添加题库信息功能
app.post("/add/questionbank", function (req, res) {
  const thisbankname = req.body.bankname;
  const thisquestionnum = req.body.questionnum;
  const thiscreatetime = req.body.createtime;
  const thiscreater = req.body.creater;
  const sql =
    `INSERT INTO questionbank_tbl (bankname,questionnum,createtime,creater) VALUES (
      '${thisbankname}','${thisquestionnum}','${thiscreatetime}','${thiscreater}')`; 
  connection.query(sql, (err, result) => {
    if (result.length == 0 || err) {
      res.status(500).json("添加题库信息失败");
    } else {
      //查到该记录，添加题库信息成功
      res.status(200).json(result);
    }
  });
});


//添加题库信息功能
app.post("/add/questionbank", async function (req, res) {
  try {
    const thisbankname = req.body.bankname;
    const thisquestionnum = req.body.questionnum;
    const thiscreatetime = req.body.createtime;
    const thiscreater = req.body.creater;
    const sql =
      `INSERT INTO questionbank_tbl (bankname,questionnum,createtime,creater) VALUES (
        '${thisbankname}','${thisquestionnum}','${thiscreatetime}','${thiscreater}')`;
    let result = await query(sql)
    if (!result) {
      return res.status(500).json("添加题库信息失败");
    }
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({message:error.message})
  }
});


//更新题库信息
app.put("/renew/questionbank", function (req, res) {
  const thisbankname = req.body.bankname;
  const thisquestionnum = req.body.questionnum;
  const thiscreatetime = req.body.createtime;
  const thiscreater = req.body.creater;
  const sql =
    `UPDATE questionbank_tbl SET questionnum='${thisquestionnum}',createtime='${thiscreatetime}',
     creater='${thiscreater}' WHERE bankname='${thisbankname}'`;
  connection.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json("更新题库信息失败");
    }
    res.status(200).json(result);
  });
});


//获取最近五次对应模式答题信息功能
app.get("/get/history/nearlyfivetimes", function (req, res) {
  const id = req.query.id;
  const thismode = req.query.mode;
  const sql =
    `SELECT * FROM history_tbl WHERE userid ='${id}' AND mode='${thismode}' ORDER BY date DESC`;
  connection.query(sql, (err, result) => {
    if (result.length == 0 || err) {
      res.status(500).json("获取题库信息失败");
    } else if (result.length < 5) {
      var obj = [];
      if (thismode == "普通模式") {
        for (var i = 0; i < result.length; i++) {
          var jsonobj = {
            date: null,
            number: null,
            correctNumber: null,
          };
          jsonobj.date = result[i].date;
          jsonobj.number = result[i].normal_answer_number;
          jsonobj.correctNumber = result[i].normal_answer_true;
          obj.push(jsonobj);
        }
      } else {
        for (var i = 0; i < result.length; i++) {
          var jsonobjchallenge = {
            date: null,
            accuracy: null,
            spandTime: null,
          };
          jsonobjchallenge.date = result[i].date;
          jsonobjchallenge.accuracy = result[i].answer_accuracy;
          jsonobjchallenge.spendTime = result[i].challenge_completion_time;
          obj.push(jsonobjchallenge);
        }
      }
      res.status(200).json(obj);
    } else {
      //查到该记录，获取近五次题答题信息成功
      var obj = [];
      if (thismode == "普通模式") {
        for (var i = 0; i < 5; i++) {
          var jsonobj = {
            date: null,
            number: null,
            correctNumber: null,
          };
          jsonobj.date = result[i].date;
          jsonobj.number = result[i].normal_answer_number;
          jsonobj.correctNumber = result[i].normal_answer_true;
          obj.push(jsonobj);
        }
      } else {
        for (var i = 0; i < 5; i++) {
          var jsonobjchallenge = {
            date: null,
            accuracy: null,
            spandTime: null,
          };
          jsonobjchallenge.date = result[i].date;
          jsonobjchallenge.accuracy = result[i].answer_accuracy;
          jsonobjchallenge.spendTime = result[i].challenge_completion_time;
          obj.push(jsonobjchallenge);
        }
      }
      res.status(200).json(obj);
    }
  });
});
const server = app.listen(8888, "localhost", function () {
  console.log("8888端口已监视");
});
