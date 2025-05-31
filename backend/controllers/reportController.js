const Expense=require('../models/expense');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');

exports.getFilteredReport = async (req, res) => {
  const userId = req.user.id;
  const filter = req.params.filterType;
  const now = new Date();

  let where = { userId };

  if (filter === 'daily') {
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));
    where.createdAt = { [Op.between]: [todayStart, todayEnd] };
  } else if (filter === 'weekly') {
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - 6); // last 7 days
    where.createdAt = { [Op.gte]: startOfWeek };
  } else if (filter === 'monthly') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    where.createdAt = { [Op.gte]: startOfMonth };
  }

  try {
    const expenses = await Expense.findAll({ where });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch report' });
  }
};

exports.downloadReport = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.findAll({ where: { userId } });
    const fields = ['id', 'amount', 'description', 'category', 'createdAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(expenses);

    const fileName = `report_${userId}_${Date.now()}.csv`;
    const filePath = path.join(__dirname, '../reports', fileName);

    fs.writeFileSync(filePath, csv);

  
    const fileUrl = `http://localhost:3000/reports/${fileName}`;

    res.status(200).json({ fileUrl });

  } catch (error) {
    res.status(500).json({ message: 'Failed to generate report' });
  }
};
