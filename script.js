const form = document.getElementById('userForm');

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const gender = document.querySelector('input[name="gender"]:checked').value;

            document.getElementById('outputID').textContent = document.getElementById('userID').value;
            document.getElementById('outputName').textContent = document.getElementById('name').value;
            document.getElementById('outputFname').textContent = document.getElementById('fatherName').value;
            document.getElementById('outputGender').textContent = gender;
            document.getElementById('outputDOB').textContent = document.getElementById('dob').value;
            document.getElementById('outputDOJ').textContent = document.getElementById('doj').value;
            document.getElementById('outputDepartment').textContent = document.getElementById('department').value;
            document.getElementById('outputDesignation').textContent = document.getElementById('designation').value;
            document.getElementById('outputSite').textContent = document.getElementById('site').value;
            document.getElementById('outputMobile').textContent = document.getElementById('mobileNumber').value;
            document.getElementById('outputAadhar').textContent = document.getElementById('aadharNumber').value;
            document.getElementById('outputAccount').textContent = document.getElementById('accountNumber').value;
            document.getElementById('outputIFSC').textContent = document.getElementById('ifsc').value;
            document.getElementById('outputBank').textContent = document.getElementById('bankName').value;
            document.getElementById('outputRemarks').textContent = document.getElementById('remarks').value;

            document.getElementById('output-card').style.display = 'block';
        });