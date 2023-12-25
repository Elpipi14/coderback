import express from "express";
import { __dirname } from "./utils.js";
import handlebars from 'express-handlebars'
import viewRouter from './router/views.router.js';

//Conexion con mongo y logica para trabjar con post
import { initMongoDB } from "./daos/mongoseDb/connection.Mongose.js";
import { errorHandler } from "./middlewares/errorHandler.js";

//LOGIN
import cookieParser from "cookie-parser";
import session from "express-session";
import { mongoStoreOptions } from "./utils.js";
import passport from "passport";
import "./passport/strategie-gitHub.js";
import "./passport/strategie-local.js";
import router from "./router/index.js";

//conexion mongo
initMongoDB()
// Express conexion con public
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// Handlebars
const hbs = handlebars.create({
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true,
});

app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(errorHandler);

//passport
app.use(cookieParser());
app.use(session(mongoStoreOptions));
app.use(passport.initialize());
app.use(passport.session());

//login
app.use(router)

// conexion HTTP
const httpSever = app.listen(8080, () => {
    console.log("escuchando al puerto 8080");
});