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
import axios from "axios";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";

function Login() {
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);
  const navigate = useNavigate();
  const location = useLocation()
  const [cookie, setCookie, removeCookie] = useCookies(["token", "userdata"]);
  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
    acc_type: "regular",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const handleLoginData = (e) => {
    const name = e.target.name;
    setUserLogin((prev) => {
      return { ...prev, [name]: e.target.value };
    });
  };
  const LoginUser = async (e) => {
    e.preventDefault();
    await axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        email: userLogin.email,
        password: userLogin.password,
      })
      .then((res) => {
        if (res.status == 200) {
          setCookie("token", res?.data?.token);
          setCookie("userdata", res?.data?.data);
          navigate(location?.state?.prevUrl ? location?.state?.prevUrl : "/", { replace: true });
        }
      })
      .catch((err) => {
        if (err) {
          setErrorMsg("Login failed");
        }
      });
  };
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => alert("Login Failed:", error),
  });
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
        .post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
          email: profile.email,
          password: "none",
          acc_type: "google",
        })
        .then((res) => {
          if (res.status == 200) {
            setCookie("token", res?.data?.token);
            setCookie("userdata", res?.data?.data);
            navigate(location?.state?.prevUrl ? location?.state?.prevUrl : "/", { replace: true });
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
              <h2 className="fw-bold mb-2 text-center">Login</h2>
              <p className="text-white-50 mb-3">
                Please enter your login and password!
              </p>

              <MDBInput
                wrapperClass="mb-4 w-100"
                label="Email address"
                id="formControlLg"
                type="email"
                size="lg"
                value={userLogin.email}
                onChange={handleLoginData}
                name="email"
              />
              <MDBInput
                wrapperClass="mb-4 w-100"
                label="Password"
                id="formControlLg"
                type="password"
                size="lg"
                value={userLogin.password}
                onChange={handleLoginData}
                name="password"
              />
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

              <MDBBtn size="lg" onClick={LoginUser}>
                Login
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
                <MDBIcon  className="mx-2" />
                <Link to="/sign-up" className="text-white no-underline">Sign Up</Link>
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
