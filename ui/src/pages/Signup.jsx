import CountryDropdown from "country-dropdown-with-flags-for-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Creatable from "react-select/creatable";
import axios from "../api/axios";
import Button from "../components/Button";
import InputField from "../components/InputField";
import useAuth from "../hooks/useAuth";
import useLocalStorage from "../hooks/useLocalStorage";
import useToggle from "../hooks/useToggle";
import { capitalize } from "../utils";

const SIGNUP_URL = "/register";

const Signup = () => {
  const { setAuth } = useAuth();
  const errRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhoneNo] = useState();
  const [password, setPassword] = useState("");

  const [gender, setGender] = useState("");

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const [interests, setInterests] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [interestLists, setInterestLists] = useState([]);
  const [country, setCountry] = useState("");

  const [_, setpersistRefreshToken] = useLocalStorage("refreshToken", "");

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  useEffect(() => {
    const getInterests = async () => {
      axios
        .get("/interests", {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          setInterests(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getInterests();
  }, []);

  let options = [];
  interests.forEach((interest) => {
    options.push({ value: interest.name, label: interest.name });
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const interests = interestLists.map((item) => {
        return {
          name: capitalize(item.value),
        };
      });
      const response = await axios.post(
        SIGNUP_URL,
        JSON.stringify({
          full_name: name,
          email,
          phone,
          password,
          gender,
          country,
          interests,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const refreshToken = response?.data?.refresh;
      setAuth({ ...response?.data });
      setPassword("");
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error.response);
      if (!error?.response) {
        setErrMsg("No Server Response");
      } else if (error.response?.data) {
        setErrMsg(Object.values(error.response.data));
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-2/3 block p-6 bg-white">
        <h1 className="text-4xl text-center mb-6">Register</h1>

        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offScreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5">
            <div>
              <InputField
                id="text"
                inputType="text"
                placeholder="Enter your fullname"
                label="Name"
                handleChange={(e) => setName(e.target.value)}
              />
              <InputField
                id="email"
                inputType="email"
                placeholder="Enter email"
                label="Email address"
                handleChange={(e) => setEmail(e.target.value)}
              />
              <InputField
                id="phone"
                inputType="tel"
                placeholder="Enter phone number"
                label="Phone Number"
                handleChange={(e) => setPhoneNo(e.target.value)}
              />

              <InputField
                id="password"
                inputType="password"
                placeholder="Password"
                label="Password"
                handleChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <div className="form-group mb-6">
                <label
                  htmlFor="country"
                  className="form-label inline-block mb-2 text-gray-700"
                >
                  Select your country
                </label>
                <div></div>
                <CountryDropdown
                  id="country"
                  className="
                    form-control
                    block
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-gray-900 focus:outline-none
                  "
                  preferredCountries={["in", "us"]}
                  value=""
                  handleChange={(e) => setCountry(e.target.value)}
                ></CountryDropdown>
              </div>
              <div className="form-group mb-6">
                <label className="form-label inline-block mb-2 text-gray-700">
                  Select your genger
                </label>
                <div></div>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={handleGenderChange}
                  />
                  Male{" "}
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    className="ml-2"
                    checked={gender === "female"}
                    onChange={handleGenderChange}
                  />
                  Female{" "}
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    className="ml-2"
                    checked={gender === "other"}
                    onChange={handleGenderChange}
                  />
                  Other
                </label>
              </div>
              <div className="form-group mb-6">
                <label
                  htmlFor="multi"
                  className="form-label inline-block mb-2 text-gray-700"
                >
                  Select your interests
                </label>

                <Creatable
                  className="mb-5"
                  for="multi"
                  isMulti
                  isClearable
                  options={options}
                  onChange={(e) => setInterestLists(e)}
                />
              </div>
            </div>
          </div>
          <Button label="Register" />
          <p className="text-gray-800 mt-6 text-center">
            Already a member?{" "}
            <Link
              to="/login"
              className="text-gray-800 hover:text-gray-900 transition duration-200 ease-in-out font-medium"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
