import { useState, useEffect } from "react";
import { register, reset } from "../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";



// async function Country() {
// 	try {
// 		const response = await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie");
// 		console.log(response);
// 	}
// 	catch (error) {
// 		console.log(error);
// 	}
// }

// Country()

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    password_confirmation: '',
    country_id: '',
    membership_id: ''
  });

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  /*
    'name' => $data['name'],
    'email' => $data['email'],
    'password' => bcrypt($data['password']),
    'country_id' => $data['country_id'],
    'membership_id' => $data['membership_id']
   */
  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== password_confirmation) {
      toast.error("Email do not match");
    } else {
      const userData = {
        email,
        name,
        password,
        password_confirmation,
        country_id,
        membership_id,
      };
      dispatch(register(userData));
    }
  };

  const { name, email, password, password_confirmation, country_id, membership_id } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  return (
    <>
      <section className="heading">
        <h1>
          <FaUser /> Register
        </h1>
        <p>Please create an account</p>
      </section>
      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              placeholder="Enter your name"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              placeholder="Create password"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password_confirmation"
              name="password_confirmation"
              value={password_confirmation}
              placeholder= "Confirm password"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="country_id"
              name="country_id"
              value= {country_id}
              placeholder="Enter country"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="membership_id"
              name="membership_id"
              value={membership_id}
              placeholder="membership_id"
              onChange={onChange}
            />
          </div>
          <div className="form-control">
            <button type="submit" className="btn btn-block">
              Submit
            </button>
          </div>
          <div className="form-control">
            <span>All Ready User?</span>
            <Link to="/login">
              <span className="button">Log In</span>
            </Link>
          </div>
        </form>
      </section>
    </>
  );
}

export default Register;