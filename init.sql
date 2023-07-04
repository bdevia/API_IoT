CREATE TABLE "Admin" (ID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT);
CREATE TABLE Company (ID INTEGER PRIMARY KEY AUTOINCREMENT, company_name TEXT, company_api_key TEXT);
CREATE TABLE "Location" (ID INTEGER PRIMARY KEY AUTOINCREMENT, company_id INTEGER REFERENCES Company(ID), location_name TEXT, location_country TEXT, location_city TEXT, location_meta TEXT);
CREATE TABLE Sensor (ID INTEGER PRIMARY KEY AUTOINCREMENT, location_id INTEGER REFERENCES "Location"(ID), sensor_name TEXT, sensor_category TEXT, sensor_meta TEXT, sensor_api_key TEXT);
CREATE TABLE Sensor_data (ID INTEGER PRIMARY KEY AUTOINCREMENT, sensor_id INTEGER REFERENCES Sensor(ID), variable TEXT, valor text, fecha_epoch INTEGER);

INSERT INTO Admin (username, password) VALUES ('admin', 'root');