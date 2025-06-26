const {DataTypes}=require('sequelize');
const sequelize=require('../utils/db-connection');

const DownloadedFile=sequelize.define('DownloadedFile',{
  fileUrl:{
    type:DataTypes.STRING,
    allowNull:false,
  },
  downloadDate:{
    type:DataTypes.DATE,
    defaultValue:DataTypes.NOW,
  }
});

module.exports=DownloadedFile;