const connection = require('../database/connection');
const moment = require('moment');

module.exports = {
  async verifyById(id) {
    try {
      const [[result]] = await connection
        .promise()
        .query(
          'SELECT COUNT (*) AS total FROM cadastro.users WHERE user_id = ?',
          [id]
        );
      return result.total;
    } catch (error) {
      throw error;
    }
  },
  async verifyId(table, column, id) {
    try {
      const [[result]] = await connection.promise().query(
        `SELECT 
          COUNT (*) AS total FROM cadastro.${table} WHERE ${column} = ?`,
        [id]
      );
      return result.total;
    } catch (error) {
      throw error;
    }
  },
  async insertProject(
    userId,
    projectName,
    projectDescription,
    projectLink,
    projectImage,
    projectTags
  ) {
    try {
      const projectDate = moment().format('YYYY-MM-DD');
      await connection.promise().beginTransaction();
      await connection
        .promise()
        .query(
          'INSERT INTO cadastro.projects (user_id, project_name, project_description, project_link, project_image, project_date) VALUES (?, ?, ?, ?, ?, ?)',
          [
            userId,
            projectName,
            projectDescription,
            projectLink,
            projectImage,
            projectDate,
          ]
        );
      const [[projectId]] = await connection
        .promise()
        .query(
          'SELECT project_id FROM cadastro.projects ORDER BY project_id DESC LIMIT 1'
        );
      await this.registerTag(projectId.project_id, projectTags);
      await connection.promise().commit();
    } catch (error) {
      await connection.promise().rollback();
      throw error;
    }
  },

  async registerTag(projectId, projectTags) {
    try {
      projectTags.forEach(async (tag) => {
        if (tag < 1 || tag > 0 || isNaN(tag) === true) {
          return;
        }
        await connection
          .promise()
          .query(
            'INSERT INTO cadastro.project_tag_relationship (tag_id, project_id) VALUES (?,?)',
            [tag, projectId]
          );
      });
    } catch (error) {
      throw error;
    }
  },

  async editProject(req) {
    const {
      projectId,
      projectTags,
      projectName,
      projectImage,
      projectLink,
      projectDescription,
    } = req.body;
    try {
      await connection
        .promise()
        .query(
          'UPDATE cadastro.projects SET project_name = ?, project_description = ?, project_link = ?, project_image = ? WHERE project_id = ?',
          [
            projectName,
            projectDescription,
            projectLink,
            projectImage,
            projectId,
          ]
        );
      await connection
        .promise()
        .query(
          'DELETE FROM cadastro.project_tag_relationship WHERE project_id = ?',
          [projectId]
        );
      projectTags.forEach(async (tag) => {
        await connection
          .promise()
          .query(
            'INSERT INTO cadastro.project_tag_relationship (tag_id, project_id) VALUES (?,?)',
            [tag, projectId]
          );
      });
    } catch (error) {
      throw error;
    }
  },
  async delete(id) {
    try {
      await connection
        .promise()
        .query('DELETE FROM cadastro.projects WHERE project_id = ?', [id]);
    } catch (error) {
      throw error;
    }
  },
};
