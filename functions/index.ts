import CarModel from './CarModel';
import db from './db';
import { v4 as uuid } from 'uuid';

//GET ALL CARS///////////////////////////////////////////////////////////////
const listCars = async () => {
    try {
        const result = await db.query(`SELECT * FROM cars`);
        return result.records; 
    } catch (err) {
        console.log(err);
        return null;
    }
}
exports.getAll = async (event:any) => {
    const cars = await listCars();
    return {statusCode: 200, headers: {"Content-Type": "application/json"}, body: JSON.stringify(cars)}
};

//GET A CAR//////////////////////////////////////////////////////////////////
const listCar = async (id: string) => {
    try {
        const query  = `SELECT * FROM cars WHERE id = :id`;
        const results = await db.query(query, { id });
        return results.records[0];
    } catch (err) {
        console.log(err);
        return null;
    }
}
exports.getCar = async (event:any) => {
    const car = await listCar(event.pathParameters.id);
    return {statusCode: 200, headers: {"Content-Type": "application/json"}, body: JSON.stringify(car)}
};

//CREATE A CAR//////////////////////////////////////////////////////////////////
const createCar = async (makeData: String, modelData: String) => {
    const car: CarModel = {
        id: uuid(),
        make: makeData,
        model: modelData,
    };
    const { id, make, model } = car;
    try {
        const query = `INSERT INTO cars (id,make,model) VALUES(:id,:make,:model)`;
        await db.query(query, { id, make, model });
        return car;
    } catch (err) {
        console.log(err);
        return null;
    }
}
exports.addCar = async (event: any) => {
    const body = JSON.parse(event.body);
    const car = await createCar(body.make, body.model);
    return {statusCode: 201, headers: {"Content-Type": "application/json"}, body: JSON.stringify(car)};
}

//DELETE A CAR///////////////////////////////////////////////////////////////
const removeCar = async (id: string) => {
    try {
        const query  = `DELETE FROM cars WHERE id = :id`;
        const response = await db.query(query, { id });
        return response;
    } catch (err) {
        console.log(err);
        return null;
    }
}

exports.delCar = async (event:any) => {
    await removeCar(event.pathParameters.id);
    return {statusCode: 204};
}

//DELETE ALL CARS////////////////////////////////////////////////////////////
const removeAll = async () => {
    try {
        const response = await db.query(`TRUNCATE TABLE cars`);
        return response;
    } catch (err) {
        console.log(err);
        return null;
    }
}

exports.delAll = async (event:any) => {
    await removeAll();
    return {statusCode: 204};
}

//UPDATE A CAR///////////////////////////////////////////////////////////////
const updateCar = async (idData: String, makeData: String, modelData: String) => {
    const car: CarModel = {
        id: idData,
        make: makeData,
        model: modelData,
    };
    const { id, make, model } = car;
    try {
        const query = `UPDATE cars SET make = :make, model = :model where id = :id`;
        await db.query(query, { id, make, model });
        return car;
    } catch (err) {
        console.log(err);
        return null;
    }
}

exports.editCar = async (event: any) => {
    const body = JSON.parse(event.body);
    const car = await updateCar(event.pathParameters.id, body.make, body.model);
    return {statusCode: 200, headers: {"Content-Type": "application/json"}, body: JSON.stringify(car)};
}
