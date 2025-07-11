document.addEventListener('DOMContentLoaded', function() {
    
    var form = document.getElementById('card-form');
    var tableBody = document.getElementById('cards-table').getElementsByTagName('tbody')[0];
    var msg = document.getElementById('msg');
    var editId = null;

    
    function showMsg(text, color) {
        msg.textContent = text;
        msg.style.background = color;
        msg.style.display = 'block';
        setTimeout(function() { msg.style.display = 'none'; }, 2000);
    }

    
    function loadApplications() {
        fetch('/api/cards')
            .then(function(res) { return res.json(); })
            .then(function(applications) {
                tableBody.innerHTML = '';
                if (applications.length === 0) {
                    var row = tableBody.insertRow();
                    row.innerHTML = '<td colspan="9" style="text-align:center;">No applications found.</td>';
                } else {
                    applications.forEach(addRow);
                }
            });
    }
     function addRow(app) {
        var row = tableBody.insertRow();
        row.innerHTML =
            '<td>' + app.first_name + '</td>' +
            '<td>' + app.last_name + '</td>' +
            '<td>' + app.passport_number + '</td>' +
            '<td>' + app.card_number + '</td>' +
            '<td>' + app.issue_date + '</td>' +
            '<td>' + app.expiry_date + '</td>' +
            '<td><span class="status ' + app.status.toLowerCase() + '">' + app.status + '</span></td>' +
            '<td>' +
                '<button class="edit-btn" onclick="editApplication(' + app.id + ')">Edit</button>' +
                '<button class="delete-btn" onclick="deleteApplication(' + app.id + ')">Delete</button>' +
            '</td>';
    }