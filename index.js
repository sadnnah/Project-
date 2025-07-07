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
    
