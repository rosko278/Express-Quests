const connection = require("../db-config");
const Joi = require("joi");
const { findByToken } = require("./user");

const db = connection.promise();

const validate = (data, forCreation = true) => {
  const presence = forCreation ? "required" : "optional";
  return Joi.object({
    title: Joi.string().max(255).presence(presence),
    director: Joi.string().max(255).presence(presence),
    year: Joi.number().integer().min(1888).presence(presence),
    color: Joi.boolean().presence(presence),
    duration: Joi.number().integer().min(1).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findMany = async ({ filters: { color, max_duration, userToken } }) => {
  let sql = "SELECT * FROM movies";
  const sqlValues = [];

  if (color) {
    sql += " WHERE color = ?";
    sqlValues.push(color);
  }
  if (max_duration) {
    if (color) sql += " AND duration <= ?";
    else sql += " WHERE duration <= ?";

    sqlValues.push(max_duration);
  }
  if (userToken) {
    const user_id = await findByToken(userToken);
    if (color || max_duration) sql += " AND user_id = ?";
    else sql += " WHERE user_id = ?";
    sqlValues.push(user_id.id);
  }
  sql += ";";
  return db.query(sql, sqlValues).then(([results]) => results);
};

const findOne = (id) => {
  return db
    .query("SELECT * FROM movies WHERE id = ?", [id])
    .then(([results]) => results[0]);
};

const create = ({ title, director, year, color, duration, user_id }) => {
  return db
    .query(
      "INSERT INTO movies (title, director, year, color, duration, user_id) VALUES (?, ?, ?, ?, ?, ?)",
      [title, director, year, color, duration, user_id]
    )
    .then(([result]) => {
      const id = result.insertId;
      return { id, title, director, year, color, duration };
    });
};

const update = (id, newAttributes) => {
  return db.query("UPDATE movies SET ? WHERE id = ?", [newAttributes, id]);
};

const destroy = (id) => {
  return db
    .query("DELETE FROM movies WHERE id = ?", [id])
    .then(([result]) => result.affectedRows !== 0);
};

module.exports = {
  findMany,
  findOne,
  validate,
  create,
  update,
  destroy,
};
