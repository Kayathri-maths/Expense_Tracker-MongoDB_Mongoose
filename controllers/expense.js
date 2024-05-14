const Expense = require('../models/expense');
const User = require('../models/User');
const S3Service = require('../services/S3services');
const DownloadFile = require('../models/downloadfileUrl');


const addExpense = async (req, res, next) => {
    try {
        const { expenseamount, description, category } = req.body;

        if (expenseamount === undefined || description.length === 0 || category.length === 0) {
            return res.status(400).json({ success: false, message: "Parameters missing" });
        }
        const expense = await Expense.create({  createdAt: new Date(), expenseamount, description, category, userId: req.user._id });
        const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount);
        console.log('totalexpenses...',totalExpense);
        await User.updateOne(
                 { _id: req.user._id },
                 {totalExpenses: totalExpense });
        res.status(201).json({ expense, success: true })
    } catch (err) {
        console.log(JSON.stringify(err))
        res.status(500).json({ success: false, error: err });
    }

}

const getexpenses = async (req, res, next) => {
    try {
        const page = +req.query.page || 1; // Get the page number from the query parameters
      let itemsPerPage = +req.query.Rows || 10; // Number of expenses per page
    
      const totalExpenses=await Expense.countDocuments({ userId: req.user._id});
      const expenses = await Expense.find({ userId: req.user._id })
      .skip((page -1)* itemsPerPage)
      .limit(itemsPerPage)
      .sort({_id: 1});  // 1-ascending order

     
    res.status(200).json({
            result: expenses,
            currentPage: page,
            hasNextPage: itemsPerPage*page< totalExpenses,
            nextPage: page+1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalExpenses/itemsPerPage),
          });
       
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error, success: false });
    }
}

const deleteExpense = async (req, res, next) => {
    try {
        if (req.params.id == 'undefined') {
            console.log('ID is missing');
            return res.status(400).json({ success: false, err: 'ID is missing' });
        }
        const expenseId = req.params.id;
        console.log('expenseId',expenseId);
        const expense = await Expense.findById(expenseId);
        const noofrows = await Expense.deleteOne({_id: expenseId, userId: req.user._id });
        console.log("expense",expense)
        const updateExpense = Number(req.user.totalExpenses) - Number(expense.expenseamount);
        await User.updateOne(
            { _id: req.user._id },
            {totalExpenses: updateExpense}
);

        console.log(noofrows)
        if (noofrows === 0) {
            return res.status(404).json({ success: false, message: "expense doesn't belong to the usr" })
        }
        return res.status(200).json({ success: true, message: "Deleted Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "failed", success: false });
    }
}


const downloadexpenses = async (req, res, next) => {
    try {
        //  const expenses = await req.user.getExpenses();
        const expenses = await Expense.find({ userId: req.user._id})
        console.log(expenses);
        const stringifiedExpenses = JSON.stringify(expenses);
        const userId = req.user._id;
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileUrl = await S3Service.uploadToS3(stringifiedExpenses, filename);
        console.log('fileUrl', fileUrl)

        await DownloadFile.create({
            fileUrl: fileUrl,
            createdAt: new Date(),
            userId: userId
        })
        res.status(200).json({ fileUrl, success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ fileUrl: '', error: err, success: false })
    }

}

module.exports = {
    addExpense,
    getexpenses,
    deleteExpense,
    downloadexpenses
}