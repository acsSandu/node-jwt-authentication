import Auth from './auth.js';
import {Verify, VerifyRole} from "../middleware/verify.js";
import UserSchema from "../models/User.js";

const Router = (server) => {

    // app
    server.get('/app', (req, res) => {
        try {
            res.status(200).json({
                status: 'success',
                data: [],
                message: 'Welcome to our API homepage',
            });
        } catch (err) {
            res.status(500).json({
                status: 'error',
                message: "Internal Server Error"
            })
        }
    })

    // admin
    server.get("/app/admin", Verify, VerifyRole, (req, res) => {
        res.status(200).json({
            status: "success",
            message: "Welcome to the Admin portal!",
        });
    });

    // user
    server.get("/app/user", Verify, (req, res) => {
        res.status(200).json({
            status: "success",
            message: "Welcome to the your Dashboard!",
        });
    });

    // get users
    server.get("/app/users", async (req, res) => {
        try {
            const users = await UserSchema.find();
            res.status(200).json(users);
        } catch (err) {
            console.log(err)
            res.status(500).send("Internal Server Error");
        }
    });

    // delete user
    server.delete("/app/users/:id", async (req, res) => {
        try {
            const {id} = req.params;
            const user = await UserSchema.findByIdAndDelete(id);
            if(!user) {
                return res.status(404).json({message: `Cannot find user with ID ${id}`})
            }
            res.status(200).json(user);
        } catch {
            res.status(500).json({message: "Internal Server Error"})
        }

    })

    server.get("/app/dashboard", Verify, (req, res) => {
        res.status(200).json({
            status: "success",
            message: "Welcome to the your Dashboard!",
        });
    });

    // register and login
    server.use('/app/auth', Auth);
};
export default Router;