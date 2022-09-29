export default async function home(req, res) {
    try{
        res.send("test")
    } catch(err){
        res.status(500).send(err.message);
    }
}
