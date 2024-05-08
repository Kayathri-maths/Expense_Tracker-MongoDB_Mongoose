const User = require('../models/User');
const Expense = require('../models/expense');
const Order = require('../models/orders');

//BROUTE FORCE CODE

// const getUserLeaderBoard =  async (req, res) => {
//     try{
//          const users = await User.findAll();
//          const expenses = await Expense.findAll();
//          const userAggregateExpenses = {};
//          console.log(expenses);

//          expenses.forEach(expense => {
//            if(userAggregateExpenses[expense.userId]){
//             userAggregateExpenses[expense.userId] += expense.expenseamount;
//            } else {
//             userAggregateExpenses[expense.userId] = expense.expenseamount;
//            }
//          });

//          var userLeaderBoardDetails = [];

//          users.forEach((user) => {
//             userLeaderBoardDetails.push({ name:user.name, total_cost: userAggregateExpenses[user.id] || 0})
//          })
//        console.log(userLeaderBoardDetails);
//        userLeaderBoardDetails.sort((a,b) => b.total_cost - a.total_cost);
//        res.status(200).json(userLeaderBoardDetails)
//     } catch(err){
//         console.log(err);
//         res.status(500).json({error: err});
//     }
// }


//OPTIMIZE CODE

// const getUserLeaderBoard =  async (req, res) => {
//   try{
//        const users = await User.findAll( {
//         attributes: ['id', 'name']
//        });
//        const userAggregateExpenses = await Expense.findAll({
//         attributes: ['userId',[sequelize.fn('sum', sequelize.col('expense.expenseamount')),'total_cost']],
//         group: ['userId']
//        });
      
//        var userLeaderBoardDetails = [];
       
//        users.forEach((user) => {
//           userLeaderBoardDetails.push({ name:user.name, total_cost: userAggregateExpenses[user.id] || 0})
//        })
//      console.log(userLeaderBoardDetails);
//      userLeaderBoardDetails.sort((a,b) => b.total_cost - a.total_cost);
//      res.status(200).json(userAggregateExpenses)
//   } catch(err){
//       console.log(err);
//       res.status(500).json({error: err});
//   }
// }

//BETTER OPTIMIZE CODE
const getUserLeaderBoard =  async (req, res) => {
  try{
       const leaderBoardofUsers = await User.find( {})
       .sort({totalExpenses: -1})
       .exec();
        // attributes: ['id', 'name',[sequelize.fn('sum', sequelize.col('expenses.expenseamount')),'total_cost']],
        // include: [
        //   {
        //     model: Expense,
        //     attributes: []
        //   }
        // ],
        // group: ['user.id'],
      //   order: [['totalExpenses','DESC']]
      //  });
    
     res.status(200).json({leaderBoardofUsers});
  } catch(err){
      console.log(err);
      res.status(500).json({error: err});
  }
}

module.exports = {
    getUserLeaderBoard
}