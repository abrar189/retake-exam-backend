'use strict'

require('dotenv').config();
const express = require('express');

const cors = require('cors');

const axios = require('axios');

const server = express();
const PORT = process.env.PORT
server.use(cors());

server.use(express.json());

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true });

// http://localhost:3006/
server.get('/', (req, res) => {
    res.send('helloooooo')
})



const fllowerSchema = new mongoose.Schema({
    instructions: String,
    photo: String,
    name: String,

});
const userSchema = new mongoose.Schema({
    email: String,
    data:[fllowerSchema],
});

const user = mongoose.model('user', userSchema);

function seedUser(){
    let userData=new user ({
        email:'algourabrar@gmail.com',
        data:[
            {
                "instructions": "Large double. Good grower, heavy bloomer. Early to mid-season, acid loving plants. Plant in moist well drained soil with pH of 4.0-5.5.",
                "photo": "https://www.miraclegro.com/sites/g/files/oydgjc111/files/styles/scotts_asset_image_720_440/public/asset_images/main_021417_MJB_IMG_2241_718x404.jpg?itok=pbCu-Pt3",
                "name": "Azalea"
                },
                {
                "instructions": "Beautiful large royal purple flowers adorn attractive satiny green leaves that turn orange\\/red in cold weather. Grows to up to 18 feet, or prune annually to shorten.",
                "photo": "https://upload.wikimedia.org/wikipedia/commons/b/bf/Flower_in_Horton_Plains_1.jpg",
                "name": "Tibouchina Semidecandra"
                },
        ]
    })
    let userData1=new user ({
        email:'roaa.abualeeqa@gmail.com',
        data:[
            {
                "instructions": "Large double. Good grower, heavy bloomer. Early to mid-season, acid loving plants. Plant in moist well drained soil with pH of 4.0-5.5.",
                "photo": "https://www.miraclegro.com/sites/g/files/oydgjc111/files/styles/scotts_asset_image_720_440/public/asset_images/main_021417_MJB_IMG_2241_718x404.jpg?itok=pbCu-Pt3",
                "name": "Azalea"
                },
                {
                "instructions": "Beautiful large royal purple flowers adorn attractive satiny green leaves that turn orange\\/red in cold weather. Grows to up to 18 feet, or prune annually to shorten.",
                "photo": "https://upload.wikimedia.org/wikipedia/commons/b/bf/Flower_in_Horton_Plains_1.jpg",
                "name": "Tibouchina Semidecandra"
                },
        ]
    })
    userData.save();
    userData1.save();

}
// seedUser()

// http://localhost:3006/dataDB?email=
server.get('/dataDB', dataDBFun )
function dataDBFun(req,res){
let email=req.query.email;
user.find({email:email},(error,userData)=>{
    if (error){
        res.send(error)
    }else{
        res.send(userData[0].data)
    }
})
}

let memory={};
// http://localhost:3006/dataAPI
server.get('/dataAPI', dataApiFun )
async function dataApiFun(req,res){
const url='https://flowers-api-13.herokuapp.com/getFlowers';
if(memory['api']!==undefined){
    res.send(memory['api'])
}else{
    const apiData= await axios.get(url);
    const apiMap=apiData.data.flowerslist.map(item=>{
        return new objData(item)
    })
    memory['api']=apiMap;
    res.send(apiMap);
}
}
class objData{
    constructor(data){
        this.instructions=data.instructions;
        this.photo=data.photo;
        this.name=data.name;

    }
}

// http://localhost:3006/addTofav
server.post('/addTofav', addTofavFun )
function addTofavFun(req,res){
let {email,instructions,photo,name}=req.body;
user.find({email:email},(error,userData)=>{
    if (error){
        res.send(error)
    }else{
        const fav={
            instructions:instructions,
            photo:photo,
            name:name,

        }
        userData[0].data.push(fav);
       
    } 
    userData[0].save();
    res.send(userData[0])
})
}


// http://localhost:3006/delete/idx
server.delete('/delete/:idx', deleteFun )
function deleteFun(req,res){
    let idx=req.params.idx
    let email=req.query.email;
user.findOne({email:email},(error,userData)=>{
    if (error){
        res.send(error)
    }else{
        userData.data.splice(idx,1);
        userData.save();
        res.send(userData.data)
    }
})
}

// http://localhost:3006/update/idx
server.put('/update/:idx', updateFun )
function updateFun(req,res){
    let idx=req.params.idx
    let {email,instructions,photo,name}=req.body;
    user.findOne({email:email},(error,userData)=>{
    if (error){
        res.send(error)
    }else{
        userData.data.splice(idx,1,{
            instructions:instructions,
            photo:photo,
            name:name,
        });
        userData.save();
        res.send(userData.data)
    }
})
}



server.listen(PORT, () => {
    console.log(`listen to ${PORT}`);
})