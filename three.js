const rl=require("readline").createInterface(
    process.stdin,process.stdout
)

rl.question(("please enter your name:"),(input)=>{
    console.log("hello" +" "+input)
    rl.close()
})