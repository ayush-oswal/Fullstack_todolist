
/*  
connection string : mongodb+srv://ayushoswal2003:Kabootar22@cluster0.jofycbf.mongodb.net/?retryWrites=true&w=majority
*/

const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser')

const _ = require('lodash')

const date = require(__dirname+"/date.js")
let day = date();
// console.log(date)

const app = express();

app.use(bodyParser.urlencoded({extended:"true"}))

app.use(express.static("public"))


var items = [];


mongoose.connect("mongodb+srv://ayushoswal2003:Kabootar22@cluster0.jofycbf.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Atlas connected'))
.catch(err => console.log(err));

const itemSchema ={
    name:String
}

const Item = mongoose.model("item",itemSchema);

const ListSchema = {
    name:String,
    items:[itemSchema]
}

const List = mongoose.model("List",ListSchema)


app.set('view engine', 'ejs');

app.get("/",function(req,res){
    

    Item.find({})
    .then(Items=> res.render("list",{ListTitle:"Today" , Newitems:Items}))

    
});

app.post("/",function(req,res){
    console.log(req.body)
    var itemName = req.body.newitem;
    const listname = req.body.list;
    const item = new Item({
        name:itemName
    });


    if(listname==="Today"){
        //console.log("in if")
        item.save();
        res.redirect("/")
    }
    else{
        //console.log("in else")
        List.findOne({name:listname})
        .then((foundlist)=>{
            foundlist.items.push(item)
            foundlist.save();
            res.redirect("/"+listname)
        })
        .catch(err=> console.log(err))
    }

    
});

app.post("/delete",function(req,res){
    const deleteid = req.body.checkbox;
    //console.log(deleteid)
    const listname = req.body.listName;
    if(listname==="Today"){
        Item.findOneAndDelete({_id:deleteid})
        .then(()=>console.log("successfully deleted item"))
        .catch(err=>console.log(err))
        res.redirect("/")
    }
    else{
        console.log("in else")
        List.findOneAndUpdate({name:listname},{$pull:{items:{_id:deleteid}}})
        .then(()=>{
            res.redirect("/"+listname)
        })
        .catch(err=>console.log(err))
    }
     
});


app.get("/:customName",function(req,res){
    const newname = _.capitalize(req.params.customName)
    List.findOne({name:newname})
    .then((listfound)=>{
        if(!listfound){
            const list = new List({
                name:newname,
                items:[]
            });
            list.save()
            res.redirect("/"+newname)
        }
        else{
            var NewItems=[]
            NewItems = listfound.items
            res.render("list",{ListTitle:newname , Newitems:NewItems})
        }
    })
    .catch(err=>console.log(err))
});

app.post("/work",function(req,res){
    var item = req.body.newitem;
    Workitems.push(item);
    res.redirect("/work")
});

app.listen("3000",function(){
    console.log("server started on 3000")
});