const User = require('../models/User');

const getUserLeaderBoard =  async (req, res) => {
  try{
       const leaderBoardofUsers = await User.find({})
       .sort({totalExpenses: -1})  //-1 descending order
       .exec();
    
     res.status(200).json({leaderBoardofUsers});
  } catch(err){
      console.log(err);
      res.status(500).json({error: err});
  }
}

module.exports = {
    getUserLeaderBoard
}