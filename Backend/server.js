const app = require("./app");
const http = require("http");

const port = process.env.PORT || 3000;
const server = http.createServer(app);


app.listen(port, ()=>{
    console.log("Server is Running at Port " , port);
});
