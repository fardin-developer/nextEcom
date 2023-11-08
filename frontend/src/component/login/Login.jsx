import React, { useState } from 'react';
import {
    MDBContainer,
    MDBCol,
    MDBRow,
    MDBBtn,
    MDBIcon,
    MDBInput,
    MDBCheckbox
}
    from 'mdb-react-ui-kit';
import './Login.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');

    const signInHandle = () => {

        const requestBody = {
            email: email,
            password: password,
          };

        fetch("http://localhost:4000/api/v1/login", {

            method: "POST",
            body: JSON.stringify(requestBody),


            // Adding headers to the request
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })

            // Converting to JSON
            .then(response => response.json())

            // Displaying results to console
            .then(json => console.log(json));

    }

    return (
        <>
            <MDBContainer fluid className="p-3 my-5">

                <MDBRow>

                    <MDBCol col='10' md='6'>
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" className="img-fluid" alt="Phone image" />
                    </MDBCol>

                    <MDBCol col='4' md='6' style={{ "marginTop": "110px" }}>


                        <MDBInput wrapperClass='mb-4' label='Email address' value={email} onChange={(e) => { setEmail(e.target.value) }} id='formControlLg' type='email' size="lg" />
                        <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg' type='password' size="lg" onChange={(e) => { setPass(e.target.value) }} />


                        <div className="d-flex justify-content-between mx-4 mb-4">
                            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                            <a href="!#">Forgot password?</a>
                        </div>

                        <MDBBtn className="mb-4 w-100" size="lg" onClick={signInHandle}>Sign in</MDBBtn>




                        <MDBBtn className="mb-4 w-100" size="lg" style={{ backgroundColor: '#55acee' }}>
                            Register
                        </MDBBtn>

                    </MDBCol>

                </MDBRow>

            </MDBContainer>
        </>
    )
}

export default Login
