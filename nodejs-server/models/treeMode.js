class Tree {
  constructor(db) {
    this.DB = db;
  }

  // Retrieve all trees with their associated plant data.
  async getAllTree() {
    try {
      // Joining threes and plants to show tree id, plant id, name, and date.
      const [rows] = await this.DB.execute(
        `SELECT threes.id AS treeId, plants.id AS plantId, plants.name, threes.date
         FROM threes 
         JOIN plants ON threes.id_plants = plants.id`
      );
      return rows;
    } catch (error) {
      console.error("Error fetching trees:", error);
      throw error;
    }
  }

  // Create a new tree record. If a plant with the given name exists, it uses that.
  // Otherwise, it creates a new plant record.
  async createTree(nameTree) {
    try {
      const date = new Date();
      const formattedDate = date.toISOString().split('T')[0];
      console.log(date);

      // Look for an existing plant with the given name
      let [rows] = await this.DB.execute(`SELECT * FROM plants WHERE name = ?`, [nameTree]);

      if (rows.length > 0) {
        // Plant exists: Insert into threes using the existing plant id.
        await this.DB.execute(`INSERT INTO threes(id_plants, date) VALUES(?, ?);`, [
          rows[0].id,
          formattedDate
        ]);
      } else {
        // Plant doesn't exist: Create a new plant record.
        const [result] = await this.DB.execute(`INSERT INTO plants(name) VALUES(?);`, [nameTree]);
        // Then insert into threes using the new plant id.
        await this.DB.execute(`INSERT INTO threes(id_plants, date) VALUES(?, ?);`, [
          result.insertId,
          formattedDate
        ]);
        console.log(result);
      }
    } catch (error) {
      console.error("Error creating tree:", error);
      throw error;
    }
  }

  // Update a tree record identified by treeId.
  // updateData may include: { newName, newDate }
  async updateTree(treeId, updateData) {
    try {
      // Retrieve the associated plant id from the threes table.
      const [rows] = await this.DB.execute(`SELECT id FROM threes WHERE id = ?`, [treeId]);
      if (rows.length === 0) {
        throw new Error("Tree not found");
      }
      // const threeId = rows[0].id_plants;
      console.log(updateData)

      // If a new name is provided, update the plant's name.
      if (updateData.name) {
          const [rows1] = await this.DB.execute(`SELECT id FROM plants WHERE name = ?`, [updateData.name]);
          if (rows1.length === 0) {
              const [result] = await this.DB.execute(`INSERT INTO plants(name) VALUES(?);`, [updateData.name]);
              await this.DB.execute(`UPDATE threes SET id_plants = ? WHERE id = ?`, [result.insertId, treeId]);
          }
          else{
              const plantId = rows1[0].id;
              await this.DB.execute(`UPDATE threes SET id_plants = ? WHERE id = ?`, [plantId, treeId]);
        }
      }
      return { message: "Tree updated successfully" };
    } catch (error) {
      console.error("Error updating tree:", error);
      throw error;
    }
  }

  // Delete a tree record identified by treeId.
  async deleteTree(treeId) {
    try {
      await this.DB.execute(`DELETE FROM threes WHERE id = ?`, [treeId]);
      return { message: "Tree deleted successfully" };
    } catch (error) {
      console.error("Error deleting tree:", error);
      throw error;
    }
  }
}

module.exports = Tree;
