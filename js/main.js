

function fetchData() {
    fetch('http://task.soft-zone.net/api/Employees/getAllEmployees') 
        .then(function(response) {
            if (!response.ok) {
                alert('Error!');
                return; 
            }
            return response.json();
        })
        .then(function(data) {
            populateTable(data); 
        })
        .catch(function() {
            alert('Please try again.');
        });
}

function populateTable(data) {
    let tableBody = document.getElementById('employeeTable');
    tableBody.innerHTML = ''; 

    data.forEach(employee => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.empId}</td>
            <td>${employee.empName}</td>
            <td>${employee.empEmail}</td>
            <td>${employee.empAddress}</td>
            <td>${employee.empPhone}</td>
            <td>
                <a class="editBtn" data-id="${employee.empId}"><i class="fa-solid fa-pen"></i></a>
                <a class="deleteBtn"><i class="fa-solid fa-trash"></i></a>
            </td>
        `;
        tableBody.appendChild(row);

        let deleteBtn = row.querySelector('.deleteBtn');
        deleteBtn.addEventListener('click', function() {
            tableBody.removeChild(row);
        });

        let editBtn = row.querySelector('.editBtn');
        editBtn.addEventListener('click', function() {
            editEmployee(employee);
        });
    });
}

function editEmployee(employee) {
    document.getElementById('id').value = employee.empId;
    document.getElementById('name').value = employee.empName;
    document.getElementById('email').value = employee.empEmail;
    document.getElementById('address').value = employee.empAddress;
    document.getElementById('phone').value = employee.empPhone;

    var addform = document.getElementById('addform');
    addform.style.display = 'block';

    document.getElementById('formTitle').textContent = 'Edit Employee';

    addform.onsubmit = function(event) {
        event.preventDefault(); 

        var updatedEmployeeData = {
            empId: document.getElementById('id').value,
            empName: document.getElementById('name').value,
            empEmail: document.getElementById('email').value,
            empAddress: document.getElementById('address').value,
            empPhone: document.getElementById('phone').value
        };

        fetch('http://task.soft-zone.net/api/Employees/updateEmployee', {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedEmployeeData)
        })
        .then(function(response) {
            if (!response.ok) {
                alert('Error');
                return;
            }
            fetchData(); 
            addform.style.display = 'none'; 
            addform.reset(); 
        })
        .catch(function() {
            alert('Failed');
        });
    };
}

window.onload = function() {
    fetchData();
};

document.getElementById('addform').onsubmit = function(event) {
    event.preventDefault(); 

    var id = document.getElementById('id').value;
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var address = document.getElementById('address').value;
    var phone = document.getElementById('phone').value;

    var employeeData = {
        empId: id,
        empName: name,
        empEmail: email,
        empAddress: address,
        empPhone: phone
    };

    fetch('http://task.soft-zone.net/api/Employees/addEmployee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
    })
    .then(function(response) {
        if (!response.ok) {
            alert('Error');
            return;
        }
        return response.json();
    })
    .then(function(data) {
        populateTable([data]); 
        document.getElementById('addform').style.display = 'none';
        this.reset(); 
        fetchData(); 
    })
    .catch(function() {
        alert('Failed');
    });
};

document.getElementById('showFormBtn').onclick = function() {
    document.getElementById('addform').style.display = 'block';
};

document.getElementById('cancelBtn').onclick = function(event) {
    event.preventDefault(); 
    document.getElementById('addform').style.display = 'none';
};