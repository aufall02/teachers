'use strict';
/**
 * Tugas membuat rest api sederhana menggunakan express dan dintregrasikan dengnan jwt
 * 
 * 
 * 
 * 
 */
// import express untuk membuat web server
import express from "express";
// import fs untuk membaca file json
import fs from 'fs/promises';
// import jwt untuk membuat token nantinya
import jwt from 'jsonwebtoken';


// setup server
// Init express
const app = express();
// set port server
const port = process.env.PORT || 3000;
// users
const users = 'users.json';
// teachers data
const teachers = 'teachers.json';
// secret key
const SECRET_KEY = process.env.SECRET_KEY || 'ini rahasia';

// json parse form express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * 
 * @param {string} path 
 * @returns {object} 
 */
// get data form db
async function getData(path) {
    try {
        // ambil data dari db
        const data = await JSON.parse(await fs.readFile(path, { encoding: 'utf-8' }));
        // jika data ada maka return data dan set error jadi null
        return {
            data: data,
            error: null
        };
    } catch (err) {
        // jika ada error return data null, dan error message
        return {
            data: null,
            error: err.message
        };
    }
}


/**
 * 
 * @param {object} userInDb 
 * @param {object} userInput 
 * @returns {object}
 */

// cek users
function isExist(userInDb, userInput) {
    // filter user
    const userFilter = userInDb.filter(user => user.username === userInput.username  && user.password === userInput.password);

    if (userFilter.length === 0) {
        // return if error
        return {
            user: null,
            message: 'username or password worng'
        };
    }
    // return jika user ditemukan
    return {
        user: userFilter[0],
        message: `Welcome back ${userFilter[0].username}`
    };
}


// generate token
function generateToken(user, secretKey) {
    try {
        // generate token with jwt
        const token = jwt.sign({ data: { id: user.id, user: user.username } }, secretKey);
        // jika token berhasil digenrate maka return token
        return { token: token, err: null };
    } catch (err) {
        return {
            token: null,
            err: err.message
        };
    }
}


/**
 * get data token adalah sebuah function untuk mengambil data didalam token
 * @param {string} token - token adalah hasil 
 * @param {string} secretKey 
 * @returns 
 */

// get data form token
function getDataToken(token, secretKey) {
    try {
        // decode data yagn ada didalam token
        const decode = jwt.verify(token, secretKey);
        // jika data kosong throw error
        if (decode.data === null) {
            throw Error('data kosong')
        }
        // jika data ada maka return data yang telah di decode
        return {
            data: decode.data,
            err: null
        };
    } catch (err) {
        return {
            data: null,
            err: err.message
        };
    }
}

// authenticator midleware
function authenticator(req, res, next) {
    // get token value
    const getToken = req.headers['auth'];
    // check apakah token ada 
    if (!getToken) return res.status(401).json({ message: 'ga bole anjirr' });
    // decode data dari token
    const {data, err} = getDataToken(getToken, SECRET_KEY);
    // 
    if (err !== null) {
        console.log(err);
        return res.status(401).json({ message: 'ga bole anjirr' });
    }

    // hasil dari decode file dimasukkan kedalam req.user yang mana nantinya akan di ambil datanya untuk verifikasi user
    req.user = data
    
    // return next jika berhasil
    return next();
}

// route untuk cek Api
app.get('/', async (req, res) => {
    res.send("Welcome to Api Server");
});

// rooute login
app.post('/login', async (req, res) => {
    // ambil data yang dimasukkan user
    const dataUser = req.body;
    // ambil data dari databse
    const { data, error } = await getData(users);
    // cek apakah ada eror ketika proses pengambilan dari database
    if (error !== null) {
        return res.status(500).send('Internal Server Error');
    }
    // cek data yang dimasukkan oleh user apakah ada di didatabase
    const { user, message } = isExist(data, dataUser);
    // cek apakah user ada atau tidak
    if (user === null) {
        return res.status(404).send(message);
    }
    // ketika user berhasil ditemukan maka lakukan generate token
    const { token, err } = generateToken(user, SECRET_KEY);
    // cek apakah terjadi error ketika proses generate
    if (err !== null) {
        console.log(err);
        return res.status(500).send('Internal server Error');
    }
    // jika token berhasil dibuat set headers auth yang mana nilainya dalah token yang kita dapatkan dari hasil generate
    res.setHeader('auth', token);
    // tamplikan pesan ketikan berhasil login
    return res.send(message);

});

// get data teachers & kasih midleware
app.get('/teachers', authenticator, async (req, res) => {
    // cek user yang sekarang login
    const userCurrent = req.user
    console.log(userCurrent);
    // ambil data guru dari database
    const {data, err} = await getData(teachers)

    res.send(data);
});

// log server 
app.listen(port, () => {
    console.info(`Running a API server at http://localhost:${port}`);
});