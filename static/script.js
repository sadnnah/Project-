// https://chatgpt.com/share/6887dc84-cc78-8000-bb8a-a8fded954345

// https://chatgpt.com/share/6887dd31-cf3c-8000-8573-dfa35a5d767e

// https://chatgpt.com/share/6887dd9d-77d4-8000-8928-f209246c6204

// https://g.co/gemini/share/402cfa0e172d

// https://g.co/gemini/share/b9d5377ad0ae

document.addEventListener('DOMContentLoaded', function() {
    // Makes a GET request to '/api/cards' to fetch all applications
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
            // After receiving a response, parses it as JSON.
                // 'res.json()' returns another Promise.
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

    
    form.onsubmit = function(e) {
        e.preventDefault();
        var data = {
            first_name: form.first_name.value,
            last_name: form.last_name.value,
            nationality: form.nationality.value,
            passport_number: form.passport_number.value,
            employment_type: form.employment_type.value,
            status: form.status.value
        };
        if (editId) {
            fetch('/api/cards/' + editId, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(function() {
                editId = null;
                form.reset();
                showMsg('Application updated!', '#ffe066');
                loadApplications();
            });
        } else {
            fetch('/api/cards', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(function() {
                form.reset();
                showMsg('Application submitted!', '#b2f2bb');
                loadApplications();
            });
        }
    };

    // Edit an application (make form ready to update)
    window.editApplication = function(id) {
        fetch('/api/cards')
            .then(function(res) { return res.json(); })
            .then(function(applications) {
                var app = applications.find(function(a) { return a.id === id; });
                if (app) {
                    form.first_name.value = app.first_name;
                    form.last_name.value = app.last_name;
                    form.nationality.value = app.nationality;
                    form.passport_number.value = app.passport_number;
                    form.employment_type.value = app.employment_type;
                    form.status.value = app.status;
                    editId = id;
                    showMsg('Editing application...', '#a5d8ff');
                }
            });
    };

    // Delete an application
    window.deleteApplication = function(id) {
        fetch('/api/cards/' + id, {method: 'DELETE'})
            .then(function() {
                showMsg('Application deleted!', '#ffa8a8');
                loadApplications();
            });
    };

    // Initial load
    loadApplications();
}); 