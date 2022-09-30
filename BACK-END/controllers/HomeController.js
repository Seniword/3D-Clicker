export default async function home(req, res) {
    try{
        res.send("cc")
    } catch(err){
        res.status(500).send(err.message);
    }
}
