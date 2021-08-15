const port=3000
const express=require("express");
const app=express();

const bodyParser=require("body-parser")
app.use(bodyParser.urlencoded({extended:true}))

const ejs=require("ejs")

const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology:true})

const _=require("lodash")

app.use(express.static("public"))

app.listen(port,function(err)
  {
    console.log("Sever up at port 3000");
  }
)

const wikiSchema={
  title:String,
  content:String
}

const Article=mongoose.model("article",wikiSchema)

app.route("/articles")
.get(function(req,res)
{
  Article.find({},function(err,results)
{
  if(!err)
  {
    res.send(results)
  }
  else{
    console.log(err)
  }
})
})

.post(function(req,res)
{
  console.log(req.body.title)
  console.log(req.body.content)
  const newArticle= new Article({
    title:req.body.title,
    content:req.body.content

  })
  newArticle.save(function(err)
{
  if(!err)
  {
    res.send("New article created")
  }
  else{
    res.send(err)
  }
})
})


.delete(function(req,res)
{
  Article.deleteMany({},function(err)
{
  if(!err)
  {
    res.send("Deleted all")
  }
  else{
    res.send(err)
  }
})
}


)


app.route("/articles/:name")
.get(function(req,res)
{
  Article.findOne({title:req.params.name},function(err,result)
{
  if(!err)
  {
    res.send(result)
  }
  else
  {
    console.log("No article with that title "+err)
  }
})
}
)
.put(function(req,res)
{
Article.update({title:req.params.name},{title:req.body.title,content:req.body.content},{overwritten:true},function(err){
  if(!err)
  {
    res.send("PUT:Update success")
  }
  else
  {
    res.send(err)
  }
})


})


.patch(function(req,res){
  Article.update({title:req.params.name},{$set:req.body},function(err)
  {
    if(!err)
    {
      res.send("PATCH:Success")
    }
    else{
      res.send(err)
    }
  })
})
