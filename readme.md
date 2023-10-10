# Assigment 2
Buatlah server Rest API menggunakan express.js dengan implementasi JWT

***Sumber data :***
- teachers.jso
```json
[
    {
        "id": 1, 
        "first_name": "Bambang",
        "last_name": "Suprapto",
        "email": "bambangsuprapto@kode.id",
        "gender": "male"
    },
    {
        "id": 2, 
        "first_name": "Rukmana",
        "last_name": "Fatmawati",
        "email": "rukmanafatmawati@kode.id",
        "gender": "female"
    },
    {
        "id": 3, 
        "first_name": "Butet",
        "last_name": "Naiborhu",
        "email": "butetnaiborhu@kode.id",
        "gender": "female"
    },
    {
        "id": 4, 
        "first_name": "Yulius",
        "last_name": "Prawiranegara",
        "email": "yuliusprawiranegara@kode.id",
        "gender": "male"
    }
]
```

- users.json
```json
[
    {
        "id": 1,
        "username": "john_doe",
        "password": "rahasia"
    }
]
```

***NB: password menggunakan plain text, tanpa hashing***

API yang harus ada:

1. Login: Buatlah API untuk login user dengan method POST, API ini akan membaca data users.json, response sukses dari API ini adalah token JWT.
2. Get All Data: Buatlah API untuk mendapatkan semua data teachers.json dengan method GET, API ini harus menyertakan token sebagai proses Autentikasi.

Cara pengumpulan :

1. Push code applikasi ke github kalian, jangan lupa untuk ignore node_modules
2. Copy link repo dan simpan dalam sebuah document
3. Upload document tersebut ke google classroom
4. Batas waktu pengumpulan tanggal 15 Oktober 2023 pukul 23:59WIB