// script.js
document.addEventListener('DOMContentLoaded', () => {
    const passwordForm = document.getElementById('passwordForm');
    const passwordTable = document.getElementById('passwordTable').getElementsByTagName('tbody')[0];

    // Load passwords from localStorage
    loadPasswords();

    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addPassword();
    });

    function addPassword() {
        const website = document.getElementById('website').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const viewPassword = document.getElementById('viewPassword').value;

        const passwords = getPasswords();
        passwords.push({ website, username, password, viewPassword });
        localStorage.setItem('passwords', JSON.stringify(passwords));

        appendPasswordToTable({ website, username, password, viewPassword });
        passwordForm.reset();
    }

    function loadPasswords() {
        const passwords = getPasswords();
        passwords.forEach(password => appendPasswordToTable(password));
    }

    function getPasswords() {
        return JSON.parse(localStorage.getItem('passwords')) || [];
    }

    function appendPasswordToTable(password) {
        const row = passwordTable.insertRow();
        row.innerHTML = `
            <td>${password.website}</td>
            <td>${password.username}</td>
            <td class="hidden-password">
                <button onclick="promptViewPassword(this)">Click to View</button>
            </td>
            <td class="actions">
                <button onclick="deletePassword(this)">Delete</button>
            </td>
        `;
        row.dataset.password = password.password;
        row.dataset.viewPassword = password.viewPassword;
    }

    window.promptViewPassword = function(button) {
        const row = button.parentElement.parentElement;
        const enteredPassword = prompt("Enter the view password:");
        if (enteredPassword === row.dataset.viewPassword) {
            button.parentElement.textContent = row.dataset.password;
        } else {
            alert("Incorrect password!");
        }
    }

    window.deletePassword = function(button) {
        const row = button.parentElement.parentElement;
        const website = row.cells[0].innerText;
        const username = row.cells[1].innerText;

        let passwords = getPasswords();
        passwords = passwords.filter(p => p.website !== website || p.username !== username);
        localStorage.setItem('passwords', JSON.stringify(passwords));

        row.remove();
    }
});
