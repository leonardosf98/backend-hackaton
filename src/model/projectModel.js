const connection = require('../database/connection');

module.exports = {
  async verifyById(id) {
    try {
      const [[result]] = await connection
        .promise()
        .query(
          'SELECT COUNT (*) AS total FROM cadastro.users WHERE user_id = ?',
          [id]
        );
      if (result[0].total === 1) {
        return 1;
      }
      return 0;
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
      if (result.total === 1) {
        return 1;
      }
      return 0;
    } catch (error) {
      throw error;
    }
  },
  async insertProject(
    userId,
    projectName,
    projectDescription,
    projectLink,
    projectImage
  ) {
    try {
      await connection
        .promise()
        .query(
          'INSERT INTO cadastro.projects (user_id, project_name, project_description, project_link, project_image) VALUES (?, ?, ?, ?, ?)',
          [userId, projectName, projectDescription, projectLink, projectImage]
        );
    } catch (error) {
      throw error;
    }

    try {
      const [[projectId]] = await connection
        .promise()
        .query(
          'SELECT project_id FROM cadastro.projects ORDER BY project_id DESC LIMIT 1'
        );

      return projectId.project_id;
    } catch (error) {
      throw error;
    }
  },
  registerTag(projectId, projectTags) {
    projectTags.forEach(async (tag) => {
      await connection
        .promise()
        .query(
          'INSERT INTO cadastro.project_tag_relationship (tag_id, project_id) VALUES (?,?)',
          [tag, projectId]
        );
    });
  },
  async delete(id) {
    try {
      await connection
        .promise()
        .query(
          'DELETE FROM cadastro.project_tag_relationship WHERE project_id = ?',
          [id]
        );
      await connection
        .promise()
        .query('DELETE FROM cadastro.projects WHERE project_id = ?', [id]);
    } catch (error) {
      throw error;
    }
  },
};
