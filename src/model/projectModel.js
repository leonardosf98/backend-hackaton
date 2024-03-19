const connection = require('../database/connection');
const moment = require('moment');

module.exports = {
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
  async getInfo(id) {
    return await connection.promise().query(
      `SELECT 
      p.project_name,
      p.project_description,
      p.project_link,
      p.project_image,
      p.project_date,
      u.user_name,
      u.user_surname,
      GROUP_CONCAT(t.tag_name) AS tag_names
  FROM 
      cadastro.projects p
  JOIN 
      cadastro.project_tag_relationship ptr ON p.project_id = ptr.project_id
  JOIN 
      cadastro.tags t ON ptr.tag_id = t.tag_id
  JOIN 
      cadastro.users u ON p.user_id = u.user_id
  WHERE 
      p.project_id = 4
  GROUP BY 
      p.project_id;  
    `,
      [id]
    );
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
      await connection.promise().query(
        `INSERT INTO 
              cadastro.projects (user_id, project_name, project_description, project_link, project_image, project_date) 
          VALUES 
              (?, ?, ?, ?, ?, ?)`,
        [
          userId,
          projectName,
          projectDescription,
          projectLink,
          projectImage,
          projectDate,
        ]
      );
      const [[projectId]] = await connection.promise().query(
        `SELECT 
              project_id 
          FROM 
              cadastro.projects 
          ORDER BY 
              project_id 
          DESC LIMIT 1`
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
      await connection.promise().beginTransaction();
      await connection
        .promise()
        .query(
          'DELETE FROM cadastro.project_tag_relationship WHERE project_id = ?',
          [id]
        );
      await connection
        .promise()
        .query('DELETE FROM cadastro.projects WHERE project_id = ?', [id]);
      await connection.promise().commit();
    } catch (error) {
      await connection.promise().rollback();
      throw error;
    }
  },
  async getProjectByTag(tags, page) {
    try {
      const offset = 6 * page;
      const projects = await connection.promise().query(
        `SELECT p.project_name, p.project_description, p.project_link, p.project_image
        FROM cadastro.projects p
        JOIN cadastro.project_tag_relationship ptr ON p.project_id = ptr.project_id
        JOIN cadastro.tags t ON ptr.tag_id = t.tag_id
        WHERE t.tag_name IN (?)
        ORDER BY p.project_id
        LIMIT 6 OFFSET ?;
        `,
        [tags, offset]
      );
      return projects;
    } catch (error) {
      throw error;
    }
  },
};
