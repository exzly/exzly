const { Model } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  class AuthVerifyModel extends Model {
    /**
     * Model associations
     */
    static associate(models) {
      this.belongsTo(models.UserModel, {
        foreignKey: 'userId',
        as: 'user',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    }
  }

  AuthVerifyModel.init(
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sha1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      token: DataTypes.TEXT,
      purpose: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      codeIsUsed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      tokenIsUsed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'AuthVerifyModel',
      tableName: 'auth_verify',
    },
  );

  return AuthVerifyModel;
};
