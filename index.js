const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());
const port = 3000; 
const db = new sqlite3.Database('database.db');

// Endpoints de COMPANYS

app.post('/api/v1/company/insert', (req, res) => { //INSERT
    const query = `SELECT * FROM Company WHERE company_name ='${req.body.company_name}';`;
    db.all(query, (error, rows) => {
        if (error) {
        console.error(error);
        } else {
            if(rows.length >= 1 ){
                console.log(`Error, la compañia ${req.body.company_name} ya existe`);
                res.status(400).json({status: "failed", description: `the company ${req.body.company_name} already exists`});
            }
            else{
                const query1 = `INSERT INTO Company (company_name, company_api_key) VALUES ('${req.body.company_name}', '${get_api_key()}');`;
                db.run(query1, (error) => {
                    if (error) {
                        console.error(error);
                    } 
                    else {
                        console.log("New company inserted");
                        res.status(201).json({status: "successful"});
                    }
                });
            }
        }
    });
});

app.get('/api/v1/company/read', (req, res) => { //READ
    const query = `SELECT * FROM Company;`;
    db.all(query, (error, rows) => {
        if (error) {
        console.error(error);
        } 
        else {
            //console.log(rows);
            res.status(200).json({status: 'successful', rows});
        }
    });
});

app.delete('/api/v1/company/delete', (req, res) => { //DELETE
    const query = `SELECT * FROM Company WHERE company_name = '${req.body.company_name}';`;
    db.all(query, (error, rows) => {
        if (error) {
        console.error(error);
        } 
        else {
            if(rows.length >= 1){
                const query1 = `DELETE FROM Company WHERE company_name = '${req.body.company_name}';`;
                db.run(query1, (error) => {
                    if (error) {
                        console.error(error);
                    } 
                    else {
                        console.log(`Company ${req.body.company_name} deleted`);
                        res.status(200).json({status: "successful"});
                    }
                });
            }
            else{
                console.log(`Error, la compañia ${req.body.company_name} no existe`);
                res.status(400).json({status: "failed", description: `the company ${req.body.company_name} not exist`});
            }
        }
    });
});

app.put('/api/v1/company/edit', (req, res) => { //UPDATE
    const query = `SELECT * FROM Company WHERE company_name = '${req.body.company_name}';`;
    db.all(query, (error, rows) => {
        if (error) {
        console.error(error);
        } 
        else {
            if(rows.length >= 1){
                if(req.body.company_name == req.body.new_company_name){
                    console.log(`Error, new company name cannot be equal to actual company name`);
                    res.status(400).json({status: "failed", description: `new company name cannot be equal to actual company name`});
                }
                else{
                    const ID = rows[0].ID;
                    const query1 = `UPDATE Company SET company_name = '${req.body.new_company_name}' WHERE ID = ${ID};`;
                    db.run(query1, (error) => {
                        if (error) {
                            console.error(error);
                        } 
                        else {
                            console.log(`Company ${req.body.company_name} updated`);
                            res.status(200).json({status: "successful"});
                        }
                    });
                }
            }
            else{
                console.log(`Error, la compañia ${req.body.company_name} no existe`);
                res.status(400).json({status: "failed", description: `the company ${req.body.company_name} not exist`});
            }
        }
    });
});

// Endpoints de LOCATIONS

app.post('/api/v1/locations/insert', (req, res) => { //INSERT
    const query = `SELECT * FROM Company WHERE company_api_key ='${req.body.company_api_key}';`;
    db.all(query, (error, rows) => {
        if (error) {
        console.error(error);
        } else {
            if(rows.length >= 1 ){
                const ID = rows[0].ID;
                const query1 = `SELECT * FROM Location WHERE company_id = ${ID} AND location_name = '${req.body.location_name}' AND location_country = '${req.body.location_country}' AND location_city = '${req.body.location_city}';`; //agregar location_meta ?
                db.all(query1, (error, rows) => {
                    if (error) {
                        console.error(error);
                    } 
                    else {
                        if (rows.length >= 1 ){
                            console.log(`Error, ya existe un Location con estas caracteristicas`);
                            res.status(400).json({status: "failed", description: `ya existe un Location con estas caracteristicas`});
                        }
                        else{
                            const query2 = `INSERT INTO Location (company_id, location_name, location_country, location_city, location_meta) VALUES (${ID}, '${req.body.location_name}', '${req.body.location_country}', '${req.body.location_city}', '${req.body.location_meta}');`; 
                            db.run(query2, (error) => {
                                if (error) {
                                    console.error(error);
                                } 
                                else {
                                    console.log(`Location insert for company_api_key ${req.body.company_api_key}`);
                                    res.status(200).json({status: "successful"});
                                }
                            });
                        }
                    }
                });
                
            }
            else{
                console.log(`Error, ${req.body.company_api_key} no esta asociada a ninguna company`);
                res.status(400).json({status: "failed", description: `${req.body.company_api_key} no esta asociada a ninguna company`});
            }
        }
    });
});

app.get('/api/v1/locations/read_all', (req, res) => { //READ_ALL
    const query = `SELECT * FROM Company WHERE company_api_key ='${req.body.company_api_key}';`;
    db.all(query, (error, rows) => {
        if (error) {
        console.error(error);
        } else {
            if(rows.length >= 1 ){
                const ID = rows[0].ID;
                const query1 = `SELECT * FROM Location WHERE company_id = ${ID};`;
                db.all(query1, (error, rows) => {
                    if (error) {
                        console.error(error);
                    } 
                    else {
                        res.status(200).json({status: 'successful', rows});
                    }
                });
                
            }
            else{
                console.log(`Error, ${req.body.company_api_key} no esta asociada a ninguna company`);
                res.status(400).json({status: "failed", description: `${req.body.company_api_key} no esta asociada a ninguna company`});
            }
        }
    });
});

app.get('/api/v1/locations/read_one', (req, res) => { //READ_one
    const query = `SELECT * FROM Company WHERE company_api_key ='${req.body.company_api_key}';`;
    db.all(query, (error, rows) => {
        if (error) {
        console.error(error);
        } else {
            if(rows.length >= 1 ){
                const ID = rows[0].ID;
                const query1 = `SELECT * FROM Location WHERE company_id = ${ID} AND ID = ${req.body.location_id};`;
                db.all(query1, (error, rows) => {
                    if (error) {
                        console.error(error);
                    } 
                    else {
                        if(rows.length >= 1){
                            res.status(200).json({status: 'successful', rows});
                        }
                        else{
                            console.log(`Error, no existe un location_id ${req.body.location_id} para company_api_key ${req.body.company_api_key}`);
                            res.status(400).json({status: "failed", description: `no existe un location_id ${req.body.location_id} para company_api_key ${req.body.company_api_key}`});
                        }
                    }
                });
                
            }
            else{
                console.log(`Error, ${req.body.company_api_key} no esta asociada a ninguna company`);
                res.status(400).json({status: "failed", description: `${req.body.company_api_key} no esta asociada a ninguna company`});
            }
        }
    });
});

app.delete('/api/v1/locations/delete', (req, res) => { //DELETE
    const query = `SELECT * FROM Company WHERE company_api_key ='${req.body.company_api_key}';`;
    db.all(query, (error, rows) => {
        if (error) {
        console.error(error);
        } else {
            if(rows.length >= 1 ){
                const ID = rows[0].ID;
                const query1 = `SELECT * FROM Location WHERE company_id = ${ID} AND ID = ${req.body.location_id};`;
                db.all(query1, (error, rows) => {
                    if (error) {
                        console.error(error);
                    } 
                    else {
                        if(rows.length >= 1){
                            const query2 = `DELETE FROM Location WHERE company_id = ${ID} AND ID = ${req.body.location_id};`;
                            db.run(query2, (error) => {
                                if (error) {
                                    console.error(error);
                                } 
                                else {
                                    res.status(200).json({status: 'successful'});
                                }
                            });
                        }
                        else{
                            console.log(`Error, no existe un location_id ${req.body.location_id} para company_api_key ${req.body.company_api_key}`);
                            res.status(400).json({status: "failed", description: `no existe un location_id ${req.body.location_id} para company_api_key ${req.body.company_api_key}`});
                        }
                    }
                });
                
            }
            else{
                console.log(`Error, ${req.body.company_api_key} no esta asociada a ninguna company`);
                res.status(400).json({status: "failed", description: `${req.body.company_api_key} no esta asociada a ninguna company`});
            }
        }
    });
});

app.put('/api/v1/locations/edit', (req, res) => { //UPDATE
    const query = `SELECT * FROM Company WHERE company_api_key ='${req.body.company_api_key}';`;
    db.all(query, (error, rows) => {
        if (error) {
        console.error(error);
        } else {
            if(rows.length >= 1 ){
                const ID = rows[0].ID;
                const query1 = `SELECT * FROM Location WHERE company_id = ${ID} AND ID = ${req.body.location_id};`;
                db.all(query1, (error, rows) => {
                    if (error) {
                        console.error(error);
                    } 
                    else {
                        if(rows.length >= 1){
                            const query2 = `SELECT * FROM Location WHERE company_id = ${ID} AND location_name = '${req.body.location_name}' AND location_country = '${req.body.location_country}' AND location_city = '${req.body.location_city}';`; //agregar location_meta ?
                            db.all(query2, (error, rows) => {
                                if (error) {
                                    console.error(error);
                                } 
                                else {
                                    if (rows.length >= 1 ){
                                        console.log(`Error, ya existe un Location con estas caracteristicas`);
                                        res.status(400).json({status: "failed", description: `ya existe un Location con estas caracteristicas`});
                                    }
                                    else{
                                        const query3 = `UPDATE Location SET location_name = '${req.body.location_name}', location_country = '${req.body.location_country}', location_city = '${req.body.location_city}', location_meta = '${req.body.location_meta}' WHERE ID = ${req.body.location_id};`;
                                        db.run(query3, (error) => {
                                            if (error) {
                                                console.error(error);
                                            } 
                                            else {
                                                console.log(`Location update`);
                                                res.status(200).json({status: "successful"});
                                            }
                                        });
                                    }
                                }
                            });
                        }
                        else{
                            console.log(`Error, no existe un location_id ${req.body.location_id} para company_api_key ${req.body.company_api_key}`);
                            res.status(400).json({status: "failed", description: `no existe un location_id ${req.body.location_id} para company_api_key ${req.body.company_api_key}`});
                        }
                    }
                });
                
            }
            else{
                console.log(`Error, ${req.body.company_api_key} no esta asociada a ninguna company`);
                res.status(400).json({status: "failed", description: `${req.body.company_api_key} no esta asociada a ninguna company`});
            }
        }
    });
});


// Endpoints de SENSOR 

app.post('/api/v1/sensor/insert', (req, res) => { //Crear nuevo sensor
    const query = `SELECT * FROM Company WHERE company_api_key ='${req.body.company_api_key}';`; // Filtro company por api_key que entrego en body
    db.all(query, (error, rows) => {
        if (error) {
        console.error(error);
        } else {
            if(rows.length >= 1 ){
                const ID = rows[0].ID; //extraigo ID de company para la siguiente consulta
                const query1 = `SELECT * FROM Location WHERE company_id ='${ID}' AND ID = ${req.body.location_id};`; // Verifico existencia de Location con ID igual al que entrego por body y que pertenezca a alguna Company existente
                db.all(query1, (error, rows) => {
                    if (error) {
                        console.error(error);
                    } else {
                        if(rows.length >= 1){ //Se cumplen las 2 condiciones
                            const query2 = `SELECT * FROM Sensor WHERE location_id = ${req.body.location_id} AND sensor_name = '${req.body.sensor_name}' AND sensor_category = '${req.body.sensor_category}' AND sensor_meta = '${req.body.sensor_meta}';`; // se envian los parametros a agregar en el nuevo sensor, exceptuando data que va mas adelante cuando se hace efectivamente la insercion
                            db.all(query2, (error, rows) => {
                            if (error) {
                                console.error(error);
                            } 
                            else {
                                if (rows.length >= 1 ){
                                    console.log(`Error, ya existe un Sensor con estas caracteristicas`);
                                    res.status(400).json({status: "failed", description: `ya existe un Sensor con estas caracteristicas`});
                                }
                                else{
                                    const query3 = `INSERT INTO Sensor (location_id, sensor_name, sensor_category, sensor_meta, sensor_api_key) VALUES ('${req.body.location_id}', '${req.body.sensor_name}', '${req.body.sensor_category}', '${req.body.sensor_meta}', '${get_api_key()}');`; 
                                    db.run(query3, (error) => {
                                        if (error) {
                                            console.error(error);
                                        } 
                                        else {
                                            console.log(`Sensor insert for company_api_key ${req.body.company_api_key} , location ID ${req.body.location_id}`);
                                            res.status(201).json({status: "successful"});
                                        }
                                    });
                                }
                            }
                        });
                    }
                    else{
                        console.log(`Error, combinacion Company con id: ${ID} y Location con id: ${req.body.location_id} no arroja coincidencias`);
                        res.status(400).json({status: "failed", description: `combinacion Company con id: ${ID} y Location con id: ${req.body.location_id} no arroja coincidencias`});
                    }

                }
            });        
        }
            else{
                console.log(`Error, ${req.body.company_api_key} no esta asociada a ninguna company`);
                res.status(400).json({status: "failed", description: `${req.body.company_api_key} no esta asociada a ninguna company`});
            }
        }
    });
});

app.get('/api/v1/sensor/read_all', (req, res) => { //READ_ALL
    const query = `SELECT * FROM Company WHERE company_api_key ='${req.body.company_api_key}';`;
    db.all(query, (error, rows) => {
        if (error) {
        console.error(error);
        } else {
            if(rows.length >= 1 ){
                const ID = rows[0].ID;
                const query1 = `SELECT * FROM Location WHERE company_id ='${ID}' AND ID = ${req.body.location_id};`;
                db.all(query1, (error, rows) => {
                   if(error) {
                    console.error(error);
                   } else{
                    if(rows.length >=1) {
                        const query2 = `SELECT * FROM Sensor WHERE location_id = ${req.body.location_id};`;
                        db.all(query2, (error, rows) => {
                    if (error) {
                        console.error(error);
                    } 
                    else {
                        res.status(200).json({status: 'successful', rows});
                    }
                });
                    }
                    else{
                        console.log(`Error, combinacion Company con id: ${ID} y Location con id: ${req.body.location_id} no arroja coincidencias`);
                        res.status(400).json({status: "failed", description: `combinacion Company con id: ${ID} y Location con id: ${req.body.location_id} no arroja coincidencias`});
                    }
                   }
                })
                
                
            }
            else{
                console.log(`Error, ${req.body.company_api_key} no esta asociada a ninguna company`);
                res.status(400).json({status: "failed", description: `${req.body.company_api_key} no esta asociada a ninguna company`});
            }
        }
    });
});

app.get('/api/v1/sensor/read_one', (req, res) => { //READ_ONE
    const query = `SELECT * FROM Company WHERE company_api_key ='${req.body.company_api_key}';`;
    db.all(query, (error, rows) => {
        if (error) {
        console.error(error);
        } else {
            if(rows.length >= 1 ){
                const ID = rows[0].ID;
                const query1 = `SELECT * FROM Location WHERE company_id ='${ID}' AND ID = ${req.body.location_id};`;
                db.all(query1, (error, rows) => {
                   if(error) {
                    console.error(error);
                   } else{
                    if(rows.length >=1) {
                        const query2 = `SELECT * FROM Sensor WHERE location_id = ${req.body.location_id} AND ID = ${req.body.sensor_id};`;
                        db.all(query2, (error, rows) => {
                            if (error) {
                                console.error(error);
                            } 
                            else {
                                if (rows.length >=1){
                                    res.status(200).json({status: 'successful', rows});
                                }
                                else{
                                    console.log(`Error, Location con id: ${req.body.location_id}, no tiene coincidencia con sensor_id: ${req.body.sensor_id}`);
                                    res.status(400).json({status: "failed", description: `Location con id: ${req.body.location_id}, no tiene coincidencia con sensor_id: ${req.body.sensor_id}`});
                                }
                            }
                        });
                    }
                    else{
                        console.log(`Error, combinacion Company con id: ${ID} y Location con id: ${req.body.location_id} no arroja coincidencias`);
                        res.status(400).json({status: "failed", description: `combinacion Company con id: ${ID} y Location con id: ${req.body.location_id} no arroja coincidencias`});
                    }
                   }
                })
            }
            else{
                console.log(`Error, ${req.body.company_api_key} no esta asociada a ninguna company`);
                res.status(400).json({status: "failed", description: `${req.body.company_api_key} no esta asociada a ninguna company`});
            }
        }
    });
});

app.delete('/api/v1/sensor/delete', (req, res) => { // Delete Sensor
    const query = `SELECT * FROM Company WHERE company_api_key ='${req.body.company_api_key}';`;
    db.all(query, (error, rows) => {
        if (error) {
        console.error(error);
        } else {
            if(rows.length >= 1 ){
                const ID = rows[0].ID;
                const query1 = `SELECT * FROM Location WHERE company_id ='${ID}' AND ID = ${req.body.location_id};`;
                db.all(query1, (error, rows) => {
                   if(error) {
                    console.error(error);
                   } else{
                    if(rows.length >=1) {
                        const query2 = `SELECT * FROM Sensor WHERE location_id = ${req.body.location_id} AND ID = ${req.body.sensor_id};`;
                        db.all(query2, (error, rows) => {
                            if (error) {
                                console.error(error);
                            } 
                            else {
                                if (rows.length >=1){
                                    const query3 = `DELETE FROM Sensor WHERE location_id = ${req.body.location_id} AND ID = ${req.body.sensor_id};`;
                                    db.run(query3, (error) => {
                                        if (error) {
                                            console.error(error);
                                        } 
                                        else {
                                            res.status(200).json({status: 'successful'});
                                        }
                                    });

                                }
                                else{
                                    console.log(`Error, Location con id: ${req.body.location_id}, no tiene coincidencia con sensor_id: ${req.body.sensor_id}`);
                                    res.status(400).json({status: "failed", description: `Location con id: ${req.body.location_id}, no tiene coincidencia con sensor_id: ${req.body.sensor_id}`});
                                }
                            }
                        });
                    }
                    else{
                        console.log(`Error, combinacion Company con id: ${ID} y Location con id: ${req.body.location_id} no arroja coincidencias`);
                        res.status(400).json({status: "failed", description: `combinacion Company con id: ${ID} y Location con id: ${req.body.location_id} no arroja coincidencias`});
                    }
                   }
                })
            }
            else{
                console.log(`Error, ${req.body.company_api_key} no esta asociada a ninguna company`);
                res.status(400).json({status: "failed", description: `${req.body.company_api_key} no esta asociada a ninguna company`});
            }
        }
    });
});

app.put('/api/v1/sensor/update', (req, res) => { // Actualizar sensor
    const query = `SELECT * FROM Company WHERE company_api_key ='${req.body.company_api_key}';`; // Filtro company por api_key que entrego en body
    db.all(query, (error, rows) => {
        if (error) {
        console.error(error);
        } else {
            if(rows.length >= 1 ){
                const ID = rows[0].ID; //extraigo ID de company para la siguiente consulta
                const query1 = `SELECT * FROM Location WHERE company_id ='${ID}' AND ID = ${req.body.location_id};`; // Verifico existencia de Location con ID igual al que entrego por body y que pertenezca a alguna Company existente
                db.all(query1, (error, rows) => {
                    if (error) {
                        console.error(error);
                    } else {
                        if(rows.length >= 1){ //Se cumplen las 2 condiciones
                            const query2 = `SELECT * FROM Sensor WHERE location_id = ${req.body.location_id} AND ID = ${req.body.sensor_id};`;
                            db.all(query2, (error, rows) => {
                                if (error) {
                                    console.error(error);
                                } 
                                else {
                                    if (rows.length >=1){
                                        const query3 = `SELECT * FROM Sensor WHERE location_id = ${req.body.location_id} AND sensor_name = '${req.body.sensor_name}' AND sensor_category = '${req.body.sensor_category}' AND sensor_meta = '${req.body.sensor_meta}';`; // se envian los parametros a agregar en el nuevo sensor, exceptuando data que va mas adelante cuando se hace efectivamente la insercion
                                        db.all(query3, (error, rows) => {
                                        if (error) {
                                            console.error(error);
                                        } 
                                        else {
                                            if (rows.length >= 1 ){
                                                console.log(`Error, ya existe un Sensor con estas caracteristicas`);
                                                res.status(400).json({status: "failed", description: `ya existe un Sensor con estas caracteristicas`});
                                            }
                                            else{
                                                const query4 = `UPDATE Sensor SET sensor_name = '${req.body.sensor_name}', sensor_category = '${req.body.sensor_category}', sensor_meta = '${req.body.sensor_meta}' WHERE ID = '${req.body.sensor_id}';`; 
                                                db.run(query4, (error) => {
                                                    if (error) {
                                                        console.error(error);
                                                    } 
                                                    else {
                                                        console.log(`Sensor update for company_api_key ${req.body.company_api_key} , location ID ${req.body.location_id}`);
                                                        res.status(200).json({status: "successful"});
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    }
                                    else{
                                        console.log(`Error, Location con id: ${req.body.location_id}, no tiene coincidencia con sensor_id: ${req.body.sensor_id}`);
                                        res.status(400).json({status: "failed", description: `Location con id: ${req.body.location_id}, no tiene coincidencia con sensor_id: ${req.body.sensor_id}`});
                                    }
                                }
                            });

                    }
                    else{
                        console.log(`Error, combinacion Company con id: ${ID} y Location con id: ${req.body.location_id} no arroja coincidencias`);
                        res.status(400).json({status: "failed", description: `combinacion Company con id: ${ID} y Location con id: ${req.body.location_id} no arroja coincidencias`});
                    }
                }
            });        
        }
            else{
                console.log(`Error, ${req.body.company_api_key} no esta asociada a ninguna company`);
                res.status(400).json({status: "failed", description: `${req.body.company_api_key} no esta asociada a ninguna company`});
            }
        }
    });
});

// Endpoints de SENSOR_DATA 

app.post('/api/v1/sensor_data/insert', (req, res) => {
    const query = `SELECT * FROM Sensor WHERE sensor_api_key ='${req.body.sensor_api_key}';`;
    db.all(query, (error, rows) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        } else {
            if (rows.length >= 1) {
                const sensorId = rows[0].ID;
                const sensorDataArray = req.body.sensor_data;

                if (sensorDataArray.length === 0) {
                    console.log('Error, no se proporcionaron datos del sensor');
                    res.status(400).json({ status: "failed", description: "No se proporcionaron datos del sensor (arreglo json vacio)" });
                    return;
                }

                const insertDataQuery = `INSERT INTO Sensor_data (sensor_id, variable, valor, fecha_epoch) VALUES (?, ?, ?, strftime('%s', 'now'));`;

                const insertData = () => {
                    db.serialize(() => {
                        db.run("BEGIN TRANSACTION;");
                        sensorDataArray.forEach(data => {
                            const { variable, valor } = data;
                            db.run(insertDataQuery, [sensorId, variable, valor], (error) => {
                                if (error) {
                                    console.error(error);
                                    res.status(500).json({ error: 'Error interno del servidor 1' });
                                    db.run("ROLLBACK;");
                                    return;
                                }
                            });
                        });

                        db.run("COMMIT;", (error) => {
                            if (error) {
                                console.error(error);
                                res.status(500).json({ error: 'Error interno del servidor 2' });
                                db.run("ROLLBACK;");
                                return;
                            }

                            console.log(`Sensor data inserted for api_key ${req.body.sensor_api_key}`);
                            res.status(201).json({ status: "successful" });
                        });
                    });
                };

                insertData();

            } else {
                console.log(`Error, el api_key ${req.body.sensor_api_key} no está asociado a ningún sensor`);
                res.status(400).json({ status: "failed", description: `El api_key ${req.body.sensor_api_key} no está asociado a ningún sensor` });
            }
        }
    });
});


app.get('/api/v1/sensor_data/read&company_api_key=:company_api_key', (req, res) => { //READ_ALL
    const query = `SELECT * FROM Company WHERE company_api_key ='${req.params.company_api_key}';`;
    db.all(query, (error, rows) => {
        if (error) {
        console.error(error);
        } else {
            if(rows.length >= 1 ){
                const ID = rows[0].ID;
                const query1 = `SELECT * FROM Location WHERE company_id ='${ID}' AND ID = ${req.body.location_id};`;
                db.all(query1, (error, rows) => {
                   if(error) {
                    console.error(error);
                   } else{
                    if(rows.length >=1) {

                        async function ejecutarConsultas() {
                            const resultados = []; 
                            for (let i=0; i<req.body.sensor_id.length; i++) {
                            const query2 = `SELECT * FROM Sensor WHERE location_id=${req.body.location_id} AND ID=${req.body.sensor_id[i]};`;
                        
                            const respuesta = await new Promise((resolve, reject) => {
                                db.all(query2, (err, rows) => {
                                  if (err) {
                                    reject(err);
                                  } else {
                                    
                                    if (rows.length >=1){
                                        const query3 = `SELECT ID, variable, valor, fecha_epoch FROM Sensor_data WHERE sensor_id=${req.body.sensor_id[i]} AND fecha_epoch >= ${req.body.from} AND fecha_epoch <= ${req.body.to};`;
                                        db.all(query3, (error, sensor_data) => {
                                            if (error) {
                                                console.error(error);
                                            } 
                                            else {
                                                if(sensor_data.length >=1){
                                                    resolve({"sensor_id": req.body.sensor_id[i], "status": "successful", sensor_data});
                                                }
                                                else{
                                                    resolve({"sensor_id": req.body.sensor_id[i], "status": "not found", "description": `No existen mediciones entre ${req.body.from} y ${req.body.to}`});
                                                }
                                                
                                            }
                                        });
                                    }
                                    else{
                                        resolve({"sensor_id": req.body.sensor_id[i], "status": "failed", "description": "No existe coincidencia entre sensor_id y location_id"});
                                    }
                                  }
                                });
                            });
                          
                              resultados.push(respuesta); // Concatenar los resultados al array
                            }
                          
                            return resultados; // Retornar el resultado final
                        }
                          
                        ejecutarConsultas()
                            .then((response) => {
                                res.status(200).json({status: "successful", response});
                            })
                            .catch((error) => {
                              console.error(error);
                            });

                    }
                    else{
                        console.log(`Error, combinacion Company con id: ${ID} y Location con id: ${req.body.location_id} no arroja coincidencias`);
                        res.status(400).json({status: "failed", description: `combinacion Company con id: ${ID} y Location con id: ${req.body.location_id} no arroja coincidencias`});
                    }
                   }
                })
            }
            else{
                console.log(`Error, ${req.body.company_api_key} no esta asociada a ninguna company`);
                res.status(400).json({status: "failed", description: `${req.body.company_api_key} no esta asociada a ninguna company`});
            }
        }
    });
});

app.delete('/api/v1/sensor_data/delete', (req, res) => { // Delete Sensor_data
    const query = `SELECT * FROM Sensor WHERE sensor_api_key ='${req.body.sensor_api_key}';`;
    db.all(query, (error, rows) => {
        if (error) {
        console.error(error);
        } else {
            if(rows.length >= 1 ){
                const ID = rows[0].ID;
                const query1 = `SELECT * FROM Sensor_data WHERE sensor_id = '${ID}' AND ID = ${req.body.sensor_data_id};`;
                db.all(query1, (error, rows) => {
                   if(error) {
                    console.error(error);
                   } else{
                    if(rows.length >=1) {
                        const query2 = `DELETE FROM Sensor_data WHERE sensor_id = '${ID}' AND ID = ${req.body.sensor_data_id};`;
                        db.run(query2, (error) => {
                            if (error) {
                                console.error(error);
                            } 
                            else {
                                res.status(200).json({status: 'successful'});
                            }
                        });
                    }
                    else{
                        console.log(`Error, combinacion Sensor con id: ${ID} y Sensor_data con id: ${req.body.sensor_data_id} no arroja coincidencias`);
                        res.status(400).json({status: "failed", description: ` Sensor_data con id: ${req.body.sensor_data_id} no existe o no esta asociado con sensor señalado`});
                    }
                   }
                })
                
            }
            else{
                console.log(`Error, ${req.body.sensor_api_key} no esta asociada a ningun Sensor`);
                res.status(400).json({status: "failed", description: `${req.body.sensor_api_key} no esta asociada a ningun Sensor`});
            }
        }
    });
});

app.put('/api/v1/sensor_data/update', (req, res) => { //READ_ALL
    const query = `SELECT * FROM Sensor WHERE sensor_api_key ='${req.body.sensor_api_key}';`;
    db.all(query, (error, rows) => {
        if (error) {
        console.error(error);
        } else {
            if(rows.length >= 1 ){
                const ID = rows[0].ID;
                const query1 = `SELECT * FROM Sensor_data WHERE sensor_id = ${ID} AND ID = ${req.body.sensor_data_id};`;
                db.all(query1, (error, rows) => {
                    if (error) {
                        console.error(error);
                    } 
                    else {
                        if(rows.length >= 1){
                            const query2 = `SELECT * FROM Sensor_data WHERE sensor_id = ${ID} AND variable = '${req.body.variable}' AND valor = '${req.body.valor}';`; 
                                db.all(query2, (error, rows) => {
                                    if (error) {
                                        console.error(error);
                                    } 
                                    else {
                                        if (rows.length >= 1 ){
                                            console.log(`Error, los valores ingresados corresponden a la data actual de sensor_data`);
                                            res.status(400).json({status: "failed", description: `los valores ingresados corresponden a la data actual de sensor_data`});
                                        }
                                        else{
                                            const query3 = `UPDATE Sensor_data SET variable = '${req.body.variable}', valor = '${req.body.valor}' WHERE ID = ${req.body.sensor_data_id};`;
                                            db.run(query3, (error) => {
                                                if (error) {
                                                    console.error(error);
                                                } 
                                                else {
                                                    console.log(`Sensor_data update`);
                                                    res.status(200).json({status: "successful"});
                                                }
                                            });
                                        }
                                    }
                                });
                        }
                        else{
                            console.log(`Error, no existe un Sensor_data ${req.body.sensor_data_id} para el Sensor con sensor_api_key ${req.body.sensor_api_key}`);
                            res.status(400).json({status: "failed", description: `no existe un Sensor_data ${req.body.sensor_data_id} para el Sensor con sensor_api_key ${req.body.sensor_api_key}`});
                        }
                    }
                });
                
            }
            else{
                console.log(`Error, ${req.body.sensor_api_key} no esta asociada a ningun Sensor`);
                res.status(400).json({status: "failed", description: `${req.body.sensor_api_key} no esta asociada a ningun Sensor`});
            }
        }
    });
});


app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

function get_api_key(){
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';
    
    for (let i = 0; i < 10; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      resultado += caracteres.charAt(indice);
    }
    
    return resultado;
}