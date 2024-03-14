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
      await connection.promise().beginTransaction();
      await connection
        .promise()
        .query(
          'INSERT INTO cadastro.projects (user_id, project_name, project_description, project_link, project_image) VALUES (?, ?, ?, ?, ?)',
          [userId, projectName, projectDescription, projectLink, projectImage]
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
    projectTags.forEach(async (tag) => {
      if (tag < 1 || tag > 0 || tag.isNaN === true) {
        return;
      }
      await connection
        .promise()
        .query(
          'INSERT INTO cadastro.project_tag_relationship (tag_id, project_id) VALUES (?,?)',
          [tag, projectId]
        );
      await connection.promise().commit();
    });
  },
};
