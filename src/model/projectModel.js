const connection = require('../database/connection');

module.exports = {
  verifyById(id) {
    try {
      return connection
        .promise()
        .query(
          'SELECT COUNT (*) AS total FROM cadastro.users WHERE user_id = ?',
          [id]
        );
    } catch (error) {
      return error;
    }
  },
  insertProject(
    userId,
    projectName,
    projectDescription,
    projectLink,
    projectImage
  ) {
    return connection
      .promise()
      .query(
        'INSERT INTO cadastro.projects (user_id, project_name, project_description, project_link) VALUES (?, ?, ?, ?)',
        [userId, projectName, projectDescription, projectLink, projectImage]
      );
  },
  registerTag(projectId, projectTags) {
    projectTags.map((tag) => {
      return connection
        .promise()
        .query(
          'INSERT INTO cadastro.project_tag_relationship (tag, projectId) VALUES (?,?)',
          [tag, projectId]
        );
    });
  },
};
