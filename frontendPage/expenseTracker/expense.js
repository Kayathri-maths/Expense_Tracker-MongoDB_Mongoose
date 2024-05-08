
let icon = document.querySelector(".icon");
let ul = document.querySelector("nav ul");

icon.addEventListener("click", () => {
    ul.classList.toggle("showData");

    if (ul.classList.contains("showData")) {
        document.getElementById("bar").className = "fa-solid fa-xmark";
    } else {
        document.getElementById("bar").className = "fa-solid fa-bars";
    }
})    
function allowPositiveValue(event) {
  if ( event.charCode !=8 && event.charCode ==0 || (event.charCode >= 48 && event.charCode <= 57)) {
    return true;
  }  else {
    return false;
  }
}
  document.getElementById('addExpenses').onsubmit = async function addExpenses(event) {
    try {
        event.preventDefault();
        const expenseamount = document.getElementById('expenseamount').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;
        const expenseItems = {
            expenseamount,
            description,
            category
        };
        console.log(expenseItems);
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/expense/addexpense', expenseItems, { headers: { "Authorization": token } });
        showOnUserScreen(response.data.expense);
        console.log(response.data.expense);
    } catch (err) {
        console.log(JSON.stringify(err));
        document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
    }
}
function showPremiumUserMessage() {
    document.getElementById('rzp-button1').style.display = "none";
    document.getElementById('premium-user').innerHTML = 'Premium Member';
}
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const page = 1;
        const token = localStorage.getItem('token');
        const decodeToken = parseJwt(token);
        console.log(decodeToken);

        const ispremiumuser = decodeToken.ispremiumuser;
        const RowsperPage = localStorage.getItem('RowsperPage');
        let Rows = 10;
        if (RowsperPage) {
            SelectRows.value = RowsperPage
            Rows = Number(RowsperPage);
        }

        if (ispremiumuser) {
            showPremiumUserMessage();
            //  showLeaderBoard();
            console.log('ispremiumuser>>>', ispremiumuser);
        }
        const response = await axios.get(`http://localhost:3000/expense/get-expenses?page=${page}&Rows=${Rows}`, { headers: { "Authorization": token } });
        console.log(response);
        response.data.result.forEach((expense) => {
            showOnUserScreen(expense);
        })
        console.log(response.data)
        showpagination(response.data);

    }
    catch (error) {
        console.log(JSON.stringify(error));
        document.body.innerHTML += `<div style="color:red">${error.message}</div>`;
    }
})


function showOnUserScreen(obj) {
    document.getElementById('expenseamount').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').querySelector('option').innerHTML = 'Select Category';
    const d = new Date(`${obj.createdAt}`);
    const parentNode = document.getElementById('expense-table-body');
    const childNode = `  <tr id="${obj._id}" >
    <td >${d.toDateString()}</td>
    <td > ${obj.expenseamount}</td>
    <td >${obj.description}</td>
    <td >${obj.category}</td>
   <td >  
   <button onclick="deleteItem('${obj._id}')" class="delete-btn" ><i class="fa-solid fa-trash-can"></i></button>
  </td>
 
  </tr>`
  parentNode.innerHTML = parentNode.innerHTML + childNode;
}

async function deleteItem(expenseid) {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/expense/delete-expense/${expenseid}`, { headers: { "Authorization": token } })
        removeItemfromScreen(expenseid)
        console.log('Item details deleted');
    } catch (err) {
        console.log(JSON.stringify(err));
        document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
    }

}

async function showLeaderBoard() {
    const token = localStorage.getItem('token');
    const isPremiumUser = JSON.parse(atob(token.split('.')[1])).ispremiumuser;
    if (!isPremiumUser) {
        alert('You need to purchase premium membership to view the leaderboard.');
        return;
    }//localhost
    const userLeaderBoardArr = await axios.get('http://localhost:3000/premium/showLeaderBoard', { headers: { "Authorization": token } })
    console.log(userLeaderBoardArr);

    const leaderBoardElement = document.getElementById('leader-board-body');
    leaderBoardElement.innerHTML = '';
   console.log('userLeaderBoardArr',userLeaderBoardArr)
    userLeaderBoardArr.data.leaderBoardofUsers.forEach((userlist) => {
        document.querySelector('h4').style.display = 'block';
        document.getElementById("leader-board").style.display = 'block';
        var leaderBoardElement = document.getElementById('leader-board-body');

        leaderBoardElement.innerHTML += `
       <tr >
       <td >${userlist.name} </td>
       <td > ${userlist.totalExpenses}</td>
       </tr>`
    })
}

function removeItemfromScreen(ItemId) {
    let parent = document.getElementById('expense-table-body');
    const childNodeDeleted = document.getElementById(ItemId);

    parent.removeChild(childNodeDeleted)
}

document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: { "Authorization": token } });
    console.log(response);
    var options = {
        "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
        "order_id": response.data.order.id,  // For one time payment
        //this handler function will handle the success payment
        "handler": async function (response) {
            console.log(response);
            const res = await axios.post('http://localhost:3000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { "Authorization": token } })
            alert('You are a Premium User Now')
            document.getElementById('rzp-button1').style.display = "none";
            document.getElementById('premium-user').innerHTML = 'premium user';
            localStorage.setItem('token', res.data.token);
        }
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response) {
        console.log(response);
        alert('Something went wrong');
    });
}

async function expensedownload() {
    try {
        const token = localStorage.getItem('token');
        const isPremiumUser = JSON.parse(atob(token.split('.')[1])).ispremiumuser;
        if (!isPremiumUser) {
            alert('You need to purchase premium membership to download expenses');
            return;
        }
        const response = await axios.get('http://localhost:3000/user/download', { headers: { "Authorization": token } })

        if (response.status === 200) {
            var a = document.createElement("a");
            a.href = response.data.fileUrl;
            a.download = 'myexpense.csv';
            a.click();
            setTimeout(() => {
                alert('Expenses Downloading started');
            }, 500)


        } else {
            throw new Error(response.data.message)
        }

    } catch (err) {
        console.log(err);
        document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
    }
}

function showpagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage
}) {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    if (hasPreviousPage) {
        const previousBtn = document.createElement('button');
        previousBtn.innerHTML = previousPage;
        previousBtn.addEventListener('click', () => getExpenses(previousPage));
        pagination.appendChild(previousBtn);
    }

    const currentBtn = document.createElement('button');
    currentBtn.innerHTML = `<h3>${currentPage}</h3>`;
    currentBtn.classList.add('current-page');
    currentBtn.addEventListener('click', () => getExpenses(currentPage));
    pagination.appendChild(currentBtn);

    if (hasNextPage) {
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = nextPage;
        nextBtn.addEventListener('click', () => getExpenses(nextPage));
        pagination.appendChild(nextBtn);
    }
}

async function getExpenses(pageNo) {
    try {
        const token = localStorage.getItem('token');
        const Rows = localStorage.getItem('RowsperPage');

        // Use the page parameter in the request URL
        const response = await axios.get(`http://localhost:3000/expense/get-expenses?page=${pageNo}&Rows=${Rows}`, {
            headers: { "Authorization": token }
        });
        let parentNode = document.getElementById("expense-table-body");
        parentNode.innerHTML = '';
        for (let i = 0; i < response.data.result.length; i++) {
            showOnUserScreen(response.data.result[i]);
        }
        showpagination(response.data);

    } catch (error) {
        console.error(error);
    }
}
const SelectRows = document.getElementById('rowsperpage');
SelectRows.onchange = async () => {
    localStorage.setItem('RowsperPage', SelectRows.value);
    window.location.href = '../ExpenseTracker/index.html'
}
 document.getElementById('logout').onclick = function logout() {
    localStorage.removeItem('token'); // Remove the token from local storage
    window.location.href = '../Login/login.html'; // Redirect to the login page
}

