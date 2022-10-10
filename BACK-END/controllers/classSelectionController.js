export default function classSelection(req, res)
{
    try{
        console.log(req.body.classChoice)
    }
    catch(err)
    {
        res.status(500).send(err.message);
    }
}