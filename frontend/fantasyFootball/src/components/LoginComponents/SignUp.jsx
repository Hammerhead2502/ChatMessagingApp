import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router-dom";
import Validation from "../../utils/Validation"
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";

function SignUp() {
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);
  const navigate = useNavigate();
  const [cookie] = useCookies(["token", "userdata"]);
  const [error, setError] = useState({})
  const [userData, setUserData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    contact_no: "",
    acc_type: "regular",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const handleChange = (e) => {
    const name = e.target.name;
    setUserData((prev) => {
      return { ...prev, [name]: e.target.value };
    });
  };
  const handleClick = async (e) => {
    e.preventDefault();
    setError(Validation(userData))
    if(Object.keys(error).length === 0 ){
       await axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/sign-up`, {
        fname: userData.fname,
        lname: userData.lname,
        email: userData.email,
        password: userData.password,
        contact_no: userData.contact_no,
      })
      .then((res) => {
        if (res.status == 200) {
          navigate("/login", { replace: true });
        }
      })
      .catch((err) => {
        if (err) {
          if(err.response.status == 422){
            err?.response?.data?.errors.map((err) => {
              return setError((prev) => {
                return {...prev, [err.path]: err.msg}
              })
            })
          }
          setErrorMsg("Something went wrong. Please retry.");
        }
      });
    }
  };
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => alert("Login Failed:", error),
  });
  useEffect(() => {
    if(cookie?.token && cookie?.userdata){
      navigate("/")
    }
  }, [])
  useEffect(() => {
    if (user?.access_token) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user?.access_token]);
  useEffect(() => {
    if (profile?.email) {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/sign-up`, {
          fname: profile.name,
          lname: profile.name,
          email: profile.email,
          password: userData.password,
          contact_no: 0,
          acc_type: "google",
        })
        .then((res) => {
          if (res.status == 200) {
            navigate("/login", { replace: true });
          }
        })
        .catch((err) => {
          if (err) {
            console.log(err);
          }
        });
    }
  }, [profile?.email]);
  return (
    <MDBContainer fluid>
      <MDBRow className="d-flex justify-content-center align-items-center h-100">
        <MDBCol col="12">
          <MDBCard
            className="bg-white my-5 mx-auto"
            style={{ borderRadius: "1rem", maxWidth: "500px" }}
          >
            <MDBCardBody className="p-5 w-100 d-flex flex-column">
              <h2 className="fw-bold mb-2 text-center">Sign up</h2>
              <p className="text-white-50 mb-3">
                Please enter your details to SignUp
              </p>
              <MDBInput
                wrapperClass={error.fname ? "w-100" : "mb-4 w-100"}
                label="First Name"
                id="formControlLg"
                type="email"
                size="lg"
                onChange={handleChange}
                value={userData.fname}
                name="fname"
              />
              {error.fname && <p className="text-red-600 mb-4 text-sm">{error.fname}</p>}
              <MDBInput
                wrapperClass={error.lname ? "w-100" : "mb-4 w-100"}
                label="Last Name"
                id="formControlLg"
                type="email"
                size="lg"
                onChange={handleChange}
                value={userData.lname}
                name="lname"
              />
              {error.lname && <p className="text-red-600 mb-4 text-sm">{error.lname}</p>}
              <MDBInput
                wrapperClass={error.email ? "w-100" : "mb-4 w-100"}
                label="Email address"
                id="formControlLg"
                type="email"
                size="lg"
                onChange={handleChange}
                value={userData.email}
                name="email"
              />
              {error.email && <p className="text-red-600 mb-4 text-sm">{error.email}</p>}
              <MDBInput
                wrapperClass={error.password ? "w-100" : "mb-4 w-100"}
                label="Password"
                id="formControlLg"
                type="password"
                size="lg"
                onChange={handleChange}
                value={userData.password}
                name="password"
              />
              {error.password && <p className="text-red-600 mb-4 text-sm">{error.password}</p>}
              <MDBInput
                wrapperClass={error.contact_no ? "w-100" : "mb-4 w-100"}
                label="Contact Number"
                id="formControlLg"
                type="number"
                size="lg"
                onChange={handleChange}
                value={userData.contact_no}
                name="contact_no"
              />
              {error.contact_no && <p className="text-red-600 mb-4 text-sm">{error.contact_no}</p>}
              {errorMsg ? (
                <p className="text-red-500 mx-auto pb-2">{errorMsg}</p>
              ) : (
                <></>
              )}

              <MDBCheckbox
                name="flexCheck"
                id="flexCheckDefault"
                className="mb-4"
                label="Remember password"
              />

              <MDBBtn size="lg" onClick={handleClick}>
                Sign-Up
              </MDBBtn>

              <hr className="my-4" />

              <MDBBtn
                className="mb-2 w-100"
                size="lg"
                style={{ backgroundColor: "#dd4b39" }}
                onClick={login}
              >
                <MDBIcon fab icon="google" className="mx-2" />
                Sign in with google
              </MDBBtn>

              <MDBBtn
                className="mb-4 w-100"
                size="lg"
                style={{ backgroundColor: "#3b5998" }}
              >
                <Link to="/login" className="text-white no-underline">Login</Link>
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default SignUp;
